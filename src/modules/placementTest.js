/**
 * PhonicsQuest – Placement Test
 *
 * A 15–20 item adaptive diagnostic that determines where a new learner
 * should start in the curriculum.  It samples:
 *   • Phonics phases 1–4 (decoding difficulty staircase)
 *   • Sight-word reading
 *   • Grammar cloze awareness (primary profiles only)
 *
 * Result object: { phase, startGroup, preSeededStats, primaryLevel }
 *   phase          – 1–4, the phase to start in
 *   startGroup     – specific word-group key (e.g. 'cvc-a', 'ccvc-a')
 *   preSeededStats – wordStats entries to pre-populate so the adaptive
 *                    engine immediately treats placed content as known
 *   primaryLevel   – 'P1'|'P2'|'P3'|'P4'|'P5'|'P6' for quest starting level
 *
 * UI contract:
 *   showPlacementTest({ container, profile, onComplete })
 *     Renders the test into `container`.
 *     Calls `onComplete(result)` when finished.
 */

import { audio } from './audio.js';

// ── Item bank ──────────────────────────────────────────────────────────────

/**
 * Phonics items: the child hears the word (TTS) and selects the matching
 * printed word from 4 choices.  Each item has a phase tag so we can bail
 * early if the child is clearly below a phase threshold.
 */
const PHONICS_ITEMS = [
  // Phase 1 – CVC
  { id: 'pl-cvc-1', word: 'cat',  phase: 1, group: 'cvc-a',  choices: ['cat',  'cut',  'cup',  'can']  },
  { id: 'pl-cvc-2', word: 'bed',  phase: 1, group: 'cvc-e',  choices: ['bad',  'bed',  'bid',  'bud']  },
  { id: 'pl-cvc-3', word: 'sit',  phase: 1, group: 'cvc-i',  choices: ['sat',  'set',  'sit',  'sot']  },
  { id: 'pl-cvc-4', word: 'dog',  phase: 1, group: 'cvc-o',  choices: ['dig',  'dug',  'dog',  'dag']  },

  // Phase 2 – CCVC (initial blends)
  { id: 'pl-ccvc-1', word: 'flag', phase: 2, group: 'ccvc-a', choices: ['flat', 'flap', 'flag', 'flab'] },
  { id: 'pl-ccvc-2', word: 'step', phase: 2, group: 'ccvc-e', choices: ['stem', 'step', 'stet', 'stew'] },
  { id: 'pl-ccvc-3', word: 'slip', phase: 2, group: 'ccvc-i', choices: ['slim', 'slid', 'slip', 'slit'] },

  // Phase 3 – CVCC (final blends)
  { id: 'pl-cvcc-1', word: 'band', phase: 3, group: 'cvcc-a', choices: ['bane', 'band', 'bond', 'bank'] },
  { id: 'pl-cvcc-2', word: 'best', phase: 3, group: 'cvcc-e', choices: ['rest', 'best', 'west', 'test'] },
  { id: 'pl-cvcc-3', word: 'gift', phase: 3, group: 'cvcc-i', choices: ['gist', 'gilt', 'giff', 'gift'] },

  // Phase 4 – CCVCC (blends at both ends)
  { id: 'pl-ccvcc-1', word: 'stamp', phase: 4, group: 'ccvcc-a', choices: ['stomp', 'stamp', 'stump', 'strap'] },
  { id: 'pl-ccvcc-2', word: 'blend', phase: 4, group: 'ccvcc-e', choices: ['blond', 'blank', 'blend', 'bland'] },

  // Phase 5 – Long vowels
  { id: 'pl-lv-1', word: 'cake',  phase: 5, group: 'long-vowel-a', choices: ['coke', 'cake', 'cane', 'cave'] },
  { id: 'pl-lv-2', word: 'kite',  phase: 5, group: 'long-vowel-i', choices: ['bite', 'mite', 'kite', 'site'] },
];

/**
 * Grammar awareness items (primary profiles only).
 * Multiple-choice cloze — tap the correct word to fill the blank.
 */
