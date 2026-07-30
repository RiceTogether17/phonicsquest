/**
 * PhonicsQuest – Remediation Router
 *
 * Builds targeted cross-module remediation chains when a child is weak
 * in a particular grammar or vocabulary skill.  Instead of just gating
 * progression, this module answers: "What should the child do NEXT to
 * strengthen this exact skill?"
 *
 * Design:
 *   1.  Identify weak skills (below mastery threshold).
 *   2.  For each weak skill, produce an ordered chain of quest activities
 *       that spiral from recognition → production → application.
 *   3.  Expose a simple API so any module (dashboard, end-of-quest screen,
 *       daily plan) can query the next best remediation step.
 *
 * Chain philosophy (grammar example):
 *   Grammar MCQ  →  Cloze Castle  →  Sentence Forge  →  Editing Quest
 *   (recognise)     (fill-in)        (construct)         (spot & fix)
 *
 * Chain philosophy (vocabulary example):
 *   Vocab MCQ  →  Word Vault  →  Editing Quest  →  Writing Quest
 *   (recognise)   (contextual)   (spot misuse)     (produce)
 */

import { questMastery } from './questMastery.js';
import { store } from './store.js';
import { confidenceFor } from './evidence.js';
import { GRAMMAR_CATEGORIES } from '../data/grammarCategories.js';
import { VOCAB_CATEGORIES } from '../data/vocabCategories.js';

const WEAK_THRESHOLD = 0.6; // below this = needs remediation
const SHAKY_THRESHOLD = 0.75; // below this = could use reinforcement

// ── Quest chains by domain ─────────────────────────────────────────────

const GRAMMAR_CHAIN = [
  { quest: 'grammarMcq', label: 'Grammar MCQ', target: 'grammar-mcq', verb: 'Recognise' },
  { quest: 'clozeCastle', label: 'Cloze Castle', target: 'cloze-castle', verb: 'Apply in context' },
  {
    quest: 'sentenceForge',
    label: 'Sentence Forge',
    target: 'sentence-forge',
    verb: 'Build sentences',
  },
  {
    quest: 'editingQuest',
    label: 'Editing Quest',
    target: 'editing-quest',
    verb: 'Spot & fix errors',
  },
];

const VOCAB_CHAIN = [
  { quest: 'vocabMcq', label: 'Vocabulary MCQ', target: 'vocab-mcq', verb: 'Recognise' },
  { quest: 'wordVault', label: 'Word Vault', target: 'word-vault', verb: 'Use in context' },
  { quest: 'editingQuest', label: 'Editing Quest', target: 'editing-quest', verb: 'Spot misuse' },
  {
    quest: 'writingQuest',
    label: 'Writing Quest',
    target: 'writing-quest',
    verb: 'Produce in writing',
  },
];

// ── Helpers ─────────────────────────────────────────────────────────────

function _isGrammarSkill(skillKey) {
  return skillKey in GRAMMAR_CATEGORIES;
}

function _isVocabSkill(skillKey) {
  return skillKey in VOCAB_CATEGORIES;
}

function _chainFor(skillKey) {
  if (_isGrammarSkill(skillKey)) return GRAMMAR_CHAIN;
  if (_isVocabSkill(skillKey)) return VOCAB_CHAIN;
  // Fallback: check both MCQ buckets
  const gm = store.get('questMastery') || {};
  if (gm.grammarMcq?.[skillKey] !== undefined) return GRAMMAR_CHAIN;
  if (gm.vocabMcq?.[skillKey] !== undefined) return VOCAB_CHAIN;
  return GRAMMAR_CHAIN; // default
}

function _categoryLabel(skillKey) {
  return (
    GRAMMAR_CATEGORIES[skillKey]?.label ||
    VOCAB_CATEGORIES[skillKey]?.label ||
    skillKey.replace(/([A-Z])/g, ' $1').trim()
  );
}

// ── Public API ──────────────────────────────────────────────────────────

/**
 * Attempt counts and last-practised date per skill, from the questAttempts
 * telemetry log. questMastery itself is an EMA and carries no sample size,
 * so a score of 0.4 from two answers and one from forty look identical
 * without this.
 * @returns {Map<string, { attempts: number, lastPractised: string|null }>}
 */
function _sampleSizeBySkill() {
  const out = new Map();
  for (const a of store.get('questAttempts') || []) {
    if (!a?.skill) continue;
    const prev = out.get(a.skill) || { attempts: 0, lastPractised: null };
    prev.attempts++;
    if (a.timestamp && (!prev.lastPractised || a.timestamp > prev.lastPractised)) {
      prev.lastPractised = a.timestamp;
    }
    out.set(a.skill, prev);
  }
  return out;
}

