/**
 * Export the Giri stories as a picture-book kit for printed readers.
 *
 * Each story in src/data/stories.js becomes a book: its pages, one image
 * prompt per page (written for ChatGPT, used in a single chat per book so
 * the characters stay the same), and a "Reading together" page for the
 * grown-up that reads the book with the child.
 *
 * The prompts are written for a decodable reader, which changes what a good
 * picture is. The child is meant to read the words, not the picture, so a
 * picture has to show exactly what the words say — a "hat" that looks like a
 * hat — and nothing a child could name instead of reading. Those rules are
 * spelled out in every setup message rather than left to the image model.
 *
 * The reading-together page is read out of the same code the app uses:
 * practice words are the story's own decodable words that contain its
 * target sounds, and "words to know first" is decodability.supportWords —
 * the words a child cannot yet sound out at this point — with the tricky
 * part of each from sightWordCode.js.
 *
 * Usage:  node scripts/export-reader-prompts.mjs
 * Writes readers/<n>-<set>.md and readers/pictures.csv. Re-run it whenever
 * a story changes; do not edit the generated files by hand.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { STORIES, BAND_META } from '../src/data/stories.js';
import {
  MASCOT_NAME,
  PROPER_NOUNS,
  classifyWord,
  extractCountableTokens,
  scanWord,
  stripSuffix,
  storySupportLevel,
  supportWords,
} from '../src/modules/decodability.js';
import { getSightWordCode } from '../src/data/sightWordCode.js';
import { WORDS } from '../src/data/words.js';

const OUT_DIR = fileURLToPath(new URL('../readers/', import.meta.url));

// ── Characters ───────────────────────────────────────────────────────────
// One description per recurring character, pasted into every book they
// appear in, so they look the same from book to book. Giri and Mrs Tan are
// described from the existing app art. Mum has no settled look yet — change
// her line here and re-run if you want her drawn differently.

const GIRI =
  'Giri (the main character, "he"): a small, fluffy white rice-ball creature speckled with little brown grains. ' +
  'He wears a light bamboo dim-sum steamer basket as a hat, tied on with red string, unless the story gives him a different hat. ' +
  'His ears are two little golden dumplings. He has thick dark seaweed-strip eyebrows, black oval eyes, a small friendly smile, ' +
  'a round yellow pineapple-bun tummy with a criss-cross pattern, short arms and stubby feet. ' +
  'Use the attached Giri picture and keep him exactly like it.';

const CAST = [
  {
    match: /\bMrs Tan\b/,
    line: "Mrs Tan: Giri's kind older neighbour — a Singaporean Chinese grandmother with grey hair in a neat bun, round glasses and a flowery blouse.",
  },
  {
    match: /\b[Mm]um\b/,
    line: "Mum (Giri's mum): a rice-ball creature like Giri but a little taller, with no steamer hat and a soft pink apron.",
  },
];

// ── Packs ────────────────────────────────────────────────────────────────
// One file per set of books you might sell together.

const PACKS = [
  {
    file: '1-band-a.md',
    title: 'Set 1 · Band A — Core Decodable Minis',
    ages: '4–6',
    band: 'A',
    test: (s) => s.band === 'A' && s.textType === 'mini-decodable',
  },
  {
    file: '2-band-b.md',
    title: 'Set 2 · Band B — Decodable Story Readers',
    ages: '5–7',
    band: 'B',
    test: (s) => s.band === 'B' && s.textType === 'story-reader',
  },
  {
    file: '3-band-c.md',
    title: 'Set 3 · Band C — Fluency Readers',
    ages: '6–8',
    band: 'C',
    test: (s) => s.band === 'C' && s.textType === 'fluency-reader',
  },
  {
    file: '4-band-d.md',
    title: 'Set 4 · Band D — Bridge Readers',
    ages: '7–9',
    band: 'D',
    test: (s) => s.band === 'D' && s.textType === 'bridge-reader',
  },
  {
    file: '5-singapore.md',
    title: 'Set 5 · Giri in Singapore',
    ages: '5–8',
    test: (s) => s.textType === 'extension-sg',
  },
  {
    file: '6-chapter-books.md',
    title: 'Set 6 · Giri Chapter Books',
    ages: '7–9',
    test: (s) => s.textType === 'chapter-reader',
  },
  {
    file: '7-band-e.md',
    title: 'Set 7 · Band E — Longer Reads',
    ages: '8–10',
    band: 'E',
    test: (s) => s.band === 'E' && s.textType === 'longer-read',
  },
];

// ── Pages ────────────────────────────────────────────────────────────────

/**
 * A story's printed pages. Labels ("Problem:") and chapter headings are not
 * pages of their own: they ride on the page that follows them.
 * @returns {Array<{ text: string, tag?: string, heading?: string }>}
 */
