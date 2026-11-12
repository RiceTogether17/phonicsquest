/*
 * PSLE-scale writing marks.
 *
 * The first two groups need no network: `fetch` is mocked, and they check
 * what is sent and that a reply off the scale is thrown away.
 *
 * The last group asks a real model to mark the sample scripts in
 * tests/fixtures/writingMarkerSamples.js and checks each mark lands in its expected range.
 * It is skipped unless a Google AI Studio key is set, so CI never calls out.
 * A free key from https://aistudio.google.com/apikey is enough:
 *
 *   GEMINI_API_KEY=AIza... npm run check:writing-marker
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  CONTINUOUS_SAMPLES,
  CONTINUOUS_TASK,
  SITUATIONAL_SAMPLES,
  SITUATIONAL_TASK,
} from '../../tests/fixtures/writingMarkerSamples.js';

const localStorageMock = (() => {
  let data = {};
  return {
    getItem: vi.fn((key) => data[key] ?? null),
    setItem: vi.fn((key, val) => {
      data[key] = String(val);
    }),
    removeItem: vi.fn((key) => {
      delete data[key];
    }),
    clear: vi.fn(() => {
      data = {};
    }),
  };
})();
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

let store;
let service;

async function loadModules() {
  localStorageMock.clear();
  vi.resetModules();
  store = (await import('../modules/store.js')).store;
  service = await import('../modules/aiService.js');
}

/** A Gemini-shaped success response carrying `text`. */
function reply(text) {
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ candidates: [{ content: { parts: [{ text }] } }] }),
  });
}

describe('PSLE-scale marks (mocked)', () => {
  let fetchMock;
  const sentBody = () => JSON.parse(fetchMock.mock.calls[0][1].body);

  beforeEach(async () => {
    await loadModules();
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    store.set('geminiApiKey', 'test-key');
  });

  it('reads a composition mark out of 36', async () => {
    fetchMock.mockReturnValue(
      reply(
        'CONTENT: 13 | The events are clear but the ending is rushed.\nLANGUAGE: 12/18 | Check your past tense.\nOVERALL: Slow down the ending.',
      ),
    );
    const graded = await service.gradePsleComposition('My story.', 6, CONTINUOUS_TASK);
    expect(graded.total).toBe(25);
    expect(graded.max).toBe(36);
    expect(graded.parts.content).toMatchObject({ label: 'Content', mark: 13, max: 18 });
    expect(graded.parts.language.mark).toBe(12);
    expect(graded.overall).toBe('Slow down the ending.');
  });

  it('reads a situational writing mark out of 14', async () => {
    fetchMock.mockReturnValue(
      reply('TASK: 4 | The bin location is missing.\nLANGUAGE: 7 | Polite and well ordered.'),
    );
    const graded = await service.gradeSituationalWriting('Dear Mr Goh, ...', 5, SITUATIONAL_TASK);
    expect(graded.total).toBe(11);
    expect(graded.max).toBe(14);
    expect(graded.parts.taskFulfilment.mark).toBe(4);
    expect(graded.parts.languageOrganisation).toMatchObject({ mark: 7, max: 8 });
  });

  it.each([
    ['a mark above the maximum', 'CONTENT: 19 | Great.\nLANGUAGE: 12 | Good.'],
    ['a missing part', 'CONTENT: 12 | Good.'],
    ['a mark in words', 'CONTENT: twelve | Good.\nLANGUAGE: 12 | Good.'],
    ['a fraction', 'CONTENT: 12.5 | Good.\nLANGUAGE: 12 | Good.'],
    ['a refusal', 'UNABLE'],
  ])('throws away %s', async (_name, text) => {
    fetchMock.mockReturnValue(reply(text));
    expect(await service.gradePsleComposition('My story.', 6)).toBeNull();
  });

  it('sends the required points as task context and fences the response', async () => {
    fetchMock.mockReturnValue(reply('UNABLE'));
    await service.gradeSituationalWriting('Dear Mr Goh', 5, SITUATIONAL_TASK);
    const prompt = sentBody().contents[0].parts[0].text;
    const system = sentBody().systemInstruction.parts[0].text;

    for (const point of SITUATIONAL_TASK.points) expect(prompt).toContain(point);
    expect(prompt).toMatch(/---BEGIN PUPIL RESPONSE [0-9a-z]+---\nDear Mr Goh/);
    expect(prompt).toMatch(/Task fulfilment out of 6/);
    expect(system).toMatch(/missing or wrong costs Task fulfilment marks/);
  });

  it('tells the marker that length and linking words are not quality', async () => {
    fetchMock.mockReturnValue(reply('UNABLE'));
    await service.gradePsleComposition('Firstly, moreover.', 6, CONTINUOUS_TASK);
    const prompt = sentBody().contents[0].parts[0].text;
    const system = sentBody().systemInstruction.parts[0].text;
    expect(prompt).toMatch(/Content out of 18 and Language out of 18/);
    expect(system).toMatch(/strings of linking words/);
  });
});

