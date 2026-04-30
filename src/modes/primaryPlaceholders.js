/**
 * Primary English placeholder modules.
 *
 * These cover the PSLE Paper 1 / Paper 2 components that don't yet have a
 * full quest implementation but which parents and teachers expect to see
 * inside the Primary English Quest pathway:
 *
 *   - Visual Text Comprehension     (Paper 2)
 *   - Comprehension Cloze           (Paper 2)
 *   - Open-ended Comprehension      (Paper 2)
 *   - Synthesis & Transformation    (Paper 2 Booklet B)
 *   - Situational Writing           (Paper 1)
 *
 * Each placeholder ships with at least one first-version exercise so that a
 * P5/P6 user can already engage with the format, plus a pointer to the
 * existing fuller modules where applicable (e.g. Sentence Forge for
 * synthesis practice).
 *
 * The module exposes a single mountPlaceholderModule(container, kind,
 * onClose) API that builds a self-contained mini-screen.
 */

import { escapeHtml } from '../utils/escapeHtml.js';

export const PRIMARY_PLACEHOLDER_KINDS = Object.freeze([
  'visual-text',
  'comprehension-cloze',
  'open-comprehension',
  'synthesis',
  'situational-writing',
]);

const VISUAL_TEXT_SAMPLES = [
  {
    id: 'vt-poster-1',
    level: 'P5',
    title: 'Library Reading Carnival Poster',
    poster: [
      'READING CARNIVAL @ Sunshine Library',
      'Sat 12 Jul · 9 a.m. – 4 p.m.',
      'Free entry · Bring 2 books to swap',
      'Special: Author talk at 11 a.m.',
      'Quiz prizes for P3–P6',
    ].join('\n'),
    questions: [
      { q: 'What is the main purpose of the poster?', a: 'To invite children to a free reading event at Sunshine Library.' },
      { q: 'Who can join the quiz?', a: 'Children from Primary 3 to Primary 6.' },
      { q: 'What must visitors bring if they want to swap books?', a: 'They must bring 2 books.' },
    ],
  },
  {
    id: 'vt-notice-1',
    level: 'P6',
    title: 'School Bus Notice',
    poster: [
      'NOTICE — School Bus Service',
      'From 1 Aug, Bus 3 will not stop at Bedok Mall.',
      'New stop: Bedok Interchange (Stand B5).',
      'Time: 6:55 a.m. (5 min earlier).',
      'Contact: 6123 4567 for changes.',
    ].join('\n'),
    questions: [
      { q: 'Why has the bus stop changed?', a: 'The notice does not say — only that Bus 3 will no longer stop at Bedok Mall.' },
      { q: 'How will the timing change for parents?', a: 'The bus will arrive 5 minutes earlier, at 6:55 a.m.' },
      { q: 'Where should pupils now wait?', a: 'At Bedok Interchange, Stand B5.' },
    ],
  },
];

const CLOZE_COMPREHENSION_SAMPLES = [
  {
    id: 'oc-1',
    level: 'P5',
    title: 'A Surprise Storm',
    passageWithBlanks: 'When we first set out, the sky was {1:bright/dark} and the wind was gentle. We were {2:looking/sailing} forward to the picnic. {3:Suddenly/Slowly}, dark clouds rolled in and rain began to {4:fall/laugh} heavily. We had to {5:abandon/begin} the picnic and run home.',
    answers: { 1: 'bright', 2: 'looking', 3: 'Suddenly', 4: 'fall', 5: 'abandon' },
  },
];

const OPEN_COMPREHENSION_SAMPLES = [
  {
    id: 'oe-1',
    level: 'P5',
    title: 'Mei Ling and the Lost Watch',
    passage: [
      'Mei Ling raced down the corridor, her heart pounding. The watch her grandfather had given her was missing — she could feel her wrist, bare and cold. She remembered washing her hands in the toilet near the canteen during recess. If anyone had picked it up, she would never forgive herself for being so careless.',
      'In the General Office, Mr Tan smiled kindly. "Is this yours?" he asked, holding up the silver watch. Mei Ling nodded, eyes filling with tears. "A Primary 4 boy returned it before lunch. He said it was on the basin." Mei Ling realised she had to thank that boy somehow.',
    ].join('\n\n'),
    questions: [
      { q: 'Why was Mei Ling worried at the start of the passage?', model: 'She had lost the watch her grandfather gave her, and she felt very careless because it had sentimental value.' },
      { q: 'Who returned the watch and where was it found?', model: 'A Primary 4 boy returned it. He had found it on the basin in the toilet near the canteen.' },
      { q: 'How did Mei Ling feel at the end of the passage? Give one piece of evidence.', model: 'She felt grateful and relieved. The text says her eyes filled with tears and she wanted to thank the boy somehow.' },
    ],
  },
];

