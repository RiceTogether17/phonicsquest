/**
 * Primary English placeholder modules.
 *
 * Covers the PSLE Paper 1 / Paper 2 components that route through this
 * single-screen module:
 *
 *   - Visual Text Comprehension     (Paper 2)  — 21+ items P1–P6
 *   - Comprehension Cloze           (Paper 2)  — routes to full quest
 *   - Open-ended Comprehension      (Paper 2)  — 24+ passages P1–P6
 *   - Synthesis & Transformation    (Paper 2 Booklet B) — 30+ items P4–P6
 *   - Situational Writing           (Paper 1)  — 20+ prompts P5–P6
 *   - P1–P6 Practice Tests          — full interactive papers
 */

import { escapeHtml } from '../utils/escapeHtml.js';
import { PLACEHOLDER_META as META, getPlaceholderMeta } from './placeholderMeta.js';
import { VISUAL_TEXT_ITEMS } from '../data/visualTextItems.js';
import { OPEN_COMPREHENSION_PASSAGES } from '../data/openComprehensionPassages.js';
import { SYNTHESIS_ITEMS } from '../data/synthesisItems.js';
import { SITUATIONAL_WRITING_PROMPTS } from '../data/situationalWritingPrompts.js';
import { P1_PRACTICE_TESTS, P1_PRACTICE_TEST_TERMS } from '../data/p1PracticeTests.js';
import { P2_PRACTICE_TESTS, P2_PRACTICE_TEST_TERMS } from '../data/p2PracticeTests.js';
import { P3_PRACTICE_TESTS, P3_PRACTICE_TEST_TERMS } from '../data/p3PracticeTests.js';
import { P4_PRACTICE_TESTS, P4_PRACTICE_TEST_TERMS } from '../data/p4PracticeTests.js';
import { P5_PRACTICE_TESTS, P5_PRACTICE_TEST_TERMS } from '../data/p5PracticeTests.js';
import { P6_PRACTICE_TESTS, P6_PRACTICE_TEST_TERMS } from '../data/p6PracticeTests.js';
import { mountPracticeTest, buildPaperLauncherHtml } from './primaryPracticeTest.js';
import { renderOpenResponseHtml, attachOpenResponses } from './openResponse.js';

export const PRIMARY_PLACEHOLDER_KINDS = Object.freeze([
  'visual-text',
  'open-comprehension',
  'synthesis',
  'situational-writing',
  'p1-practice-tests',
  'p2-practice-tests',
  'p3-practice-tests',
  'p4-practice-tests',
  'p5-practice-tests',
  'p6-practice-tests',
]);

export { getPlaceholderMeta };

/**
 * Build static HTML for a placeholder module. Pure function — can be
 * unit-tested without a DOM.
 */