function pagesOf(story) {
  const pages = [];
  let tag;
  let heading;
  for (const line of story.lines ?? []) {
    if (!line.text) continue;
    if (line.type === 'label') {
      tag = line.text.replace(/:$/, '');
      continue;
    }
    if (line.type === 'chapter') {
      heading = line.text;
      continue;
    }
    if (line.type === 'script') {
      // A line in a play keeps its speaker, so the page says who talks, and
      // three lines share a page: one picture per line would be a picture
      // for "Yes!".
      const said = `${line.role}: ${line.text}`;
      const last = pages.at(-1);
      if (last?.lines && last.lines < 3) {
        last.text += ` / ${said}`;
        last.lines += 1;
      } else {
        pages.push({ text: said, lines: 1 });
      }
      continue;
    }
    pages.push({ text: line.text, ...(tag && { tag }), ...(heading && { heading }) });
    tag = undefined;
    heading = undefined;
  }
  return pages;
}

/** Stories grouped into books: chapter readers share one book. */
function booksOf(stories) {
  const books = [];
  const byChapter = new Map();
  for (const story of stories) {
    if (!story.chapterOf) {
      books.push({ id: story.id, title: story.title, stories: [story] });
      continue;
    }
    let book = byChapter.get(story.chapterOf);
    if (!book) {
      book = {
        id: story.chapterOf,
        title: story.title.replace(/\s+—\s+Chapter.*$/, ''),
        stories: [],
      };
      byChapter.set(story.chapterOf, book);
      books.push(book);
    }
    book.stories.push(story);
  }
  for (const book of byChapter.values()) {
    book.stories.sort((a, b) => (a.chapterNum ?? 0) - (b.chapterNum ?? 0));
  }
  return books;
}

const pad = (n) => String(n).padStart(2, '0');
const pictureFile = (storyId, n) => `${storyId}-p${pad(n)}.png`;
const coverFile = (bookId) => `${bookId}-cover.png`;

// ── Prompts ──────────────────────────────────────────────────────────────

function pictureRules(band) {
  const early = band === 'A' || band === 'B';
  return [
    'Draw exactly what the words on the page say. Every person, animal and thing the words name must be easy to see, and must look like the everyday thing a young child would call by that word (a "hat" must look like a hat, a "pot" like a cooking pot).',
    early
      ? 'Keep the background simple. Do not add extra animals, people or objects — a child might name those instead of reading the words.'
      : 'A fuller background is fine, but the things the words name must be the clear focus.',
    'Show only the moment on that page. Do not show anything that happens on a later page.',
    'No words, letters, numbers or signs anywhere in the picture — not on shirts, books, shops or labels. The text is printed separately.',
    'Giri looks exactly the same in every picture. Anyone else looks the same on every page once you have drawn them.',
    'Square picture (1:1). Keep everything important away from the edges so nothing is lost when it is printed.',
  ];
}

function setupMessage(book, band, ages) {
  const allText = book.stories.flatMap((s) => s.lines.map((l) => l.text)).join(' ');
  const cast = [GIRI, ...CAST.filter((c) => c.match.test(allText)).map((c) => c.line)];
  cast.push(
    'Anyone else: design them from the story the first time they appear, then keep them the same.',
  );

  const storyLines = [];
  for (const story of book.stories) {
    pagesOf(story).forEach((page, i) => {
      if (page.heading) storyLines.push('', page.heading);
      storyLines.push(`Page ${i + 1}: ${page.text}`);
    });
  }
  const pageCount = book.stories.reduce((n, s) => n + pagesOf(s).length, 0);

  return [
    `I am making a printed picture book for children aged ${ages} who are learning to read. It is a decodable reader: the child sounds out the words, so each picture must show exactly what the words say. I will ask you for one picture at a time. First read all of this, then reply only "Ready".`,
    '',
    `BOOK: "${book.title}" — a cover and ${pageCount} pages.`,
    '',
    'CHARACTERS',
    ...cast.map((c) => `- ${c}`),
    '',
    'STYLE',
    'Warm, cheerful picture-book cartoon with clean dark outlines, soft flat colours and gentle shading, matching the attached Giri picture. Bright but not busy.',
    'Giri lives in Singapore. When a page shows a home, street, school or shop, make it look like Singapore (HDB flats, void decks, corridors, hawker centres) unless the story says otherwise.',
    '',
    'RULES FOR EVERY PICTURE',
    ...pictureRules(band).map((r, i) => `${i + 1}. ${r}`),
    '',
    'THE STORY',
    ...storyLines,
  ].join('\n');
}

