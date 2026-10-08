/**
 * The placement check must not say the answer out loud.
 *
 * Gate A's sound items are for children who can't read, so the labels are
 * hidden and the question is spoken. They used to speak the answer word
 * ("moon" for "Which picture starts with /m/?"), so a child only had to
 * tap the picture they had just heard named. Now the question is spoken
 * with the target sound as a recording.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { CURRICULUM } from '../data/curriculum.js';
import { getRecommendedStage, stagesOpenedByPlacement } from '../modules/progression.js';

let GATE_A_ITEMS;
let GATE_C_ITEMS;
let audio;

beforeAll(async () => {
  globalThis.speechSynthesis = globalThis.speechSynthesis || {
    getVoices: () => [],
    addEventListener: () => {},
    speak: () => {},
    cancel: () => {},
  };
  const mod = await import('../modules/placementTest.js');
  GATE_A_ITEMS = mod.GATE_A_ITEMS;
  GATE_C_ITEMS = mod.GATE_C_ITEMS;
  ({ audio } = await import('../modules/audio.js'));
});

const SOUND_SECTIONS = ['firstSound', 'lastSound', 'middleSound', 'oralBlending'];
const soundItems = () => GATE_A_ITEMS.filter((i) => SOUND_SECTIONS.includes(i.section));
const spokenText = (item) =>
  [item.speak, ...(item.say || []).filter((p) => typeof p === 'string')]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
const sounds = (item) => (item.say || []).filter((p) => p?.sound).map((p) => p.sound);

describe('Gate A sound items', () => {
  it('speak the question and the sound, never the answer word', () => {
    expect(soundItems().length).toBe(12);
    for (const item of soundItems()) {
      expect(item.speak, `${item.id} speaks a word`).toBeUndefined();
      expect(sounds(item).length, `${item.id} plays no sound`).toBeGreaterThan(0);
      expect(spokenText(item)).not.toContain(item.correct);
    }
  });

  it('play the sound the question is about', () => {
    for (const item of soundItems()) {
      const word = item.correct;
      const s = sounds(item);
      if (item.section === 'firstSound') expect(s).toEqual([word[0]]);
      if (item.section === 'lastSound') expect(s).toEqual([word[word.length - 1]]);
      if (item.section === 'middleSound') expect(s).toEqual([word[1]]);
      // c-a-t: the /k/ recording is keyed 'c'.
      if (item.section === 'oralBlending') expect(s.join('')).toBe(word);
    }
  });

  it('have exactly one picture that fits', () => {
    const pick = { firstSound: (w) => w[0], lastSound: (w) => w.at(-1), middleSound: (w) => w[1] };
    for (const item of soundItems()) {
      const at = pick[item.section];
      if (!at) continue;
      const target = sounds(item)[0];
      const fits = item.options.filter((o) => at(o.id) === target).map((o) => o.id);
      expect(fits, item.id).toEqual([item.correct]);
    }
  });

  it('says the definition, not the word, for the helper item', () => {
    const doctor = GATE_A_ITEMS.find((i) => i.correct === 'doctor');
    expect(spokenText(doctor)).not.toContain('doctor');
  });
});

describe('Gate C', () => {
  it('no prompt prints its own answer', () => {
    for (const item of GATE_C_ITEMS) {
      if (typeof item.correct !== 'string') continue;
      expect(String(item.prompt).toLowerCase(), item.id).not.toContain(`: ${item.correct}`);
    }
  });

  it('comprehension items speak the whole sentence and question', () => {
    for (const item of GATE_C_ITEMS.filter((i) => i.section === 'comprehension')) {
      expect(spokenText(item).split(' ').length, item.id).toBeGreaterThan(5);
    }
  });
});

describe('audio.speakWithSounds', () => {
  afterEach(() => vi.restoreAllMocks());

  it('speaks text and plays recordings in order', async () => {
    const calls = [];
    vi.spyOn(audio, 'speakText').mockImplementation(async (t) => calls.push(`say:${t}`));
    vi.spyOn(audio, '_playPhonemeAudio').mockImplementation(async (k) => calls.push(`sound:${k}`));
    vi.spyOn(audio, '_delay').mockResolvedValue(undefined);
    await audio.speakWithSounds(['Which picture starts with', { sound: 'm' }]);
    expect(calls).toEqual(['say:Which picture starts with', 'sound:m']);
  });

  it('stops when something else starts speaking', async () => {
    const played = vi.spyOn(audio, '_playPhonemeAudio').mockResolvedValue(undefined);
    vi.spyOn(audio, '_delay').mockResolvedValue(undefined);
    // The child moves on while the question is still being spoken.
    vi.spyOn(audio, 'speakText').mockImplementation(async () => {
      await Promise.resolve();
      audio.cancelSpeech();
    });
    await audio.speakWithSounds(['Listen.', { sound: 'c' }, { sound: 'a' }]);
    expect(played).not.toHaveBeenCalled();
  });
});

describe('placement sets the starting stage', () => {
  it('opens nothing extra for a phase 1 result', () => {
    expect(stagesOpenedByPlacement({ phase: 1, startGroup: 'cvc-a' })).toEqual([]);
    expect(stagesOpenedByPlacement(null)).toEqual([]);
  });

  it('opens the phases below and the placed phase up to the start group', () => {
    const ids = stagesOpenedByPlacement({ phase: 2, startGroup: 'ccvc-e' });
    const groups = ids.map((id) => CURRICULUM.find((s) => s.id === id).group);
    expect(groups).toEqual([
      'cvc-a',
      'cvc-e',
      'cvc-i',
      'cvc-o',
      'cvc-u',
      'struct-cvc',
      'ccvc-a',
      'ccvc-e',
    ]);
  });

  it('recommends the first stage of the placed phase', () => {
    const placement = { phase: 2, startGroup: 'ccvc-e' };
    const stage = getRecommendedStage({
      stagesUnlocked: stagesOpenedByPlacement(placement),
      placementPhase: placement.phase,
    });
    expect(stage.group).toBe('ccvc-a');
  });
});
