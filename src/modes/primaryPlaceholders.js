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
import { P1_PRACTICE_TESTS, P1_PRACTICE_TEST_TERMS } from '../data/p1PracticeTests.js';

export const PRIMARY_PLACEHOLDER_KINDS = Object.freeze([
  'visual-text',
  'open-comprehension',
  'synthesis',
  'situational-writing',
  'p1-practice-tests',
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

const OPEN_COMPREHENSION_SAMPLES = [
  {
    id: 'oe-p1-1',
    level: 'P1',
    title: 'Sarah and Emma',
    passage: [
      'Sarah was the only child in her family. At times, she would feel very lonely as there was no one at home to play with her. Her parents were always busy working.',
      'Luckily, Sarah had a next-door neighbour named Emma who was the same age as her. Whenever both girls were free, they would go to each other’s homes to play computer games. Sometimes, they would also go to the playground nearby.',
      'One day, Sarah received bad news. Her friend Emma and her family were moving away. When Sarah heard that, she refused to eat or sleep for a few days.',
      'Before Emma left for her new home, she invited Sarah to visit her. Sarah said that she would do so. Both girls made a promise that they would remain friends forever.',
    ].join('\n\n'),
    questions: [
      { q: 'How many people were there in Sarah’s family?', model: 'Three — Sarah and her two parents (she is the only child).' },
      { q: 'What did Sarah and Emma like doing together?', model: 'They played computer games at each other’s homes and sometimes went to the playground nearby.' },
      { q: 'What was the bad news Sarah received?', model: 'Emma and her family were moving away.' },
    ],
  },
  {
    id: 'oe-p1-2',
    level: 'P1',
    title: 'Tim and the Busker',
    passage: [
      'Tim did not like music lessons. He was learning to play the piano at a music school every Saturday. His teacher was very strict with him. He made Tim play a certain part over and over again until it was perfect.',
      'One day, Tim went to a shopping mall and saw a busker playing the piano. As Tim listened to the music, he kept tapping his feet.',
      'Many people came to watch the busker. Whenever he finished playing a tune, people clapped loudly.',
      'Tim wanted to be as good as the busker. From then on, he started practising the piano eagerly and regularly. Soon, he became so good that he was chosen to play the piano on stage.',
    ].join('\n\n'),
    questions: [
      { q: 'How often did Tim have music lessons?', model: 'Once a week — every Saturday.' },
      { q: 'What did Tim do when he listened to the busker?', model: 'He kept tapping his feet to the music.' },
      { q: 'How did Tim feel after watching the busker — and what did he start doing?', model: 'He felt inspired and wanted to be as good as the busker, so he started practising the piano eagerly and regularly.' },
    ],
  },
  {
    id: 'oe-p1-3',
    level: 'P1',
    title: 'Toby and Shadow',
    passage: [
      'Toby loved sunny days, not just for the warmth, but for his best friend, Shadow. Shadow followed Toby everywhere and copied all his actions. One afternoon, Toby had an idea. "I’m going to catch Shadow!" he declared.',
      'He stretched out his butterfly net and charged at the inky outline. Poof! Shadow slipped away. Toby chased after Shadow, but Shadow was too quick for him. He zipped under the fence and climbed up a tree.',
      'Toby plopped down to catch his breath. Just then, he saw Shadow stretching before him in the grass. Toby giggled. Maybe catching Shadow wasn’t the point. The best part was having a friend who could play hide-and-seek with him in the sunshine.',
    ].join('\n\n'),
    questions: [
      { q: 'Why did Toby love sunny days?', model: 'He liked the warmth and being with his best friend Shadow.' },
      { q: 'What does "the inky outline" in paragraph 2 refer to?', model: 'It refers to Toby’s shadow.' },
      { q: 'Why couldn’t Toby catch Shadow?', model: 'Shadow was too quick — it slipped away, zipped under the fence and climbed up a tree.' },
    ],
  },
  {
    id: 'oe-p1-4',
    level: 'P1',
    title: 'Lisa and the Magic Pebble',
    passage: [
      'Lisa was in the woods near her house when she found a small, shiny pebble that was shaped like a bird’s egg. When she picked it up, a soft voice whispered, "Make a wish, but choose wisely."',
      'Excited, Lisa closed her eyes and wished for her favourite thing: to talk to animals.',
      'Suddenly, the forest around her came to life! A squirrel chattered, "Hello!" and a bird tweeted, "How’s the weather?"',
      'Lisa giggled in amazement. She spent the afternoon chatting with rabbits, foxes, and even a wise old owl. They told her interesting secrets about the woods she had never known.',
      'As the sun set, Lisa thanked the pebble, grateful for the many new friends she had made in the woods.',
    ].join('\n\n'),
    questions: [
      { q: 'Why was the pebble magical?', model: 'It whispered to Lisa and gave her a wish — it could talk.' },
      { q: 'What did Lisa wish for?', model: 'She wished that she could talk to animals.' },
      { q: 'Why was Lisa grateful to the pebble at the end?', model: 'Because of the wish, she had many new animal friends in the woods.' },
    ],
  },
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
  'p1-practice-tests': {
    icon: '🎓',
    label: 'Primary 1 Practice Tests',
    blurb: 'Four full P1 English papers — Term 1 to Term 4. Each paper covers Grammar MCQ, Vocabulary MCQ, Grammar Cloze, Vocabulary Cloze, Word Order, Editing (T3 & T4) and a Comprehension passage. Use them to spot weak sections, then drill those modules.',
    paperLink: 'P1 · Continual Assessment style',
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

  if (kind === 'p1-practice-tests') {
    return _renderP1PracticeTests();
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

function _formatClozeText(text) {
  return escapeHtml(text).replace(/\{\{(\d+)\}\}/g, (_, n) =>
    `<span class="p1pt-blank" aria-label="blank ${n}">(${n}) ______</span>`,
  );
}

function _formatEditingParagraph(paragraph) {
  return escapeHtml(paragraph).replace(/\{\{(\d+):([^}]*)\}\}/g, (_, n, token) => {
    const safeToken = token ? `<u>${token}</u>` : '○';
    return `<span class="p1pt-edit"><sup>(${n})</sup> ${safeToken}</span>`;
  });
}

function _renderPaperSection(test, key) {
  const section = test[key];
  if (!section) return '';
  const heading = `<h4>${escapeHtml(section.title)} <small>(${section.marks} marks)</small></h4>`;

  if (key === 'sectionA' || key === 'sectionB') {
    const list = section.items.map((it, i) => `
      <li>
        <p>${i + 1}. ${escapeHtml(it.q)}</p>
        <ol type="1" class="p1pt-choices">
          ${it.choices.map(c => `<li>${escapeHtml(c)}</li>`).join('')}
        </ol>
        <details><summary>Show answer</summary>
          <p><strong>Answer:</strong> ${escapeHtml(it.answer)}</p>
          <p>${escapeHtml(it.explain || '')}</p>
        </details>
      </li>`).join('');
    return `${heading}<ol class="p1pt-mcq">${list}</ol>`;
  }

  if (key === 'sectionC' || key === 'sectionD') {
    const wordBank = (section.wordBank || []).map(w => `<span class="p1pt-word">${escapeHtml(w)}</span>`).join(' ');
    const formatted = _formatClozeText(section.text);
    const reuse = section.reuseAllowed ? '<p><em>You may use the words more than once.</em></p>' : '';
    return `${heading}
      <p>${escapeHtml(section.instructions || '')}</p>
      <p class="p1pt-wordbank"><strong>Word box:</strong> ${wordBank}</p>
      ${reuse}
      <p class="p1pt-cloze" style="white-space:pre-line">${formatted}</p>
      <details><summary>Show answers</summary>
        <ol>
          ${section.answers.map((a, i) => `<li>(${i + 1}) <strong>${escapeHtml(a)}</strong></li>`).join('')}
        </ol>
        ${(section.leftOver || []).length ? `<p><em>Left over: ${section.leftOver.map(escapeHtml).join(', ')}</em></p>` : ''}
      </details>`;
  }

  if (key === 'sectionE') {
    const list = section.items.map((it, i) => `
      <li>
        <p>${i + 1}. <code>${it.scrambled.map(escapeHtml).join(' / ')}</code></p>
        <details><summary>Show sentence</summary><p>${escapeHtml(it.answer)}</p></details>
      </li>`).join('');
    return `${heading}
      <p>${escapeHtml(section.instructions || '')}</p>
      <ol class="p1pt-word-order">${list}</ol>`;
  }

  if (key === 'sectionF') {
    const errs = section.errors.map(e => `<li>(${e.num}) <strong>${escapeHtml(e.correction)}</strong> — ${escapeHtml(e.explain || '')}</li>`).join('');
    return `${heading}
      <p>${escapeHtml(section.instructions || '')}</p>
      <p class="p1pt-editing" style="white-space:pre-line">${_formatEditingParagraph(section.paragraph)}</p>
      <details><summary>Show corrections</summary><ol>${errs}</ol></details>`;
  }

  if (key === 'sectionG') {
    const questions = section.questions.map((q, i) => {
      const stem = `<p><strong>${i + 1}.</strong> ${escapeHtml(q.q)} <small>(${q.marks}m)</small></p>`;
      if (q.type === 'mcq') {
        return `<li>${stem}
          <ol type="1" class="p1pt-choices">${q.choices.map(c => `<li>${escapeHtml(c)}</li>`).join('')}</ol>
          <details><summary>Show answer</summary>
            <p><strong>${escapeHtml(q.answer)}</strong></p>
            <p>${escapeHtml(q.explain || '')}</p>
          </details>
        </li>`;
      }
      if (q.type === 'sequence') {
        const opts = q.options.map((o, idx) => `<li>${escapeHtml(o)} <em>(answer ${q.answer[idx]})</em></li>`).join('');
        return `<li>${stem}
          <ul class="p1pt-sequence">${q.options.map(o => `<li>______ ${escapeHtml(o)}</li>`).join('')}</ul>
          <details><summary>Show order</summary><ol>${opts}</ol></details>
        </li>`;
      }
      if (q.type === 'word-meaning') {
        return `<li>${stem}
          <p><em>${escapeHtml(q.sentence || '')}</em></p>
          <details><summary>Show answer</summary>
            <p><strong>${escapeHtml(q.answer)}</strong> — ${escapeHtml(q.explain || '')}</p>
          </details>
        </li>`;
      }
      return `<li>${stem}
        <details><summary>Show model answer</summary><p>${escapeHtml(q.model || '')}</p></details>
      </li>`;
    }).join('');
    return `${heading}
      <p class="p1pt-passage" style="white-space:pre-line">${escapeHtml(section.passage)}</p>
      <ol class="p1pt-comprehension">${questions}</ol>`;
  }

  return '';
}

function _renderP1PracticeTests() {
  const sectionsForTerm = (term) => (term === 'T1' || term === 'T2')
    ? ['sectionA', 'sectionB', 'sectionC', 'sectionD', 'sectionE', 'sectionG']
    : ['sectionA', 'sectionB', 'sectionC', 'sectionD', 'sectionE', 'sectionF', 'sectionG'];

  const cards = P1_PRACTICE_TEST_TERMS.map(term => {
    const test = P1_PRACTICE_TESTS[term];
    if (!test) return '';
    const sections = sectionsForTerm(term).map(key => _renderPaperSection(test, key)).join('');
    return `
      <article class="placeholder-card p1pt-paper" data-term="${term}">
        <header>
          <h3>${escapeHtml(test.label)}</h3>
          <p><small>${escapeHtml(test.duration)} · ${test.totalMarks} marks · ${escapeHtml(test.level)}</small></p>
          <p>${escapeHtml(test.blurb)}</p>
        </header>
        <details class="p1pt-paper-toggle">
          <summary>Open paper</summary>
          ${sections}
        </details>
      </article>`;
  }).join('');

  return `<p>Tap a paper below to expand it. Each section can be tried on paper or read aloud together — answers and short explanations are tucked under "Show answer".</p>${cards}`;
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