/**
 * Get all skills below the weak threshold, sorted weakest-first.
 *
 * Each entry carries the sample size behind its score so callers can report
 * confidence instead of presenting every percentage as equally solid.
 *
 * Returns: [{ skill, score, domain, label, attempts, lastPractised, confidence }]
 */
export function getWeakSkills() {
  const mastery = store.get('questMastery') || {};
  const samples = _sampleSizeBySkill();
  const results = [];

  for (const [_questKey, bucket] of Object.entries(mastery)) {
    if (!bucket || typeof bucket !== 'object') continue;
    for (const [skill, score] of Object.entries(bucket)) {
      if (typeof score !== 'number' || score >= WEAK_THRESHOLD) continue;
      // Deduplicate: keep the lowest score per skill across quests
      const existing = results.find((r) => r.skill === skill);
      if (existing) {
        if (score < existing.score) existing.score = score;
        continue;
      }
      const sample = samples.get(skill) || { attempts: 0, lastPractised: null };
      results.push({
        skill,
        score,
        domain: _isGrammarSkill(skill)
          ? 'grammar'
          : _isVocabSkill(skill)
            ? 'vocabulary'
            : 'unknown',
        label: _categoryLabel(skill),
        attempts: sample.attempts,
        lastPractised: sample.lastPractised,
        // Quest modes are objectively scored — no self-report channel to
        // discount, so every recorded attempt is independent evidence.
        independentAttempts: sample.attempts,
        confidence: confidenceFor(sample.attempts),
      });
    }
  }

  return results.sort((a, b) => a.score - b.score);
}

/**
 * Build a full remediation chain for a specific skill.
 * Returns an ordered array of steps, each annotated with mastery status.
 *
 * [{ quest, label, target, verb, score, status }]
 *   status: 'weak' | 'shaky' | 'strong' | 'untried'
 */
export function getRemediationChain(skillKey) {
  const chain = _chainFor(skillKey);

  return chain.map((step) => {
    const score = questMastery.getSkillScore(step.quest, skillKey);
    let status = 'untried';
    const mastery = store.get('questMastery') || {};
    const bucket = mastery[step.quest] || {};
    if (skillKey in bucket) {
      status = score < WEAK_THRESHOLD ? 'weak' : score < SHAKY_THRESHOLD ? 'shaky' : 'strong';
    }
    return { ...step, score, status, skill: skillKey, skillLabel: _categoryLabel(skillKey) };
  });
}

/**
 * Get the single best next remediation step for a skill.
 * Finds the first step in the chain that is 'weak' or 'untried'.
 * If all steps are at least 'shaky', returns the weakest one.
 */
export function getNextRemediationStep(skillKey) {
  const chain = getRemediationChain(skillKey);

  // Prefer the first weak or untried step in chain order
  const needsWork = chain.find((s) => s.status === 'weak' || s.status === 'untried');
  if (needsWork) return needsWork;

  // Otherwise, return the shakiest step
  const shaky = chain.filter((s) => s.status === 'shaky');
  if (shaky.length) return shaky.sort((a, b) => a.score - b.score)[0];

  return null; // skill is strong across all modes
}

/**
 * Get up to `limit` prioritised remediation recommendations.
 * Each recommendation includes the weak skill and its next step.
 *
 * Returns: [{ skill, skillLabel, score, domain, nextStep }]
 */
export function getRemediationPlan(limit = 5) {
  const weakSkills = getWeakSkills();

  return weakSkills.slice(0, limit).map((ws) => {
    const nextStep = getNextRemediationStep(ws.skill);
    return {
      skill: ws.skill,
      skillLabel: ws.label,
      score: ws.score,
      domain: ws.domain,
      nextStep,
    };
  });
}

/**
 * After a quest attempt, check if the skill needs remediation and
 * return a suggestion for what to do next.  Intended to be called
 * from end-of-round screens.
 *
 * Returns null if the skill is healthy, or a recommendation object.
 */
export function checkPostAttempt(questKey, skillKey, wasCorrect) {
  if (wasCorrect) return null;

  const score = questMastery.getSkillScore(questKey, skillKey);
  if (score >= SHAKY_THRESHOLD) return null;

  const next = getNextRemediationStep(skillKey);
  if (!next || next.quest === questKey) {
    // Already in the right quest — just keep practising here
    return {
      type: 'retry',
      message: `Keep practising ${_categoryLabel(skillKey)} — you're building strength!`,
      skill: skillKey,
      skillLabel: _categoryLabel(skillKey),
    };
  }

  return {
    type: 'redirect',
    message: `Try ${next.label} to strengthen ${_categoryLabel(skillKey)}.`,
    skill: skillKey,
    skillLabel: _categoryLabel(skillKey),
    target: next.target,
    targetLabel: next.label,
    verb: next.verb,
  };
}