function coverMessage(book) {
  return [
    `Cover picture, square. Show Giri and the main thing from the title "${book.title}", in the story's setting, without giving away the ending.`,
    'Keep the top quarter calm and plain (sky, wall or floor) so the title can be printed over it later. No words or letters anywhere.',
  ].join('\n');
}

function pageMessage(page, n, total, chapter) {
  const where = chapter ? `${chapter}, page ${n} of ${total}` : `page ${n} of ${total}`;
  return [
    `Picture for ${where}. Square.`,
    `Words on this page: ${page.text}`,
    'Draw this moment only. Keep Giri exactly like the reference. No words or letters in the picture.',
  ].join('\n');
}

// ── Reading-together page ────────────────────────────────────────────────

const SINGLE_VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);
const SUFFIX_GRAPHEMES = new Set(['ed', 'ing']);
const WORDS_BY_WORD = new Map(WORDS.map((w) => [w.word.toLowerCase(), w]));

/** How a grapheme is written for a grown-up: a_e → a-e. */
const showGrapheme = (g) => g.replace('_e', '-e');

/**
 * Spellings with more than one sound (snow / cow, moon / book, bead /
 * bread). Their spelling cannot say which sound a word has, so a word only
 * counts for one of these when words.js records it.
 */
const AMBIGUOUS = new Set(['ow', 'ou', 'oo', 'ea', 'ear', 'ere', 'ie', 'y']);

/** The words.js type an ambiguous spelling must have to count, by band. */
function expectedType(grapheme, band) {
  if ((grapheme === 'ow' || grapheme === 'ou') && band === 'D') return 'dp';
  if (['ow', 'oo', 'ea', 'ie'].includes(grapheme)) return 'lv';
  return null;
}

/**
 * Common words whose vowel does not say what its letters suggest. Leaving a
 * word out costs a practice word; listing a wrong one teaches the wrong
 * sound, so when in doubt a word goes here.
 */
const IRREGULAR = new Set(
  (
    'won son ton front most post host ghost both only old cold gold hold told bold fold sold ' +
    'kind find mind wild child mild wash wasp swan watch squash ball tall call fall wall all ' +
    'small talk walk chalk salt half calf pretty been women busy love glove shove dove come ' +
    'done none gone give live have lose move prove whole sure sugar put push pull full bull bush'
  ).split(' '),
);

const R_CONTROLLED = new Set(['ar', 'or', 'er', 'ir', 'ur']);

/**
 * Spellings that look like the target but sound different in this word:
 * the ar of "warm" says /or/, the er of "very" is e then r, the u of
 * "hurried" is short, the au of "caught" belongs to augh.
 */
function misleading(word, grapheme) {
  if (R_CONTROLLED.has(grapheme)) {
    if (!new RegExp(`${grapheme}(?![aeiouyr])`).test(word)) return true;
    if ((grapheme === 'ar' || grapheme === 'or') && /(w|qu)(ar|or)/.test(word)) return true;
  }
  if (grapheme === 'au' && !/au(?!gh)/.test(word)) return true;
  if (grapheme === 'a' && /al[lkt]|wa[stn]|wat|qua/.test(word)) return true;
  if (grapheme === 'o' && /ol[dt]/.test(word)) return true;
  if (grapheme === 'i' && /i(nd|ld)$/.test(word)) return true;
  return false;
}

