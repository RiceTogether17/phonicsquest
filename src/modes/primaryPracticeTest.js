/**
 * PhonicsQuest – Practice Test Mode (interactive)
 *
 * Turns a P1 / P2 / P3 practice paper (one term) into an interactive,
 * scored game.  This is NOT a static viewer — the student fills in or
 * selects answers and the mode scores each section, surfaces the skills
 * they got wrong, and routes them into the matching drill module.
 *
 * Public API:
 *   mountPracticeTest(container, paper, opts) → void
 *
 * Section types supported (each renders an interactive UI):
 *   sectionA / sectionB        — MCQ (radio)
 *   sectionC / sectionD        — cloze with word box (typed; case-insensitive)
 *   sectionE (T3 P3)           — open cloze (typed; primary + accepted variants)
 *   sectionE (other) / F (P2)  — word order (typed sentence)
 *   sectionF (P2/P3) / G       — sentence combining (typed sentence)
 *   sectionG (P1/P2) / F (P1)  — editing (typed correction per blank)
 *   comprehension              — MCQ + short + sequence + true-false + table
 *
 * Scoring uses normalised case-insensitive string equality for short
 * answers (with `accept` synonyms supported).  Comprehension long-answer
 * questions ask the student to self-score against the model answer.
 */

import { escapeHtml, escapeAttr } from '../utils/escapeHtml.js';
import { GRAMMAR_CATEGORIES } from '../data/grammarCategories.js';
import { VOCAB_CATEGORIES } from '../data/vocabCategories.js';

const PRACTISE_TARGET_LABELS = {
  'grammar-mcq':    '🧠 Grammar MCQ',
  'vocab-mcq':      '📖 Vocabulary MCQ',
  'cloze-castle':   '🏰 Cloze Castle',
  'word-vault':     '🔑 Word Vault',
  'sentence-forge': '🔨 Sentence Forge',
  'editing-quest':  '✏️ Editing Quest',
};

const SECTION_KEYS = ['sectionA', 'sectionB', 'sectionC', 'sectionD', 'sectionE', 'sectionF', 'sectionG', 'sectionH', 'sectionI'];

