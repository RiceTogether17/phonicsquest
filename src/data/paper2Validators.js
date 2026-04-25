/**
 * PhonicsQuest – Paper 2 Content Validators
 *
 * Shared schema validators for Paper 2 practice banks:
 *   - Grammar MCQ (GRAMMAR_MCQ_ITEMS)
 *   - Vocabulary MCQ (VOCAB_MCQ_ITEMS)
 *   - Grammar Cloze passages (passages)
 *   - Vocabulary Cloze passages (vocabPassages)
 *
 * Each validator returns an array of issue strings (empty = clean).  The tests
 * in paper2ContentIntegrity.test.js call these helpers so content contributors
 * get a clear failure message instead of a single opaque expect() line.
 *
 * These helpers are intentionally forgiving about legacy fields and focus on
 * structural invariants that the modes consume:
 *   - required fields present
 *   - blanks align with answers
 *   - answers are in the word bank / choices
 *   - categories are registered in the category spine
 *
 * Keep the logic dependency-light so validators can run under vitest without
 * importing DOM-touching modules.
 */

const GRAMMAR_MCQ_REQUIRED = ['id', 'level', 'category', 'subskill', 'difficulty', 'q', 'choices', 'answer', 'explain'];
const VOCAB_MCQ_REQUIRED   = ['id', 'level', 'category', 'subskill', 'difficulty', 'q', 'choices', 'answer', 'explain'];
const PASSAGE_REQUIRED     = ['id', 'text', 'answers', 'wordBank'];
const SPIRAL_LEVEL_KEYS    = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'];
const BANNED_PRACTICE_LEAKS = /(practice set|p1 practice|p2 practice|p3 practice|p4 practice|p5 practice|p6 practice|set 88)/i;

function _countBlanks(text) {
  return (String(text || '').match(/___/g) || []).length;
}

function _hasDupes(arr) {
  return new Set(arr).size !== arr.length;
}

function _hasCaseFoldDupes(arr) {
  const normalized = arr.map(v => String(v).trim().toLowerCase());
  return new Set(normalized).size !== normalized.length;
}

function _normalizeToken(value) {
  return String(value || '').trim().toLowerCase();
}

function _looksLikePlaceholderDefinition(word, definition) {
  const d = String(definition || '').trim().toLowerCase();
  const w = String(word || '').trim().toLowerCase();
  if (!d) return true;
  if (['definition unavailable', 'tbd', 'placeholder', 'todo', 'n/a', 'na'].includes(d)) return true;
  if (d === w) return true;
  if (d.length < 7 && d !== 'not wet.') return true;
  return false;
}

/**
 * Validate a single MCQ item.  Returns an array of issue strings.
 * @param {object} item
 * @param {{ required: string[], knownCategories: Set<string>, expectedLevel?: string }} ctx
 */
export function validateMcqItem(item, ctx) {
  const issues = [];
  const tag = item && item.id ? item.id : '(missing id)';
  if (!item || typeof item !== 'object') return [`${tag}: item is not an object`];

  for (const f of ctx.required) {
    if (item[f] === undefined || item[f] === null || item[f] === '') {
      issues.push(`${tag}: missing field "${f}"`);
    }
  }

  if (ctx.expectedLevel && item.level && item.level !== ctx.expectedLevel) {
    issues.push(`${tag}: level mismatch — expected ${ctx.expectedLevel}, got ${item.level}`);
  }

  if (item.id !== undefined && (typeof item.id !== 'string' || !item.id.trim())) {
    issues.push(`${tag}: id must be a non-empty string`);
  }
  if (item.q !== undefined && (typeof item.q !== 'string' || !item.q.trim())) {
    issues.push(`${tag}: q must be a non-empty string`);
  }
  if (item.explain !== undefined && (typeof item.explain !== 'string' || !item.explain.trim())) {
    issues.push(`${tag}: explain must be a non-empty string`);
  }
  if (item.subskill !== undefined && (typeof item.subskill !== 'string' || !item.subskill.trim())) {
    issues.push(`${tag}: subskill must be a non-empty string`);
  }

  if (typeof item.difficulty === 'number' && ![1, 2, 3].includes(item.difficulty)) {
    issues.push(`${tag}: difficulty must be 1, 2 or 3 (got ${item.difficulty})`);
  }

  if (item.category && ctx.knownCategories && !ctx.knownCategories.has(item.category)) {
    issues.push(`${tag}: unknown category "${item.category}"`);
  }

  if (Array.isArray(item.choices)) {
    if (item.choices.length !== 4) {
      issues.push(`${tag}: choices must have exactly 4 options (got ${item.choices.length})`);
    }
    if (_hasDupes(item.choices)) {
      issues.push(`${tag}: duplicate choices`);
    }
    if (_hasCaseFoldDupes(item.choices)) {
      issues.push(`${tag}: duplicate choices after case/space normalization`);
    }
    if (item.answer !== undefined && !item.choices.includes(item.answer)) {
      issues.push(`${tag}: answer "${item.answer}" is not in choices`);
    }
    for (const c of item.choices) {
      if (typeof c !== 'string' || !c.trim()) {
        issues.push(`${tag}: non-string or empty choice`);
        break;
      }
    }
  } else if (item.choices !== undefined) {
    issues.push(`${tag}: choices must be an array`);
  }

  if (item.answer !== undefined && (typeof item.answer !== 'string' || !item.answer.trim())) {
    issues.push(`${tag}: answer must be a non-empty string`);
  }

  if (typeof item.q === 'string') {
    const blanks = _countBlanks(item.q);
    if (blanks !== 1) {
      issues.push(`${tag}: question stem must contain exactly one "___" blank (found ${blanks})`);
    }
    if (BANNED_PRACTICE_LEAKS.test(item.q)) {
      issues.push(`${tag}: question contains banned internal practice label text`);
    }
    if (!/[.?!]$/.test(item.q.trim())) {
      issues.push(`${tag}: question should end with natural sentence punctuation`);
    }
  }

  return issues;
}