/** Does a words.js entry spell this target sound? */
function entryHas(entry, grapheme, band) {
  const { graphemes, types } = entry;
  if (SINGLE_VOWELS.has(grapheme)) {
    return graphemes.some((g, i) => g === grapheme && types[i] === 'sv');
  }
  if (grapheme.endsWith('_e')) {
    return types.includes('se') && graphemes.some((g, i) => g === grapheme[0] && types[i] === 'lv');
  }
  const want = expectedType(grapheme, band);
  return graphemes.some((g, i) => g === grapheme && (!want || types[i] === want));
}

/** Does a word words.js does not know spell this target sound? */
function scanHas(word, stripped, grapheme) {
  if (AMBIGUOUS.has(grapheme)) return false;
  const parses = [scanWord(word).parse];
  if (stripped) parses.push(scanWord(stripped.base).parse);
  // The e of "wiggle" and "white" is not the short e of "hen".
  const sounded = parses.map((p) => (grapheme === 'e' && p.at(-1) === 'e' ? p.slice(0, -1) : p));
  if (!sounded.some((p) => p.includes(grapheme))) return false;
  // Nor is the a of "baked" the short a of "hat".
  return !(SINGLE_VOWELS.has(grapheme) && parses.some((p) => p.includes(`${grapheme}_e`)));
}

/** A real inflection: "jumped", not "need"; "jumping", not "thing". */
function realSuffix(word) {
  const stripped = stripSuffix(word);
  if (!stripped || !/[aeiouy]/.test(stripped.base)) return null;
  if (stripped.suffix === 'ed' && word.endsWith('eed')) return null;
  if (stripped.suffix === 's') {
    if (word.endsWith('ss')) return null;
    // No e drops before a plain -s, so none comes back: "its" is not "ite".
    return { base: word.slice(0, -1), suffix: 's' };
  }
  return stripped;
}

/**
 * Up to six of the story's own words that a child can sound out and that
 * contain this target sound, in the order the child meets them. Words to
 * learn by heart are left out even when they contain the letters ("was" is
 * not a short-a word).
 */
function practiceWords(story, grapheme) {
  const out = [];
  const seen = new Set();
  for (const word of extractCountableTokens(story)) {
    if (seen.has(word) || out.length >= 6) continue;
    seen.add(word);
    if (word.length < 2 || word === MASCOT_NAME || PROPER_NOUNS.has(word)) continue;
    if (getSightWordCode(word)?.category === 'heart') continue;
    if (classifyWord(word, story).status !== 'decodable') continue;

    const stripped = realSuffix(word);
    if (SUFFIX_GRAPHEMES.has(grapheme)) {
      if (stripped?.suffix === grapheme) out.push(word);
      continue;
    }
    // IRREGULAR is about vowels: the sh of "bush" is still sh.
    const vowelTarget = /[aeiouy]/.test(grapheme) && grapheme !== 'qu';
    if (vowelTarget && (IRREGULAR.has(word) || IRREGULAR.has(stripped?.base))) continue;
    if (misleading(word, grapheme)) continue;
    const entry = WORDS_BY_WORD.get(word) ?? WORDS_BY_WORD.get(stripped?.base);
    const has = entry ? entryHas(entry, grapheme, story.band) : scanHas(word, stripped, grapheme);
    if (has) out.push(word);
  }
  return out;
}

/**
 * The words to read together before the story: supportWords (what the app
 * shows before a story), plus any heart word the story uses that the
 * validator counts as decodable. Its check is by spelling, so "a" and "was"
 * pass as sound-out-able; a child sounding out "was" says "wass".
 */
function wordsToKnow(story) {
  const support = new Map(supportWords(story).map((w) => [w.word, w]));
  const out = [];
  const seen = new Set();
  for (const word of extractCountableTokens(story)) {
    if (seen.has(word)) continue;
    seen.add(word);
    if (support.has(word)) out.push(support.get(word));
    else if (getSightWordCode(word)?.category === 'heart') {
      out.push({ word, display: word === 'i' ? 'I' : word, status: 'heart' });
    }
  }
  return out;
}

