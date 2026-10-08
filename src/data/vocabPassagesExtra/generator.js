import { VOCAB_CATEGORIES } from '../vocabCategories.js';
import { MIN_QUESTIONS_PER_SCOPE, passageLead, contextualTitle } from '../practiceExpansion.js';
import { GENERATED_BANKS } from './authored.js';
import { LEXICON } from './lexicon.js';

const LEVELS = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'];

const CATEGORY_SHORT = {
  contextInference: 'ci', definitionMatch: 'dm', synonymContrast: 'sc', morphologicalAffix: 'ma',
  collocationCloze: 'cc', grammaticalRole: 'gr', connectorClue: 'cn', idiomaticExpressions: 'ie',
  proverbsSayings: 'ps', scienceTechTerms: 'st', socialStudiesVocab: 'ss', grammarPrepositions: 'gp',
  grammarArticles: 'ga', grammarSVA: 'gs',
};

/**
 * P1–P3 share the lower bank and P4–P6 the upper one, so the answer words
 * grow with the child instead of repeating from P1 to P6.
 */
const BAND = { p1: 'lower', p2: 'lower', p3: 'lower', p4: 'upper', p5: 'upper', p6: 'upper' };

function bankFor(category, level) {
  return GENERATED_BANKS[category]?.[BAND[level]];
}

const CONTEXTS = {
  p1: ['recess', 'reading corner', 'morning assembly', 'class duty', 'playground break', 'library period'],
  p2: ['science lesson', 'school garden', 'PE period', 'music rehearsal', 'lunch queue', 'bus ride home'],
  p3: ['group project', 'show-and-tell', 'museum trip', 'CCA training', 'community visit', 'art workshop'],
  p4: ['inquiry task', 'service-learning day', 'debate practice', 'camp briefing', 'lab activity', 'journal writing'],
  p5: ['exam revision', 'leadership camp', 'heritage project', 'STEM challenge', 'presentation prep', 'peer coaching'],
  p6: ['PSLE revision', 'research forum', 'class leadership meeting', 'science consultation', 'community proposal', 'study clinic'],
};

const TITLE_SEEDS = {
  contextInference: ['Rainy Corridor', 'After-School Dash', 'Unexpected Shower', 'Shelter First'],
  definitionMatch: ['Places in School', 'Campus Map Clues', 'Where We Go', 'School Spaces'],
  synonymContrast: ['Tone and Manners', 'Word Opposites', 'Feeling and Behaviour', 'Choosing the Right Shade'],
  morphologicalAffix: ['Word Parts at Work', 'Prefix and Suffix Clues', 'Build the Word', 'Affix Detective'],
  collocationCloze: ['Natural Word Partners', 'Phrases That Fit', 'Everyday Collocations', 'Best Pairing'],
  grammaticalRole: ['Form in Context', 'Noun or Adverb?', 'Word Form Choice', 'Role in the Sentence'],
  connectorClue: ['Signal Word Meaning', 'Because and Although', 'Reason and Contrast Clues', 'Connector Evidence'],
  idiomaticExpressions: ['Figurative Meaning', 'Idiom in Context', 'What It Really Means', 'School Idioms'],
  proverbsSayings: ['Wisdom in Action', 'Meaning Behind the Saying', 'Proverb Context', 'Advice from Elders'],
  scienceTechTerms: ['Lab and Tech Vocabulary', 'Science in School', 'Data and Devices', 'Investigation Terms'],
  socialStudiesVocab: ['Community Matters', 'Active Citizenship', 'People and Policies', 'Heritage and Leadership'],
  grammarPrepositions: ['Location Clues', 'Where Things Are', 'Position in School', 'Place and Space'],
  grammarArticles: ['Article Choice', 'Specific or General?', 'Noun Starters', 'Choosing a/an/the'],
  grammarSVA: ['Subject and Verb Match', 'Agreement in Action', 'Singular or Plural?', 'Correct Verb Form'],
};

function makeDefinition(word) {
  const key = String(word || '').toLowerCase();
  if (!LEXICON[key]) throw new Error(`[vocabPassagesExtra] Missing lexicon definition for word: "${word}"`);
  return LEXICON[key][1];
}

function makePos(word) {
  const key = String(word || '').toLowerCase();
  if (!LEXICON[key]) throw new Error(`[vocabPassagesExtra] Missing lexicon part-of-speech for word: "${word}"`);
  return LEXICON[key][0];
}

function pick(level, idx, arr) {
  return arr[(idx + LEVELS.indexOf(level)) % arr.length];
}

