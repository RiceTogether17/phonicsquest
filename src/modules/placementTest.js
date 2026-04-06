/**
 * PhonicsQuest – Developmental Placement Diagnostic
 *
 * Gate sequence:
 *   A. Oral/no-print foundations
 *   B. Early print readiness
 *   C. Connected reading
 *   D. Sentence/grammar/vocabulary readiness
 *
 * Gate progression is adaptive: B only appears if A is secure, etc.
 */

import { audio } from './audio.js';

const GATE_A_ITEMS = [
  {
    id: 'a-or-1',
    gate: 'A',
    section: 'oral',
    kind: 'teacher-scale',
    title: 'Basic oral response',
    prompt: 'Learner responds to name/questions with understandable speech.',
  },
  {
    id: 'a-vocab-1',
    gate: 'A',
    section: 'vocab',
    kind: 'picture-choice',
    title: 'Vocabulary',
    prompt: 'Tap the fish.',
    speak: 'fish',
    correct: 'fish',
    options: [
      { id: 'fish', emoji: '🐟', label: 'Fish' },
      { id: 'dog', emoji: '🐶', label: 'Dog' },
      { id: 'car', emoji: '🚗', label: 'Car' },
      { id: 'book', emoji: '📘', label: 'Book' },
    ],
  },
  {
    id: 'a-first-1',
    gate: 'A',
    section: 'firstSound',
    kind: 'picture-choice',
    title: 'First sound',
    prompt: 'Which picture starts with /m/?',
    speak: 'moon',
    correct: 'moon',
    options: [
      { id: 'moon', emoji: '🌙', label: 'Moon' },
      { id: 'sun', emoji: '☀️', label: 'Sun' },
      { id: 'hat', emoji: '🎩', label: 'Hat' },
      { id: 'bus', emoji: '🚌', label: 'Bus' },
    ],
  },
  {
    id: 'a-last-1',
    gate: 'A',
    section: 'lastSound',
    kind: 'picture-choice',
    title: 'Last sound',
    prompt: 'Which picture ends with /t/?',
    speak: 'cat',
    correct: 'cat',
    options: [
      { id: 'cat', emoji: '🐱', label: 'Cat' },
      { id: 'bee', emoji: '🐝', label: 'Bee' },
      { id: 'goat', emoji: '🐐', label: 'Goat' },
      { id: 'shoe', emoji: '👟', label: 'Shoe' },
    ],
  },
  {
    id: 'a-middle-1',
    gate: 'A',
    section: 'middleSound',
    kind: 'picture-choice',
    title: 'Middle sound',
    prompt: 'Which picture has /a/ in the middle?',
    speak: 'cat',
    correct: 'cat',
    options: [
      { id: 'cat', emoji: '🐱', label: 'Cat' },
      { id: 'pig', emoji: '🐷', label: 'Pig' },
      { id: 'bus', emoji: '🚌', label: 'Bus' },
      { id: 'hen', emoji: '🐔', label: 'Hen' },
    ],
  },
  {
    id: 'a-letters-1',
    gate: 'A',
    section: 'letterSounds',
    kind: 'teacher-scale',
    title: 'Letter-sound knowledge',
    prompt: 'Teacher score: learner identifies common letter sounds in an adult-led check (no independent print demand).',
  },
  {
    id: 'a-blend-1',
    gate: 'A',
    section: 'oralBlending',
    kind: 'picture-choice',
    title: 'Oral blending',
    prompt: 'Listen: /c/ /a/ /t/. Tap the word.',
    speak: 'cat',
    correct: 'cat',
    options: [
      { id: 'cat', emoji: '🐱', label: 'Cat' },
      { id: 'cap', emoji: '🧢', label: 'Cap' },
      { id: 'can', emoji: '🥫', label: 'Can' },
      { id: 'car', emoji: '🚗', label: 'Car' },
    ],
  },
];