/**
 * Validate a single cloze passage.  Returns an array of issue strings.
 * @param {object} p
 * @param {{ knownCategories: Set<string>, category?: string, level?: string }} ctx
 */
export function validateClozePassage(p, ctx = {}) {
  const issues = [];
  const tag = p && p.id ? p.id : '(missing id)';
  if (!p || typeof p !== 'object') return [`${tag}: passage is not an object`];
  const strictQuality = Boolean(ctx?.strictQuality);

  for (const f of PASSAGE_REQUIRED) {
    if (p[f] === undefined || p[f] === null) {
      issues.push(`${tag}: missing field "${f}"`);
    }
  }

  if (!Array.isArray(p.answers)) {
    issues.push(`${tag}: answers must be an array`);
  }
  if (!Array.isArray(p.wordBank)) {
    issues.push(`${tag}: wordBank must be an array`);
  }

  const blanks = _countBlanks(p.text);
  if (BANNED_PRACTICE_LEAKS.test(String(p.text || '')) || BANNED_PRACTICE_LEAKS.test(String(p.title || ''))) {
    issues.push(`${tag}: passage contains banned internal practice label text`);
  }
  if (Array.isArray(p.answers)) {
    if (p.answers.length !== blanks) {
      issues.push(`${tag}: ${blanks} blank(s) in text but ${p.answers.length} answer(s)`);
    }
    for (const a of p.answers) {
      if (typeof a !== 'string' || !a.trim()) {
        issues.push(`${tag}: non-string or empty answer value`);
        break;
      }
    }
  }

  if (Array.isArray(p.wordBank) && Array.isArray(p.answers)) {
    for (const a of p.answers) {
      if (!p.wordBank.includes(a)) {
        issues.push(`${tag}: answer "${a}" is not present in wordBank`);
      }
    }
    if (p.wordBank.length < p.answers.length) {
      issues.push(`${tag}: wordBank shorter than answers`);
    }

    if (strictQuality) {
      const normalizedAnswers = p.answers.map(_normalizeToken);
      const normalizedWordBank = p.wordBank.map(_normalizeToken);

      if (_hasCaseFoldDupes(p.wordBank)) {
        issues.push(`${tag}: wordBank has duplicate entries after case/space normalization`);
      }
      if (_hasCaseFoldDupes(p.answers)) {
        issues.push(`${tag}: answers has duplicate entries after case/space normalization`);
      }
      if (p.wordBank.length < p.answers.length + 2) {
        issues.push(`${tag}: strict quality requires at least 2 distractors in wordBank`);
      }

      for (const wb of p.wordBank) {
        if (typeof wb !== 'string' || !wb.trim()) {
          issues.push(`${tag}: strict quality requires all wordBank entries to be non-empty strings`);
          break;
        }
      }

      const answerSet = new Set(normalizedAnswers);
      const distractors = normalizedWordBank.filter(token => !answerSet.has(token));
      if (distractors.length < 2) {
        issues.push(`${tag}: strict quality requires at least 2 non-answer distractors in wordBank`);
      }
    }
  }

  if (Array.isArray(p.clues)) {
    const answersLen = Array.isArray(p.answers) ? p.answers.length : 0;
    for (const clue of p.clues) {
      if (typeof clue?.blankIndex !== 'number' || clue.blankIndex < 0 || clue.blankIndex >= answersLen) {
        issues.push(`${tag}: clue.blankIndex out of range (${clue?.blankIndex})`);
      }
    }
  }

  if (ctx.knownCategories && ctx.category && !ctx.knownCategories.has(ctx.category)) {
    issues.push(`${tag}: unknown category "${ctx.category}"`);
  }

  return issues;
}