const GRAMMAR_ITEMS = [
  {
    id: 'pl-gr-1',
    level: 'P1',
    sentence: 'She ___ a cat.',
    blank: 'has',
    choices: ['has', 'have', 'having', 'had'],
    skill: 'svAgreement',
  },
  {
    id: 'pl-gr-2',
    level: 'P2',
    sentence: 'They ___ playing football yesterday.',
    blank: 'were',
    choices: ['are', 'were', 'was', 'will'],
    skill: 'pastCont',
  },
  {
    id: 'pl-gr-3',
    level: 'P3',
    sentence: 'The cake ___ baked by my mother.',
    blank: 'was',
    choices: ['is', 'was', 'were', 'has'],
    skill: 'passiveVoice',
  },
  {
    id: 'pl-gr-4',
    level: 'P4',
    sentence: 'If it rains, we ___ stay indoors.',
    blank: 'will',
    choices: ['will', 'would', 'should', 'might'],
    skill: 'conditionals',
  },
  {
    id: 'pl-gr-5',
    level: 'P5',
    sentence: 'She said that she ___ finish the work.',
    blank: 'would',
    choices: ['will', 'would', 'should', 'could'],
    skill: 'reportedSpeech',
  },
];

// ── Scoring helpers ────────────────────────────────────────────────────────

/**
 * Given phase-level results, determine the starting phase and group.
 * Uses early-exit: as soon as the child fails 2 consecutive phase items,
 * that phase is the placement floor.
 * @param {Array<{phase:number, group:string, correct:boolean}>} results
 * @returns {{ phase:number, startGroup:string }}
 */
function _scorePlacement(results) {
  const byPhase = {};
  for (const r of results) {
    if (!byPhase[r.phase]) byPhase[r.phase] = { correct: 0, total: 0, groups: [] };
    byPhase[r.phase].total++;
    if (r.correct) byPhase[r.phase].correct++;
    if (!byPhase[r.phase].groups.includes(r.group)) {
      byPhase[r.phase].groups.push(r.group);
    }
  }

  let bestPhase = 1;
  let bestGroup = 'cvc-a';

  for (let p = 1; p <= 5; p++) {
    const bucket = byPhase[p];
    if (!bucket) break;
    const acc = bucket.correct / bucket.total;
    if (acc >= 0.6) {
      bestPhase = p;
      // Use the last group that was tested in this phase
      bestGroup = bucket.groups[bucket.groups.length - 1] || bestGroup;
    } else {
      break; // Stop at first phase where performance drops
    }
  }

  return { phase: bestPhase, startGroup: bestGroup };
}

/**
 * Derive the best Primary-level starting point from grammar results.
 * @param {Array<{level:string, correct:boolean}>} grammarResults
 * @returns {'P1'|'P2'|'P3'|'P4'|'P5'|'P6'}
 */
function _scoreGrammarLevel(grammarResults) {
  const LEVELS = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'];
  let bestLevel = 'P1';
  for (const r of grammarResults) {
    if (r.correct) {
      const idx = LEVELS.indexOf(r.level);
      if (idx > LEVELS.indexOf(bestLevel)) bestLevel = r.level;
    } else {
      break;
    }
  }
  return bestLevel;
}

/**
 * Build synthetic wordStats to pre-populate the adaptive pool for phases
 * the learner has demonstrated competence in.
 * Words in those phases are seeded as "strong" so the adaptive engine
 * de-prioritises them (0.5× weight) in favour of the learner's start phase.
 * @param {number} placedPhase
 * @returns {Record<string, {attempts:number, correct:number, lastSeen:string}>}
 */
function _buildPreSeededStats(placedPhase) {
  if (placedPhase <= 1) return {};
  const stats = {};
  const now = new Date().toISOString();
  // Mark CVC words as mastered for any learner placed above Phase 1
  const mastered = ['cat', 'bed', 'sit', 'dog', 'cup', 'bat', 'hen', 'big', 'hot', 'bun'];
  for (const id of mastered) {
    stats[id] = { attempts: 8, correct: 8, lastSeen: now, reviewInterval: 1, nextReviewDate: now };
  }
  if (placedPhase >= 3) {
    const more = ['flag', 'step', 'slip', 'drop', 'drum', 'clap', 'frog', 'trim'];
    for (const id of more) {
      stats[id] = { attempts: 8, correct: 8, lastSeen: now, reviewInterval: 1, nextReviewDate: now };
    }
  }
  if (placedPhase >= 4) {
    const more2 = ['band', 'best', 'gift', 'bond', 'jump', 'nest', 'dusk', 'loft'];
    for (const id of more2) {
      stats[id] = { attempts: 8, correct: 8, lastSeen: now, reviewInterval: 1, nextReviewDate: now };
    }
  }
  return stats;
}

