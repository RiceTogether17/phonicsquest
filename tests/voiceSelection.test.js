import { beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * Pins the default voice selection: PhonicsQuest should pick the
 * clearest UK female voice available on the device, falling through to
 * non-UK premium voices only when no UK voice is installed.
 */

function installVoices(voices) {
  globalThis.speechSynthesis = {
    getVoices: () => voices,
    addEventListener: () => {},
    speak: () => {},
    cancel: () => {},
    paused: false,
    resume: () => {},
  };
  globalThis.SpeechSynthesisUtterance = class {
    constructor(t) {
      this.text = t;
    }
  };
}

async function pickVoiceWith(voices) {
  installVoices(voices);
  vi.resetModules();
  const { audio } = await import('../src/modules/audio.js');
  return audio.getTtsVoice();
}

beforeEach(() => {
  vi.resetModules();
});

describe('voice selection — defaults to the clearest UK female', () => {
  it('prefers Microsoft Sonia Online (Natural) when present', async () => {
    const v = await pickVoiceWith([
      { name: 'Microsoft David Desktop', lang: 'en-US' },
      { name: 'Microsoft Sonia Online (Natural) - English (United Kingdom)', lang: 'en-GB' },
      { name: 'Google US English', lang: 'en-US' },
    ]);
    expect(v.name).toMatch(/Sonia/);
  });

  it('picks Google UK English Female over US voices', async () => {
    const v = await pickVoiceWith([
      { name: 'Google US English', lang: 'en-US' },
      { name: 'Google UK English Female', lang: 'en-GB' },
      { name: 'Google UK English Male', lang: 'en-GB' },
    ]);
    expect(v.name).toBe('Google UK English Female');
  });

  it('picks Kate (Enhanced) over Samantha (Enhanced) on iOS/macOS', async () => {
    const v = await pickVoiceWith([
      { name: 'Samantha (Enhanced)', lang: 'en-US' },
      { name: 'Kate (Enhanced)', lang: 'en-GB' },
      { name: 'Daniel (Enhanced)', lang: 'en-GB' }, // UK male — must NOT win
    ]);
    expect(v.name).toBe('Kate (Enhanced)');
  });

  it('skips UK male voices (Daniel, Arthur) in favour of a female UK voice', async () => {
    const v = await pickVoiceWith([
      { name: 'Daniel', lang: 'en-GB' },
      { name: 'Arthur', lang: 'en-GB' },
      { name: 'Kate', lang: 'en-GB' },
    ]);
    expect(v.name).toBe('Kate');
  });

  it('picks a UK female by heuristic name (Olivia) when not in the exact list', async () => {
    const v = await pickVoiceWith([
      { name: 'Microsoft Olivia Online (Natural)', lang: 'en-GB' },
      { name: 'Daniel', lang: 'en-GB' },
    ]);
    expect(v.name).toMatch(/Olivia/);
  });

  it('falls back to a premium en-GB voice when no UK female is available', async () => {
    const v = await pickVoiceWith([
      { name: 'Daniel', lang: 'en-GB' },
      { name: 'George (Enhanced)', lang: 'en-GB' }, // UK male premium
      { name: 'Google US English', lang: 'en-US' },
    ]);
    // Should pick the premium en-GB voice (George) over a non-UK voice
    expect(v.lang.toLowerCase()).toBe('en-gb');
  });

  it('falls back to any en-GB voice over a non-UK voice', async () => {
    const v = await pickVoiceWith([
      { name: 'Arthur', lang: 'en-GB' },
      { name: 'Samantha', lang: 'en-US' },
    ]);
    expect(v.lang.toLowerCase()).toBe('en-gb');
  });

  it('falls back to a premium non-UK voice when no UK voice is installed', async () => {
    const v = await pickVoiceWith([
      { name: 'Microsoft David', lang: 'en-US' },
      { name: 'Samantha (Enhanced)', lang: 'en-US' },
    ]);
    expect(v.name).toBe('Samantha (Enhanced)');
  });

  it('still skips iOS low-quality "Compact" / novelty voices', async () => {
    const v = await pickVoiceWith([
      { name: 'Kate-compact', lang: 'en-GB' },
      { name: 'Bahh', lang: 'en-US' }, // novelty
      { name: 'Trinoids', lang: 'en-US' }, // novelty
      { name: 'Samantha', lang: 'en-US' },
    ]);
    expect(v.name).toBe('Samantha'); // novelty / compact filtered out
  });

  it('returns a voice even with a sparse low-quality voice list', async () => {
    const v = await pickVoiceWith([{ name: 'Some Random Voice', lang: 'en-US' }]);
    expect(v).not.toBeNull();
    expect(v.name).toBe('Some Random Voice');
  });
});