describe('sample scripts', () => {
  it('give every part and total a range that fits its scale', () => {
    const fits = (range, max) => range[0] >= 0 && range[0] <= range[1] && range[1] <= max;
    for (const s of CONTINUOUS_SAMPLES) {
      expect(fits(s.expect.content, 18), s.id).toBe(true);
      expect(fits(s.expect.language, 18), s.id).toBe(true);
      expect(fits(s.expect.total, 36), s.id).toBe(true);
    }
    for (const s of SITUATIONAL_SAMPLES) {
      expect(fits(s.expect.taskFulfilment, 6), s.id).toBe(true);
      expect(fits(s.expect.languageOrganisation, 8), s.id).toBe(true);
      expect(fits(s.expect.total, 14), s.id).toBe(true);
    }
  });
});

const LIVE_KEY = globalThis.process?.env?.GEMINI_API_KEY;

describe.skipIf(!LIVE_KEY)('live marker check (needs GEMINI_API_KEY)', () => {
  beforeEach(async () => {
    vi.unstubAllGlobals();
    await loadModules();
    store.set('aiProvider', 'google');
    store.set('aiApiKeys', { google: LIVE_KEY });
  });

  const within = (mark, [min, max]) => mark >= min && mark <= max;

  it.each(CONTINUOUS_SAMPLES.map((s) => [s.id, s]))(
    'composition "%s" lands in its expected range',
    async (_id, sample) => {
      const graded = await service.gradePsleComposition(sample.text, 6, CONTINUOUS_TASK);
      expect(graded, 'the model gave no usable mark').not.toBeNull();
      const got = `content ${graded.parts.content.mark}, language ${graded.parts.language.mark}, total ${graded.total}`;
      expect(within(graded.parts.content.mark, sample.expect.content), got).toBe(true);
      expect(within(graded.parts.language.mark, sample.expect.language), got).toBe(true);
      expect(within(graded.total, sample.expect.total), got).toBe(true);
    },
    60_000,
  );

  it.each(SITUATIONAL_SAMPLES.map((s) => [s.id, s]))(
    'situational writing "%s" lands in its expected range',
    async (_id, sample) => {
      const graded = await service.gradeSituationalWriting(sample.text, 5, SITUATIONAL_TASK);
      expect(graded, 'the model gave no usable mark').not.toBeNull();
      const got = `task ${graded.parts.taskFulfilment.mark}, language ${graded.parts.languageOrganisation.mark}, total ${graded.total}`;
      expect(within(graded.parts.taskFulfilment.mark, sample.expect.taskFulfilment), got).toBe(
        true,
      );
      expect(
        within(graded.parts.languageOrganisation.mark, sample.expect.languageOrganisation),
        got,
      ).toBe(true);
      expect(within(graded.total, sample.expect.total), got).toBe(true);
    },
    60_000,
  );
});