/**
 * Validate a full grammar MCQ bank keyed by level.
 */
export function validateGrammarMcqBank(bank, knownCategories) {
  const issues = [];
  const seenIds = new Set();
  for (const [level, items] of Object.entries(bank || {})) {
    if (!Array.isArray(items)) {
      issues.push(`Grammar MCQ ${level}: not an array`);
      continue;
    }
    for (const item of items) {
      if (item?.id) {
        if (seenIds.has(item.id)) issues.push(`Grammar MCQ: duplicate id "${item.id}"`);
        seenIds.add(item.id);
      }
      issues.push(...validateMcqItem(item, {
        required: GRAMMAR_MCQ_REQUIRED,
        knownCategories,
        expectedLevel: level,
      }));
    }
  }
  return issues;
}

/**
 * Validate a full vocab MCQ bank keyed by level.
 */
export function validateVocabMcqBank(bank, knownCategories) {
  const issues = [];
  const seenIds = new Set();
  for (const [level, items] of Object.entries(bank || {})) {
    if (!Array.isArray(items)) {
      issues.push(`Vocab MCQ ${level}: not an array`);
      continue;
    }
    for (const item of items) {
      if (item?.id) {
        if (seenIds.has(item.id)) issues.push(`Vocab MCQ: duplicate id "${item.id}"`);
        seenIds.add(item.id);
      }
      issues.push(...validateMcqItem(item, {
        required: VOCAB_MCQ_REQUIRED,
        knownCategories,
        expectedLevel: level,
      }));
    }
  }
  return issues;
}

/**
 * Validate a grammar passages map (levels -> category -> passage[]).
 */
export function validateGrammarPassages(passagesMap, knownCategories, opts = {}) {
  const issues = [];
  const seenIds = new Set();
  for (const [level, cats] of Object.entries(passagesMap || {})) {
    for (const [catKey, arr] of Object.entries(cats || {})) {
      if (!Array.isArray(arr)) {
        issues.push(`Grammar passages ${level}/${catKey}: not an array`);
        continue;
      }
      if (knownCategories && !knownCategories.has(catKey)) {
        issues.push(`Grammar passages ${level}: unknown category "${catKey}"`);
      }
      for (const p of arr) {
        if (p?.id) {
          if (seenIds.has(p.id)) issues.push(`Grammar passages: duplicate id "${p.id}"`);
          seenIds.add(p.id);
        }
        issues.push(...validateClozePassage(p, {
          knownCategories,
          category: catKey,
          level,
          strictQuality: opts.strictQuality,
        }));
      }
    }
  }
  return issues;
}

/**
 * Validate a vocab passages map (category -> level -> passage[]).
 */