/** One line for each word the child should meet before reading. */
function wordToKnow(story, { word, display, status }) {
  const vocab = (story.vocab ?? []).find((v) => v.word.toLowerCase() === word);
  if (vocab) return `**${display}** — ${vocab.meaning}`;
  const code = getSightWordCode(word);
  if (code?.category === 'heart') return `**${display}** — ❤️ tricky part: ${code.note}`;
  if (code && code.decodableAt <= 4)
    return `**${display}** — no tricky part; sound it out together`;
  if (code?.waitsOnTip) {
    return `**${display}** — no tricky part; your child can sound it out once they know ${code.waitsOnTip}. Read it together for now`;
  }
  if (code) return `**${display}** — no tricky part; clap the parts, then sound it out together`;
  if (status === 'proper') return `**${display}** — a name; read it to your child`;
  return `**${display}** — read it to your child for now`;
}

function readingTogether(story) {
  const out = [];
  const sounds = (story.targetGraphemes ?? [])
    .map((g) => {
      const words = practiceWords(story, g);
      return words.length ? `**${showGrapheme(g)}** — ${words.join(', ')}` : null;
    })
    .filter(Boolean);
  if (sounds.length) {
    out.push('**Sounds in this book** — say the sound, then read these words from the story:');
    out.push(...sounds.map((s) => `- ${s}`));
    out.push('');
  }

  const known = wordsToKnow(story);
  if (known.length) {
    out.push(
      '**Words to know first** — read each one together before the story. For a ❤️ word, point to the tricky part; the rest of the word sounds out as normal:',
    );
    out.push(...known.map((w) => `- ${wordToKnow(story, w)}`));
    out.push('');
  }

  const vocabExtra = (story.vocab ?? []).filter(
    (v) => !known.some((k) => k.word === v.word.toLowerCase()),
  );
  if (vocabExtra.length) {
    out.push('**Word meanings** — talk about these before reading:');
    out.push(...vocabExtra.map((v) => `- **${v.word}** — ${v.meaning}`));
    out.push('');
  }

  if (story.comprehension?.length) {
    out.push('**After reading — check understanding** (answer ticked):');
    story.comprehension.forEach((q, i) => {
      if (q.kind === 'order') {
        // Events are stored in story order, which is the answer.
        out.push(`${i + 1}. ${q.q}  `, `   ${q.events.map((e, j) => `(${j + 1}) ${e}`).join(' ')}`);
        return;
      }
      const prompt = q.kind === 'tf' ? `True or false? ${q.q}` : q.q;
      const options = q.options.map((o, j) => (j === q.answer ? `${o} ✓` : o)).join(' · ');
      out.push(`${i + 1}. ${prompt}  `, `   ${options}`);
    });
    out.push('');
  }

  for (const w of story.openEnded ?? []) {
    out.push(`**Write about it:** ${w.q}  `, `_A good answer:_ ${w.sampleAnswer}`, '');
  }

  if (story.talkAboutIt?.length) {
    out.push('**Talk about it:**');
    out.push(...story.talkAboutIt.map((t) => `- ${t}`));
    out.push('');
  }

  for (const spot of story.grammarSpotlight ?? []) {
    out.push(`**Spot it: ${spot.pattern}** — ${spot.example}. ${spot.tip}`);
    out.push('');
  }

  if (storySupportLevel(story) === 'adult-supported') {
    out.push(
      '_Read this one together: it uses some words and sentences beyond the sounds your child has been taught._',
      '',
    );
  }
  return out;
}

// ── How to read together (once per pack) ─────────────────────────────────

function howToRead(early) {
  const steps = early
    ? [
        "**Warm up (2 minutes).** Say the book's sound together, then read the practice words from the reading-together page.",
        '**Words to know first.** Show each one and read it together. For a ❤️ word, point to the tricky part — the rest of the word sounds out as normal.',
        '**Read.** Your child points under each word and sounds it out. If they guess, cover the picture and say "Let\'s check the letters." Look at the picture after the page is read — it shows whether they got it right.',
        '**Read it again tomorrow.** A second read is where speed and confidence come from.',
        '**Talk.** Ask the questions and the talk-about-it prompt.',
      ]
    : [
        '**Before reading.** Go through the word meanings and the words to know first.',
        '**Take turns.** Your child reads a page aloud; you read the next. Pause at the end of each page: "What just happened?"',
        '**Tricky word?** Sound it out together rather than giving it straight away. If the code is new, say the word and move on.',
        '**Read a favourite page again** with expression — the voices, the pauses.',
        '**Talk.** Ask the questions and the talk-about-it prompts.',
      ];
  return steps.map((s, i) => `${i + 1}. ${s}`);
}