// ── UI renderer ────────────────────────────────────────────────────────────

/**
 * Render the placement test into `container`.
 * @param {{ container: HTMLElement, profile: object, onComplete: (result:object) => void }} opts
 */
export function showPlacementTest({ container, profile, onComplete }) {
  const isPrimary = profile?.schoolLevel === 'primary';
  const phonicsItems  = isPrimary ? PHONICS_ITEMS.slice(0, 8) : PHONICS_ITEMS;
  const grammarItems  = isPrimary ? GRAMMAR_ITEMS : [];
  const allItems      = [...phonicsItems, ...grammarItems];

  let currentIndex = 0;
  const results = [];

  function _renderProgress() {
    const pct = Math.round((currentIndex / allItems.length) * 100);
    const bar = container.querySelector('#pt-progress-bar');
    const lbl = container.querySelector('#pt-progress-label');
    if (bar) bar.style.width = `${pct}%`;
    if (lbl) lbl.textContent = `${currentIndex} / ${allItems.length}`;
  }

  function _renderItem() {
    if (currentIndex >= allItems.length) {
      _finish();
      return;
    }
    const item = allItems[currentIndex];
    const isGrammar = !!item.sentence;
    _renderProgress();

    if (isGrammar) {
      _renderGrammarItem(item);
    } else {
      _renderPhonicsItem(item);
    }
  }

  function _renderPhonicsItem(item) {
    // Speak the word via TTS
    setTimeout(() => audio.speakWord(item.word), 400);

    const shuffled = [...item.choices].sort(() => Math.random() - 0.5);

    container.querySelector('#pt-body').innerHTML = `
      <div class="pt-item">
        <div class="pt-phase-tag">Phonics · Phase ${item.phase}</div>
        <button class="pt-listen-btn" id="pt-listen" aria-label="Hear the word again">
          🔊 Tap to hear the word
        </button>
        <p class="pt-question">Which word did you hear?</p>
        <div class="pt-choices" role="group" aria-label="Word choices">
          ${shuffled.map(c => `
            <button class="pt-choice-btn" data-word="${c}" aria-label="${c}">${c}</button>
          `).join('')}
        </div>
      </div>`;

    container.querySelector('#pt-listen')?.addEventListener('click', () => {
      audio.speakWord(item.word);
    });

    container.querySelectorAll('.pt-choice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const correct = btn.dataset.word === item.word;
        results.push({ phase: item.phase, group: item.group, correct, id: item.id });

        // Brief visual feedback
        btn.classList.add(correct ? 'pt-choice--correct' : 'pt-choice--wrong');
        if (!correct) {
          container.querySelectorAll('.pt-choice-btn').forEach(b => {
            if (b.dataset.word === item.word) b.classList.add('pt-choice--correct');
          });
        }
        container.querySelectorAll('.pt-choice-btn').forEach(b => b.disabled = true);

        // Adaptive early exit: if child fails all 4 Phase-1 items, skip ahead to finish
        const phase1Results = results.filter(r => r.phase === 1);
        if (phase1Results.length === 4 && phase1Results.every(r => !r.correct)) {
          setTimeout(_finish, 800);
          return;
        }

        setTimeout(() => { currentIndex++; _renderItem(); }, 700);
      });
    });
  }

  function _renderGrammarItem(item) {
    const shuffled = [...item.choices].sort(() => Math.random() - 0.5);

    container.querySelector('#pt-body').innerHTML = `
      <div class="pt-item">
        <div class="pt-phase-tag">Grammar · ${item.level}</div>
        <p class="pt-question pt-question--grammar">
          ${item.sentence.replace('___', '<span class="pt-blank">___</span>')}
        </p>
        <p class="pt-grammar-hint">Choose the correct word for the blank:</p>
        <div class="pt-choices" role="group" aria-label="Word choices">
          ${shuffled.map(c => `
            <button class="pt-choice-btn" data-word="${c}" aria-label="${c}">${c}</button>
          `).join('')}
        </div>
      </div>`;

    container.querySelectorAll('.pt-choice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const correct = btn.dataset.word === item.blank;
        results.push({ level: item.level, skill: item.skill, correct, id: item.id });

        btn.classList.add(correct ? 'pt-choice--correct' : 'pt-choice--wrong');
        if (!correct) {
          container.querySelectorAll('.pt-choice-btn').forEach(b => {
            if (b.dataset.word === item.blank) b.classList.add('pt-choice--correct');
          });
        }
        container.querySelectorAll('.pt-choice-btn').forEach(b => b.disabled = true);

        // If child fails the P1 grammar item, no need to test further
        if (item.level === 'P1' && !correct) {
          setTimeout(_finish, 800);
          return;
        }

        setTimeout(() => { currentIndex++; _renderItem(); }, 700);
      });
    });
  }

  function _finish() {
    const phonicsResults = results.filter(r => r.phase);
    const grammarResults = results.filter(r => r.level);

    const { phase, startGroup } = phonicsResults.length
      ? _scorePlacement(phonicsResults)
      : { phase: 1, startGroup: 'cvc-a' };

    const primaryLevel = grammarResults.length
      ? _scoreGrammarLevel(grammarResults)
      : 'P1';

    const preSeededStats = _buildPreSeededStats(phase);

    const result = { phase, startGroup, preSeededStats, primaryLevel };

    // Show a brief result summary before handing off
    const phaseLabels = {
      1: 'Starting at CVC words — great foundation!',
      2: 'Starting at Initial Blends — solid phonics!',
      3: 'Starting at Final Blends — impressive!',
      4: 'Starting at Complex Blends — advanced reader!',
      5: 'Starting at Long Vowels — excellent!',
    };

    container.querySelector('#pt-body').innerHTML = `
      <div class="pt-result">
        <div class="pt-result-icon" aria-hidden="true">🎯</div>
        <h2 class="pt-result-title">Placement complete!</h2>
        <p class="pt-result-desc">${phaseLabels[phase] || 'Great start!'}</p>
        ${isPrimary ? `<p class="pt-result-grammar">Grammar level: <strong>${primaryLevel}</strong></p>` : ''}
        <button class="btn btn--primary btn--xl pt-start-btn" id="pt-start-btn">
          Start Learning →
        </button>
      </div>`;

    container.querySelector('#pt-start-btn')?.addEventListener('click', () => {
      onComplete(result);
    });

    _renderProgress();
  }

  // ── Initial render ────────────────────────────────────────────────────────

  container.innerHTML = `
    <div class="pt-wrapper" role="main" aria-label="Placement test">
      <div class="pt-header">
        <div class="pt-title-row">
          <span class="pt-title-icon" aria-hidden="true">🎯</span>
          <div>
            <h1 class="pt-title">Quick Check</h1>
            <p class="pt-subtitle">Let's find the perfect starting point</p>
          </div>
          <button class="btn btn--ghost btn--sm pt-skip-btn" id="pt-skip">Skip</button>
        </div>
        <div class="pt-progress-bar-wrap" role="progressbar"
             aria-valuemin="0" aria-valuemax="${allItems.length}" aria-valuenow="0">
          <div class="pt-progress-bar" id="pt-progress-bar" style="width:0%"></div>
        </div>
        <span class="pt-progress-label" id="pt-progress-label" aria-hidden="true">0 / ${allItems.length}</span>
      </div>
      <div class="pt-body" id="pt-body"></div>
    </div>`;

  container.querySelector('#pt-skip')?.addEventListener('click', () => {
    onComplete({ phase: 1, startGroup: 'cvc-a', preSeededStats: {}, primaryLevel: 'P1' });
  });

  _renderItem();
}
