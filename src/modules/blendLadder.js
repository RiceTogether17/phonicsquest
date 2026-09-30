/**
 * PhonicsQuest — the blend ladder.
 *
 * Tapping a word used to play every sound in turn and then say the word. The
 * child watched. That is a demonstration of blending, not blending: the step
 * where decoding is actually built is the child holding the sounds so far and
 * adding the next one to them.
 *
 * So the panel builds the word one sound at a time, on the child's tap:
 *
 *     m  →  ma  →  map
 *
 * Each tap lights the tile, plays its sound, and grows the accumulated blend.
 * Any tile can be tapped to hear a sound again. "Just hear the word" stays
 * available throughout — keeping the story moving matters more than finishing
 * every blend, and a child stuck on one word should not be stuck in the panel.
 *
 * Modelled on the cumulative blending in the LiftOff Stories reader
 * (github.com/RiceTogether17/LiftOff). PhonicsQuest already carries grapheme
 * and type data in its word bank, so there is no splitting to do here — only
 * the pacing, which is the part that teaches.
 */

import { graphemeSounds, SOUND_META } from './phonemeColors.js';
import { html, raw } from '../utils/html.js';

/**
 * The cumulative blend, one step per sounded grapheme.
 *
 * Silent letters never get a step of their own — there is no sound to add —
 * but they do join the spelling at the step where their word is complete, so
 * the ladder for "cake" ends at "cake" rather than at "cak".
 *
 * @param {string[]} graphemes
 * @param {string[]} sounds  per-grapheme sound category (from graphemeSounds)
 * @returns {string[]}
 */
export function blendSteps(graphemes, sounds) {
  const steps = [];
  let acc = '';
  let pending = '';
  graphemes.forEach((g, i) => {
    // Affix tiles are written "-ed", "-ing" — the hyphen says "this joins
    // onto a word" and belongs on the tile, not in the spelling. Without
    // this the ladder for "stayed" ends at "stay-ed".
    const letters = g.replace(/^-/, '');
    if (sounds[i] === 'silent') {
      pending += letters;
      return;
    }
    acc += pending + letters;
    pending = '';
    steps.push(acc);
  });
  // Trailing silent letters (the magic e) belong on the last step.
  if (pending && steps.length) steps[steps.length - 1] += pending;
  return steps;
}

/** Index in `graphemes` of the nth sounded grapheme, or -1. */
export function soundedIndex(sounds, n) {
  let seen = -1;
  for (let i = 0; i < sounds.length; i++) {
    if (sounds[i] === 'silent') continue;
    if (++seen === n) return i;
  }
  return -1;
}

/**
 * Render an interactive blend ladder into `host`.
 *
 * @param {HTMLElement} host
 * @param {object} opts
 * @param {string} opts.word
 * @param {string[]} opts.graphemes
 * @param {string[]} opts.types
 * @param {(grapheme:string, type:string, ctx:object) => Promise<any>} opts.speakPhoneme
 * @param {(word:string) => Promise<any>} opts.speakWord
 * @param {string} [opts.extraActions] trusted markup appended to the buttons
 * @returns {{ destroy: () => void }}
 */