const GATE_B_ITEMS = [
  { id: 'b-cvc-1', gate: 'B', section: 'decoding', kind: 'word-choice', title: 'CVC decoding', prompt: 'Tap: cat', speak: 'cat', correct: 'cat', phase: 1, group: 'cvc-a', options: ['cat', 'cut', 'cot', 'cap'] },
  { id: 'b-cvc-2', gate: 'B', section: 'decoding', kind: 'word-choice', title: 'Short vowels', prompt: 'Tap: bed', speak: 'bed', correct: 'bed', phase: 1, group: 'cvc-e', options: ['bad', 'bid', 'bed', 'bud'] },
  { id: 'b-blend-1', gate: 'B', section: 'decoding', kind: 'word-choice', title: 'Initial blends', prompt: 'Tap: flag', speak: 'flag', correct: 'flag', phase: 2, group: 'ccvc-a', options: ['flag', 'flap', 'frog', 'plug'] },
  { id: 'b-cvcc-1', gate: 'B', section: 'decoding', kind: 'word-choice', title: 'Final blends', prompt: 'Tap: best', speak: 'best', correct: 'best', phase: 3, group: 'cvcc-e', options: ['best', 'beast', 'bent', 'belt'] },
  { id: 'b-digraph-1', gate: 'B', section: 'decoding', kind: 'word-choice', title: 'Digraphs', prompt: 'Tap: ship', speak: 'ship', correct: 'ship', phase: 4, group: 'digraphs', options: ['chip', 'shop', 'ship', 'slip'] },
  { id: 'b-long-1', gate: 'B', section: 'decoding', kind: 'word-choice', title: 'Long vowels', prompt: 'Tap: cake', speak: 'cake', correct: 'cake', phase: 5, group: 'long-a', options: ['cake', 'cane', 'cook', 'kick'] },
  { id: 'b-sight-1', gate: 'B', section: 'sightWords', kind: 'word-choice', title: 'Sight words', prompt: 'Tap: said', speak: 'said', correct: 'said', options: ['seed', 'said', 'sad', 'sail'] },
  { id: 'b-sight-2', gate: 'B', section: 'sightWords', kind: 'word-choice', title: 'Sight words', prompt: 'Tap: the', speak: 'the', correct: 'the', options: ['the', 'then', 'them', 'that'] },
];

const GATE_C_ITEMS = [
  {
    id: 'c-word-1', gate: 'C', section: 'connectedReading', kind: 'word-choice', title: 'Decodable reading',
    prompt: 'Tap: jump', speak: 'jump', correct: 'jump', options: ['jump', 'lump', 'lamp', 'hump'],
  },
  {
    id: 'c-sentence-1', gate: 'C', section: 'connectedReading', kind: 'sentence-choice', title: 'Sentence reading',
    sentence: 'The cat can hop.', prompt: 'Read and choose the matching picture.',
    correct: 'cat-hop',
    options: [
      { id: 'cat-hop', emoji: '🐱↗️', label: 'Cat can hop' },
      { id: 'dog-run', emoji: '🐶🏃', label: 'Dog can run' },
      { id: 'pig-sit', emoji: '🐷🪑', label: 'Pig can sit' },
      { id: 'hen-fly', emoji: '🐔🪽', label: 'Hen can fly' },
    ],
  },
  {
    id: 'c-readaloud-1', gate: 'C', section: 'storyReadiness', kind: 'teacher-scale',
    title: 'Read aloud readiness',
    prompt: 'Teacher score: learner reads 1–2 short decodable sentences with support.',
  },
  {
    id: 'c-comp-1', gate: 'C', section: 'comprehension', kind: 'picture-choice', title: 'Comprehension',
    prompt: 'Listen: "Sam had a red cap." Tap what Sam had.', speak: 'red cap', correct: 'cap',
    options: [
      { id: 'cap', emoji: '🧢', label: 'Cap' },
      { id: 'bag', emoji: '👜', label: 'Bag' },
      { id: 'cup', emoji: '🥤', label: 'Cup' },
      { id: 'pen', emoji: '🖊️', label: 'Pen' },
    ],
  },
];

const GATE_D_ITEMS = [
  {
    id: 'd-sentence-1', gate: 'D', section: 'sentenceReady', kind: 'word-choice', title: 'Sentence building',
    prompt: 'Pick the best sentence:',
    options: ['She is running.', 'She running is.', 'Running she is.', 'Is she running'],
    correct: 'She is running.',
  },
  {
    id: 'd-grammar-1', gate: 'D', section: 'grammarReady', kind: 'word-choice', title: 'Grammar cloze',
    prompt: 'He ___ to school yesterday.',
    options: ['go', 'goes', 'went', 'going'],
    correct: 'went',
  },
  {
    id: 'd-vocab-1', gate: 'D', section: 'vocabularyReady', kind: 'word-choice', title: 'Vocabulary in context',
    prompt: 'The room was dark, so we turned on the ___.',
    options: ['light', 'spoon', 'shoe', 'rain'],
    correct: 'light',
  },
];

