/**
 * Story Recording Module
 *
 * Provides a MediaRecorder-based pipeline for recording child read-aloud
 * attempts. Recordings are stored as Blobs in memory and metadata is
 * persisted to localStorage.
 *
 * Supports:
 *  - Full-story recording (fluency practice)
 *  - Per-line "echo read" recording
 *  - Playback, delete, re-record
 *  - Fluency history (recent attempts per story)
 */

// ── Constants ────────────────────────────────────────────────────────────

const HISTORY_KEY = 'giri_fluency_history';
const MAX_HISTORY_PER_STORY = 5;

// ── In-memory blob store (keyed by generated id) ─────────────────────────
// Blobs cannot be serialised to localStorage, so we keep them in memory
// for the current session. Metadata (without blob) is persisted.

const _blobStore = new Map();

// ── Recording state ──────────────────────────────────────────────────────

let _mediaStream   = null;
let _recorder      = null;
let _chunks        = [];
let _recordingId   = null;
let _recordStart   = null;
let _onStateChange = null;   // callback(state)  state: 'idle'|'recording'|'recorded'|'playing'|'error'

/** Current state: 'idle' | 'recording' | 'recorded' | 'playing' | 'error' */
let _state = 'idle';

// ── Playback ──────────────────────────────────────────────────────────────

let _audioEl = null;

// ── Public API ────────────────────────────────────────────────────────────

/**
 * Request microphone permission and return true if granted.
 * Call this early so the permission prompt appears before recording starts.
 */
export async function requestMicPermission() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // Stop tracks immediately — we just wanted the permission grant
    stream.getTracks().forEach(t => t.stop());
    return true;
  } catch {
    return false;
  }
}

/**
 * Start recording audio.
 * @param {object} opts
 * @param {string} opts.storyId   – story being read
 * @param {number} [opts.lineIdx] – if echo-read, which line index
 * @param {function} [opts.onStateChange] – callback(state)
 * @returns {Promise<boolean>} true if recording started
 */