export function buildPlaceholderHtml(kind) {
  const meta = META[kind];
  if (!meta) return '';
  const body = _renderBody(kind);
  const related = meta.related
    ? `<p class="placeholder-related">Also useful: <button class="btn btn--ghost btn--sm" data-related="${meta.related.target}">${meta.related.label}</button>.</p>`
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

function _renderVisualText() {
  const items = VISUAL_TEXT_ITEMS;
  // Group by level for navigation
  const levels = [...new Set(items.map((i) => i.level))].sort();
  const byLevel = Object.fromEntries(levels.map((l) => [l, items.filter((i) => i.level === l)]));
  return levels
    .map(
      (level) => `
    <section class="placeholder-level-group">
      <h3 class="placeholder-level-heading">${level} — ${byLevel[level].length} items</h3>
      ${byLevel[level]
        .map(
          (s) => `
        <article class="placeholder-card">
          <h4>${escapeHtml(s.title)} <span class="module-level-badge">${s.type || 'visual'}</span></h4>
          <pre class="placeholder-poster" aria-label="Visual text content">${escapeHtml(s.poster)}</pre>
          <ol class="placeholder-questions">
            ${s.questions
              .map(
                (q, qi) => `
              <li>
                <p class="ptg-q-stem">${escapeHtml(q.q)}</p>
                ${renderOpenResponseHtml({ id: `vt-${s.id || level}-${qi}`, model: q.a, skill: 'visualText' })}
              </li>`,
              )
              .join('')}
          </ol>
        </article>`,
        )
        .join('')}
    </section>`,
    )
    .join('');
}

function _renderOpenComprehension() {
  const items = OPEN_COMPREHENSION_PASSAGES;
  const levels = [...new Set(items.map((i) => i.level))].sort();
  const byLevel = Object.fromEntries(levels.map((l) => [l, items.filter((i) => i.level === l)]));
  return levels
    .map(
      (level) => `
    <section class="placeholder-level-group">
      <h3 class="placeholder-level-heading">${level} — ${byLevel[level].length} passage${byLevel[level].length > 1 ? 's' : ''}</h3>
      ${byLevel[level]
        .map(
          (s) => `
        <article class="placeholder-card">
          <h4>${escapeHtml(s.title)}</h4>
          <p class="placeholder-passage" style="white-space:pre-line">${escapeHtml(s.passage)}</p>
          <ol class="placeholder-questions">
            ${s.questions
              .map(
                (q, qi) => `
              <li>
                <p class="ptg-q-stem">${escapeHtml(q.q)}</p>
                ${renderOpenResponseHtml({ id: `oc-${s.id || level}-${qi}`, model: q.model, skill: 'openComprehension' })}
              </li>`,
              )
              .join('')}
          </ol>
        </article>`,
        )
        .join('')}
    </section>`,
    )
    .join('');
}

function _renderSynthesis() {
  const items = SYNTHESIS_ITEMS;
  const patterns = [...new Set(items.map((i) => i.pattern || i.skill))];
  const byPattern = Object.fromEntries(
    patterns.map((p) => [p, items.filter((i) => (i.pattern || i.skill) === p)]),
  );
  return patterns
    .map(
      (pattern) => `
    <section class="placeholder-level-group">
      <h3 class="placeholder-level-heading">${escapeHtml(pattern)}</h3>
      <ol class="placeholder-questions">
        ${byPattern[pattern]
          .map(
            (s) => `
          <li class="placeholder-card">
            <p><strong>${escapeHtml(s.skill)}</strong> <span class="module-level-badge">${s.level}</span></p>
            <p>Rewrite: <em>${escapeHtml(s.original)}</em></p>
            ${s.stem ? `<p>Begin with: <code>${escapeHtml(s.stem)} …</code></p>` : ''}
            <details>
              <summary>Show model answer</summary>
              <p class="placeholder-answer">${escapeHtml(s.answer)}</p>
              ${s.explain ? `<p class="placeholder-explain"><em>${escapeHtml(s.explain)}</em></p>` : ''}
              ${s.alternates?.length ? `<p class="placeholder-explain">Also accepted: ${s.alternates.map((a) => `<em>${escapeHtml(a)}</em>`).join(' / ')}</p>` : ''}
            </details>
          </li>`,
          )
          .join('')}
      </ol>
    </section>`,
    )
    .join('');
}

function _renderSituationalWriting() {
  const items = SITUATIONAL_WRITING_PROMPTS;
  const formats = [...new Set(items.map((i) => i.format))];
  const byFormat = Object.fromEntries(formats.map((f) => [f, items.filter((i) => i.format === f)]));
  return formats
    .map(
      (format) => `
    <section class="placeholder-level-group">
      <h3 class="placeholder-level-heading">${escapeHtml(format)}</h3>
      ${byFormat[format]
        .map(
          (s) => `
        <article class="placeholder-card">
          <h4>${escapeHtml(s.title)} <span class="module-level-badge">${s.level}</span></h4>
          <p><strong>Audience:</strong> ${escapeHtml(s.audience)}</p>
          <p><strong>Purpose:</strong> ${escapeHtml(s.purpose)}</p>
          ${s.context ? `<p class="placeholder-context">${escapeHtml(s.context)}</p>` : ''}
          <p><strong>Include all 3 points:</strong></p>
          <ul>${(s.bullets || []).map((b) => `<li>${escapeHtml(b)}</li>`).join('')}</ul>
          <p class="ptg-note">Word count: ${escapeHtml(s.wordCount || '100–120 words')}</p>
          ${renderOpenResponseHtml({
            id: `sw-${s.id || s.title || 'prompt'}`,
            model: s.modelAnswer || '',
            skill: 'situationalWriting',
            placeholder: 'Write your letter, email or diary entry here…',
          })}
          ${
            s.checklist?.length
              ? `
            <details>
              <summary>Self-check list</summary>
              <ul>${s.checklist.map((c) => `<li>${escapeHtml(c)}</li>`).join('')}</ul>
            </details>`
              : ''
          }
          ${
            s.modelAnswer
              ? `
            <details>
              <summary>Show model answer</summary>
              <pre class="placeholder-poster">${escapeHtml(s.modelAnswer)}</pre>
            </details>`
              : ''
          }
          ${
            s.rubric
              ? `
            <details>
              <summary>Marking rubric</summary>
              <table class="ptg-table"><tbody>
                ${Object.entries(s.rubric)
                  .map(
                    ([k, v]) =>
                      `<tr><td><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(v)}</td></tr>`,
                  )
                  .join('')}
              </tbody></table>
            </details>`
              : ''
          }
        </article>`,
        )
        .join('')}
    </section>`,
    )
    .join('');
}