function _shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function _accuracy(results, section) {
  const rows = results.filter(r => r.section === section && typeof r.correct === 'boolean');
  if (!rows.length) return 0;
  return rows.filter(r => r.correct).length / rows.length;
}

function _teacherScore(results, section) {
  const rows = results.filter(r => r.section === section && typeof r.score === 'number');
  if (!rows.length) return 0;
  return rows.reduce((a, b) => a + b.score, 0) / rows.length;
}

function _phaseFromDecoding(results) {
  const decoding = results.filter(r => r.section === 'decoding');
  if (!decoding.length) return { phase: 1, startGroup: 'cvc-a' };
  const phaseAccuracy = new Map();
  for (const row of decoding) {
    const p = row.phase || 1;
    const bucket = phaseAccuracy.get(p) || { total: 0, correct: 0, groups: [] };
    bucket.total += 1;
    if (row.correct) bucket.correct += 1;
    if (row.group && !bucket.groups.includes(row.group)) bucket.groups.push(row.group);
    phaseAccuracy.set(p, bucket);
  }
  let phase = 1;
  for (let p = 1; p <= 5; p++) {
    const b = phaseAccuracy.get(p);
    if (!b) break;
    if ((b.correct / b.total) >= 0.6) phase = p;
    else break;
  }
  const group = (phaseAccuracy.get(phase)?.groups || []).slice(-1)[0]
    || (phase <= 1 ? 'cvc-a' : phase === 2 ? 'ccvc-a' : phase === 3 ? 'cvcc-a' : phase === 4 ? 'digraphs' : 'long-a');
  return { phase, startGroup: group };
}

function _buildPreSeededStats(phase) {
  if (phase <= 1) return {};
  const now = new Date().toISOString();
  const stats = {};
  const seed = [
    ...(phase >= 2 ? ['cat', 'bed', 'sit', 'dog', 'map', 'sun'] : []),
    ...(phase >= 3 ? ['flag', 'frog', 'step', 'best', 'nest'] : []),
    ...(phase >= 4 ? ['camp', 'hand', 'gift', 'sand'] : []),
    ...(phase >= 5 ? ['cake', 'kite', 'home', 'cute', 'tune'] : []),
  ];
  for (const w of seed) {
    stats[w] = { attempts: 8, correct: 8, lastSeen: now, reviewInterval: 1, nextReviewDate: now };
  }
  return stats;
}

function _recommendedPath(result) {
  const byBand = {
    'pre-reader': ['letter-sounds', 'first-sound', 'last-sound', 'middle-sound', 'hear', 'oral-blend', 'sight-words', 'stories'],
    'emerging-decoder': ['blend', 'classicBlend', 'sight-words', 'stories', 'hear'],
    'developing-reader': ['blend', 'stories', 'sight-words', 'sentence-forge'],
    'reader': ['sentence-forge', 'cloze-castle', 'word-vault', 'editing-quest'],
  };
  return byBand[result.readingBand] || byBand['pre-reader'];
}