const SYNTHESIS_SAMPLES = [
  { id: 'st-1', level: 'P5', original: 'The boy was tired. He still finished his homework.', stem: 'Although', answer: 'Although the boy was tired, he still finished his homework.', skill: 'Connector — Contrast' },
  { id: 'st-2', level: 'P6', original: '"I will help you tomorrow," said the teacher.', stem: 'The teacher said', answer: 'The teacher said that she would help me the next day.', skill: 'Reported speech' },
  { id: 'st-3', level: 'P6', original: 'The chef baked the cake. The cake was delicious.', stem: 'The cake', answer: 'The cake that was baked by the chef was delicious.', skill: 'Passive + Relative clause' },
];

const SITUATIONAL_WRITING_SAMPLES = [
  {
    id: 'sw-1',
    level: 'P5',
    title: 'Email to your form teacher',
    purpose: 'Inform her you cannot attend tomorrow\'s class outing because of a fever.',
    audience: 'Mrs Lim — your form teacher',
    format: 'Email',
    bullets: [
      'Reason for not attending',
      'Apology and politeness',
      'Promise to catch up on missed work',
    ],
  },
  {
    id: 'sw-2',
    level: 'P6',
    title: 'Letter to your friend',
    purpose: 'Invite a friend to a book-swap party at your house.',
    audience: 'A close friend',
    format: 'Informal letter',
    bullets: [
      'When and where the party will be held',
      'What to bring',
      'How to RSVP',
    ],
  },
];

const META = {
  'visual-text': {
    icon: '🖼️',
    label: 'Visual Text Comprehension',
    blurb: 'Read posters, notices and signs and answer questions about the visible information. Helps with Paper 2 Visual Text Comprehension.',
    paperLink: 'Paper 2 · Visual Text',
  },
  'comprehension-cloze': {
    icon: '📰',
    label: 'Comprehension Cloze',
    blurb: 'Open-cloze passages — fill the blank with one suitable word using both grammar and meaning clues. Helps with Paper 2 Comprehension Cloze.',
    paperLink: 'Paper 2 · Comprehension Cloze',
  },
  'open-comprehension': {
    icon: '📚',
    label: 'Open-ended Comprehension',
    blurb: 'Read a passage and answer questions in your own words. Look at model answers and self-check.',
    paperLink: 'Paper 2 · Comprehension Open-ended',
  },
  synthesis: {
    icon: '🔁',
    label: 'Synthesis & Transformation',
    blurb: 'Combine or rewrite sentences without changing meaning — connectors, reported speech, passive voice, relative clauses.',
    paperLink: 'Paper 2 Booklet B · Synthesis & Transformation',
    related: { target: 'sentence-forge', label: '🔨 Sentence Forge for word-order practice' },
  },
  'situational-writing': {
    icon: '✉️',
    label: 'Situational Writing',
    blurb: 'Plan a short email or letter for a real-life purpose — purpose, audience and format matter.',
    paperLink: 'Paper 1 · Situational Writing',
    related: { target: 'writing-quest', label: '📝 Writing Quest for continuous writing' },
  },
};

export function getPlaceholderMeta(kind) {
  return META[kind] || null;
}

/**
 * Build static HTML for a placeholder module. Pure function so it can be
 * unit-tested without a DOM.
 */
export function buildPlaceholderHtml(kind) {
  const meta = META[kind];
  if (!meta) return '';
  const body = _renderBody(kind);
  const related = meta.related
    ? `<p class="placeholder-related">Already feels familiar? Try <button class="btn btn--ghost btn--sm" data-related="${meta.related.target}">${meta.related.label}</button>.</p>`
    : '';
  return `
    <div class="primary-placeholder" data-kind="${kind}" role="region" aria-label="${meta.label}">
      <header class="placeholder-header">
        <h2 class="placeholder-title">${meta.icon} ${meta.label}</h2>
        <p class="placeholder-paper-link" aria-label="School-paper component">${meta.paperLink}</p>
        <p class="placeholder-blurb">${meta.blurb}</p>
      </header>
      <div class="placeholder-body">${body}</div>
      ${related}
      <div class="sfq-actions">
        <button class="btn btn--ghost" data-placeholder-close>← Back to home</button>
      </div>
    </div>`;
}

