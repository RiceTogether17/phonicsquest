import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';

// Mock MediaRecorder
class MockMediaRecorder {
  constructor(stream, options) {
    this.stream = stream;
    this.state = 'inactive';
    this.mimeType = options?.mimeType || 'audio/webm';
    this.ondataavailable = null;
    this.onstop = null;
    this.onerror = null;
  }
  start() {
    this.state = 'recording';
  }
  stop() {
    this.state = 'inactive';
    // Simulate data chunk
    this.ondataavailable?.({ data: new Blob(['test-audio'], { type: this.mimeType }) });
    this.onstop?.();
  }
  static isTypeSupported(mime) {
    return mime === 'audio/webm';
  }
}

// Mock getUserMedia
function makeMockStream() {
  return { getTracks: () => [{ stop: vi.fn() }] };
}

function installMediaMocks() {
  globalThis.MediaRecorder = MockMediaRecorder;
  globalThis.navigator.mediaDevices = {
    getUserMedia: vi.fn().mockResolvedValue(makeMockStream()),
  };
}

function clearStorage() {
  localStorage.clear();
}

describe('storyRecording module', () => {
  beforeEach(() => {
    clearStorage();
    installMediaMocks();
  });

  afterEach(() => {
    clearStorage();
  });

  describe('fluency history', () => {
    it('saves and retrieves fluency attempts', async () => {
      const { saveFluencyAttempt, getFluencyHistory, getBestWcpm } = await import('../src/modules/storyRecording.js');

      saveFluencyAttempt({ storyId: 'test-1', wcpm: 45, durationSec: 30, wordCount: 22 });
      saveFluencyAttempt({ storyId: 'test-1', wcpm: 52, durationSec: 25, wordCount: 22 });

      const history = getFluencyHistory('test-1');
      expect(history).toHaveLength(2);
      expect(history[0].wcpm).toBe(45);
      expect(history[1].wcpm).toBe(52);
      expect(getBestWcpm('test-1')).toBe(52);
    });

    it('returns null for unknown story', async () => {
      const { getBestWcpm, getFluencyHistory } = await import('../src/modules/storyRecording.js');

      expect(getFluencyHistory('unknown')).toEqual([]);
      expect(getBestWcpm('unknown')).toBeNull();
    });

    it('caps history at 5 entries per story', async () => {
      const { saveFluencyAttempt, getFluencyHistory } = await import('../src/modules/storyRecording.js');

      for (let i = 0; i < 8; i++) {
        saveFluencyAttempt({ storyId: 's1', wcpm: 40 + i, durationSec: 30, wordCount: 20 });
      }

      const history = getFluencyHistory('s1');
      expect(history).toHaveLength(5);
      // Should keep the most recent 5 (40+3 through 40+7)
      expect(history[0].wcpm).toBe(43);
      expect(history[4].wcpm).toBe(47);
    });
  });

  describe('recording lifecycle', () => {
    it('starts and stops recording', async () => {
      const { startRecording, stopRecording, getRecorderState, cleanupRecording } = await import('../src/modules/storyRecording.js');
      cleanupRecording();

      const stateChanges = [];
      const started = await startRecording({
        storyId: 'test-1',
        onStateChange: (s) => stateChanges.push(s),
      });

      expect(started).toBe(true);
      expect(stateChanges).toContain('recording');

      stopRecording();
      // After stop, state should transition to 'recorded'
      expect(stateChanges).toContain('recorded');

      cleanupRecording();
    });

    it('returns false and sets error on mic failure', async () => {
      const { startRecording, cleanupRecording } = await import('../src/modules/storyRecording.js');
      cleanupRecording();

      navigator.mediaDevices.getUserMedia = vi.fn().mockRejectedValue(new Error('denied'));

      const stateChanges = [];
      const started = await startRecording({
        storyId: 'test-1',
        onStateChange: (s) => stateChanges.push(s),
      });

      expect(started).toBe(false);
      expect(stateChanges).toContain('error');
      cleanupRecording();
    });

    it('deleteRecording resets state to idle', async () => {
      const { startRecording, stopRecording, deleteRecording, getRecorderState, cleanupRecording } = await import('../src/modules/storyRecording.js');
      cleanupRecording();

      await startRecording({ storyId: 'test-1' });
      stopRecording();
      deleteRecording();
      expect(getRecorderState()).toBe('idle');
      cleanupRecording();
    });

    it('caps in-memory blobs, evicting the oldest takes first', async () => {
      const { startRecording, stopRecording, getRecordingBlob, getLastRecordingId, cleanupRecording } =
        await import('../src/modules/storyRecording.js');
      cleanupRecording();

      const ids = [];
      for (let i = 0; i < 14; i++) {
        await startRecording({ storyId: `story-${i}` });
        stopRecording();
        ids.push(getLastRecordingId());
      }

      // Oldest takes are gone, the most recent are retained.
      expect(getRecordingBlob(ids[0])).toBeFalsy();
      expect(getRecordingBlob(ids[ids.length - 1])).toBeTruthy();
      const retained = ids.filter(id => getRecordingBlob(id));
      expect(retained.length).toBeLessThanOrEqual(10);
      cleanupRecording();
    });
  });

  describe('requestMicPermission', () => {
    it('returns true when mic is granted', async () => {
      const { requestMicPermission } = await import('../src/modules/storyRecording.js');
      const result = await requestMicPermission();
      expect(result).toBe(true);
    });

    it('returns false when mic is denied', async () => {
      navigator.mediaDevices.getUserMedia = vi.fn().mockRejectedValue(new Error('denied'));
      const { requestMicPermission } = await import('../src/modules/storyRecording.js');
      const result = await requestMicPermission();
      expect(result).toBe(false);
    });
  });
});
