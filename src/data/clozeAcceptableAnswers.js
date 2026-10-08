/**
 * Second answers that cloze blanks accept.
 *
 * Each cloze blank has one keyed answer. Where the passage's own word bank
 * holds another word that is also correct English in that blank — "although"
 * beside "even though", "which" beside "that" in a defining clause, "should"
 * beside "must" in a rule — a child who picks it has not made a mistake, and
 * marking it wrong teaches them to distrust a correct instinct. Those words are
 * listed here, per blank, and `isBlankAnswerCorrect` marks them right.
 *
 * Keys are passage seed ids, so a re-presented passage (a revision round with
 * a new lead sentence) inherits its seed's list. The arrays line up with the
 * blanks: entry i lists the extra words accepted in blank i.
 *
 * Review audit 2026-10-07 (second-reader pass over Cloze Castle and Word Vault).
 * Distractors that were simply wrong to offer were replaced in the passage
 * itself; this list is for blanks where English genuinely allows two words.
 */

const LEVELS = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'];

/** The GrammarMaster expansion passages are copied into several levels. */
function atLevels(levels, stem, alternatives) {
  return Object.fromEntries(levels.map((level) => [`gm-${level}-${stem}`, alternatives]));
}

/** Cloze Castle (grammar) — keyed by `passages.js` / `passagesExtra` seed ids. */
export const GRAMMAR_CLOZE_ACCEPTABLE_ANSWERS = {
  // ── Pronouns and possessives ───────────────────────────────────────────
  'g-p1-pro-03': [[], [], ['My']], // "Ali and I … My mother called us home."
  'g-p1-pos-01': [['her', 'your'], ['hers'], []],
  'g-p1-pos-02': [['My'], ['mine', 'his'], []],
  'g-p1-pos-03': [[], ['mine'], []],
  'g-p2-pos-02': [['his'], ['mine'], []],
  'g-p2-pos-03': [['their'], ['theirs'], []], // a group can take "their" in British usage

  // ── Articles ───────────────────────────────────────────────────────
  'g-p1-art-03': [[], [], ['A'], []], // "A whiteboard is on the wall" — a first mention
  'gx-p2-articles-31': [[], [], ['the']], // the race's trophy is a known one

  // ── Prepositions ───────────────────────────────────────────────────────
  'g-p1-pre-02': [[], [], ['by']], // "The bus stops by my house."
  'g-p1-pre-03': [['under'], [], []], // "My bed is under the window."
  'gx-p1-prepositions-06': [[], [], ['beside']],
  'gx-p2-prepositions-05': [['into'], [], []],
  'gx-p2-prepositions-16': [[], [], ['after']],
  'gx-p2-prepositions-17': [['before'], [], []],
  'gx-p2-prepositions-18': [[], [], ['before']],
  'gx-p2-prepositions-19': [[], [], ['after']],
  'gx-p2-prepositions-20': [[], [], ['before']],
  'gx-p4-prepositions-33': [['into'], [], []],
  // "Despite" and "in spite of" mean the same thing.
  'gx-p5-prepositions-41': [[], ['In spite of'], ['Despite']],
  'gx-p5-prepositions-42': [['In spite of'], [], ['Despite']],
  'gx-p5-prepositions-43': [[], ['In spite of'], ['Despite']],
  'gx-p5-prepositions-44': [[], ['In spite of'], ['Despite']],
  'gx-p5-prepositions-45': [[], ['In spite of'], ['Despite']],

  // ── Tense ──────────────────────────────────────────────────────────────
  'g-p1-sp-01': [['walked', 'ran'], [], []], // "Yesterday, I walked to school early."
  'g-p1-sp-02': [['made'], [], []], // "Mum made a cake."
  'g-p1-sp-03': [['ran'], [], []], // "I ran home quickly."
  'g-p1-ta-02': [[], ['read'], ['read']], // "Last week, she read us a story." / "we read the pledge"
  'g-p2-sva-05': [['was'], [], []],
  'g-p2-conj-02': [[], [], ['so']], // "…and so we went outside."
  'g-p3-aux-02': [[], [], ['Has']], // "Has everyone brought their lunch?"

  // ── Modals ─────────────────────────────────────────────────────────────
  // A rule can be stated with "must" or "should"; permission with "can" or "may".
  'g-p1-mod-01': [[], [], ['can']],
  'g-p1-mod-02': [[], ['should'], ['may']],
  'g-p1-mod-03': [[], [], ['should']],
  'gx-p1-modals-08': [['should'], [], ['could']],
  'gx-p2-modals-09': [[], ['could'], []],
  'g-p4-ft-01': [[], ['can'], []],
  'g-p4-mod-01': [['must'], ['should'], ['must']],
  'g-p4-mod-02': [[], [], ['can']],
  'g-p4-mod-03': [['should'], ['must'], ['should']],
  'g-p4-mod-04': [['should'], ['must'], ['must']],
  'g-p4-mod-05': [['should'], ['should'], ['can']],
  'g-p4-mod-06': [['must'], ['should'], ['must']],
  'g-p5-mod-01': [[], ['might'], ['might', 'could']],
  'g-p5-mod-02': [['should'], ['might', 'must'], []],
  'g-p5-mod-03': [['could'], ['should', 'might'], []],
  'g-p5-mod-04': [['could'], ['should', 'might'], ['could']],
  'g-p5-mod-05': [['could'], ['should'], ['could']],
  'g-p5-mod-06': [['could'], ['should', 'might'], ['could']],
  ...atLevels(LEVELS, 'modals-1', [['should'], ['must not'], ['could', 'can']]), // "but can ask for help"
  ...atLevels(LEVELS, 'modals-2', [['could', 'may'], ['must'], ['should']]),
  ...atLevels(LEVELS, 'modals-3', [['must'], ['should not'], ['could']]),

  // ── Reported speech ────────────────────────────────────────────────────
  // "must" usually stays "must" when it is reported.
  'gx-p5-reportedSpeech-05': [[], ['must'], ['should']],
  'g-p6-rs-01': [[], ['must'], []],
  'g-p6-rs-04': [[], ['must'], ['must']],
  'gx-p6-reportedSpeech-02': [['must'], ['should'], []],
  // Nothing pins the quiz in the past, so an unshifted "will" is also right.
  ...atLevels(['p5', 'p6'], 'reportedSpeech-1', [['will'], ['must'], ['will']]),
  ...atLevels(['p5', 'p6'], 'reportedSpeech-2', [[], ['were'], []]),
  ...atLevels(['p5', 'p6'], 'reportedSpeech-3', [['could'], ['must'], ['would']]),

  // ── Quantifiers and countable/uncountable ──────────────────────────────
  'g-p1-cu-01': [[], ['many'], []], // "Mum buys many oranges."
  'gx-p1-countableUncountable-09': [['scissors'], [], []],
  'g-p2-cu-01': [[], [], ['many']],
  'g-p2-cu-02': [['a lot of'], ['a lot of'], []],
  'g-p2-cu-04': [['many'], [], ['a lot of']],
  'g-p2-cu-05': [[], [], ['some']], // "Do you have some glue?"
  'g-p2-cu-06': [['some'], ['Some'], []],
  'g-p3-cu-01': [[], [], ['some']],
  'g-p3-cu-02': [[], [], ['any', 'a little']],
  'g-p3-cu-05': [['some'], ['some'], []],
  'g-p3-cu-06': [[], ['many', 'a few'], []],
  'gx-p3-quantifiers-35': [['a few'], [], []],
  'g-p4-quan-01': [[], ['each'], []],
  'g-p4-quan-02': [[], [], ['Some']],
  'g-p4-quan-03': [['several'], [], [], []],
  'g-p4-cu-01': [['a few'], [], ['a little']],
  'g-p4-cu-02': [[], ['few'], []],
  'g-p4-cu-03': [[], [], ['any']],
  'g-p4-mix-02': [[], [], [], ['Each']],
  'g-p5-cu-01': [[], [], ['enough']],
  'g-p5-mix-02': [[], ['must be'], [], []],
  'g-p5-mix-03': [['Many'], [], [], ['must']],
  'g-p6-quan-01': [[], ['Some of'], ['Several']],
  'g-p6-quan-02': [[], ['Several of'], ['Several']],
  'g-p6-quan-03': [[], [], ['each']],
  'g-p6-mix-03': [[], ['many'], [], ['should']],

  // ── Relative clauses ───────────────────────────────────────────────────
  // In a defining clause about a thing, "that" and "which" are both correct.
  'gx-p4-relativeClauses-39': [[], ['that'], []],
  'gx-p4-relativeClauses-40': [['which'], [], ['that']],
  'gx-p4-relativeClauses-41': [[], ['which'], ['that']],
  'gx-p4-relativeClauses-42': [['which'], [], ['that']],
  'gx-p4-relativeClauses-43': [['which'], [], ['that']],
  'g-p6-rc-02': [[], [], ['which']],
  'g-p6-rc-03': [[], ['that'], []],
  'g-p6-rc-04': [['that'], [], []],
  'g-p6-rc-05': [[], ['which'], []],
  'g-p6-rc-06': [['which'], [], []],
  'gx-p6-relativeClauses-04': [['which'], [], []],
  'gx-p6-relativeClauses-10': [['which'], [], []],
  'gm-p6-relativeClauses-1': [[], ['which'], []],
  'gm-p6-relativeClauses-2': [['that'], ['that'], []],
  'gm-p6-relativeClauses-3': [['which'], [], []],

  // ── Connectors ─────────────────────────────────────────────────────────
  // "Even though"/"although", "furthermore"/"moreover" and
  // "however"/"nevertheless" do the same job in these sentences.
  'gx-p5-connectors-23': [[], ['Although'], [], []],
  'gx-p5-connectors-24': [[], ['Although'], [], []],
  'gx-p5-connectors-25': [[], ['Although'], [], []],
  'gx-p5-connectors-26': [[], ['Although'], [], []],
  'gx-p5-connectors-27': [[], ['Although'], [], []],
  'gx-p5-connectors-28': [[], ['Although'], [], []],
  'gx-p6-connectors-28': [[], ['Moreover'], ['Furthermore']],
  'gx-p6-connectors-29': [['However'], ['Moreover'], []],
  'gx-p6-connectors-30': [['Nevertheless'], [], ['Moreover']],
  'gx-p6-connectors-31': [['Moreover'], ['However'], []],
  'gx-p6-connectors-32': [['Moreover'], ['However'], []],
  'gx-p6-connectors-33': [['Nevertheless'], ['Moreover'], []],
};

