/**
 * PhonicsQuest – Ask Giri
 *
 * A constrained question box: instead of free chat, the child picks from
 * question chips generated from their own recent mistakes ("Explain past
 * tense to me"). Every chip has an authored offline answer (the same
 * rule/example/tip cards used in the teach-back loops), and — when a Gemini
 * key is configured — an optional richer elaboration through the
 * aiGuardrails child-safety layer.
 *
 * P4–P6 profiles may also type a free question; it goes through the same
 * guarded persona, which refuses anything that isn't English learning.
 */

import { getRecentMistakes } from './mistakesDen.js';
import { GRAMMAR_TIPS, getGrammarTip } from '../data/grammarTips.js';
import { GRAMMAR_CATEGORIES } from '../data/grammarCategories.js';
import { VOCAB_CATEGORIES } from '../data/vocabCategories.js';

/** Quests whose skill keys are grammar categories. */
const GRAMMAR_QUESTS = new Set([
  'grammarMcq',
  'clozeCastle',
  'editingQuest',
  'sentenceForge',
  'synthesisQuest',
]);
/** Quests whose skill keys are vocabulary categories. */
const VOCAB_QUESTS = new Set(['vocabMcq', 'wordVault']);

/** Default chips when there are no recent mistakes to draw on. */
const STARTER_CHIPS = [
  { skillKey: 'svAgreement', domain: 'grammar' },
  { skillKey: 'simplePast', domain: 'grammar' },
  { skillKey: 'contextInference', domain: 'vocab' },
];

function _skillFromMistake(m) {
  // quest mistake ids look like `quest:<moduleKey>:<skillKey>`
  if (m.kind !== 'quest') return null;
  const skillKey = m.id.split(':')[2];
  if (!skillKey || skillKey === 'general') return null;

  if (GRAMMAR_QUESTS.has(m.moduleKey) && GRAMMAR_TIPS[skillKey]) {
    return { skillKey, domain: 'grammar' };
  }
  if (VOCAB_QUESTS.has(m.moduleKey) && VOCAB_CATEGORIES[skillKey]) {
    return { skillKey, domain: 'vocab' };
  }
  // Grammar skill keys can also surface from mixed quests
  if (GRAMMAR_TIPS[skillKey]) return { skillKey, domain: 'grammar' };
  if (VOCAB_CATEGORIES[skillKey]) return { skillKey, domain: 'vocab' };
  return null;
}

function _labelFor(skillKey, domain) {
  if (domain === 'grammar') return GRAMMAR_CATEGORIES[skillKey]?.label || skillKey;
  return VOCAB_CATEGORIES[skillKey]?.label || skillKey;
}

/**
 * Build question chips from the child's recent mistakes (deduped, weakest
 * first), topped up with starter chips so the box is never empty.
 *
 * @param {{ limit?: number }} [opts]
 * @returns {Array<{ id: string, label: string, question: string,
 *                   skillKey: string, domain: 'grammar'|'vocab' }>}
 */
export function buildGiriQuestionChips({ limit = 6 } = {}) {
  const seen = new Set();
  const chips = [];

  const push = ({ skillKey, domain }) => {
    const id = `${domain}:${skillKey}`;
    if (seen.has(id) || chips.length >= limit) return;
    seen.add(id);
    const label = _labelFor(skillKey, domain);
    chips.push({
      id,
      skillKey,
      domain,
      label,
      question: `Can you explain ${label.toLowerCase()} to me?`,
    });
  };

  let mistakes = [];
  try {
    mistakes = getRecentMistakes();
  } catch (_) {
    /* fresh profile */
  }
  for (const m of mistakes) {
    const skill = _skillFromMistake(m);
    if (skill) push(skill);
    if (chips.length >= limit) break;
  }
  for (const starter of STARTER_CHIPS) {
    if (chips.length >= limit) break;
    push(starter);
  }
  return chips;
}

/**
 * The authored offline answer for a chip — always available, no key needed.
 * @param {{ skillKey: string, domain: string }} chip
 * @returns {{ rule: string, example: string, tip: string }}
 */
export function answerChipOffline(chip) {
  if (chip.domain === 'vocab') {
    const cat = VOCAB_CATEGORIES[chip.skillKey] || {};
    return {
      rule:
        cat.rule ||
        `${cat.label || chip.skillKey} questions test word meaning and usage in context.`,
      example: cat.example || 'Read the whole sentence and test each option in the blank.',
      tip: cat.tip || 'Look for clue words around the gap before choosing.',
    };
  }
  return getGrammarTip(chip.skillKey);
}

/**
 * Optional AI elaboration on a chip (null without key / capped / failure).
 * The authored answer is always shown first; this adds a fresh second
 * explanation in different words, which is what a tutor does when the
 * first explanation didn't click.
 *
 * @param {{ skillKey: string, domain: string, label: string }} chip
 * @returns {Promise<string|null>}
 */
export async function answerChipAi(chip) {
  const { askGiriConstrained } = await import('./aiGuardrails.js');
  const authored = answerChipOffline(chip);
  const prompt = `A primary school student tapped "Can you explain ${chip.label} to me?" after getting questions on this skill wrong recently.

The app already showed them this rule: "${authored.rule}"

Explain the same idea AGAIN but in different, even simpler words, with ONE new example sentence. Do not repeat the example "${authored.example}".`;

  return askGiriConstrained('ask', prompt, {
    maxTokens: 160,
    logSummary: `Ask: ${chip.label}`,
  });
}

/**
 * Free-text question (P4–P6 only — callers gate on level). Goes through the
 * guarded Giri persona, which only answers English-learning questions.
 *
 * @param {string} question
 * @returns {Promise<string|null>}
 */
export async function askGiriFreeText(question) {
  const q = String(question || '')
    .trim()
    .slice(0, 300);
  if (!q) return null;
  const { askGiriConstrained } = await import('./aiGuardrails.js');
  return askGiriConstrained(
    'ask',
    `The student asks: "${q}"

Answer the question if it is about English learning. Otherwise use your standard redirect line.`,
    {
      maxTokens: 160,
      logSummary: `Ask (typed): ${q.slice(0, 80)}`,
    },
  );
}
