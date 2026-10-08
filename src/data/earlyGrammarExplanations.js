/**
 * Per-option explanations for the early-years Grammar MCQ items that had none.
 *
 * P1 Pronouns and P1–P2 Simple Past were the only lower-primary categories
 * whose feedback fell back to "'X' is the choice that fits this sentence" —
 * which tells a six-year-old that they were wrong, but not why. Pronoun
 * feedback here names the word the pronoun stands for; simple-past feedback
 * names the time clue and what is wrong with each other verb form.
 *
 * Review audit 2026-10-07. Attached in grammarMcq.js before pupil names are
 * varied, so a swapped name is swapped in the explanation too.
 */

/** P1 pronouns, keyed by the authored stem. */
export const P1_PRONOUN_EXPLANATIONS = {
  'Tom is my friend. ___ likes to play football with me.': {
    He: '“He” is right — it stands for Tom, one boy.',
    She: '“She” is for a girl or a woman, but Tom is a boy.',
    It: '“It” is for a thing or an animal, not a person like Tom.',
    They: '“They” is for more than one, but Tom is one boy.',
  },
  'Sara and I went to the park. ___ played on the swings.': {
    We: '“We” is right — it stands for Sara and me together.',
    I: '“I” is only me, but Sara was on the swings too.',
    They: '“They” leaves me out, but I played on the swings too.',
    She: '“She” is only Sara, but I played too.',
  },
  'Look at the bird in the cage. ___ is so colourful!': {
    It: '“It” is right — it stands for the bird, one animal.',
    He: '“He” is for a boy or a man; for an animal we usually say “it”.',
    She: '“She” is for a girl or a woman; for an animal we usually say “it”.',
    They: '“They” is for more than one, but there is one bird.',
  },
  'The boys forgot their bags. The teacher reminded ___.': {
    them: '“Them” is right — it stands for the boys, and it comes after the doing word “reminded”.',
    they: '“They” goes before a doing word (“They forgot”), not after it.',
    their: '“Their” needs a thing after it, like “their bags”.',
    theirs: '“Theirs” means “belonging to them”, like “The bags are theirs”.',
  },
  "Don't eat the bread. ___ has turned mouldy.": {
    It: '“It” is right — it stands for the bread, one thing.',
    He: '“He” is for a boy or a man, not for bread.',
    She: '“She” is for a girl or a woman, not for bread.',
    They: '“They” is for more than one, but “has” tells us it is one thing.',
  },
  'My dog loves to run. ___ chases every ball in the park.': {
    It: '“It” is right — it stands for my dog, one animal.',
    He: '“He” is for a boy or a man; for an animal we usually say “it”.',
    She: '“She” is for a girl or a woman; for an animal we usually say “it”.',
    They: '“They” is for more than one, but there is one dog.',
  },
  'Aunty Sue baked some cookies. ___ put them on the table for us.': {
    She: '“She” is right — it stands for Aunty Sue, one woman.',
    He: '“He” is for a boy or a man, but Aunty Sue is a woman.',
    It: '“It” is for a thing or an animal, not a person.',
    They: '“They” is for more than one, but Aunty Sue is one person.',
  },
  'The twins like football. ___ practise every Saturday morning.': {
    They: '“They” is right — it stands for the twins, two people.',
    He: '“He” is for one boy, but twins are two people.',
    She: '“She” is for one girl, but twins are two people.',
    It: '“It” is for a thing, not for people.',
  },
  'Mum and I went to the market. ___ bought fresh fruit.': {
    We: '“We” is right — it stands for Mum and me together.',
    They: '“They” leaves me out, but I went to the market too.',
    I: '“I” is only me, but Mum was there too.',
    She: '“She” is only Mum, but I bought fruit too.',
  },
  'Dad called my sister and ___. We had to come inside.': {
    me: '“Me” is right — Dad called me. Take away “my sister and” to check: “Dad called me”.',
    I: '“I” goes before a doing word (“I came”); after “called” we say “me”.',
    my: '“My” needs a thing after it, like “my bag”.',
    mine: '“Mine” means “belonging to me”, like “The bag is mine”.',
  },
  'My sister lost her pencil. I lent ___ mine for the rest of the lesson.': {
    her: '“Her” is right — it stands for my sister, and it comes after the doing word “lent”.',
    she: '“She” goes before a doing word (“She lost”); after “lent” we say “her”.',
    hers: '“Hers” means “belonging to her”, like “The pencil is hers”.',
    herself: '“Herself” is for when she does something to herself, like “She hurt herself”.',
  },
  'The kitten knocked over the cup. ___ fell off the table.': {
    It: '“It” is right — it stands for the cup, the thing that fell.',
    He: '“He” is for a boy or a man, not for a cup.',
    She: '“She” is for a girl or a woman, not for a cup.',
    They: '“They” is for more than one, but there is one cup.',
  },
  'Our class won the quiz. The teacher praised ___.': {
    us: '“Us” is right — it stands for our class, and it comes after the doing word “praised”.',
    we: '“We” goes before a doing word (“We won”); after “praised” we say “us”.',
    our: '“Our” needs a thing after it, like “our class”.',
    ours: '“Ours” means “belonging to us”, like “The prize is ours”.',
  },
  'Bala and I were late, so ___ ran to the classroom together.': {
    we: '“We” is right — it stands for Bala and me, the ones who ran.',
    us: '“Us” comes after a doing word (“She saw us”); before “ran” we say “we”.',
    they: '“They” leaves me out, but I ran too.',
    them: '“Them” leaves me out, and it comes after a doing word.',
  },
  'Mum bought a new lunchbox and ___ is blue and yellow.': {
    it: '“It” is right — it stands for the lunchbox, one thing.',
    he: '“He” is for a boy or a man, not for a lunchbox.',
    she: '“She” would mean Mum is blue and yellow — it is the lunchbox.',
    they: '“They” is for more than one, but there is one lunchbox.',
  },
  'The children sat at the void deck because ___ were tired.': {
    they: '“They” is right — it stands for the children, the ones who were tired.',
    them: '“Them” comes after a doing word (“I saw them”); before “were” we say “they”.',
    we: '“We” would mean me too, but the sentence is about the children.',
    it: '“It” is for one thing, not for children.',
  },
  'My brother forgot his umbrella, so I passed ___ mine.': {
    him: '“Him” is right — it stands for my brother, and it comes after the doing word “passed”.',
    he: '“He” goes before a doing word (“He forgot”); after “passed” we say “him”.',
    his: '“His” needs a thing after it, like “his umbrella”.',
    them: '“Them” is for more than one, but my brother is one boy.',
  },
  'Siti left her bag at the canteen, so the teacher kept ___ safe.': {
    it: '“It” is right — it stands for the bag, the thing the teacher kept safe.',
    her: '“Her” would mean the teacher kept Siti safe, but it was her bag.',
    she: '“She” goes before a doing word, and the teacher kept the bag, not Siti.',
    hers: '“Hers” means “belonging to her”; the teacher kept the bag itself.',
  },
  'The teacher asked Bala and ___ to clean the board.': {
    me: '“Me” is right — take away “Bala and” to check: “The teacher asked me”.',
    I: '“I” goes before a doing word; we say “asked me”, not “asked I”.',
    we: '“We” means more people, and it goes before a doing word.',
    they: '“They” leaves me out, and it goes before a doing word.',
  },
  'Can you help ___? I cannot open my locker.': {
    me: '“Me” is right — it stands for the speaker, and it comes after the doing word “help”.',
    I: '“I” goes before a doing word (“I cannot”); after “help” we say “me”.',
    my: '“My” needs a thing after it, like “my locker”.',
    mine: '“Mine” means “belonging to me”, like “The locker is mine”.',
  },
};

