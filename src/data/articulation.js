/**
 * PhonicsQuest – Articulation (mouth-shape) cues
 *
 * Maps each phoneme in the word bank to a mouth shape, so a child can see
 * what their mouth should *do* — not just hear the sound. Articulatory
 * cueing is a well-established part of structured-literacy instruction: for
 * children who can't yet discriminate /b/ from /p/ by ear, "both lips, but
 * one buzzes" is often the cue that unlocks it.
 *
 * The 66 distinct phonemes in the bank collapse to 13 shapes, because mouth
 * position is shared across many sounds. Consonants are grouped by *place
 * of articulation* (where the airflow is obstructed), vowels by tongue
 * height and lip rounding.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * REVIEW NEEDED — this mapping is educational content.
 *
 * It is derived from standard place/manner classification for Southern
 * British / Singapore English, but it has NOT been checked by anyone with
 * phonetics training, and several entries involve real judgement calls:
 *
 *   • /r/ is post-alveolar here; it is lip-rounded for many speakers and
 *     arguably belongs with the rounded group for a *visual* cue.
 *   • /w/ and /wh/ are labio-velar (lips AND back of tongue). Filed under
 *     'rounded-lips' because that is the visible part.
 *   • /y/ serves as both a consonant glide and a vowel in this bank; it is
 *     mapped as the glide.
 *   • The vowel groupings are visual approximations — English vowel space
 *     is continuous, and dialect moves several of these.
 *
 * Have a speech/language specialist confirm before this ships to children.
 * Nothing else in the app depends on it, so it can be corrected freely.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * @typedef {'lips-closed'|'lips-teeth'|'tongue-teeth'|'tongue-ridge'
 *   |'tongue-back'|'open-throat'|'rounded-small'|'rounded-lips'
 *   |'vowel-open'|'vowel-mid'|'vowel-smile'|'vowel-round'|'glide'} MouthShape
 */

/**
 * Human-readable cue per shape. Written as an instruction a child can act
 * on ("Press your lips together") rather than a phonetic label, because the
 * point is for them to try it.
 *
 * @type {Record<MouthShape, { label: string, cue: string }>}
 */
export const MOUTH_SHAPES = Object.freeze({
  'lips-closed':  { label: 'Lips together', cue: 'Press both lips together, then pop them open.' },
  'lips-teeth':   { label: 'Lip and teeth', cue: 'Top teeth rest on your bottom lip and the air hisses through.' },
  'tongue-teeth': { label: 'Tongue peeks out', cue: 'Poke your tongue tip between your teeth.' },
  'tongue-ridge': { label: 'Tongue tip up', cue: 'Tongue tip taps the bumpy ridge behind your top teeth.' },
  'tongue-back':  { label: 'Back of tongue', cue: 'The back of your tongue lifts to the roof of your mouth.' },
  'open-throat':  { label: 'Open and breathe', cue: 'Mouth open, just a puff of air from your throat.' },
  'rounded-small':{ label: 'Small round lips', cue: 'Push your lips forward into a small circle.' },
  'rounded-lips': { label: 'Round lips', cue: 'Round your lips like you are about to whistle.' },
  'vowel-open':   { label: 'Wide open', cue: 'Drop your jaw and open wide.' },
  'vowel-mid':    { label: 'Half open', cue: 'Mouth relaxed and half open.' },
  'vowel-smile':  { label: 'Smile shape', cue: 'Stretch your lips wide like a smile.' },
  'vowel-round':  { label: 'Round shape', cue: 'Make your lips into a round O.' },
  'glide':        { label: 'Mouth moves', cue: 'Your mouth slides from one shape into another.' },
});

/**
 * Phoneme → mouth shape. Keys are the `/x/` notation used in words.js.
 * Doubled graphemes (/bb/, /ss/…) share their single counterpart's shape.
 *
 * @type {Record<string, MouthShape>}
 */