function _renderBody(kind) {
  if (kind === 'visual-text') {
    return VISUAL_TEXT_SAMPLES.map(s => `
      <article class="placeholder-card">
        <h3>${escapeHtml(s.title)} <small>(${s.level})</small></h3>
        <pre class="placeholder-poster" aria-label="Visual text">${escapeHtml(s.poster)}</pre>
        <ol>
          ${s.questions.map(q => `
            <li>
              <strong>Q.</strong> ${escapeHtml(q.q)}<br>
              <details><summary>Show model answer</summary><p>${escapeHtml(q.a)}</p></details>
            </li>`).join('')}
        </ol>
      </article>`).join('');
  }

  if (kind === 'comprehension-cloze') {
    return CLOZE_COMPREHENSION_SAMPLES.map(s => {
      const answersList = Object.entries(s.answers).map(([k, v]) => `<li>${k}. <strong>${escapeHtml(v)}</strong></li>`).join('');
      const passageHtml = escapeHtml(s.passageWithBlanks)
        .replace(/\{(\d+):([^/}]+)\/([^}]+)\}/g, (_m, num, a, b) => `(${num}) [<em>${a}</em> / <em>${b}</em>]`);
      return `
        <article class="placeholder-card">
          <h3>${escapeHtml(s.title)} <small>(${s.level})</small></h3>
          <p>${passageHtml}</p>
          <details><summary>Show answers</summary><ol>${answersList}</ol></details>
        </article>`;
    }).join('');
  }

  if (kind === 'open-comprehension') {
    return OPEN_COMPREHENSION_SAMPLES.map(s => `
      <article class="placeholder-card">
        <h3>${escapeHtml(s.title)} <small>(${s.level})</small></h3>
        <p style="white-space:pre-line">${escapeHtml(s.passage)}</p>
        <ol>
          ${s.questions.map(q => `
            <li>
              <strong>Q.</strong> ${escapeHtml(q.q)}
              <details><summary>Show model answer</summary><p>${escapeHtml(q.model)}</p></details>
            </li>`).join('')}
        </ol>
      </article>`).join('');
  }

  if (kind === 'synthesis') {
    return `
      <article class="placeholder-card">
        <p>Read each pair of sentences. Try to combine or rewrite them using the given stem.</p>
        <ol>
          ${SYNTHESIS_SAMPLES.map(s => `
            <li>
              <strong>${escapeHtml(s.skill)}</strong> <small>(${s.level})</small><br>
              Original: <em>${escapeHtml(s.original)}</em><br>
              Stem: <code>${escapeHtml(s.stem)} …</code>
              <details><summary>Show model answer</summary><p>${escapeHtml(s.answer)}</p></details>
            </li>`).join('')}
        </ol>
      </article>`;
  }

  if (kind === 'situational-writing') {
    return SITUATIONAL_WRITING_SAMPLES.map(s => `
      <article class="placeholder-card">
        <h3>${escapeHtml(s.title)} <small>(${s.level})</small></h3>
        <p><strong>Purpose:</strong> ${escapeHtml(s.purpose)}</p>
        <p><strong>Audience:</strong> ${escapeHtml(s.audience)} &middot; <strong>Format:</strong> ${escapeHtml(s.format)}</p>
        <p><strong>Cover all 3 bullets:</strong></p>
        <ul>${s.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join('')}</ul>
        <details>
          <summary>Show writing checklist</summary>
          <ul>
            <li>Greeting and sign-off match the format</li>
            <li>Purpose is clear in the first 2 lines</li>
            <li>All 3 bullets are addressed</li>
            <li>Polite tone for the audience</li>
          </ul>
        </details>
      </article>`).join('');
  }
  return '';
}

/**
 * Mount a placeholder module into a container element.
 * @param {HTMLElement} container
 * @param {string} kind
 * @param {{ onClose?: () => void, onRelated?: (target: string) => void }} [opts]
 */
export function mountPlaceholderModule(container, kind, { onClose, onRelated } = {}) {
  if (!container) return;
  container.innerHTML = buildPlaceholderHtml(kind);
  container.querySelector('[data-placeholder-close]')?.addEventListener('click', () => onClose?.());
  container.querySelectorAll('[data-related]').forEach(btn => {
    btn.addEventListener('click', () => onRelated?.(btn.dataset.related));
  });
}
