/**
 * PhonicsQuest — Quest Journey screens.
 *
 * Pure render functions. Each `renderX(host, props)` returns the host
 * element after writing its UI into `host.innerHTML`. Side effects on
 * the host element only — no globals, no audio, no document-wide DOM.
 * The thin controller in `controller.js` wires them together; tests
 * exercise each function in isolation against jsdom.
 *
 * All copy is sourced from `src/data/curriculum.js` and
 * `src/modes/phonicsModes.js` so changes to instructions or learning
 * outcomes flow through automatically.
 */

import { PHASES, getStage, getPhase, getStagesInPhase } from '../../data/curriculum.js';
import { PHONICS_MODES } from '../../modes/phonicsModes.js';

// ── Helpers ──────────────────────────────────────────────────────────────

function _el(host, html) {
  if (!host) return null;
  host.innerHTML = html;
  return host;
}

function _escape(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function _safeOn(host, selector, event, handler) {
  const el = host.querySelector(selector);
  if (el) el.addEventListener(event, handler);
  return el;
}

// ── 1. Welcome ───────────────────────────────────────────────────────────

export function renderWelcome(host, { onStart, onPickProfile, onAdult } = {}) {
  _el(host, `
    <main class="qj-page" role="main">
      <section class="qj-card qj-card--hero" aria-labelledby="qj-welcome-title">
        <div aria-hidden="true" style="font-size:3rem">🐉</div>
        <h1 id="qj-welcome-title" class="qj-welcome__title">PhonicsQuest</h1>
        <p class="qj-welcome__subtitle">Ready for today's quest?</p>
        <div class="qj-welcome__actions">
          <button class="btn--qj-cta qj-tap" data-action="start"
                  aria-label="Start today's quest">Start</button>
          <div class="qj-welcome__secondary">
            <button type="button" class="qj-header__back qj-tap" data-action="profiles">Pick a player ›</button>
            <button type="button" class="qj-header__back qj-tap" data-action="adult">Grown-ups ›</button>
          </div>
        </div>
      </section>
    </main>
  `);
  _safeOn(host, '[data-action="start"]',    'click', () => onStart?.());
  _safeOn(host, '[data-action="profiles"]', 'click', () => onPickProfile?.());
  _safeOn(host, '[data-action="adult"]',    'click', () => onAdult?.());
  return host;
}

// ── 2. Profile select ────────────────────────────────────────────────────

export function renderProfileSelect(host, { profiles = [], onPick, onCreate } = {}) {
  const cards = (profiles || []).map(p => `
    <button class="qj-profile-card qj-tap" data-profile-id="${_escape(p.id)}"
            aria-label="Play as ${_escape(p.name)} — ${_escape(p.meta || '')}">
      <span class="qj-profile-card__avatar" aria-hidden="true">${_escape(p.avatar || '🦁')}</span>
      <span class="qj-profile-card__name">${_escape(p.name)}</span>
      <span class="qj-profile-card__meta">${_escape(p.meta || 'New player')}</span>
    </button>
  `).join('');

  _el(host, `
    <main class="qj-page" role="main">
      <h1 class="qj-welcome__title">Who's playing?</h1>
      <p class="qj-welcome__subtitle">Pick your card to start.</p>
      <div class="qj-profiles__grid">
        ${cards}
        <button class="qj-profile-card qj-tap" data-action="create"
                aria-label="Add a new player">
          <span class="qj-profile-card__avatar" aria-hidden="true">＋</span>
          <span class="qj-profile-card__name">Add player</span>
          <span class="qj-profile-card__meta">New profile</span>
        </button>
      </div>
    </main>
  `);

  host.querySelectorAll('[data-profile-id]').forEach(btn => {
    btn.addEventListener('click', () => onPick?.(btn.dataset.profileId));
  });
  _safeOn(host, '[data-action="create"]', 'click', () => onCreate?.());
  return host;
}

// ── 3. Quest map ─────────────────────────────────────────────────────────

/**
 * @param {object} props
 * @param {string} props.currentStageId
 * @param {Set<string>|string[]} props.masteredStageIds
 * @param {Set<string>|string[]} props.unlockedStageIds
 * @param {(stageId: string) => void} props.onPick
 * @param {() => void} props.onAdult
 */
export function renderQuestMap(host, {
  currentStageId,
  masteredStageIds = [],
  unlockedStageIds = [],
  onPick,
  onAdult,
} = {}) {
  const mastered = new Set(masteredStageIds);
  const unlocked = new Set([...(unlockedStageIds || []), currentStageId].filter(Boolean));
  const currentPhase = currentStageId ? getStage(currentStageId)?.phase : 1;

  const phaseBar = PHASES.map(p => {
    let mod = '';
    if (currentPhase && p.phase < currentPhase) mod = 'qj-map__phase-bar-item--mastered';
    else if (p.phase === currentPhase) mod = 'qj-map__phase-bar-item--current';
    return `<li class="qj-map__phase-bar-item ${mod}" aria-hidden="true"></li>`;
  }).join('');

  const phaseBlocks = PHASES.map(phase => {
    const stages = getStagesInPhase(phase.phase);
    const nodes = stages.map(stage => {
      let stateClass = 'qj-node--locked';
      let statusText = 'Locked';
      if (mastered.has(stage.id))             { stateClass = 'qj-node--mastered';  statusText = 'Mastered'; }
      else if (stage.id === currentStageId)   { stateClass = 'qj-node--current';   statusText = 'You are here'; }
      else if (unlocked.has(stage.id))        { stateClass = 'qj-node--available'; statusText = 'Available'; }
      const ariaLabel = `${_escape(stage.name)} — ${statusText}`;
      const disabled = stateClass === 'qj-node--locked' ? 'disabled aria-disabled="true"' : '';
      return `
        <button class="qj-node ${stateClass} qj-tap" data-stage-id="${_escape(stage.id)}"
                aria-label="${ariaLabel}" ${disabled}>
          <span class="qj-node__icon" aria-hidden="true">${_escape(stage.icon ?? '⭐')}</span>
          <span class="qj-node__name">${_escape(stage.name)}</span>
          <span class="qj-node__status">${statusText}</span>
        </button>`;
    }).join('');

    return `
      <section class="qj-map__phase" aria-labelledby="qj-phase-${phase.phase}-title">
        <header class="qj-map__phase-header">
          <span class="qj-map__phase-label">Phase ${phase.phase}</span>
          <h2 id="qj-phase-${phase.phase}-title" class="qj-map__phase-title">
            ${_escape(phase.icon)} ${_escape(phase.title)}
          </h2>
        </header>
        <div class="qj-map__nodes">${nodes}</div>
      </section>`;
  }).join('');

  _el(host, `
    <header class="qj-header" role="banner">
      <span class="qj-header__mascot" aria-hidden="true">🦁</span>
      <h1 class="qj-header__title">Your quest map</h1>
      <button class="qj-header__back qj-tap" data-action="adult"
              aria-label="Open grown-ups view">Grown-ups ›</button>
    </header>
    <main class="qj-page" role="main">
      <ul class="qj-map__phase-bar" aria-label="Curriculum progress by phase">${phaseBar}</ul>
      ${phaseBlocks}
    </main>
  `);

  host.querySelectorAll('[data-stage-id]').forEach(btn => {
    if (btn.hasAttribute('disabled')) return;
    btn.addEventListener('click', () => onPick?.(btn.dataset.stageId));
  });
  _safeOn(host, '[data-action="adult"]', 'click', () => onAdult?.());
  return host;
}

// ── 4. Lesson intro ──────────────────────────────────────────────────────

export function renderLessonIntro(host, { stageId, onStart, onBack, onReplay } = {}) {
  const stage = getStage(stageId);
  if (!stage) return _el(host, `<main class="qj-page"><p>Stage not found.</p></main>`);
  const sampleWord = stage.sampleWords?.[0] ?? '';
  const sentence   = stage.sentenceExamples?.[0] ?? '';
  const phase      = getPhase(stage.phase);
  const targetSoundLabel = stage.targetSounds?.[0] ?? phase?.targetSounds?.[0] ?? '';
  // Pull the bracketed sound bubble — e.g. "/ă/" — out of the label.
  const bubbleText = (/[/](.+?)[/]/.exec(targetSoundLabel)?.[0]) ?? stage.icon ?? '🔊';

  _el(host, `
    <header class="qj-header" role="banner">
      <button class="qj-header__back qj-tap" data-action="back" aria-label="Back to quest map">← Map</button>
      <h1 class="qj-header__title">${_escape(stage.name)}</h1>
      <span style="width:48px"></span>
    </header>
    <main class="qj-page qj-lesson" role="main">
      <p class="qj-welcome__subtitle">Today's sound</p>
      <button class="qj-sound-bubble qj-tap" data-action="replay"
              aria-label="Play the sound ${_escape(targetSoundLabel)}">
        ${_escape(bubbleText)}
      </button>
      <div class="qj-word-card" aria-label="Sample word">${_escape(sampleWord)}</div>
      <p class="qj-sentence">${_escape(sentence)}</p>
      <button class="btn--qj-cta qj-tap" data-action="start"
              aria-label="Start the lesson for ${_escape(stage.name)}">Let's go!</button>
    </main>
  `);

  _safeOn(host, '[data-action="back"]',   'click', () => onBack?.());
  _safeOn(host, '[data-action="replay"]', 'click', () => onReplay?.(bubbleText));
  _safeOn(host, '[data-action="start"]',  'click', () => onStart?.(stageId));
  return host;
}

// ── 5. Game mode shell ───────────────────────────────────────────────────

/**
 * Render one round of a Sound Match or Blend Builder game. The shell is
 * mode-agnostic — caller passes the round payload, the renderer renders
 * the appropriate widget.
 *
 * Round shapes:
 *   Sound Match:  { mode: 'soundMatch',  instruction, prompt: { sound, grapheme }, choices: ['sh','ch','th','wh'] }
 *   Blend Builder:{ mode: 'blendBuilder', instruction, target: { word, graphemes }, bank: ['c','a','t'] }
 *
 * Callbacks:
 *   onAnswer(answerPayload) — answer shape mirrors the score function input
 *   onPause()
 */
export function renderGameMode(host, {
  modeKey,
  round,
  totalRounds = 3,
  currentRound = 1,
  feedback,    // { state: 'correct'|'wrong-first'|'wrong-second', copy, hint }
  onAnswer,
  onPause,
  onContinue,
} = {}) {
  const mode = PHONICS_MODES[modeKey];
  if (!mode || !round) {
    return _el(host, `<main class="qj-page"><p>Round not found.</p></main>`);
  }

  const dots = Array.from({ length: totalRounds }, (_, i) => {
    if (i + 1 < currentRound) return `<li class="qj-dots__dot qj-dots__dot--done" aria-label="Round ${i + 1} of ${totalRounds} — done"></li>`;
    if (i + 1 === currentRound) return `<li class="qj-dots__dot qj-dots__dot--current" aria-label="Round ${i + 1} of ${totalRounds} — current"></li>`;
    return `<li class="qj-dots__dot" aria-label="Round ${i + 1} of ${totalRounds}"></li>`;
  }).join('');

  const widget = modeKey === 'soundMatch'
    ? _renderSoundMatchWidget(round)
    : modeKey === 'blendBuilder'
      ? _renderBlendBuilderWidget(round)
      : `<p>Mode not supported in slice: ${_escape(modeKey)}</p>`;

  const feedbackBlock = feedback ? _renderFeedbackBlock(feedback) : '';

  _el(host, `
    <header class="qj-header" role="banner">
      <span class="qj-header__mascot" aria-hidden="true">🦁</span>
      <ul class="qj-dots" aria-label="Lesson progress">${dots}</ul>
      <button class="qj-header__pause qj-tap" data-action="pause"
              aria-label="Pause the lesson">Pause</button>
    </header>
    <main class="qj-page qj-game" role="main">
      <p class="qj-game__instruction">${_escape(mode.instruction)}</p>
      ${widget}
      ${feedbackBlock}
    </main>
  `);

  _safeOn(host, '[data-action="pause"]', 'click', () => onPause?.());
  _safeOn(host, '[data-action="continue"]', 'click', () => onContinue?.());

  if (modeKey === 'soundMatch') {
    host.querySelectorAll('[data-choice]').forEach(btn => {
      btn.addEventListener('click', () => onAnswer?.({
        prompt: round.prompt,
        chosen: btn.dataset.choice,
        choices: round.choices,
        timeMs: 0,
      }));
    });
  }

  if (modeKey === 'blendBuilder') {
    _wireBlendBuilder(host, round, onAnswer);
  }

  return host;
}

function _renderSoundMatchWidget(round) {
  const choices = (round.choices || []).map(c => `
    <button class="qj-sound-tile qj-tap ${/^[aeiou]+$/.test(c) ? 'qj-sound-tile--vowel' : ''}"
            data-choice="${_escape(c)}"
            aria-label="Choose ${_escape(c)}">${_escape(c)}</button>
  `).join('');
  return `
    <div class="qj-card qj-card--hero" style="padding:var(--space-6)">
      <p class="qj-welcome__subtitle" style="margin-bottom:var(--space-2)">Listen for the sound</p>
      <button class="qj-sound-bubble qj-tap" data-action="replay"
              aria-label="Replay the sound ${_escape(round.prompt.sound)}">
        ${_escape(round.prompt.sound)}
      </button>
    </div>
    <div class="qj-tile-grid" role="group" aria-label="Sound choices">${choices}</div>
  `;
}

function _renderBlendBuilderWidget(round) {
  const graphemes = round.target.graphemes || [];
  const slots = graphemes.map((_, i) =>
    `<div class="qj-blend__slot" data-slot="${i}" aria-label="Sound slot ${i + 1} of ${graphemes.length}"></div>`
  ).join('');
  const bank = (round.bank || []).map((g, i) => `
    <button class="qj-blend__chip qj-tap ${/^[aeiou]+$/.test(g) ? 'qj-blend__chip--vowel' : ''}"
            data-bank-index="${i}" data-grapheme="${_escape(g)}"
            aria-label="Sound ${_escape(g)}">${_escape(g)}</button>
  `).join('');

  return `
    <div class="qj-blend" role="group" aria-label="Build the word ${_escape(round.target.word)}">
      <div class="qj-blend__target">${slots}</div>
      <div class="qj-blend__bank">${bank}</div>
      <button class="btn--qj-cta qj-tap" data-action="blend-check"
              aria-label="Check my word">Check</button>
      <button type="button" class="qj-header__back qj-tap" data-action="blend-reset"
              aria-label="Clear and try again">Reset</button>
    </div>
  `;
}

function _wireBlendBuilder(host, round, onAnswer) {
  const placed = [];
  const totalSlots = round.target.graphemes?.length ?? 0;

  function paintSlots() {
    host.querySelectorAll('[data-slot]').forEach((slot, i) => {
      if (placed[i]) {
        slot.classList.add('qj-blend__slot--filled');
        slot.textContent = placed[i];
      } else {
        slot.classList.remove('qj-blend__slot--filled');
        slot.textContent = '';
      }
    });
  }

  host.querySelectorAll('[data-bank-index]').forEach(chip => {
    chip.addEventListener('click', () => {
      if (chip.hasAttribute('disabled')) return;
      if (placed.length >= totalSlots) return;
      placed.push(chip.dataset.grapheme);
      chip.setAttribute('disabled', '');
      paintSlots();
    });
  });

  _safeOn(host, '[data-action="blend-reset"]', 'click', () => {
    placed.length = 0;
    host.querySelectorAll('[data-bank-index]').forEach(c => c.removeAttribute('disabled'));
    paintSlots();
  });

  _safeOn(host, '[data-action="blend-check"]', 'click', () => {
    onAnswer?.({
      target: round.target,
      placed: [...placed],
      timeMs: 0,
    });
  });
}

function _renderFeedbackBlock(feedback) {
  if (!feedback) return '';
  const isCorrect = feedback.state === 'correct';
  const variant = isCorrect ? 'qj-feedback--correct' : 'qj-feedback--wrong';
  const headline = isCorrect ? (feedback.copy || 'Yes!') : (feedback.copy || 'Almost!');
  const hint = feedback.hint ? `<span class="qj-feedback__hint">${_escape(feedback.hint)}</span>` : '';
  const cta = feedback.cta || (isCorrect ? 'Next' : 'Try again');
  return `
    <div class="qj-feedback ${variant}" role="status" aria-live="polite">
      <div class="qj-feedback__copy">
        ${_escape(headline)}
        ${hint}
      </div>
      <button class="qj-feedback__cta qj-tap" data-action="continue"
              aria-label="${_escape(cta)}">${_escape(cta)}</button>
    </div>
  `;
}

// ── 6. Results ───────────────────────────────────────────────────────────

/**
 * @param {object} props.summary
 *   {
 *     name, stageId,
 *     totalRounds, correctRounds,
 *     accuracy,        // 0..1
 *     stars,           // 1..3
 *     wordsPractised,  // ['cat', 'hat', ...]
 *     mastered,        // boolean
 *   }
 */
export function renderResults(host, { summary, onContinue, onBackToMap } = {}) {
  const pct = Math.round((summary?.accuracy ?? 0) * 100);
  const stars = '★'.repeat(summary?.stars ?? 0) + '☆'.repeat(3 - (summary?.stars ?? 0));
  const stage = getStage(summary?.stageId);

  let headline;
  if (summary?.accuracy >= 0.8)      headline = `You mastered the ${stage?.name ?? 'lesson'}!`;
  else if (summary?.accuracy >= 0.5) headline = "You're getting closer!";
  else                                headline = "Let's try this one again together.";

  const words = (summary?.wordsPractised ?? []).map(w =>
    `<li>${_escape(w)}</li>`
  ).join('');

  _el(host, `
    <header class="qj-header" role="banner">
      <span class="qj-header__mascot" aria-hidden="true">🦁</span>
      <h1 class="qj-header__title">Great quest, ${_escape(summary?.name ?? 'Learner')}!</h1>
      <span style="width:48px"></span>
    </header>
    <main class="qj-page qj-results" role="main" aria-labelledby="qj-results-headline">
      <div class="qj-results__stars" aria-label="${summary?.stars ?? 0} stars out of 3">${stars}</div>
      <h2 id="qj-results-headline" class="qj-results__headline">${_escape(headline)}</h2>
      <div class="qj-results__stats" role="list">
        <div class="qj-results__stat" role="listitem">
          <div class="qj-results__stat-label">Accuracy</div>
          <div class="qj-results__stat-value">${pct}%</div>
        </div>
        <div class="qj-results__stat" role="listitem">
          <div class="qj-results__stat-label">Rounds correct</div>
          <div class="qj-results__stat-value">${summary?.correctRounds ?? 0} / ${summary?.totalRounds ?? 0}</div>
        </div>
      </div>
      <div>
        <p class="qj-welcome__subtitle">Words you practised</p>
        <ul class="qj-results__words">${words}</ul>
      </div>
      <button class="btn--qj-cta qj-tap" data-action="continue"
              aria-label="Continue back to the quest map">Continue</button>
      <button type="button" class="qj-header__back qj-tap" data-action="map"
              aria-label="Open the quest map">Quest map ›</button>
    </main>
  `);

  _safeOn(host, '[data-action="continue"]', 'click', () => onContinue?.());
  _safeOn(host, '[data-action="map"]',      'click', () => onBackToMap?.());
  return host;
}

// ── 7. Mastery badge ─────────────────────────────────────────────────────

export function renderMasteryBadge(host, { phaseNumber, skills = [], onContinue } = {}) {
  const phase = getPhase(phaseNumber);
  if (!phase) return _el(host, `<main class="qj-page"><p>Badge not found.</p></main>`);
  const skillList = skills.map(s => `<li>${_escape(s)}</li>`).join('');
  _el(host, `
    <main class="qj-page qj-results" role="main" aria-labelledby="qj-badge-title">
      <div class="qj-card qj-card--hero" style="background:var(--qj-badge-gold);color:var(--text)">
        <div style="font-size:5rem" role="img" aria-label="${_escape(phase.title)} badge">${_escape(phase.icon)}</div>
        <h1 id="qj-badge-title" class="qj-welcome__title">You earned the ${_escape(phase.title)} badge!</h1>
        <p class="qj-welcome__subtitle">Here's what this badge means:</p>
        <ul class="qj-results__words" style="text-align:left">${skillList}</ul>
      </div>
      <button class="btn--qj-cta qj-tap" data-action="continue"
              aria-label="Add the badge to my map">Add to my map!</button>
    </main>
  `);
  _safeOn(host, '[data-action="continue"]', 'click', () => onContinue?.());
  return host;
}

// ── 8. Parent/teacher progress view ──────────────────────────────────────

export function renderProgressView(host, { summary, onBack, onPrint } = {}) {
  if (!summary) {
    return _el(host, `<main class="qj-page"><p>No progress yet.</p></main>`);
  }

  const strongest = (summary.strongestSounds ?? []).slice(0, 5).map(s =>
    `<li>${_escape(s.sound)} — ${Math.round(s.accuracy * 100)}% (${s.attempts} attempts)</li>`
  ).join('') || '<li>Not enough attempts yet.</li>';

  const weakest = (summary.weakestSounds ?? []).slice(0, 5).map(s =>
    `<li>${_escape(s.sound)} — ${Math.round(s.accuracy * 100)}% (${s.attempts} attempts)</li>`
  ).join('') || '<li>No weak spots yet.</li>';

  const errs = (summary.commonErrorTypes ?? []).slice(0, 5).map(e =>
    `<li>${_escape(e.category)} — ${e.count}</li>`
  ).join('') || '<li>No errors logged.</li>';

  const print = (summary.printablePracticeList ?? []).map(p => `
    <section class="qj-card" style="margin-bottom:var(--space-4)">
      <h3 style="margin:0 0 var(--space-2)">${_escape(p.stage.name)}</h3>
      <p>Words: ${(p.sampleWords || []).map(_escape).join(' · ')}</p>
      ${p.sentence ? `<p><em>${_escape(p.sentence)}</em></p>` : ''}
    </section>
  `).join('');

  _el(host, `
    <header class="qj-header" role="banner">
      <button class="qj-header__back qj-tap" data-action="back" aria-label="Back to child view">← Child view</button>
      <h1 class="qj-header__title">Progress</h1>
      <button class="qj-header__pause qj-tap" data-action="print" aria-label="Print practice list">🖨️ Print</button>
    </header>
    <main class="qj-page" role="main">
      <section class="qj-card" style="margin-bottom:var(--space-6)">
        <p class="qj-welcome__subtitle">Current phase</p>
        <h2 style="margin:0">Phase ${summary.currentPhase} — ${getPhase(summary.currentPhase)?.title ?? ''}</h2>
        <p>Overall mastery: <strong>${summary.masteryPercent}%</strong></p>
      </section>

      <section class="qj-card" style="margin-bottom:var(--space-6)" aria-labelledby="qj-strong-title">
        <h2 id="qj-strong-title" style="margin-top:0">Strongest sounds</h2>
        <ul>${strongest}</ul>
      </section>

      <section class="qj-card" style="margin-bottom:var(--space-6)" aria-labelledby="qj-weak-title">
        <h2 id="qj-weak-title" style="margin-top:0">Weakest sounds</h2>
        <ul>${weakest}</ul>
      </section>

      <section class="qj-card" style="margin-bottom:var(--space-6)" aria-labelledby="qj-next-title">
        <h2 id="qj-next-title" style="margin-top:0">Suggested next activity</h2>
        <p>${summary.suggestedNext
          ? `Start with <strong>${_escape(summary.suggestedNext.name)}</strong>.`
          : 'All done — pick any stage for review.'}</p>
      </section>

      <section class="qj-card" style="margin-bottom:var(--space-6)" aria-labelledby="qj-errs-title">
        <h2 id="qj-errs-title" style="margin-top:0">Common error types</h2>
        <ul>${errs}</ul>
      </section>

      <section aria-labelledby="qj-print-title">
        <h2 id="qj-print-title">Printable practice list</h2>
        ${print}
      </section>
    </main>
  `);

  _safeOn(host, '[data-action="back"]',  'click', () => onBack?.());
  _safeOn(host, '[data-action="print"]', 'click', () => onPrint?.());
  return host;
}
