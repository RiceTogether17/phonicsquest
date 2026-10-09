/**
 * writingChecks.js
 *
 * Checks the writing marker uses to tell real, on-topic writing from text
 * that only looks busy. Each one is something a child can read back and act
 * on, so every check returns what it found, not just a number.
 *
 *   - topicRelevance: does the draft use the words of the task?
 *   - englishShape:   does it read as English sentences, or a word list?
 *   - connectorLoad:  are the linking words joining ideas, or just piled up?
 *   - findGrammarSlips: common P1–P6 slips ("we seen", "they was", "eated"),
 *     each with the correction.
 */

import { phrasePattern } from './textMatch.js';

// ── Shared word lists ───────────────────────────────────────────────────────

// Words too common to say anything about a topic.
const STOP = new Set(
  (
    'about above after again also always another around away back because been before being ' +
    'below between both came come could does doing done down during each even every first from ' +
    'gave give going good great have having here into just know like little made make many more ' +
    'most much must never next only other over said same should some something than that their ' +
    'them then there these they thing things think this those through time told took very want ' +
    'was went were what when where which while will with would write your yours sentences ' +
    'sentence paragraph words short story letter email using include points practice focus ' +
    'clear extra connector improve choice vivid phrase boundaries one the and you her his ' +
    'are but for not had has all can our out who how its may she him get got say see use ' +
    'any too off own yet way why let put far few new old big lot try topic task'
  ).split(' '),
);

// Grammar words that appear in almost every English sentence. Linking words
// (and, but, because, then…) are left out on purpose: a list of them is
// exactly what padded nonsense looks like.
const FUNCTION_WORDS = new Set(
  (
    'the a an i me my mine we our us you your he him his she her it its they them their ' +
    'is am are was were be been being have has had do did does to of in on at for with from ' +
    'up down out into onto this that these those there here not no very all some can could ' +
    'will would should shall may might must what who how went got said saw came made took ' +
    'gave told felt looked like by as'
  ).split(' '),
);

const CONNECTORS = new Set(
  (
    'and but so or first then after next finally lastly because when while although if unless ' +
    'since before despite however therefore moreover consequently furthermore nevertheless ' +
    'meanwhile suddenly also'
  ).split(' '),
);