export function derivePlacementResult(results, intake = {}, schoolLevel = 'preschool') {
  const oral = _teacherScore(results, 'oral');
  const first = _accuracy(results, 'firstSound');
  const last = _accuracy(results, 'lastSound');
  const middle = _accuracy(results, 'middleSound');
  const letterSounds = _teacherScore(results, 'letterSounds');
  const oralBlending = _accuracy(results, 'oralBlending');
  const vocab = _accuracy(results, 'vocab');
  const decoding = _accuracy(results, 'decoding');
  const sightWords = _accuracy(results, 'sightWords');
  const connectedReading = _accuracy(results, 'connectedReading');
  const comprehension = _accuracy(results, 'comprehension');
  const readAloud = _teacherScore(results, 'storyReadiness');
  const sentenceReadyScore = _accuracy(results, 'sentenceReady');
  const grammarReadyScore = _accuracy(results, 'grammarReady');
  const vocabularyReadyScore = _accuracy(results, 'vocabularyReady');

  const gateASecure = (first + last + middle + letterSounds + oralBlending + vocab + oral) / 7 >= 0.6;
  const gateBSecure = decoding >= 0.6;
  const gateCSecure = ((connectedReading + comprehension + readAloud) / 3) >= 0.6;

  let readingBand = 'pre-reader';
  if (gateASecure) readingBand = 'emerging-decoder';
  if (gateASecure && gateBSecure) readingBand = 'developing-reader';
  if (gateASecure && gateBSecure && gateCSecure && (sentenceReadyScore + grammarReadyScore + vocabularyReadyScore) / 3 >= 0.6) {
    readingBand = 'reader';
  }

  const { phase: phonicsPhase, startGroup } = _phaseFromDecoding(results);

  const storyReadiness = !gateBSecure
    ? 'not-ready'
    : gateCSecure
      ? 'paragraph'
      : 'sentence';

  const sightWordBand = sightWords >= 0.8
    ? 'strong'
    : sightWords >= 0.55
      ? 'developing'
      : sightWords > 0
        ? 'early'
        : 'none';

  const sentenceReady = readingBand === 'reader' || sentenceReadyScore >= 0.6;
  const grammarReady = readingBand === 'reader' || (gateCSecure && grammarReadyScore >= 0.6);
  const vocabularyReady = readingBand === 'reader' || vocabularyReadyScore >= 0.6;

  const result = {
    readingBand,
    phonicsPhase,
    phase: phonicsPhase,
    startGroup,
    preSeededStats: _buildPreSeededStats(phonicsPhase),
    soundAwarenessProfile: {
      firstSound: first,
      lastSound: last,
      middleSound: middle,
      oralBlending,
      letterSounds,
    },
    oralLanguageProfile: {
      basicResponse: oral,
      receptiveVocabulary: vocab,
    },
    sightWordBand,
    storyReadiness,
    sentenceReady,
    grammarReady,
    vocabularyReady,
    intake: {
      age: intake.age || '',
      schoolLevel: intake.schoolLevel || schoolLevel || 'preschool',
      homeLanguage: intake.homeLanguage || '',
      canWriteName: intake.canWriteName || 'unknown',
      letterRecognition: intake.letterRecognition || 'unknown',
      simpleWordReading: intake.simpleWordReading || 'unknown',
      notes: intake.notes || '',
    },
    gateScores: {
      gateA: Number(((first + last + middle + letterSounds + oralBlending + vocab + oral) / 7).toFixed(2)),
      gateB: Number(decoding.toFixed(2)),
      gateC: Number((((connectedReading + comprehension + readAloud) / 3)).toFixed(2)),
      gateD: Number((((sentenceReadyScore + grammarReadyScore + vocabularyReadyScore) / 3)).toFixed(2)),
    },
  };

  result.recommendedHomePath = _recommendedPath(result);
  return result;
}

function _defaultResult(profile) {
  const intake = {
    age: '',
    schoolLevel: profile?.schoolLevel || 'preschool',
    homeLanguage: '',
    canWriteName: 'unknown',
    letterRecognition: 'unknown',
    simpleWordReading: 'unknown',
    notes: '',
  };
  const readingBand = profile?.schoolLevel === 'primary' ? 'developing-reader' : 'pre-reader';
  const base = {
    readingBand,
    phonicsPhase: 1,
    phase: 1,
    startGroup: 'cvc-a',
    preSeededStats: {},
    soundAwarenessProfile: { firstSound: 0, lastSound: 0, middleSound: 0, oralBlending: 0, letterSounds: 0 },
    oralLanguageProfile: { basicResponse: 0, receptiveVocabulary: 0 },
    sightWordBand: 'none',
    storyReadiness: 'not-ready',
    sentenceReady: false,
    grammarReady: false,
    vocabularyReady: false,
    intake,
    gateScores: { gateA: 0, gateB: 0, gateC: 0, gateD: 0 },
  };
  base.recommendedHomePath = _recommendedPath(base);
  return base;
}

export function getNextGateToAppend(baseResult, existingSequence = []) {
  const gates = new Set(existingSequence.map(i => i.gate));
  const gateA = baseResult?.gateScores?.gateA ?? 0;
  const gateB = baseResult?.gateScores?.gateB ?? 0;
  const gateC = baseResult?.gateScores?.gateC ?? 0;

  if (!gates.has('B') && gateA >= 0.55) return 'B';
  if (!gates.has('C') && gateA >= 0.55 && gateB >= 0.55) return 'C';
  if (!gates.has('D') && gateA >= 0.55 && gateB >= 0.55 && gateC >= 0.6) return 'D';
  return null;
}

/**
 * Render the placement test into `container`.
 */