// Time words that tell a child the action is already over.
const PAST_CLUE =
  /\b(yesterday(?: [a-z]+)?|last (?:night|week|weekend|term|thursday|friday|saturday|sunday|month|year)|this morning|just now|a moment ago|as a young boy|earlier today)\b/i;

const lower = (w) => String(w).toLowerCase();
const isThirdPersonS = (form, base) =>
  form === `${base}s` || form === `${base}es` || (base.endsWith('y') && form === `${base.slice(0, -1)}ies`);

/**
 * Explanations for a simple-past item: the answer, plus what each other verb
 * form is (the base form, the -s form, an -ing form, a present continuous, or
 * a past participle that needs a helper).
 *
 * @param {{ q: string, answer: string, choices: string[] }} spec
 * @returns {Record<string, string>}
 */
export function makeSimplePastExplanations({ q, answer, choices }) {
  const clueMatch = String(q).match(PAST_CLUE);
  const clue = clueMatch ? `“${clueMatch[0]}”` : null;
  const when = clue ? `${clue} tells us it already happened` : 'the sentence tells about something that already happened';

  const others = choices.filter((c) => c !== answer);
  // The base form is the one another choice adds -s to ("swim" → "swims").
  const base = others.find((c) => others.some((o) => o !== c && isThirdPersonS(lower(o), lower(c))));

  const describe = (choice) => {
    if (/^(is|are|am) /.test(choice)) {
      return `“${choice}” means it is happening right now, but ${when}.`;
    }
    if (/ing$/.test(choice) && !choice.includes(' ')) {
      return `“${choice}” cannot be used on its own — it needs a helper like “was”. Here we need the past tense “${answer}”.`;
    }
    if (base && choice === base) {
      return `“${choice}” is for now or every day, but ${when}, so we use “${answer}”.`;
    }
    if (base && isThirdPersonS(lower(choice), lower(base))) {
      return `“${choice}” is for now or every day (he/she/it ${choice}), but ${when}.`;
    }
    if (!base) {
      return `“${choice}” is not the past tense — ${when}, so we use “${answer}”.`;
    }
    return `“${choice}” needs a helper word before it, like “has ${choice}”. On its own, the past tense is “${answer}”.`;
  };

  return Object.fromEntries(
    choices.map((choice) => [
      choice,
      choice === answer ? `“${answer}” is right — ${when}, so we use the past tense.` : describe(choice),
    ]),
  );
}