function _tokens(text) {
  return (
    String(text || '')
      .toLowerCase()
      .match(/[a-z]+(?:'[a-z]+)?/g) || []
  ).map((w) => w.replace(/'.*$/, ''));
}

// A light stem for topic matching only ("swings" ~ "swing", "played" ~
// "play"). Credit for specific required words still uses exact matching.
function _stem(word) {
  return word
    .replace(/(?:ies)$/, 'y')
    .replace(/(?:ing|ed|es|s)$/, '')
    .replace(/(.)\1$/, '$1');
}

function _contentWords(text) {
  return _tokens(text).filter((w) => w.length >= 3 && !STOP.has(w));
}

// ── Topic relevance ─────────────────────────────────────────────────────────

/**
 * The words that say what a task is about. Words from the task itself
 * (prompt, title) are "core"; words from the points to cover, the story
 * starters and the model answer widen the net.
 */
export function topicTerms(item = {}) {
  const prompt = String(item.prompt || '').replace(/\([^)]*\)/g, ' ');
  const core = [prompt, item.title, item.lessonTitle, item.pac?.context, item.taskBrief?.situation]
    .filter(Boolean)
    .join(' ');
  const wider = [
    ...(item.requiredPoints || []),
    ...(item.taskBrief?.points || []),
    ...(item.storyStarterChoices || []),
    ...(item.requiredChecks || []).flatMap((c) => c.keywordsAny || c.keywordsAll || []),
    ...(item.topicWords || []),
    item.sampleAnswer,
    item.context,
  ]
    .filter(Boolean)
    .join(' ');
  const coreStems = new Set(_contentWords(core).map(_stem));
  const widerStems = new Set(
    _contentWords(wider)
      .map(_stem)
      .filter((s) => !coreStems.has(s)),
  );
  return { core: coreStems, wider: widerStems };
}

/**
 * 0–1: how much of the draft's vocabulary belongs to the task. Core task
 * words count double. Returns the matched words so feedback can show them.
 */
export function topicRelevance(item, text) {
  const { core, wider } = topicTerms(item);
  if (!core.size && !wider.size) return { score: 1, matched: [], applicable: false };
  const stems = new Set(_contentWords(text).map(_stem));
  const coreHits = [...stems].filter((s) => core.has(s));
  const widerHits = [...stems].filter((s) => wider.has(s));
  let score = Math.min(1, (coreHits.length * 2 + widerHits.length) / 5);
  // Not one word of the task itself, and only a couple of the everyday words
  // its checks list ("long", "gentle"): that is another topic.
  if (core.size && !coreHits.length && widerHits.length < 4) score = Math.min(score, 0.25);
  return { score, matched: [...coreHits, ...widerHits], applicable: true };
}

/** A few words that name the task, for an off-topic message. */
export function topicLabel(item = {}) {
  const prompt = String(item.prompt || item.lessonTitle || item.title || '')
    .replace(/\([^)]*\)/g, ' ')
    .replace(/^.*?:\s*/, '');
  return prompt.trim().split(/\s+/).slice(0, 14).join(' ');
}

// ── English shape ───────────────────────────────────────────────────────────

/**
 * Share of words that are everyday grammar words (the, was, my, to…).
 * Real sentences sit around 0.3–0.5; made-up words strung together with
 * linking words sit near 0.
 */
export function englishShape(text) {
  const toks = _tokens(text);
  if (!toks.length) return { ratio: 0, looksLikeEnglish: false };
  const fn = toks.filter((w) => FUNCTION_WORDS.has(w)).length;
  const ratio = fn / toks.length;
  // Very short answers ("I like it.") are judged leniently.
  return { ratio, looksLikeEnglish: toks.length < 6 ? fn > 0 : ratio >= 0.14 };
}

/** Linking words as a share of all words. Above ~0.22 they are piled up. */
export function connectorLoad(text) {
  const toks = _tokens(text);
  if (!toks.length) return { ratio: 0, stuffed: false };
  const n = toks.filter((w) => CONNECTORS.has(w)).length;
  const ratio = n / toks.length;
  return { ratio, stuffed: toks.length >= 8 && ratio > 0.22 };
}

// ── Grammar slips ───────────────────────────────────────────────────────────

// Regular -ed added to an irregular verb.
const IRREGULAR_PAST = {
  goed: 'went',
  eated: 'ate',
  runned: 'ran',
  catched: 'caught',
  buyed: 'bought',
  bringed: 'brought',
  teached: 'taught',
  thinked: 'thought',
  sleeped: 'slept',
  swimmed: 'swam',
  falled: 'fell',
  drinked: 'drank',
  writed: 'wrote',
  taked: 'took',
  maked: 'made',
  gived: 'gave',
  comed: 'came',
  sitted: 'sat',
  standed: 'stood',
  finded: 'found',
  feeled: 'felt',
  keeped: 'kept',
  telled: 'told',
  sayed: 'said',
  knowed: 'knew',
  growed: 'grew',
  throwed: 'threw',
  drawed: 'drew',
  flied: 'flew',
  hided: 'hid',
  losed: 'lost',
  meeted: 'met',
  speaked: 'spoke',
  stealed: 'stole',
  winned: 'won',
  breaked: 'broke',
  choosed: 'chose',
  forgetted: 'forgot',
  getted: 'got',
  hitted: 'hit',
  hurted: 'hurt',
  cutted: 'cut',
  shutted: 'shut',
  leaved: 'left',
  freezed: 'froze',
  shaked: 'shook',
  waked: 'woke',
  blowed: 'blew',
  digged: 'dug',
  rided: 'rode',
  fighted: 'fought',
  holded: 'held',
  sended: 'sent',
  spended: 'spent',
  builded: 'built',
  becomed: 'became',
  begined: 'began',
  drived: 'drove',
  feeded: 'fed',
};

const PRONOUNS = ['i', 'we', 'you', 'they', 'he', 'she'];
// Words that make a following plain verb correct ("does he have", "to go").
const GUARD_BEFORE =
  /\b(?:did|does|do|doesn't|didn't|don't|will|would|can|could|should|shall|may|might|must|to|let|make|made|help|helped|if|wish|wished|that)\s+$/i;

const PATTERNS = [
  // "we seen", "I done", "they gone" → past simple or have + participle
  ...PRONOUNS.flatMap((p) =>
    [
      ['seen', 'saw'],
      ['done', 'did'],
      ['gone', 'went'],
      ['been', 'was'],
    ].map(([part, past]) => ({
      find: `${p} ${part}`,
      fix: `${p === 'i' ? 'I' : p} ${past} (or ${p === 'i' ? 'I' : p} ${['he', 'she'].includes(p) ? 'has' : 'have'} ${part})`,
      rule: `“${part}” needs “have” or “has” in front of it.`,
    })),
  ),
  ...['we', 'you', 'they'].map((p) => ({
    find: `${p} was`,
    fix: `${p} were`,
    rule: 'Use “were” with we, you and they.',
  })),
  ...['he', 'she', 'it'].map((p) => ({
    find: `${p} were`,
    fix: `${p} was`,
    rule: 'Use “was” with he, she and it.',
    guard: true,
  })),
  { find: 'i is', fix: 'I am', rule: 'Use “am” with I.' },
  { find: 'i are', fix: 'I am', rule: 'Use “am” with I.' },
  { find: 'i has', fix: 'I have', rule: 'Use “have” with I.' },
  ...['he', 'she', 'it'].map((p) => ({
    find: `${p} are`,
    fix: `${p} is`,
    rule: 'Use “is” with he, she and it.',
  })),
  ...['we', 'they'].map((p) => ({
    find: `${p} is`,
    fix: `${p} are`,
    rule: 'Use “are” with we and they.',
  })),
  ...['he', 'she', 'it'].flatMap((p) => [
    { find: `${p} don't`, fix: `${p} doesn't`, rule: 'Use “doesn’t” with he, she and it.' },
    ...[
      ['have', 'has'],
      ['go', 'goes'],
      ['like', 'likes'],
      ['want', 'wants'],
      ['play', 'plays'],
    ].map(([base, s]) => ({
      find: `${p} ${base}`,
      fix: `${p} ${s} (or ${p} ${base === 'have' ? 'had' : base === 'go' ? 'went' : base + 'd'})`,
      rule: 'With he, she or it, the verb needs -s (or use the past tense in a story).',
      guard: true,
    })),
  ]),
];

/**
 * Common slips with their corrections. Returns at most one entry per slip,
 * in the order they appear.
 *
 * @returns {{found: string, fix: string, rule: string}[]}
 */
export function findGrammarSlips(text) {
  const t = String(text || '');
  const slips = [];
  const seen = new Set();
  for (const w of _tokens(t)) {
    if (IRREGULAR_PAST[w] && !seen.has(w)) {
      seen.add(w);
      slips.push({
        found: w,
        fix: IRREGULAR_PAST[w],
        rule: `“${IRREGULAR_PAST[w]}” is the past tense of this verb.`,
        at: t.toLowerCase().indexOf(w),
      });
    }
  }
  for (const p of PATTERNS) {
    if (seen.has(p.find)) continue;
    const re = phrasePattern(p.find);
    const g = new RegExp(re.source, 'gi');
    let m;
    while ((m = g.exec(t))) {
      if (p.guard && GUARD_BEFORE.test(t.slice(Math.max(0, m.index - 12), m.index))) continue;
      seen.add(p.find);
      slips.push({ found: m[0], fix: p.fix, rule: p.rule, at: m.index });
      break;
    }
  }
  // "a" before a vowel sound: "a apple" → "an apple".
  const an = /\ba\s+([aeio][a-z]*)/gi;
  let m;
  while ((m = an.exec(t))) {
    if (/^(one|once|euro)/i.test(m[1])) continue;
    slips.push({
      found: m[0],
      fix: `an ${m[1]}`,
      rule: 'Use “an” before a vowel sound.',
      at: m.index,
    });
    break;
  }
  return slips.sort((a, b) => a.at - b.at).map(({ found, fix, rule }) => ({ found, fix, rule }));
}

// ── Task kind ───────────────────────────────────────────────────────────────

/**
 * Is this a story? Stories are judged on climax, resolution and dialogue;
 * emails, notices and recounts are not, so a correct email is never told to
 * add a turning point.
 */
export function isNarrativeTask(item = {}) {
  if (item.kind) return item.kind === 'narrative';
  if (item.lessonType === 'narrative' || item.lessonType === 'bootcamp') return true;
  if (item.mode === 'situational') return false;
  if (item.mode === 'continuous' || item.mode === 'hybrid') {
    return !/recount|report|email|letter|argument/i.test(item.textType || '');
  }
  return /narrative|story/i.test(item.textType || '');
}