export function renderBlendLadder(
  host,
  { word, graphemes, types, speakPhoneme, speakWord, extraActions = '' },
) {
  const sounds = graphemeSounds(word, graphemes, types);
  const steps = blendSteps(graphemes, sounds);
  const hasSilent = sounds.includes('silent');
  let shown = 0;

  const tiles = graphemes.map((g, i) => {
    const meta = SOUND_META[sounds[i]] ?? SOUND_META.consonant;
    return html`<button
      type="button"
      class="bl-tile${sounds[i] === 'silent' ? ' bl-tile--silent' : ''}"
      data-idx="${i}"
      data-mark="${meta.mark || ''}"
      style="--tile-color:${meta.color}"
      aria-label="${
        sounds[i] === 'silent' ? `${g} is silent` : `Hear the sound for ${g}, ${meta.label}`
      }"
    >
      ${g}
    </button>`;
  });

  host.innerHTML = html`
    <div class="blend-ladder" data-word="${word}">
      <div class="bl-tiles" role="group" aria-label="The sounds in this word">${tiles}</div>
      ${hasSilent ? html`<p class="bl-note">Grey letters are silent — skip them.</p>` : ''}
      <ol class="bl-steps" aria-live="polite"></ol>
      <div class="bl-actions">
        <button class="btn btn--primary bl-next" type="button">Add a sound ▶</button>
        <button class="btn btn--ghost bl-again" type="button" hidden>Start again ↺</button>
        <button class="btn btn--ghost bl-say" type="button">🔊 Just hear the word</button>
        ${raw(extraActions)}
      </div>
      <details class="bl-help">
        <summary>🧑‍🏫 How to help</summary>
        <p>
          Point at each sound and let your child say it first, then tap to check. Blend as you go —
          <em>m… ma… map</em>. If they are tired or stuck, just tell them the word and keep the
          story moving.
        </p>
      </details>
    </div>
  `;

  const $ = (s) => host.querySelector(s);
  const list = $('.bl-steps');
  const next = $('.bl-next');
  const again = $('.bl-again');
  const say = $('.bl-say');
  const tileEls = [...host.querySelectorAll('.bl-tile')];

  function draw() {
    list.innerHTML = html`${steps
      .slice(0, shown)
      .map((s, i) => html`<li class="${i === shown - 1 ? 'is-new' : ''}">${s}</li>`)}`;
    tileEls.forEach((t) => {
      const idx = Number(t.dataset.idx);
      // A tile is lit once its sound has been added; silent letters light
      // with the step that completes their word.
      const order = sounds.slice(0, idx + 1).filter((s) => s !== 'silent').length - 1;
      const lit = sounds[idx] === 'silent' ? shown >= steps.length : order > -1 && order < shown;
      t.classList.toggle('is-lit', lit);
      t.classList.toggle('is-current', sounds[idx] !== 'silent' && order === shown - 1);
    });

    const done = shown >= steps.length;
    next.hidden = done;
    again.hidden = !done;
    // Before the child has blended, hearing the word is the quiet way out;
    // afterwards it is how they check themselves.
    say.textContent = done ? '🔊 Hear the word' : '🔊 Just hear the word';
    say.classList.toggle('bl-say--escape', !done);
    if (done && steps.length) {
      list.insertAdjacentHTML(
        'beforeend',
        String(html`<li class="bl-done">
          Now say the whole word, then tap 🔊 to check. Does it make sense in the sentence?
        </li>`),
      );
    }
  }

  function addSound() {
    if (shown >= steps.length) return;
    const idx = soundedIndex(sounds, shown);
    shown += 1;
    // The rung appears on the tap, and the sound plays alongside it. Gating
    // the next tap on the audio finishing meant a child pressing again got
    // nothing at all whenever a recording was slow to load — the one thing
    // a button must never do.
    draw();
    if (idx >= 0) {
      Promise.resolve(speakPhoneme(graphemes[idx], types[idx], { word, index: idx })).catch(
        () => {},
      );
    }
  }

  next.addEventListener('click', addSound);
  again.addEventListener('click', () => {
    shown = 0;
    draw();
    next.focus({ preventScroll: true });
  });
  say.addEventListener('click', () => {
    Promise.resolve(speakWord(word)).catch(() => {});
  });
  tileEls.forEach((t) =>
    t.addEventListener('click', async () => {
      const i = Number(t.dataset.idx);
      if (sounds[i] === 'silent') return;
      t.classList.add('is-tapped');
      setTimeout(() => t.classList.remove('is-tapped'), 300);
      try {
        await speakPhoneme(graphemes[i], types[i], { word, index: i });
      } catch {
        /* ignore */
      }
    }),
  );

  draw();
  return {
    destroy() {
      host.innerHTML = '';
    },
  };
}