function _renderBody(kind) {
  if (kind === 'visual-text') return _renderVisualText();
  if (kind === 'open-comprehension') return _renderOpenComprehension();
  if (kind === 'synthesis') return _renderSynthesis();
  if (kind === 'situational-writing') return _renderSituationalWriting();

  if (kind === 'p1-practice-tests') {
    return buildPaperLauncherHtml({
      level: 'P1',
      papers: P1_PRACTICE_TEST_TERMS.map((t) => P1_PRACTICE_TESTS[t]).filter(Boolean),
      intro:
        "Pick a P1 paper to take the test interactively. Every section is scored — at the end you'll see which skills to drill.",
    });
  }
  if (kind === 'p2-practice-tests') {
    return buildPaperLauncherHtml({
      level: 'P2',
      papers: P2_PRACTICE_TEST_TERMS.map((t) => P2_PRACTICE_TESTS[t]).filter(Boolean),
      intro:
        'Pick a P2 paper to take the test interactively. Includes Sentence Combining and mixed-error Editing.',
    });
  }
  if (kind === 'p3-practice-tests') {
    return buildPaperLauncherHtml({
      level: 'P3',
      papers: P3_PRACTICE_TEST_TERMS.map((t) => P3_PRACTICE_TESTS[t]).filter(Boolean),
      intro:
        'Pick a P3 paper to take the test interactively. Only Terms 1–3 are in this bank (no T4). T3 includes open Comprehension Cloze and two passages.',
    });
  }
  if (kind === 'p4-practice-tests') {
    return buildPaperLauncherHtml({
      level: 'P4',
      papers: P4_PRACTICE_TEST_TERMS.map((t) => P4_PRACTICE_TESTS[t]).filter(Boolean),
      intro:
        'Pick a P4 paper to take the test interactively. Includes Synthesis & Transformation and longer Comprehension.',
    });
  }
  if (kind === 'p5-practice-tests') {
    return buildPaperLauncherHtml({
      level: 'P5',
      papers: P5_PRACTICE_TEST_TERMS.map((t) => P5_PRACTICE_TESTS[t]).filter(Boolean),
      intro:
        'Pick a P5 paper. Includes Situational Writing, Comprehension Cloze and evidence-based comprehension questions.',
    });
  }
  if (kind === 'p6-practice-tests') {
    return buildPaperLauncherHtml({
      level: 'P6',
      papers: P6_PRACTICE_TEST_TERMS.map((t) => P6_PRACTICE_TESTS[t]).filter(Boolean),
      intro:
        'Pick a P6 PSLE-format paper. Full Paper 1 + Paper 2 structure. Every wrong answer routes to the matching drill.',
    });
  }
  return '';
}

/**
 * Mount a placeholder module into a container element.
 */
export function mountPlaceholderModule(container, kind, { onClose, onRelated } = {}) {
  if (!container) return;
  container.innerHTML = buildPlaceholderHtml(kind);
  container.querySelector('[data-placeholder-close]')?.addEventListener('click', () => onClose?.());
  container.querySelectorAll('[data-related]').forEach((btn) => {
    btn.addEventListener('click', () => onRelated?.(btn.dataset.related));
  });

  // The comprehension and writing libraries are answerable, not just readable.
  attachOpenResponses(container, { quest: kind });

  // Mode picker toggle (Practice / Test Mode).
  const modeBtns = container.querySelectorAll('.ptg-mode-btn');
  modeBtns.forEach((mb) => {
    mb.addEventListener('click', () => {
      modeBtns.forEach((b) => b.classList.remove('ptg-mode-btn--active'));
      mb.classList.add('ptg-mode-btn--active');
    });
  });

  // Practice-test launcher buttons — start the interactive mode in-place.
  const startButtons = container.querySelectorAll('[data-start-paper]');
  if (startButtons.length) {
    const paperBank = _lookupPaperBank(kind);
    startButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-start-paper');
        const paper = paperBank.find((p) => p.id === id);
        if (!paper) return;
        const activeMode = container.querySelector('.ptg-mode-btn--active');
        const mode = activeMode?.getAttribute('data-mode') || 'practice';
        const stage = document.createElement('div');
        stage.className = 'primary-placeholder ptg-stage-wrap';
        container.innerHTML = '';
        container.appendChild(stage);
        mountPracticeTest(stage, paper, {
          onClose: () => onClose?.(),
          onPractiseSkill: (target) => onRelated?.(target),
          mode,
        });
      });
    });
  }
}

function _lookupPaperBank(kind) {
  if (kind === 'p1-practice-tests')
    return P1_PRACTICE_TEST_TERMS.map((t) => P1_PRACTICE_TESTS[t]).filter(Boolean);
  if (kind === 'p2-practice-tests')
    return P2_PRACTICE_TEST_TERMS.map((t) => P2_PRACTICE_TESTS[t]).filter(Boolean);
  if (kind === 'p3-practice-tests')
    return P3_PRACTICE_TEST_TERMS.map((t) => P3_PRACTICE_TESTS[t]).filter(Boolean);
  if (kind === 'p4-practice-tests')
    return P4_PRACTICE_TEST_TERMS.map((t) => P4_PRACTICE_TESTS[t]).filter(Boolean);
  if (kind === 'p5-practice-tests')
    return P5_PRACTICE_TEST_TERMS.map((t) => P5_PRACTICE_TESTS[t]).filter(Boolean);
  if (kind === 'p6-practice-tests')
    return P6_PRACTICE_TEST_TERMS.map((t) => P6_PRACTICE_TESTS[t]).filter(Boolean);
  return [];
}