/** The index `pick` would return for an array of this length. */
function pickIndex(level, idx, length) {
  return (idx + LEVELS.indexOf(level)) % length;
}

/**
 * Build one passage body, and say which of the generator's fixed parts made it.
 *
 * Audit 2026-09-19, finding 12: the body is a template with a school context
 * dropped into it, so two passages built from the same template and context
 * are the same passage with a different lead sentence. The returned
 * `seedKey` is what makes the repeat visible to the counters — see
 * `practiceSeeds.js`.
 *
 * The template advances with every passage and the context every
 * `templates.length` passages, so each template meets each context instead of
 * template and context always moving together.
 *
 * @returns {{text: string, seedKey: string, template: object}}
 */
function makeText(category, level, idx) {
  const { templates } = bankFor(category, level);
  const templateIdx = pickIndex(level, idx, templates.length);
  const contextIdx = pickIndex(level, Math.floor(idx / templates.length), CONTEXTS[level].length);
  const template = templates[templateIdx];
  const body = template.body.replace('{context}', CONTEXTS[level][contextIdx]);
  return {
    text: `${passageLead(idx)} ${body}`,
    seedKey: `t${templateIdx}c${contextIdx}`,
    template,
  };
}

const wordsOf = (str) =>
  String(str)
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.replace(/^[^a-z]+|[^a-z]+$/g, ''))
    .filter(Boolean);

/** Throw at build time if a clue names a word the child cannot find in the passage. */
function assertCluesInText(category, level, template, text) {
  const present = new Set(wordsOf(text));
  for (const c of template.clues) {
    for (const span of [...c.spans, ...c.partial]) {
      const missing = wordsOf(span).filter((w) => !present.has(w));
      if (missing.length) {
        throw new Error(
          `[vocabPassagesExtra] ${category}/${level}: clue "${span}" names words not in the passage: ${missing.join(', ')}`,
        );
      }
    }
  }
}

function buildLearningAids(category, template) {
  const aidMap = {
    contextInference: {
      hint: 'Use setting and cause clues around the blank to infer meaning.',
      prompt: 'Which nearby setting detail (weather/place/action) points to the correct word?',
      clueType: 'setting-cause-clue',
      explanation: 'The surrounding setting details narrow the meaning to one suitable word.',
    },
    definitionMatch: {
      hint: 'Match each blank to the sentence definition of that place or concept.',
      prompt: 'Which sentence phrase defines what this place/word is used for?',
      clueType: 'definition-in-context',
      explanation: 'The sentence itself gives a child-friendly definition that matches one option.',
    },
    synonymContrast: {
      hint: 'Look for tone clues that signal similar or opposite meaning.',
      prompt: 'Which phrase signals a positive/negative contrast that guides the word choice?',
      clueType: 'synonym-contrast-clue',
      explanation: 'Contrast and tone clues show whether the answer should be close in meaning or opposite.',
    },
    morphologicalAffix: {
      hint: 'Use prefix/suffix clues to decide the correct word form and meaning.',
      prompt: 'Which part of the sentence hints at a prefix/suffix meaning (re-, -less, etc.)?',
      clueType: 'affix-word-formation',
      explanation: 'Word-part clues in context indicate the correct derived form.',
    },
    collocationCloze: {
      hint: 'Pick the word that naturally pairs with nearby words (collocation).',
      prompt: 'Which neighbouring words form a natural collocation with the answer?',
      clueType: 'collocation-clue',
      explanation: 'Only one option forms a natural word partnership in this context.',
    },
    grammaticalRole: {
      hint: 'Check the sentence frame for noun/adjective/adverb form.',
      prompt: 'Which surrounding words show the needed grammatical role here?',
      clueType: 'word-form-role',
      explanation: 'The sentence structure reveals the required part of speech.',
    },
    connectorClue: {
      hint: 'Use connector logic (although/because/since) to infer meaning.',
      prompt: 'Which connector relationship (contrast/reason/result) gives the clue?',
      clueType: 'connector-logic-clue',
      explanation: 'The connector sets a logic relationship that points to the best vocabulary choice.',
    },
    idiomaticExpressions: {
      hint: 'Use whole-situation clues to infer figurative meaning.',
      prompt: 'Which event in the sentence reveals the idiom’s intended meaning?',
      clueType: 'idiom-context-clue',
      explanation: 'The scenario context, not literal words, signals the idiom meaning.',
    },
    proverbsSayings: {
      hint: 'Infer the proverb meaning from actions and outcomes in the scenario.',
      prompt: 'Which outcome in the situation reflects the proverb’s lesson?',
      clueType: 'proverb-lesson-clue',
      explanation: 'The situation demonstrates the proverb’s message and supports one answer.',
    },
    scienceTechTerms: {
      hint: 'Use experiment/device clues to infer the science or tech term.',
      prompt: 'Which experiment or device detail in the sentence identifies the term?',
      clueType: 'science-tech-context',
      explanation: 'Lab and device evidence in the sentence identifies the precise technical word.',
    },
    socialStudiesVocab: {
      hint: 'Use citizenship/community clues to infer the social studies word.',
      prompt: 'Which civic action or leadership detail gives the strongest clue?',
      clueType: 'civic-context-clue',
      explanation: 'Community and citizenship details point to the correct social studies vocabulary.',
    },
    grammarPrepositions: {
      hint: 'Use location/position clues to choose the preposition.',
      prompt: 'Which place relationship in the sentence guides the preposition choice?',
      clueType: 'preposition-location-clue',
      explanation: 'Relative position words in the sentence indicate the correct preposition.',
    },
    grammarArticles: {
      hint: 'Use noun sound and specificity clues for article choice.',
      prompt: 'Which noun sound or specificity clue decides a/an/the here?',
      clueType: 'article-sound-specificity',
      explanation: 'Vowel/consonant sound and specific reference clues determine the right article.',
    },
    grammarSVA: {
      hint: 'Use subject number clues to choose the correct verb form.',
      prompt: 'Which subject in this clause controls subject-verb agreement?',
      clueType: 'subject-verb-agreement-clue',
      explanation: 'The subject’s number/person determines the matching verb form.',
    },
  };
  const aid = aidMap[category] || aidMap.contextInference;

  return template.clues.map((c, i) => ({
    hint: `Blank ${i + 1}: ${aid.hint}`,
    clue: {
      blankIndex: i,
      prompt: aid.prompt,
      acceptableSpans: [...c.spans],
      partialSpans: [...c.partial],
      clueType: aid.clueType,
      explanation: c.why,
    },
  }));
}