export function validateVocabPassages(vocabMap, knownCategories, opts = {}) {
  const issues = [];
  const seenIds = new Set();
  const strictQuality = Boolean(opts?.strictQuality);
  const requireLearningAids = Boolean(opts?.requireLearningAids);

  for (const [catKey, levels] of Object.entries(vocabMap || {})) {
    if (knownCategories && !knownCategories.has(catKey)) {
      issues.push(`Vocab passages: unknown category "${catKey}"`);
    }
    for (const [lv, arr] of Object.entries(levels || {})) {
      if (!Array.isArray(arr)) {
        issues.push(`Vocab passages ${catKey}/${lv}: not an array`);
        continue;
      }
      for (const p of arr) {
        if (p?.id) {
          if (seenIds.has(p.id)) issues.push(`Vocab passages: duplicate id "${p.id}"`);
          seenIds.add(p.id);
        }
        issues.push(...validateClozePassage(p, {
          knownCategories,
          category: catKey,
          level: lv,
          strictQuality,
        }));

        if (requireLearningAids) {
          if (!Array.isArray(p?.hints)) {
            issues.push(`${p?.id || 'missing-id'}: hints must be an array`);
          } else if (Array.isArray(p?.answers) && p.hints.length !== p.answers.length) {
            issues.push(`${p?.id || 'missing-id'}: hints length must match answers length`);
          } else {
            p.hints.forEach((h, idx) => {
              if (typeof h !== 'string' || !h.trim()) {
                issues.push(`${p?.id || 'missing-id'}: hints[${idx}] must be a non-empty string`);
              }
            });
          }

          if (!Array.isArray(p?.clues)) {
            issues.push(`${p?.id || 'missing-id'}: clues must be an array`);
          } else if (Array.isArray(p?.answers) && p.clues.length !== p.answers.length) {
            issues.push(`${p?.id || 'missing-id'}: clues length must match answers length`);
          } else {
            const seenBlankIndexes = new Set();
            p.clues.forEach((clue, idx) => {
              const tag = `${p?.id || 'missing-id'} clues[${idx}]`;
              if (typeof clue?.blankIndex !== 'number') issues.push(`${tag}: blankIndex must be a number`);
              if (seenBlankIndexes.has(clue?.blankIndex)) issues.push(`${tag}: duplicate blankIndex ${clue?.blankIndex}`);
              seenBlankIndexes.add(clue?.blankIndex);
              if (typeof clue?.prompt !== 'string' || !clue.prompt.trim()) issues.push(`${tag}: prompt must be non-empty string`);
              if (typeof clue?.explanation !== 'string' || !clue.explanation.trim()) issues.push(`${tag}: explanation must be non-empty string`);
              if (!Array.isArray(clue?.acceptableSpans) || !clue.acceptableSpans.length) issues.push(`${tag}: acceptableSpans must be non-empty array`);
              if (!Array.isArray(clue?.partialSpans) || !clue.partialSpans.length) issues.push(`${tag}: partialSpans must be non-empty array`);
              if (typeof clue?.clueType !== 'string' || !clue.clueType.trim()) issues.push(`${tag}: clueType must be non-empty string`);
              for (const span of clue?.acceptableSpans || []) {
                if (typeof span !== 'string' || !span.trim()) issues.push(`${tag}: acceptableSpans must contain non-empty strings`);
                else if (!String(p?.text || '').toLowerCase().includes(span.trim().toLowerCase())) {
                  issues.push(`${tag}: acceptable span "${span}" not found in passage text`);
                }
              }
              for (const span of clue?.partialSpans || []) {
                if (typeof span !== 'string' || !span.trim()) issues.push(`${tag}: partialSpans must contain non-empty strings`);
              }
            });

            if (Array.isArray(p?.answers)) {
              for (let i = 0; i < p.answers.length; i += 1) {
                if (!seenBlankIndexes.has(i)) issues.push(`${p?.id || 'missing-id'}: missing clue for blankIndex ${i}`);
              }
            }
          }

          if (!p?.definitions || typeof p.definitions !== 'object') {
            issues.push(`${p?.id || 'missing-id'}: definitions object is required`);
          } else {
            for (const wb of p?.wordBank || []) {
              if (!(wb in p.definitions)) {
                issues.push(`${p?.id || 'missing-id'}: missing definition for "${wb}"`);
              } else if (_looksLikePlaceholderDefinition(wb, p.definitions[wb])) {
                issues.push(`${p?.id || 'missing-id'}: definition for "${wb}" looks like a placeholder`);
              }
            }
          }

          if (!p?.partOfSpeechMap || typeof p.partOfSpeechMap !== 'object') {
            issues.push(`${p?.id || 'missing-id'}: partOfSpeechMap object is required`);
          } else {
            for (const wb of p?.wordBank || []) {
              const pos = p.partOfSpeechMap[wb];
              if (typeof pos !== 'string' || !pos.trim()) {
                issues.push(`${p?.id || 'missing-id'}: missing partOfSpeechMap entry for "${wb}"`);
              }
            }
          }
        }
      }
    }
  }
  return issues;
}

/**
 * Count items by category within an MCQ bank — useful for coverage reports.
 * @returns {{ [level]: { [category]: number } }}
 */
export function countMcqCategories(bank) {
  const out = {};
  for (const [level, items] of Object.entries(bank || {})) {
    out[level] = {};
    for (const it of items || []) {
      out[level][it.category] = (out[level][it.category] || 0) + 1;
    }
  }
  return out;
}

/**
 * Detect duplicate MCQ prompts after whitespace/case normalization.
 * Helps prevent accidental clone stems in large content expansions.
 */
export function validateUniqueMcqPrompts(bank, label = 'MCQ') {
  const issues = [];
  const seen = new Map();

  for (const [level, items] of Object.entries(bank || {})) {
    for (const item of items || []) {
      const normalized = String(item?.q || '')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
      if (!normalized) continue;
      const prev = seen.get(normalized);
      if (prev) {
        issues.push(`${label}: duplicate prompt "${item?.q}" (${prev} vs ${item?.id || 'missing-id'})`);
      } else {
        seen.set(normalized, item?.id || `${level}-missing-id`);
      }
    }
  }

  return issues;
}