export async function startRecording({ storyId, lineIdx, onStateChange } = {}) {
  if (_state === 'recording') return false;

  _onStateChange = onStateChange ?? null;
  _chunks = [];

  try {
    _mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch (err) {
    _setState('error');
    return false;
  }

  // Choose a supported MIME type
  const mimeType = _pickMimeType();

  try {
    _recorder = new MediaRecorder(_mediaStream, mimeType ? { mimeType } : {});
  } catch {
    _recorder = new MediaRecorder(_mediaStream);
  }

  _recorder.ondataavailable = (e) => {
    if (e.data.size > 0) _chunks.push(e.data);
  };

  _recorder.onstop = () => {
    const blob = new Blob(_chunks, { type: _recorder.mimeType || 'audio/webm' });
    const id = `rec_${storyId}_${lineIdx ?? 'full'}_${Date.now()}`;
    _recordingId = id;
    _blobStore.set(id, blob);
    _cleanupStream();
    _setState('recorded');
  };

  _recorder.onerror = () => {
    _cleanupStream();
    _setState('error');
  };

  _recordStart = Date.now();
  _recorder.start();
  _setState('recording');
  return true;
}

/**
 * Stop the current recording.
 * The recording blob is available via getLastRecordingId() after state
 * transitions to 'recorded'.
 */
export function stopRecording() {
  if (_recorder && _recorder.state === 'recording') {
    _recorder.stop();
  } else {
    _cleanupStream();
  }
}

/**
 * Play back a recording by id.
 * @param {string} [id] – defaults to last recording
 * @returns {Promise<void>}
 */
export function playRecording(id) {
  const blobId = id ?? _recordingId;
  const blob = blobId ? _blobStore.get(blobId) : null;
  if (!blob) return Promise.resolve();

  return new Promise((resolve) => {
    stopPlayback();
    const url = URL.createObjectURL(blob);
    _audioEl = new Audio(url);
    _setState('playing');
    _audioEl.onended = () => {
      URL.revokeObjectURL(url);
      _audioEl = null;
      _setState('recorded');
      resolve();
    };
    _audioEl.onerror = () => {
      URL.revokeObjectURL(url);
      _audioEl = null;
      _setState('recorded');
      resolve();
    };
    _audioEl.play().catch(() => {
      URL.revokeObjectURL(url);
      _audioEl = null;
      _setState('recorded');
      resolve();
    });
  });
}

/** Stop any active playback. */
export function stopPlayback() {
  if (_audioEl) {
    _audioEl.pause();
    _audioEl = null;
  }
}

/**
 * Delete a recording blob from memory.
 * @param {string} [id] – defaults to last recording
 */
export function deleteRecording(id) {
  const blobId = id ?? _recordingId;
  if (blobId) _blobStore.delete(blobId);
  if (blobId === _recordingId) _recordingId = null;
  stopPlayback();
  _setState('idle');
}

/** Get the id of the last recording made this session. */
export function getLastRecordingId() {
  return _recordingId;
}

/** Get the current recorder state. */
export function getRecorderState() {
  return _state;
}

/** Get duration of the current/last recording in seconds. */
export function getRecordingDuration() {
  if (_state === 'recording' && _recordStart) {
    return (Date.now() - _recordStart) / 1000;
  }
  // For completed recordings, estimate from blob
  const blob = _recordingId ? _blobStore.get(_recordingId) : null;
  if (!blob) return 0;
  // Accurate duration requires decoding; return stored metadata estimate
  return _lastDuration ?? 0;
}

let _lastDuration = 0;

/** Cleanup: call when leaving story reader. */
export function cleanupRecording() {
  stopRecording();
  stopPlayback();
  _blobStore.clear();
  _recordingId = null;
  _state = 'idle';
  _onStateChange = null;
}

// ── Fluency history (localStorage) ───────────────────────────────────────

/**
 * Save a fluency attempt for a story.
 * @param {object} entry
 * @param {string} entry.storyId
 * @param {number} entry.wcpm
 * @param {number} entry.durationSec
 * @param {number} entry.wordCount
 * @param {string} [entry.recordingId] – if a recording was made
 */
export function saveFluencyAttempt(entry) {
  const history = _getHistory();
  const storyHistory = history[entry.storyId] ?? [];
  storyHistory.push({
    date: new Date().toISOString(),
    wcpm: entry.wcpm,
    durationSec: Math.round(entry.durationSec),
    wordCount: entry.wordCount,
    hasRecording: !!entry.recordingId,
  });
  // Keep only most recent attempts
  if (storyHistory.length > MAX_HISTORY_PER_STORY) {
    storyHistory.splice(0, storyHistory.length - MAX_HISTORY_PER_STORY);
  }
  history[entry.storyId] = storyHistory;
  _saveHistory(history);
}

/**
 * Get fluency history for a story.
 * @param {string} storyId
 * @returns {Array<{date:string, wcpm:number, durationSec:number, wordCount:number, hasRecording:boolean}>}
 */
export function getFluencyHistory(storyId) {
  const history = _getHistory();
  return history[storyId] ?? [];
}

/**
 * Get the best WCPM for a story.
 * @param {string} storyId
 * @returns {number|null}
 */
export function getBestWcpm(storyId) {
  const attempts = getFluencyHistory(storyId);
  if (attempts.length === 0) return null;
  return Math.max(...attempts.map(a => a.wcpm));
}

// ── Private helpers ──────────────────────────────────────────────────────

function _setState(newState) {
  _state = newState;
  if (newState === 'recorded' && _recordStart) {
    _lastDuration = (Date.now() - _recordStart) / 1000;
  }
  _onStateChange?.(newState);
}

function _cleanupStream() {
  if (_mediaStream) {
    _mediaStream.getTracks().forEach(t => t.stop());
    _mediaStream = null;
  }
}

function _pickMimeType() {
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/mp4',
  ];
  for (const mime of candidates) {
    try {
      if (MediaRecorder.isTypeSupported(mime)) return mime;
    } catch { /* ignore */ }
  }
  return '';
}

function _getHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '{}');
  } catch {
    return {};
  }
}

function _saveHistory(history) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch { /* storage full — silently fail */ }
}