// Tiny CSS attr-selector escape — JSDOM (and older browsers) may lack
// CSS.escape.  Our q-keys only contain `/` and `#`, so escape `#`.
function cssEscape(value) {
  if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') return CSS.escape(value);
  return String(value).replace(/[#"\\]/g, '\\$&');
}

function _normalize(s) {
  return String(s ?? '')
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[.,;:!?]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function _normalizeSentence(s) {
  // looser comparison for word-order / sentence-combining items: collapse
  // multiple spaces, strip end-punct, lowercase.  Internal punctuation
  // (commas, apostrophes) is preserved.
  return _normalize(s).replace(/[?!.]+$/, '');
}

function _skillMeta(skill) {
  if (!skill) return null;
  return GRAMMAR_CATEGORIES[skill] || VOCAB_CATEGORIES[skill] || null;
}

function _skillLabel(skill) {
  const m = _skillMeta(skill);
  return m?.label || skill || '';
}

function _skillIcon(skill) {
  const m = _skillMeta(skill);
  return m?.icon || '';
}

function _defaultPractiseTarget(skill) {
  // P1 items don't carry practiseTarget — fall back to "grammar-mcq" for
  // grammar skills, "vocab-mcq" for vocab skills.  Returns '' if the
  // skill isn't registered in either spine.
  if (!skill) return '';
  if (GRAMMAR_CATEGORIES[skill]) return 'grammar-mcq';
  if (VOCAB_CATEGORIES[skill]) return 'vocab-mcq';
  return '';
}

/* ────────────────────────────────────────────────────────────────────── */
/* Section renderers — each returns a fragment to mount into the body.    */
/* They tag inputs with data-* attributes the grader picks up later.      */
/* ────────────────────────────────────────────────────────────────────── */

function renderMcqSection(section, sectionKey) {
  const items = section.items.map((item, i) => {
    const groupName = `q-${sectionKey}-${i}`;
    const practise = item.practiseTarget || _defaultPractiseTarget(item.skill);
    const choices = item.choices.map((c, ci) => `
      <label class="ptg-radio">
        <input type="radio" name="${groupName}" value="${escapeAttr(c)}"
               data-q-key="${sectionKey}/${i}"
               data-answer="${escapeAttr(item.answer)}"
               data-skill="${escapeAttr(item.skill || '')}"
               data-practise="${escapeAttr(practise)}">
        <span>${escapeHtml(c)}</span>
      </label>`).join('');
    return `
      <li class="ptg-question" data-q-index="${i}">
        <p class="ptg-q-stem">${escapeHtml(item.q)}</p>
        <div class="ptg-choices">${choices}</div>
        <div class="ptg-feedback" data-feedback-for="${sectionKey}/${i}" hidden></div>
      </li>`;
  }).join('');
  return `<ol class="ptg-mcq">${items}</ol>`;
}

function renderClozeSection(section, sectionKey) {
  const practise = section.practiseTarget || _defaultPractiseTarget(section.skill) || 'cloze-castle';
  const wordBank = (section.wordBank || []).map(w => `<span class="ptg-word-pill">${escapeHtml(w)}</span>`).join(' ');
  const text = escapeHtml(section.text).replace(/\{\{(\d+)\}\}/g, (_, n) => {
    const idx = Number(n) - 1;
    return `<input type="text" class="ptg-input ptg-input--cloze" data-q-key="${sectionKey}/${idx}"
            data-answer="${escapeAttr(section.answers[idx] || '')}"
            data-skill="${escapeAttr(section.skill || '')}"
            data-practise="${escapeAttr(practise)}"
            aria-label="Blank ${n}" autocomplete="off" />`;
  });
  const reuse = section.reuseAllowed ? '<p class="ptg-note"><em>You may use the words more than once.</em></p>' : '';
  return `
    <p class="ptg-instructions">${escapeHtml(section.instructions || '')}</p>
    <p class="ptg-wordbank"><strong>Word box:</strong> ${wordBank}</p>
    ${reuse}
    <p class="ptg-cloze">${text}</p>
    <div class="ptg-feedback" data-feedback-for="${sectionKey}/all" hidden></div>`;
}

function renderOpenClozeSection(section, sectionKey) {
  const practise = section.practiseTarget || _defaultPractiseTarget(section.skill) || 'cloze-castle';
  const text = escapeHtml(section.text).replace(/\{\{(\d+)\}\}/g, (_, n) => {
    const idx = Number(n) - 1;
    const blank = section.blanks?.[idx];
    const answer = blank?.answer || '';
    const accepts = (blank?.accept || []).join('|');
    return `<input type="text" class="ptg-input ptg-input--cloze" data-q-key="${sectionKey}/${idx}"
            data-answer="${escapeAttr(answer)}" data-accept="${escapeAttr(accepts)}"
            data-skill="${escapeAttr(section.skill || '')}"
            data-practise="${escapeAttr(practise)}"
            aria-label="Blank ${n}" autocomplete="off" />`;
  });
  return `
    <p class="ptg-instructions">${escapeHtml(section.instructions || 'Fill in each blank with ONE suitable word. No word box — use grammar and meaning clues.')}</p>
    <p class="ptg-cloze">${text}</p>
    <div class="ptg-feedback" data-feedback-for="${sectionKey}/all" hidden></div>`;
}

function renderWordOrderSection(section, sectionKey) {
  const items = section.items.map((item, i) => {
    const scrambled = item.scrambled.map(w => `<span class="ptg-tile">${escapeHtml(w)}</span>`).join(' ');
    return `
      <li class="ptg-question" data-q-index="${i}">
        <p class="ptg-q-stem">${i + 1}. Rearrange: ${scrambled}</p>
        <input type="text" class="ptg-input ptg-input--full" data-q-key="${sectionKey}/${i}"
               data-answer="${escapeAttr(item.answer)}"
               data-accept="${escapeAttr((item.alternates || []).join('|'))}"
               data-skill="${escapeAttr(item.skill || 'wordOrder')}"
               data-practise="sentence-forge"
               placeholder="Type the full sentence here…" autocomplete="off" />
        <div class="ptg-feedback" data-feedback-for="${sectionKey}/${i}" hidden></div>
      </li>`;
  }).join('');
  return `<p class="ptg-instructions">${escapeHtml(section.instructions || '')}</p><ol class="ptg-word-order">${items}</ol>`;
}

function renderSentenceCombiningSection(section, sectionKey) {
  const items = section.items.map((item, i) => {
    const originals = item.originals.map(o => `<li>${escapeHtml(o)}</li>`).join('');
    return `
      <li class="ptg-question" data-q-index="${i}">
        <ol class="ptg-orig">${originals}</ol>
        <p>Connector: <code>${escapeHtml(item.connector)}</code></p>
        <textarea class="ptg-input ptg-input--area" rows="2"
                  data-q-key="${sectionKey}/${i}"
                  data-answer="${escapeAttr(item.model)}"
                  data-skill="${escapeAttr(item.skill || 'connectors')}"
                  data-practise="sentence-forge"
                  placeholder="Write the combined sentence…"></textarea>
        <div class="ptg-feedback" data-feedback-for="${sectionKey}/${i}" hidden></div>
      </li>`;
  }).join('');
  return `<p class="ptg-instructions">${escapeHtml(section.instructions || '')}</p><ol class="ptg-combining">${items}</ol>`;
}

function renderSynthesisSection(section, sectionKey) {
  const items = section.items.map((item, i) => {
    const alts = (item.alternates || []).join('|');
    return `
      <li class="ptg-question" data-q-index="${i}">
        <p class="ptg-q-stem">${i + 1}. ${escapeHtml(item.q)}</p>
        <p class="ptg-synthesis-stem"><strong>Begin with:</strong> <code>${escapeHtml(item.stem)}</code></p>
        <textarea class="ptg-input ptg-input--area" rows="2"
                  data-q-key="${sectionKey}/${i}"
                  data-answer="${escapeAttr(item.answer)}"
                  data-accept="${escapeAttr(alts)}"
                  data-skill="${escapeAttr(item.skillKey || item.skill || 'synthesis')}"
                  data-practise="sentence-forge"
                  placeholder="Write your transformed sentence…"></textarea>
        <div class="ptg-feedback" data-feedback-for="${sectionKey}/${i}" hidden></div>
      </li>`;
  }).join('');
  return `<p class="ptg-instructions">${escapeHtml(section.instructions || 'Rewrite each sentence using the given beginning. Do not change the meaning.')}</p><ol class="ptg-combining">${items}</ol>`;
}

function renderSituationalWritingSection(section, sectionKey) {
  const bullets = (section.bullets || []).map(b => `<li>${escapeHtml(b)}</li>`).join('');
  const rubricRows = section.rubric
    ? Object.entries(section.rubric).map(([k, v]) => `<tr><td><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(v)}</td></tr>`).join('')
    : '';
  const rubricTable = rubricRows
    ? `<details class="ptg-rubric"><summary>Marking rubric</summary><table class="ptg-table"><tbody>${rubricRows}</tbody></table></details>`
    : '';
  return `
    <div class="ptg-situational-writing">
      <div class="ptg-sw-brief">
        <p><strong>Format:</strong> ${escapeHtml(section.format || '')} &nbsp;|&nbsp; <strong>Audience:</strong> ${escapeHtml(section.audience || '')} &nbsp;|&nbsp; <strong>Word count:</strong> ${escapeHtml(section.wordCount || '100–120 words')}</p>
        <p><strong>Purpose:</strong> ${escapeHtml(section.purpose || '')}</p>
        ${section.context ? `<p class="ptg-sw-context">${escapeHtml(section.context)}</p>` : ''}
        <p><strong>In your response, include ALL of the following:</strong></p>
        <ul class="ptg-sw-bullets">${bullets}</ul>
      </div>
      <p class="ptg-instructions">Write your response in the box below. Check format, tone and that all 3 points are covered.</p>
      <textarea class="ptg-input ptg-input--writing" rows="8"
                data-q-key="${sectionKey}/0"
                data-q-type="writing"
                data-skill="situationalWriting"
                data-practise="writing-quest"
                placeholder="Write your ${escapeHtml(section.format || 'response')} here…"></textarea>
      <details class="ptg-model-answer">
        <summary>Show model answer</summary>
        <pre class="ptg-sw-model">${escapeHtml(section.modelAnswer || '')}</pre>
      </details>
      ${rubricTable}
      <div class="ptg-feedback" data-feedback-for="${sectionKey}/all" hidden></div>
    </div>`;
}

function renderEditingSection(section, sectionKey) {
  const text = escapeHtml(section.paragraph).replace(/\{\{(\d+):([^}]*)\}\}/g, (_, n, wrong) => {
    const idx = Number(n) - 1;
    const err = section.errors?.[idx];
    const ans = err?.correction ?? '';
    const wrongLabel = wrong ? `<u>${escapeHtml(wrong)}</u>` : '○';
    return `<span class="ptg-edit-slot">
      <sup>(${n})</sup> ${wrongLabel}
      <input type="text" class="ptg-input ptg-input--inline" data-q-key="${sectionKey}/${idx}"
        data-answer="${escapeAttr(ans)}"
        data-skill="${escapeAttr(err?.kind === 'spelling' ? 'spelling' : err?.kind === 'punctuation' ? 'punctuation' : 'editing')}"
        data-practise="editing-quest"
        aria-label="Correction ${n}" autocomplete="off" />
    </span>`;
  });
  return `<p class="ptg-instructions">${escapeHtml(section.instructions || '')}</p>
    <p class="ptg-editing">${text}</p>
    <div class="ptg-feedback" data-feedback-for="${sectionKey}/all" hidden></div>`;
}

function renderComprehensionSection(section, sectionKey) {
  const passage = `<p class="ptg-passage">${escapeHtml(section.passage)}</p>`;
  const items = (section.questions || []).map((q, i) => {
    const qKey = `${sectionKey}/${i}`;
    const stem = `<p class="ptg-q-stem"><strong>${i + 1}.</strong> ${escapeHtml(q.q)} <small>(${q.marks}m)</small></p>`;

    if (q.type === 'mcq') {
      const group = `cmcq-${sectionKey}-${i}`;
      const choices = q.choices.map(c => `
        <label class="ptg-radio">
          <input type="radio" name="${group}" value="${escapeAttr(c)}"
                 data-q-key="${qKey}" data-answer="${escapeAttr(q.answer)}"
                 data-q-type="mcq" data-marks="${q.marks}">
          <span>${escapeHtml(c)}</span>
        </label>`).join('');
      return `<li>${stem}<div class="ptg-choices">${choices}</div>
        <div class="ptg-feedback" data-feedback-for="${qKey}" hidden></div></li>`;
    }

    if (q.type === 'word-meaning') {
      const group = `cwm-${sectionKey}-${i}`;
      const sentence = q.sentence ? `<p><em>${escapeHtml(q.sentence)}</em></p>` : '';
      const choices = q.choices.map(c => `
        <label class="ptg-radio">
          <input type="radio" name="${group}" value="${escapeAttr(c)}"
                 data-q-key="${qKey}" data-answer="${escapeAttr(q.answer)}"
                 data-q-type="mcq" data-marks="${q.marks}">
          <span>${escapeHtml(c)}</span>
        </label>`).join('');
      return `<li>${stem}${sentence}<div class="ptg-choices">${choices}</div>
        <div class="ptg-feedback" data-feedback-for="${qKey}" hidden></div></li>`;
    }

    if (q.type === 'sequence') {
      const opts = q.options.map((o, idx) => {
        const select = `<select class="ptg-input ptg-input--inline" data-q-key="${qKey}#${idx}"
          data-answer="${q.answer[idx]}" data-q-type="sequence" data-marks="0">
          <option value="">–</option><option value="1">1</option><option value="2">2</option><option value="3">3</option>
        </select>`;
        return `<li>${select} ${escapeHtml(o)}</li>`;
      }).join('');
      return `<li>${stem}<ul class="ptg-sequence" data-marks="${q.marks}" data-q-key="${qKey}">${opts}</ul>
        <div class="ptg-feedback" data-feedback-for="${qKey}" hidden></div></li>`;
    }

    if (q.type === 'true-false') {
      const rows = q.statements.map((s, si) => {
        const group = `ctf-${sectionKey}-${i}-${si}`;
        return `<li class="ptg-tf-row">
          <p>${si + 1}. ${escapeHtml(s.text)}</p>
          <label class="ptg-radio"><input type="radio" name="${group}" value="true"
             data-q-key="${qKey}#${si}" data-answer="${s.answer ? 'true' : 'false'}"
             data-q-type="true-false" data-marks="1"> <span>True</span></label>
          <label class="ptg-radio"><input type="radio" name="${group}" value="false"
             data-q-key="${qKey}#${si}" data-answer="${s.answer ? 'true' : 'false'}"
             data-q-type="true-false" data-marks="1"> <span>False</span></label>
        </li>`;
      }).join('');
      return `<li>${stem}<ul class="ptg-tf">${rows}</ul>
        <div class="ptg-feedback" data-feedback-for="${qKey}" hidden></div></li>`;
    }

    if (q.type === 'table') {
      const rows = q.rows.map((row, ri) => `
        <tr>
          <td>${escapeHtml(row.action)}</td>
          <td><input type="text" class="ptg-input" data-q-key="${qKey}#${ri}"
                     data-answer="${escapeAttr(row.answer)}" data-q-type="short" data-marks="1"
                     placeholder="Type the person" autocomplete="off"></td>
        </tr>`).join('');
      return `<li>${stem}
        <table class="ptg-table">
          <thead><tr><th>Action</th><th>Person who did it</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <div class="ptg-feedback" data-feedback-for="${qKey}" hidden></div></li>`;
    }

    // type: 'short'
    const keywordsAttr = (q.keywords || []).join('|');
    const isOneWord = (q.model || '').trim().split(/\s+/).length <= 3;
    const input = isOneWord
      ? `<input type="text" class="ptg-input ptg-input--full" data-q-key="${qKey}"
         data-answer="${escapeAttr(q.model || '')}" data-keywords="${escapeAttr(keywordsAttr)}"
         data-q-type="short" data-marks="${q.marks}" placeholder="Type your answer" autocomplete="off">`
      : `<textarea class="ptg-input ptg-input--area" rows="2" data-q-key="${qKey}"
         data-answer="${escapeAttr(q.model || '')}" data-keywords="${escapeAttr(keywordsAttr)}"
         data-q-type="short" data-marks="${q.marks}" placeholder="Type your answer in a full sentence"></textarea>`;
    return `<li>${stem}${input}
      <div class="ptg-feedback" data-feedback-for="${qKey}" hidden></div></li>`;
  }).join('');

  return `${passage}<ol class="ptg-comprehension">${items}</ol>`;
}

function _dispatchSection(s, k) {
  if (!s) return '';
  if (s.bullets && s.modelAnswer !== undefined) return renderSituationalWritingSection(s, k);
  if (Array.isArray(s.blanks)) return renderOpenClozeSection(s, k);
  if (s.paragraph) return renderEditingSection(s, k);
  if (s.passage) return renderComprehensionSection(s, k);
  if (Array.isArray(s.items)) {
    const first = s.items[0];
    if (first?.scrambled) return renderWordOrderSection(s, k);
    if (first?.originals) return renderSentenceCombiningSection(s, k);
    if (first?.stem !== undefined) return renderSynthesisSection(s, k);
    if (first?.choices) return renderMcqSection(s, k);
  }
  if (s.wordBank) return renderClozeSection(s, k);
  if (s.text && !s.wordBank) return renderOpenClozeSection(s, k);
  return '';
}

const SECTION_RENDERERS = {
  sectionA: (s, k) => renderMcqSection(s, k),
  sectionB: (s, k) => renderMcqSection(s, k),
  sectionC: (s, k) => renderClozeSection(s, k),
  sectionD: (s, k) => renderClozeSection(s, k),
  sectionE: (s, k) => _dispatchSection(s, k),
  sectionF: (s, k) => _dispatchSection(s, k),
  sectionG: (s, k) => _dispatchSection(s, k),
  sectionH: (s, k) => (s.passage ? renderComprehensionSection(s, k) : _dispatchSection(s, k)),
  sectionI: (s, k) => (s.passage ? renderComprehensionSection(s, k) : ''),
};

/* ────────────────────────────────────────────────────────────────────── */
/* Grading                                                                */
/* ────────────────────────────────────────────────────────────────────── */

function isShortAnswerCorrect(userValue, expected, keywordsAttr) {
  const u = _normalize(userValue);
  if (!u) return false;
  const e = _normalize(expected);
  if (u === e) return true;
  const keywords = (keywordsAttr || '').split('|').filter(Boolean);
  if (keywords.length === 0) return false;
  // Pass if at least one expected keyword appears in the user's answer.
  return keywords.some(k => u.includes(_normalize(k)));
}

function gradeInput(el) {
  const expected = el.getAttribute('data-answer') || '';
  const accepts = (el.getAttribute('data-accept') || '').split('|').filter(Boolean);
  const value = el.value ?? '';
  const qType = el.getAttribute('data-q-type') || '';

  if (qType === 'writing') return null; // self-assessed — not auto-graded

  if (el.type === 'radio') {
    if (!el.checked) return null; // grade only the checked radio per group
    return _normalize(value) === _normalize(expected);
  }

  if (qType === 'short') {
    const keywords = el.getAttribute('data-keywords') || '';
    return isShortAnswerCorrect(value, expected, keywords);
  }

  if (el.tagName === 'TEXTAREA' || (qType === '' && el.classList.contains('ptg-input--area'))) {
    // sentence combining — accept normalized full-sentence match
    const u = _normalizeSentence(value);
    if (!u) return false;
    if (u === _normalizeSentence(expected)) return true;
    return accepts.map(_normalizeSentence).includes(u);
  }

  // standard typed answer
  if (!value.trim()) return false;
  const u = _normalize(value);
  if (u === _normalize(expected)) return true;
  return accepts.map(_normalize).includes(u);
}

function readSectionMarks(section, sectionKey) {
  // How many marks does each grader-checked input contribute?
  if (sectionKey === 'sectionA' || sectionKey === 'sectionB') return 1;
  if (sectionKey === 'sectionC' || sectionKey === 'sectionD') return 1;
  if (Array.isArray(section.items) && section.items[0]?.originals) return 2; // sentence combining
  if (Array.isArray(section.items) && section.items[0]?.scrambled) return 1; // word order
  if (Array.isArray(section.items) && section.items[0]?.stem !== undefined) return 2; // synthesis
  if (Array.isArray(section.blanks)) return 1; // open cloze
  if (section.paragraph) return 1; // editing
  return 1;
}

function gradeSection(root, sectionKey, section) {
  const inputs = root.querySelectorAll(`[data-q-key^="${sectionKey}/"]`);
  let scored = 0;
  let total = 0;
  const perKey = new Map(); // key → { correct: bool, expected, value, skill, practise }
  const radioGroupsHandled = new Set();

  inputs.forEach(el => {
    if (el.type === 'radio') {
      if (radioGroupsHandled.has(el.name)) return;
      radioGroupsHandled.add(el.name);
      const checked = root.querySelector(`input[name="${el.name}"]:checked`);
      const expected = el.getAttribute('data-answer') || '';
      const key = el.getAttribute('data-q-key');
      const skill = el.getAttribute('data-skill') || '';
      const practise = el.getAttribute('data-practise') || '';
      const qType = el.getAttribute('data-q-type') || '';
      const marks = Number(el.getAttribute('data-marks')) || (qType === 'true-false' ? 1 : readSectionMarks(section, sectionKey));
      total += marks;
      let correct = false;
      let answered = false;
      if (checked) {
        answered = true;
        correct = _normalize(checked.value) === _normalize(expected);
      }
      if (correct) scored += marks;
      perKey.set(key, {
        key, marks, correct, answered,
        userValue: checked?.value || '',
        expected,
        skill,
        practise,
        qType,
      });
      return;
    }

    const key = el.getAttribute('data-q-key');
    const skill = el.getAttribute('data-skill') || '';
    const practise = el.getAttribute('data-practise') || '';
    const qType = el.getAttribute('data-q-type') || '';
    const grade = gradeInput(el);
    if (grade === null) {
      // self-assessed section (e.g. situational writing) — skip from score
      perKey.set(key, { key, marks: 0, correct: false, selfAssess: true, answered: true, userValue: el.value || '', expected: '', skill, practise, qType });
      return;
    }
    const marks = Number(el.getAttribute('data-marks')) || readSectionMarks(section, sectionKey);
    total += marks;
    const correct = grade === true;
    if (correct) scored += marks;
    perKey.set(key, {
      key, marks, correct,
      answered: !!String(el.value || '').trim(),
      userValue: el.value || '',
      expected: el.getAttribute('data-answer') || '',
      skill,
      practise,
      qType,
    });
  });

  return { scored, total, perKey };
}

/* ────────────────────────────────────────────────────────────────────── */
/* Mount                                                                  */
/* ────────────────────────────────────────────────────────────────────── */

function buildSummaryHtml(paper, sectionResults) {
  const totalScored = sectionResults.reduce((a, r) => a + r.scored, 0);
  const totalMarks = sectionResults.reduce((a, r) => a + r.total, 0);

  // Aggregate weak skills across sections.
  const weakSkills = new Map(); // skill -> { wrong, total, practise }
  for (const r of sectionResults) {
    for (const v of r.perKey.values()) {
      if (!v.skill) continue;
      const existing = weakSkills.get(v.skill) || { wrong: 0, total: 0, practise: v.practise };
      existing.total += 1;
      if (!v.correct) existing.wrong += 1;
      if (v.practise && !existing.practise) existing.practise = v.practise;
      weakSkills.set(v.skill, existing);
    }
  }
  const ranked = [...weakSkills.entries()]
    .filter(([, v]) => v.wrong > 0)
    .sort((a, b) => b[1].wrong - a[1].wrong)
    .slice(0, 5);

  const weakHtml = ranked.length
    ? ranked.map(([skill, v]) => {
        const targetBtn = v.practise && PRACTISE_TARGET_LABELS[v.practise]
          ? `<button class="ptg-practise" data-related="${v.practise}" type="button">Practise → ${PRACTISE_TARGET_LABELS[v.practise]}</button>`
          : '';
        return `<li><span class="ptg-skill-chip">${_skillIcon(skill)} ${escapeHtml(_skillLabel(skill))}</span>
          <span class="ptg-skill-tally">${v.wrong}/${v.total} missed</span>
          ${targetBtn}</li>`;
      }).join('')
    : '<li>No clear weak skill — you nailed it across the board! 🎉</li>';

  const perSection = sectionResults.map(r => `
    <tr>
      <td>${escapeHtml(r.title)}</td>
      <td>${r.scored} / ${r.total}</td>
      <td>${r.total > 0 ? Math.round(100 * r.scored / r.total) : 0}%</td>
    </tr>`).join('');

  return `
    <h3>📊 ${escapeHtml(paper.label)} — Summary</h3>
    <p class="ptg-summary-total"><strong>Total:</strong> ${totalScored} / ${totalMarks} (auto-graded sections)</p>
    <p class="ptg-note"><em>Open-ended comprehension answers were graded with keyword matching — re-read the model answer if you're unsure.</em></p>
    <table class="ptg-summary-table">
      <thead><tr><th>Section</th><th>Score</th><th>%</th></tr></thead>
      <tbody>${perSection}</tbody>
    </table>
    <h4>🎯 Skills to Practise</h4>
    <ul class="ptg-weak-list">${weakHtml}</ul>
    <div class="ptg-actions">
      <button class="btn btn--primary" data-action="retry" type="button">Try this paper again</button>
      <button class="btn btn--ghost" data-action="close" type="button">← Back to home</button>
    </div>`;
}

/** Converts "1 h 50 min", "45 min", "1 h" etc. → milliseconds (0 if unparseable). */
function parseDurationMs(str) {
  if (!str) return 0;
  const h = str.match(/(\d+)\s*h/);
  const m = str.match(/(\d+)\s*min/);
  return ((h ? Number(h[1]) : 0) * 60 + (m ? Number(m[1]) : 0)) * 60_000;
}

/** Formats a positive millisecond count as M:SS or H:MM:SS. */
function formatRemaining(ms) {
  const totalSec = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function renderPaperFrame(paper) {
  return `
    <section class="ptg" data-paper-id="${escapeAttr(paper.id)}">
      <header class="ptg-header">
        <div class="ptg-header-row">
          <h2>${escapeHtml(paper.label)}</h2>
          <div class="ptg-timer" role="timer" aria-label="Time remaining" aria-live="off" hidden></div>
        </div>
        <p><small>${escapeHtml(paper.duration)} · ${paper.totalMarks} marks · ${escapeHtml(paper.level)}</small></p>
        <div class="ptg-stepper" aria-label="Section progress"></div>
        <p class="ptg-blurb">${escapeHtml(paper.blurb || '')}</p>
      </header>
      <main class="ptg-stage" aria-live="polite"></main>
      <footer class="ptg-foot">
        <button class="btn btn--ghost" data-action="prev" type="button" hidden>← Previous</button>
        <button class="btn btn--primary" data-action="check" type="button">Check answers</button>
        <button class="btn btn--primary" data-action="next" type="button" hidden>Next section →</button>
        <button class="btn btn--primary" data-action="finish" type="button" hidden>Finish &amp; show summary</button>
        <button class="btn btn--ghost" data-action="exit" type="button">Exit</button>
      </footer>
    </section>`;
}

export function mountPracticeTest(container, paper, { onClose, onPractiseSkill, mode = 'practice' } = {}) {
  if (!container || !paper) return;
  const sectionKeys = SECTION_KEYS.filter(k => paper[k]);
  if (!sectionKeys.length) {
    container.innerHTML = '<p>No sections in this paper.</p>';
    return;
  }

  container.innerHTML = renderPaperFrame(paper);

  const stepperEl = container.querySelector('.ptg-stepper');
  const stageEl = container.querySelector('.ptg-stage');
  const timerEl = container.querySelector('.ptg-timer');
  const btnPrev = container.querySelector('[data-action="prev"]');
  const btnCheck = container.querySelector('[data-action="check"]');
  const btnNext = container.querySelector('[data-action="next"]');
  const btnFinish = container.querySelector('[data-action="finish"]');
  const btnExit = container.querySelector('[data-action="exit"]');

  let idx = 0;
  const sectionResults = []; // collected on Check
  let timerInterval = null;

  function renderStepper() {
    stepperEl.innerHTML = sectionKeys.map((k, i) => {
      const status = i < idx ? 'done' : i === idx ? 'current' : 'pending';
      return `<span class="ptg-step ptg-step--${status}">${String.fromCharCode(65 + i)}</span>`;
    }).join('');
  }

  function renderCurrentSection() {
    const key = sectionKeys[idx];
    const section = paper[key];
    const renderer = SECTION_RENDERERS[key];
    const title = `<h3 class="ptg-section-title">${escapeHtml(section.title)} <small>(${section.marks} marks)</small></h3>`;
    const body = renderer ? renderer(section, key) : '<p>Unsupported section.</p>';
    stageEl.innerHTML = `${title}${body}`;
    renderStepper();
    btnPrev.hidden = idx === 0;
    btnCheck.hidden = false;
    btnNext.hidden = true;
    btnFinish.hidden = true;
  }

  function showFeedback(perKey) {
    perKey.forEach((info, key) => {
      // The summary entry for a question lives at the BASE key
      // (e.g. "sectionG/3" even when sub-keys like "sectionG/3#0" were
      // graded for sequence / true-false sub-statements).
      const baseKey = String(key).split('#')[0];
      const fb = stageEl.querySelector(`[data-feedback-for="${cssEscape(baseKey)}"]`);
      if (!fb) return;
      const skillRow = info.skill
        ? `<div class="ptg-skill-row"><span class="ptg-skill-chip">${_skillIcon(info.skill)} ${escapeHtml(_skillLabel(info.skill))}</span>
            ${info.practise && PRACTISE_TARGET_LABELS[info.practise]
              ? `<button class="ptg-practise" data-related="${info.practise}" type="button">Practise → ${PRACTISE_TARGET_LABELS[info.practise]}</button>`
              : ''}
          </div>`
        : '';
      fb.hidden = false;
      if (info.selfAssess) {
        fb.className = 'ptg-feedback ptg-feedback--info';
        fb.innerHTML = '<span>📝 Self-assess: compare your response to the model answer above. Check format, tone, and that all 3 bullet points are covered.</span>';
        return;
      }
      fb.className = `ptg-feedback ptg-feedback--${info.correct ? 'ok' : 'no'}`;
      if (info.correct) {
        fb.innerHTML = `<span>✅ Correct.</span>${skillRow}`;
      } else if (!info.answered) {
        fb.innerHTML = `<span>⚠️ Not answered. Correct: <strong>${escapeHtml(info.expected || '')}</strong></span>${skillRow}`;
      } else {
        fb.innerHTML = `<span>❌ Correct answer: <strong>${escapeHtml(info.expected || '')}</strong></span>${skillRow}`;
      }
    });
  }

  function onCheck() {
    const key = sectionKeys[idx];
    const section = paper[key];
    const result = gradeSection(stageEl, key, section);
    showFeedback(result.perKey);
    sectionResults[idx] = { ...result, title: section.title, key };

    // Disable further input editing in this section
    stageEl.querySelectorAll('input, textarea, select').forEach(el => { el.disabled = true; });

    btnCheck.hidden = true;
    if (idx < sectionKeys.length - 1) {
      btnNext.hidden = false;
    } else {
      btnFinish.hidden = false;
    }
  }

  function onPrev() {
    if (idx === 0) return;
    idx -= 1;
    renderCurrentSection();
    // Restore prior feedback if section was already graded
    const prior = sectionResults[idx];
    if (prior) {
      stageEl.querySelectorAll('input, textarea, select').forEach(el => {
        const key = el.getAttribute('data-q-key');
        const stored = prior.perKey.get(key);
        if (!stored) return;
        if (el.type === 'radio') {
          if (_normalize(el.value) === _normalize(stored.userValue)) el.checked = true;
        } else {
          el.value = stored.userValue || '';
        }
        el.disabled = true;
      });
      showFeedback(prior.perKey);
      btnCheck.hidden = true;
      btnNext.hidden = idx === sectionKeys.length - 1;
      btnFinish.hidden = idx !== sectionKeys.length - 1;
    }
  }

  function onNext() {
    if (idx >= sectionKeys.length - 1) return;
    idx += 1;
    renderCurrentSection();
  }

  function onFinish() {
    clearInterval(timerInterval);
    if (timerEl) timerEl.hidden = true;
    stageEl.innerHTML = buildSummaryHtml(paper, sectionResults);
    stepperEl.innerHTML = '';
    btnPrev.hidden = true;
    btnCheck.hidden = true;
    btnNext.hidden = true;
    btnFinish.hidden = true;
    stageEl.querySelectorAll('[data-action="retry"]').forEach(b => b.addEventListener('click', () => {
      idx = 0;
      sectionResults.length = 0;
      renderCurrentSection();
    }));
    stageEl.querySelectorAll('[data-action="close"]').forEach(b => b.addEventListener('click', () => onClose?.()));
  }

  // Event delegation for practise-link buttons (work in both feedback + summary)
  container.addEventListener('click', (e) => {
    const target = e.target;
    if (target instanceof HTMLElement && target.matches('[data-related]')) {
      const t = target.getAttribute('data-related');
      if (t && onPractiseSkill) onPractiseSkill(t);
    }
  });

  btnPrev.addEventListener('click', onPrev);
  btnCheck.addEventListener('click', onCheck);
  btnNext.addEventListener('click', onNext);
  btnFinish.addEventListener('click', onFinish);
  btnExit.addEventListener('click', () => onClose?.());

  // Countdown timer — only active in Test Mode
  if (mode === 'test' && timerEl) {
    const durationMs = parseDurationMs(paper.duration || '');
    if (durationMs > 0) {
      const startedAt = Date.now();
      const WARN_THRESHOLD = 5 * 60_000; // 5 minutes

      const tick = () => {
        const remaining = durationMs - (Date.now() - startedAt);
        if (remaining <= 0) {
          clearInterval(timerInterval);
          timerEl.textContent = '⏰ Time\'s up!';
          timerEl.className = 'ptg-timer ptg-timer--up';
          timerEl.setAttribute('aria-live', 'assertive');
          // Grade the current section silently if not already done
          if (!sectionResults[idx]) {
            const key = sectionKeys[idx];
            const section = paper[key];
            const result = gradeSection(stageEl, key, section);
            sectionResults[idx] = { ...result, title: section.title, key };
          }
          onFinish();
          return;
        }
        timerEl.textContent = '⏱ ' + formatRemaining(remaining);
        if (remaining <= WARN_THRESHOLD) {
          timerEl.classList.add('ptg-timer--warn');
          if (remaining <= WARN_THRESHOLD && !timerEl.dataset.warnAnnounced) {
            timerEl.dataset.warnAnnounced = '1';
            timerEl.setAttribute('aria-live', 'polite');
            // One-shot announcement; revert so subsequent ticks stay quiet
            setTimeout(() => timerEl.setAttribute('aria-live', 'off'), 2000);
          }
        }
      };

      timerEl.hidden = false;
      tick(); // render immediately before first interval fires
      timerInterval = setInterval(tick, 1000);
    }
  }

  renderCurrentSection();
}

/**
 * Build a launcher card for a level: shows a list of available papers and
 * lets the student start any one.  Designed to slot into the existing
 * primary-placeholder body.
 */
export function buildPaperLauncherHtml({ level, papers, intro }) {
  const cards = papers.map(p => `
    <article class="ptg-launcher-card" data-paper-id="${escapeAttr(p.id)}">
      <h4>${escapeHtml(p.label)}</h4>
      <p><small>${escapeHtml(p.duration)} · ${p.totalMarks} marks</small></p>
      <p>${escapeHtml(p.blurb || '')}</p>
      <button class="btn btn--primary" data-start-paper="${escapeAttr(p.id)}" type="button">Start paper</button>
    </article>`).join('');
  return `
    <div class="ptg-mode-picker" role="group" aria-label="Select paper mode">
      <button class="ptg-mode-btn ptg-mode-btn--active" data-mode="practice" type="button">🎯 Practice</button>
      <button class="ptg-mode-btn" data-mode="test" type="button">⏱ Test Mode</button>
    </div>
    <p>${escapeHtml(intro || "Pick a paper to take the test interactively. Every section is scored — at the end you’ll see which skills to drill.")}</p>
    <div class="ptg-launcher-grid" data-level="${escapeAttr(level)}">${cards}</div>`;
}