/**
 * Heuristic guardrails for ambiguity-prone vocabulary MCQs.
 * Focuses on upper-primary contextual discrimination items.
 */
export function validateVocabMcqDiscrimination(bank) {
  const issues = [];
  const targetLevels = new Set(['P5', 'P6']);
  const targetCats = new Set(['contextInference', 'synonymContrast', 'collocationCloze', 'connectorClue']);

  for (const [level, items] of Object.entries(bank || {})) {
    if (!targetLevels.has(level)) continue;
    for (const item of items || []) {
      if (!targetCats.has(item?.category)) continue;
      if ((item?.difficulty || 0) < 3) continue;
      const q = String(item?.q || '').trim();
      const wc = q.split(/\s+/).filter(Boolean).length;
      if (wc < 6) {
        issues.push(`${item?.id || 'missing-id'}: upper-primary high-difficulty vocab stem should provide richer context (min 6 words)`);
      }
    }
  }
  return issues;
}

/**
 * Validate Paper Mode playlists + item count maps.
 * Keeps section routing stable for Paper Mode launcher and MCQ caps.
 *
 * @param {{
 *   levels: string[],
 *   playlists: Record<string, string[]>,
 *   sectionLabels: Record<string, string>,
 *   itemCounts: Record<string, Record<string, number|null>>
 * }} cfg
 */
export function validatePaperModeConfig(cfg) {
  const issues = [];
  const levels = Array.isArray(cfg?.levels) ? cfg.levels : [];
  const playlists = cfg?.playlists || {};
  const sectionLabels = cfg?.sectionLabels || {};
  const itemCounts = cfg?.itemCounts || {};

  for (const lv of levels) {
    const seq = playlists[lv];
    if (!Array.isArray(seq)) {
      issues.push(`Paper playlists ${lv}: not an array`);
      continue;
    }
    if (!seq.length) issues.push(`Paper playlists ${lv}: empty sequence`);
    if (_hasDupes(seq)) issues.push(`Paper playlists ${lv}: duplicate section keys`);

    for (const section of seq) {
      if (!sectionLabels[section]) {
        issues.push(`Paper playlists ${lv}: unknown section "${section}" (missing label)`);
      }
    }

    const caps = itemCounts[lv];
    if (!caps || typeof caps !== 'object') {
      issues.push(`Paper item counts ${lv}: missing`);
      continue;
    }

    for (const section of seq) {
      if (!(section in caps)) {
        issues.push(`Paper item counts ${lv}: missing key for "${section}"`);
        continue;
      }
      const value = caps[section];
      if (value !== null && (!Number.isInteger(value) || value <= 0)) {
        issues.push(`Paper item counts ${lv}/${section}: expected positive integer or null (got ${value})`);
      }
    }
  }

  return issues;
}

/**
 * Validate Spiral Grammar matrix structure (level coverage + required fields).
 * This guards the curriculum map consumed by recommendation / planning logic.
 */
export function validateSpiralGrammarMatrix(matrix, knownCategories = null) {
  const issues = [];
  for (const [strand, levels] of Object.entries(matrix || {})) {
    if (knownCategories && !knownCategories.has(strand)) {
      issues.push(`Spiral matrix: unknown strand "${strand}"`);
    }
    if (!levels || typeof levels !== 'object') {
      issues.push(`Spiral matrix ${strand}: invalid level map`);
      continue;
    }

    const presentLevels = SPIRAL_LEVEL_KEYS.filter(lv => levels[lv] && typeof levels[lv] === 'object');
    if (!presentLevels.length) {
      issues.push(`Spiral matrix ${strand}: no valid level nodes`);
      continue;
    }
    const startIdx = SPIRAL_LEVEL_KEYS.indexOf(presentLevels[0]);

    for (let i = startIdx; i < SPIRAL_LEVEL_KEYS.length; i++) {
      const lv = SPIRAL_LEVEL_KEYS[i];
      const node = levels[lv];
      if (!node || typeof node !== 'object') {
        issues.push(`Spiral matrix ${strand}: missing ${lv}`);
        continue;
      }
      for (const f of ['label', 'focus', 'keyForms', 'questionDemand']) {
        if (node[f] === undefined || node[f] === null || node[f] === '') {
          issues.push(`Spiral matrix ${strand}/${lv}: missing "${f}"`);
        }
      }
      if (!Array.isArray(node.keyForms) || node.keyForms.length === 0) {
        issues.push(`Spiral matrix ${strand}/${lv}: keyForms must be a non-empty array`);
      }
    }
  }
  return issues;
}