export const PHONEME_MOUTH = Object.freeze({
  // ── Bilabial: both lips ────────────────────────────────────────────────
  '/b/': 'lips-closed', '/bb/': 'lips-closed',
  '/p/': 'lips-closed', '/pp/': 'lips-closed',
  '/m/': 'lips-closed',

  // ── Labiodental: top teeth on bottom lip ───────────────────────────────
  '/f/': 'lips-teeth', '/ff/': 'lips-teeth',
  '/v/': 'lips-teeth',

  // ── Dental: tongue between the teeth ───────────────────────────────────
  '/th/': 'tongue-teeth',

  // ── Alveolar: tongue tip at the ridge behind the top teeth ─────────────
  '/t/': 'tongue-ridge', '/tt/': 'tongue-ridge',
  '/d/': 'tongue-ridge',
  '/n/': 'tongue-ridge', '/nn/': 'tongue-ridge',
  '/s/': 'tongue-ridge', '/ss/': 'tongue-ridge', '/se/': 'tongue-ridge',
  '/z/': 'tongue-ridge',
  '/l/': 'tongue-ridge', '/ll/': 'tongue-ridge',

  // ── Post-alveolar: tongue further back, lips pushed forward ────────────
  '/sh/': 'rounded-small',
  '/ch/': 'rounded-small',
  '/j/':  'rounded-small',
  '/r/':  'rounded-small',   // see review note: rounding varies by speaker

  // ── Velar: back of the tongue at the soft palate ───────────────────────
  '/k/': 'tongue-back', '/c/': 'tongue-back', '/ck/': 'tongue-back',
  '/g/': 'tongue-back', '/gg/': 'tongue-back',
  '/ng/': 'tongue-back',

  // ── Glottal ────────────────────────────────────────────────────────────
  '/h/': 'open-throat',

  // ── Labio-velar / glides ───────────────────────────────────────────────
  '/w/':  'rounded-lips',
  '/wh/': 'rounded-lips',
  '/y/':  'glide',

  // ── Vowels: open ───────────────────────────────────────────────────────
  '/a/':  'vowel-open',
  '/ar/': 'vowel-open',

  // ── Vowels: mid / relaxed (includes schwa and r-coloured) ──────────────
  '/e/':  'vowel-mid',
  '/u/':  'vowel-mid',
  '/uh/': 'vowel-mid',
  '/ə/':  'vowel-mid',
  '/er/': 'vowel-mid',
  '/ir/': 'vowel-mid',
  '/ur/': 'vowel-mid',

  // ── Vowels: close front, lips spread ───────────────────────────────────
  '/i/':   'vowel-smile', '/ɪ/': 'vowel-smile',
  '/ee/':  'vowel-smile', '/ea/': 'vowel-smile', '/ē/': 'vowel-smile',
  '/ay/':  'vowel-smile', '/ai/': 'vowel-smile',
  '/ie/':  'vowel-smile', '/igh/': 'vowel-smile', '/ī/': 'vowel-smile',

  // ── Vowels: back, lips rounded ─────────────────────────────────────────
  '/o/':  'vowel-round', '/oa/': 'vowel-round', '/ō/': 'vowel-round',
  '/oo/': 'vowel-round', '/ew/': 'vowel-round', '/ue/': 'vowel-round',
  '/or/': 'vowel-round', '/aw/': 'vowel-round',

  // ── Diphthongs: the mouth visibly travels ──────────────────────────────
  '/oi/':  'glide', '/oy/': 'glide',
  '/ou/':  'glide', '/ow/': 'glide',
  '/air/': 'glide',
});

/**
 * Look up the mouth shape for a phoneme.
 * Accepts either `/c/` or bare `c`.
 *
 * @param {string} phoneme
 * @returns {{ shape: MouthShape, label: string, cue: string } | null}
 */
export function getMouthCue(phoneme) {
  if (!phoneme || typeof phoneme !== 'string') return null;
  const key = phoneme.startsWith('/') ? phoneme : `/${phoneme}/`;
  const shape = PHONEME_MOUTH[key];
  if (!shape) return null;
  return { shape, ...MOUTH_SHAPES[shape] };
}