export function showPlacementTest({ container, profile, onComplete }) {
  if (!container) return;

  const intake = {
    schoolLevel: profile?.schoolLevel || 'preschool',
  };
  const responses = [];
  let sequence = [{ gate: 'INTAKE', kind: 'intake', id: 'intake' }, ...GATE_A_ITEMS];
  let index = 0;

  function progressLabel() {
    const current = Math.min(index + 1, sequence.length);
    return `${current} / ${sequence.length}`;
  }

  function renderFrame(content, title = 'Reading Readiness Check') {
    const pct = sequence.length ? Math.round((index / sequence.length) * 100) : 0;
    container.innerHTML = `
      <div class="pt-wrapper" role="main" aria-label="Placement diagnostic">
        <div class="pt-header">
          <div class="pt-title-row">
            <span class="pt-title-icon" aria-hidden="true">🧭</span>
            <div>
              <h1 class="pt-title">${title}</h1>
              <p class="pt-subtitle">No-print first, then print, then reading, then language.</p>
            </div>
            <button class="btn btn--ghost btn--sm pt-skip-btn" id="pt-skip">Skip</button>
          </div>
          <div class="pt-progress-bar-wrap"><div class="pt-progress-bar" style="width:${pct}%"></div></div>
          <span class="pt-progress-label">${progressLabel()}</span>
        </div>
        <div class="pt-body" id="pt-body">${content}</div>
      </div>`;

    container.querySelector('#pt-skip')?.addEventListener('click', () => onComplete(_defaultResult(profile)));
  }

  function next() {
    index += 1;
    if (index >= sequence.length) return finish();
    renderCurrent();
  }

  function answer(item, payload) {
    responses.push({ id: item.id, gate: item.gate, section: item.section, ...payload });
    next();
  }

  function bindChoice(item, correctId) {
    container.querySelectorAll('[data-choice]').forEach(btn => {
      btn.addEventListener('click', () => {
        const picked = btn.getAttribute('data-choice');
        const correct = picked === correctId;
        btn.classList.add(correct ? 'pt-choice--correct' : 'pt-choice--wrong');
        setTimeout(() => answer(item, { correct, selected: picked, phase: item.phase, group: item.group }), 220);
      });
    });

    container.querySelector('#pt-listen')?.addEventListener('click', () => {
      if (item.speak) audio.speakWord(item.speak);
    });

    if (item.speak) setTimeout(() => audio.speakWord(item.speak), 200);
  }

  function renderIntake() {
    renderFrame(`
      <div class="pt-item">
        <div class="pt-phase-tag">Section 1 · Intake</div>
        <p class="pt-question">Quick adult intake (not heavily scored)</p>
        <div class="pt-intake-grid">
          <label>Age <input id="pt-age" type="number" min="2" max="14" value="${intake.age || ''}"/></label>
          <label>School level
            <select id="pt-school-level">
              <option value="preschool" ${intake.schoolLevel === 'preschool' ? 'selected' : ''}>Preschool</option>
              <option value="primary" ${intake.schoolLevel === 'primary' ? 'selected' : ''}>Primary</option>
            </select>
          </label>
          <label>Home language <input id="pt-home-lang" type="text" value="${intake.homeLanguage || ''}" placeholder="e.g. English / Malay"/></label>
          <label>Can write name?
            <select id="pt-write-name">
              <option value="unknown">Not sure</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </label>
          <label>Recognises letters?
            <select id="pt-letter-rec">
              <option value="unknown">Not sure</option>
              <option value="yes">Yes</option>
              <option value="some">Some letters</option>
              <option value="no">No</option>
            </select>
          </label>
          <label>Reads simple words?
            <select id="pt-simple-words">
              <option value="unknown">Not sure</option>
              <option value="yes">Yes</option>
              <option value="some">Some words</option>
              <option value="no">No</option>
            </select>
          </label>
          <label class="pt-intake-wide">Notes/concerns
            <textarea id="pt-notes" rows="2" placeholder="Optional"></textarea>
          </label>
        </div>
        <button class="btn btn--primary btn--xl" id="pt-intake-next">Start Gate A →</button>
      </div>
    `);

    container.querySelector('#pt-intake-next')?.addEventListener('click', () => {
      intake.age = container.querySelector('#pt-age')?.value || '';
      intake.schoolLevel = container.querySelector('#pt-school-level')?.value || intake.schoolLevel;
      intake.homeLanguage = container.querySelector('#pt-home-lang')?.value?.trim() || '';
      intake.canWriteName = container.querySelector('#pt-write-name')?.value || 'unknown';
      intake.letterRecognition = container.querySelector('#pt-letter-rec')?.value || 'unknown';
      intake.simpleWordReading = container.querySelector('#pt-simple-words')?.value || 'unknown';
      intake.notes = container.querySelector('#pt-notes')?.value?.trim() || '';
      next();
    });
  }

  function renderTeacherScale(item) {
    renderFrame(`
      <div class="pt-item">
        <div class="pt-phase-tag">Gate ${item.gate} · ${item.title}</div>
        <p class="pt-question">${item.prompt}</p>
        <p class="pt-grammar-hint">Teacher/parent assisted scoring</p>
        <div class="pt-choices" role="group">
          <button class="pt-choice-btn" data-score="0">Not yet</button>
          <button class="pt-choice-btn" data-score="0.5">With support</button>
          <button class="pt-choice-btn" data-score="1">Independent</button>
        </div>
      </div>
    `);
    container.querySelectorAll('[data-score]').forEach(btn => {
      btn.addEventListener('click', () => answer(item, { score: Number(btn.getAttribute('data-score')) }));
    });
  }

  function renderPictureChoice(item) {
    const opts = _shuffle(item.options);
    const hideText = item.gate === 'A';
    renderFrame(`
      <div class="pt-item">
        <div class="pt-phase-tag">Gate ${item.gate} · ${item.title}</div>
        <button class="pt-listen-btn" id="pt-listen">🔊 Hear prompt</button>
        <p class="pt-question">${item.prompt}</p>
        <div class="pt-choices" role="group" aria-label="Picture choices">
          ${opts.map(o => `
            <button class="pt-choice-btn" data-choice="${o.id}" aria-label="${o.label}">
              <span>${o.emoji || ''}</span>
              <small class="${hideText ? 'visually-hidden' : ''}">${o.label}</small>
            </button>
          `).join('')}
        </div>
      </div>
    `);
    bindChoice(item, item.correct);
  }

  function renderWordChoice(item) {
    const opts = _shuffle(item.options);
    renderFrame(`
      <div class="pt-item">
        <div class="pt-phase-tag">Gate ${item.gate} · ${item.title}</div>
        ${item.speak ? '<button class="pt-listen-btn" id="pt-listen">🔊 Hear prompt</button>' : ''}
        <p class="pt-question">${item.prompt}</p>
        ${item.sentence ? `<p class="pt-question pt-question--grammar">${item.sentence}</p>` : ''}
        <div class="pt-choices" role="group">
          ${opts.map(o => {
            const value = typeof o === 'string' ? o : o.id;
            const label = typeof o === 'string' ? o : `${o.emoji || ''} ${o.label}`;
            return `<button class="pt-choice-btn" data-choice="${value}">${label}</button>`;
          }).join('')}
        </div>
      </div>
    `);
    bindChoice(item, item.correct);
  }

  function renderCurrent() {
    const item = sequence[index];
    if (!item) return finish();
    if (item.kind === 'intake') return renderIntake();
    if (item.kind === 'teacher-scale') return renderTeacherScale(item);
    if (item.kind === 'picture-choice') return renderPictureChoice(item);
    return renderWordChoice(item);
  }

  function finish() {
    const baseResult = derivePlacementResult(responses, intake, profile?.schoolLevel);
    const nextGate = getNextGateToAppend(baseResult, sequence);
    if (nextGate === 'B') {
      sequence = [...sequence, ...GATE_B_ITEMS];
      return renderCurrent();
    }
    if (nextGate === 'C') {
      sequence = [...sequence, ...GATE_C_ITEMS];
      return renderCurrent();
    }
    if (nextGate === 'D') {
      sequence = [...sequence, ...GATE_D_ITEMS];
      return renderCurrent();
    }

    const result = derivePlacementResult(responses, intake, profile?.schoolLevel);
    const bandLabels = {
      'pre-reader': 'Pre-reader pathway',
      'emerging-decoder': 'Emerging decoder pathway',
      'developing-reader': 'Developing reader pathway',
      reader: 'Reader pathway',
    };

    renderFrame(`
      <div class="pt-result">
        <div class="pt-result-icon">🎯</div>
        <h2 class="pt-result-title">Placement complete</h2>
        <p class="pt-result-desc"><strong>${bandLabels[result.readingBand]}</strong></p>
        <p class="pt-result-grammar">Start focus: <strong>${result.recommendedHomePath.slice(0, 3).join(' → ')}</strong></p>
        <button class="btn btn--primary btn--xl pt-start-btn" id="pt-start-btn">Start learning →</button>
      </div>
    `, 'Placement Result');

    container.querySelector('#pt-start-btn')?.addEventListener('click', () => onComplete(result));
  }

  renderCurrent();
}