/** Word Vault (vocabulary) — keyed by `vocabPassages.js` / `vocabPassagesExtra` seed ids. */
export const VOCAB_CLOZE_ACCEPTABLE_ANSWERS = {
  // ── Context inference and definitions ──────────────────────────────────
  'ci-p2-03': [[], [], ['beside']], // "found it beside the sofa"
  'ci-p3-04': [['upset'], [], []],
  'dm-p1-03': [['sea'], [], []], // "The sea is blue."
  'dm-p5-03': [['Determination'], [], []],
  'dm-p6-01': [[], ['preservation'], []],
  'dm-p6-02': [['resistance'], [], ['emotional']],

  // ── Synonyms and contrast ──────────────────────────────────────────────
  'sc-p1-03': [[], [], ['cool']], // "not hot and not cold — it is cool"
  'vxp-sc-p2-02': [[], ['sleepy'], []],
  'sc-p3-03': [[], ['greedy'], []],
  'sc-p4-01': [[], [], ['shy']],
  'sc-p5-03': [[], ['scolded'], []],
  'sc-p6-01': [['hardworking'], [], ['hardworking']],
  'sc-p6-02': [['shared'], [], ['faithful']],
  'sc-p6-03': [['honest'], ['clear'], []],

  // ── Collocations ───────────────────────────────────────────────────────
  'cc-p1-01': [['clean'], [], []], // "I clean my teeth" (British English)
  'cc-p1-02': [[], ['jump'], ['tells']], // "Mum tells me a bedtime story."
  'cc-p1-03': [['clean'], [], []],
  'cc-p1-04': [[], ['write'], []],
  'cc-p2-01': [[], ['hold'], []],
  'cc-p2-02': [['did'], ['called'], ['clapped']],
  'cc-p2-03': [[], [], ['picked']],
  'cc-p2-04': [[], ['fixes'], []],
  'cc-p3-01': [['do'], ['have'], ['keep']],
  'cc-p3-03': [[], ['stir'], ['put']],
  'cc-p4-01': [['settle'], [], []],
  'cc-p4-03': [[], [], ['printed']],
  'cc-p4-04': [['revise'], [], []],
  'cc-p5-01': [[], ['counting'], ['presented']],
  'cc-p5-02': [['hold'], [], ['gave']],
  'cc-p5-04': [['hold'], ['find'], ['write']],
  'cc-p6-02': [['called'], [], []],
  'cc-p6-03': [['started'], ['enhance'], ['use']],
  'cc-p6-04': [[], ['send'], []],

  // ── Word forms ─────────────────────────────────────────────────────────
  'gr-p6-03': [[], ['remarkable'], []],

  // ── Connectors ─────────────────────────────────────────────────────────
  'con-p3-01': [[], ['Therefore'], ['As a result']],
  'con-p3-02': [[], ['Moreover'], ['Besides']],
  'con-p3-03': [[], ['Furthermore'], ['In addition']],
  'con-p3-04': [['Therefore'], [], []],
  'con-p4-01': [['Consequently', 'As a result'], ['Therefore', 'As a result'], ['Therefore', 'Consequently']],
  'con-p4-03': [['Furthermore', 'Moreover'], ['In addition', 'Moreover'], ['In addition', 'Furthermore']],
  'con-p4-04': [['As a result'], [], ['Therefore']],
  'con-p5-02': [['Although'], [], ['While']],
  'con-p5-03': [['However'], [], []],
  'con-p6-01': [[], ['In addition'], []],
  'con-p6-02': [[], ['Nevertheless'], ['However']],

  // ── Grammar in vocabulary passages ─────────────────────────────────────
  'gp-p1-01': [['under'], [], []],
};

/**
 * Attach each seed's accepted alternatives to every passage built from it.
 *
 * @param {Record<string, Record<string, object[]>>} bank  level → category → passages, or category → level → passages
 * @param {Record<string, string[][]>} table
 */
export function attachAcceptableAnswers(bank, table) {
  for (const group of Object.values(bank || {})) {
    for (const passages of Object.values(group || {})) {
      for (const passage of passages || []) {
        const alternatives = table[passage.seedId || passage.id];
        if (alternatives) passage.acceptableAnswers = alternatives;
      }
    }
  }
}