// ── Output ───────────────────────────────────────────────────────────────

const fence = (text) => ['```text', text, '```'];
const csvCell = (v) => `"${String(v).replace(/"/g, '""')}"`;

const csv = [['set', 'book', 'story_id', 'picture', 'file', 'words', 'done'].join(',')];
const summary = [];
const used = new Set();

mkdirSync(OUT_DIR, { recursive: true });

for (const pack of PACKS) {
  const stories = STORIES.filter(pack.test);
  stories.forEach((s) => used.add(s.id));
  const books = booksOf(stories);
  const meta = BAND_META.find((b) => b.band === pack.band);
  const early = pack.band === 'A' || pack.band === 'B' || pack.file.includes('singapore');
  const pictureCount = books.reduce(
    (n, b) => n + 1 + b.stories.reduce((m, s) => m + pagesOf(s).length, 0),
    0,
  );
  summary.push({ pack, books: books.length, pictures: pictureCount });

  const md = [
    `# ${pack.title}`,
    '',
    '> Generated by `node scripts/export-reader-prompts.mjs` from `src/data/stories.js` — do not edit by hand.',
    '',
    `**${books.length} books · ${pictureCount} pictures (covers included) · ages ${pack.ages}**` +
      (meta ? ` · sounds: ${meta.targetSounds} · ${meta.wordRange} words per book` : ''),
    '',
    'See [README.md](README.md) for how to use this with ChatGPT.',
    '',
    '## How to read these books together',
    '',
    '_Print this on the inside cover of every book in the set._',
    '',
    ...howToRead(early),
    '',
  ];

  for (const book of books) {
    const band = book.stories[0].band;
    md.push('---', '', `## ${book.title}`, '');
    const first = book.stories[0];
    const words = book.stories.reduce((n, s) => n + extractCountableTokens(s).length, 0);
    md.push(
      `\`${book.id}\` · Band ${band} · ${words} words · sounds: ${(first.targetGraphemes ?? []).map(showGrapheme).join(', ') || '—'}`,
      '',
    );

    md.push(
      '### 1. Setup — paste once at the start of a new chat, with the Giri picture attached',
      '',
    );
    md.push(...fence(setupMessage(book, band, pack.ages)), '');

    md.push('### 2. Pictures — paste one at a time', '');
    md.push(`**Cover** → \`${coverFile(book.id)}\``, '', ...fence(coverMessage(book)), '');
    csv.push(
      [pack.file, book.id, book.id, 'cover', coverFile(book.id), book.title, '']
        .map(csvCell)
        .join(','),
    );

    for (const story of book.stories) {
      const pages = pagesOf(story);
      const chapter = story.chapterOf ? `Chapter ${story.chapterNum}` : null;
      pages.forEach((page, i) => {
        const file = pictureFile(story.id, i + 1);
        const label = [chapter, `Page ${i + 1}`].filter(Boolean).join(', ');
        const tag = page.tag ? ` _(${page.tag})_` : '';
        md.push(
          `**${label}**${tag} → \`${file}\``,
          '',
          ...fence(pageMessage(page, i + 1, pages.length, chapter)),
          '',
        );
        csv.push(
          [pack.file, book.id, story.id, `p${pad(i + 1)}`, file, page.text, '']
            .map(csvCell)
            .join(','),
        );
      });
    }

    for (const story of book.stories) {
      const heading = story.chapterOf ? `Reading together — ${story.title}` : 'Reading together';
      md.push(`### 3. ${heading}`, '', '_For the back page of the book._', '');
      md.push(...readingTogether(story));
    }
  }

  writeFileSync(`${OUT_DIR}${pack.file}`, `${md.join('\n').trimEnd()}\n`);
}

const missed = STORIES.filter((s) => !used.has(s.id)).map((s) => s.id);
if (missed.length) {
  throw new Error(`export-reader-prompts: stories in no pack: ${missed.join(', ')}`);
}

writeFileSync(`${OUT_DIR}pictures.csv`, `${csv.join('\n')}\n`);

for (const { pack, books, pictures } of summary) {
  console.log(
    `${pack.file.padEnd(20)} ${String(books).padStart(3)} books  ${String(pictures).padStart(4)} pictures`,
  );
}
console.log(`pictures.csv         ${csv.length - 1} rows`);