function buildPassage(category, level, idx) {
  const core = bankFor(category, level);
  const { text, seedKey, template } = makeText(category, level, idx);
  assertCluesInText(category, level, template, text);
  const wordBank = [...core.answers, ...core.distractors];
  const learning = buildLearningAids(category, template);
  const definitions = Object.fromEntries(wordBank.map((w) => [w, makeDefinition(w)]));
  const partOfSpeechMap = Object.fromEntries(wordBank.map((w) => [w, makePos(w)]));
  const short = CATEGORY_SHORT[category];
  const levelNum = level.replace('p', '');
  const titleSeed = pick(level, idx, TITLE_SEEDS[category]);

  return {
    id: `vxg-${short}-p${levelNum}-${String(idx + 1).padStart(2, '0')}`,
    // Two passages sharing a seed share their body and their answers; only
    // the lead sentence and the title differ.
    seedId: `vxs-${short}-p${levelNum}-${seedKey}`,
    title: `${titleSeed} · ${contextualTitle(idx)} (${level.toUpperCase()})`,
    text,
    answers: [...core.answers],
    wordBank,
    hints: learning.map((l) => l.hint),
    clues: learning.map((l) => l.clue),
    definitions,
    partOfSpeechMap,
    xp: Number(levelNum) <= 2 ? 20 : Number(levelNum) <= 4 ? 30 : 40,
  };
}

export function buildExtraPassageBank(levels = []) {
  const out = {};
  for (const category of Object.keys(VOCAB_CATEGORIES)) {
    // Skip categories that don't have a generator bank (e.g. P1-only MCQ-only
    // categories such as collectiveNouns, soundVerbs, placeNouns).  These
    // categories are exercised through Vocabulary MCQ but don't have cloze
    // passages, so we omit them from the auto-generated extras.
    if (!GENERATED_BANKS[category]) continue;
    out[category] = {};
    for (const level of levels) {
      const passageCount = Math.ceil(MIN_QUESTIONS_PER_SCOPE / bankFor(category, level).answers.length);
      const built = Array.from({ length: passageCount }, (_, i) => buildPassage(category, level, i));
      // The first passage to present a body is that body's seed; the rest are
      // re-presentations of it. Rewriting the first one's seedId to its own id
      // keeps "is this a repeat?" answerable from the item alone.
      const firstForSeed = new Map();
      for (const passage of built) {
        if (!firstForSeed.has(passage.seedId)) {
          firstForSeed.set(passage.seedId, passage);
          passage.seedId = passage.id;
        } else {
          passage.seedId = firstForSeed.get(passage.seedId).id;
          passage.isVariant = true;
        }
      }
      out[category][level] = built;
    }
  }
  return out;
}
