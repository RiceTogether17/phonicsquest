/**
 * PhonicsQuest — Reading Ruler
 *
 * An on-screen version of the card or ruler a child holds under a line of
 * print. It works on the lines they actually SEE — measured from where the
 * words landed after wrapping — not on paragraphs, because a paragraph is
 * three or four lines on a phone and tracking is a line-by-line job.
 *
 *   word    a pointer sits under one word at a time
 *   line    the ruler sits under the line; the lines below are covered
 *   window  only the current line is lit; above and below are dimmed
 *
 * Move it with Next / Back, the arrow keys, by tapping a line, or by dragging
 * the bar. It follows the voice while Giri reads, and keeps its place when the
 * text is resized or the screen is rotated.
 *
 * ── Why this exists ───────────────────────────────────────────────────────
 * The reader already had a "📏 Reading ruler" toggle. It set a class that
 * underlined `.sline--active` — and `.sline--active` is only ever set while
 * text-to-speech is speaking. So the ruler drew a line under the sentence the
 * app was reading aloud, and did nothing at all when the child read by
 * themselves, which is the only time a reading ruler has a purpose.
 *
 * Adapted from the Reading Ruler in the LiftOff Stories reader
 * (github.com/RiceTogether17/LiftOff), which was itself built from this app's
 * story mode. The measuring and dragging are its design; the theming, the
 * word-span selector and the reduced-motion handling are fitted to this app.
 */

export const RULER_MODES = Object.freeze([
  {
    id: 'word',
    icon: '👆',
    label: 'Word',
    hint: 'Point at each word as you read it.',
  },
  {
    id: 'line',
    icon: '📏',
    label: 'Line',
    hint: 'Keep the ruler under the line you are reading.',
  },
  {
    id: 'window',
    icon: '🔦',
    label: 'Window',
    hint: 'Only the line you are reading is bright.',
  },
]);

/**
 * Group word boxes (in reading order) into the visual lines they sit on. A
 * word starts a new line when its middle falls below the bottom of the line
 * being built — which is what makes this work on wrapped text, where the DOM
 * knows nothing about where a line begins.
 *
 * Pure, so the awkward cases (a superscript raising a box, a word hidden by
 * `display:none`) can be tested without a browser.
 *
 * @param {Array<{top:number, bottom:number}|null>} boxes null = not rendered
 * @returns {Array<{top:number, bottom:number, first:number, last:number}>}
 */
export function groupLines(boxes) {
  const lines = [];
  boxes.forEach((b, i) => {
    if (!b) return;
    const line = lines[lines.length - 1];
    if (!line || (b.top + b.bottom) / 2 > line.bottom) {
      lines.push({ top: b.top, bottom: b.bottom, first: i, last: i });
    } else {
      line.top = Math.min(line.top, b.top);
      line.bottom = Math.max(line.bottom, b.bottom);
      line.last = i;
    }
  });
  return lines;
}

const reduceMotion = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * The element that actually scrolls this story, or null for the window.
 *
 * PhonicsQuest is an app shell: `#app` and `main` are `overflow: hidden` and
 * the scrolling happens in a pane well inside the tree. Scrolling the window
 * — which is what a ruler written for a plain document does — moves the page
 * by the few pixels the document itself can move and leaves the child's line
 * off screen, with the whole visible story sitting under the veil.
 *
 * @param {HTMLElement} el
 * @returns {HTMLElement|null}
 */
export function scrollHost(el) {
  for (let n = el?.parentElement; n && n !== document.body; n = n.parentElement) {
    const oy = getComputedStyle(n).overflowY;
    if ((oy === 'auto' || oy === 'scroll') && n.scrollHeight > n.clientHeight + 2) return n;
  }
  return null;
}

/**
 * Mount a ruler over a story body.
 *
 * @param {HTMLElement} storyEl the `.story-body` element (must be positioned)
 * @param {object} opts
 * @param {'word'|'line'|'window'} opts.mode
 * @param {number|null} [opts.word] word index to start on (null = first line on screen)
 * @param {string} [opts.wordSelector] which spans count as words
 * @param {() => {top:number, bottom:number}} opts.safeArea viewport band not covered by bars
 * @param {(state:{word:number,line:number,lines:number,words:number,atEnd:boolean}) => void} [opts.onMove]
 */
export function createRuler(
  storyEl,
  { mode, word = null, wordSelector = '.wf-word', safeArea, onMove },
) {
  const words = [...storyEl.querySelectorAll(wordSelector)];
  let lines = [];
  let wordIdx = 0;
  let lineIdx = 0;

  const layer = document.createElement('div');
  layer.className = `ruler-layer ruler-layer--${mode}`;
  // The whole overlay is decoration; the child is told where they are by the
  // ruler's own controls, which are real buttons with live text.
  layer.setAttribute('aria-hidden', 'true');
  layer.innerHTML = `
    <div class="ruler-veil ruler-veil--above"></div>
    <div class="ruler-strip"></div>
    <div class="ruler-word"></div>
    <div class="ruler-veil ruler-veil--below"></div>
    <div class="ruler-bar" title="Drag me, or tap a line">
      <span class="ruler-arrow">▶</span>
      <span class="ruler-ticks"></span>
      <span class="ruler-grip">⠿</span>
    </div>`;
  storyEl.classList.add('has-ruler');
  storyEl.appendChild(layer);

  /**
   * The story's own text size. Read from a word rather than from the
   * container: the container carries layout, and the font size is set on the
   * `.sline` cards inside it — measuring the wrong element left the ruler bar
   * stuck at its 12px floor whatever size the child was reading at.
   */
  const emOf = () => {
    const src = words[wordIdx] ?? words[0] ?? storyEl;
    return parseFloat(getComputedStyle(src).fontSize) || 20;
  };

  const $ = (s) => layer.querySelector(s);
  const above = $('.ruler-veil--above');
  const below = $('.ruler-veil--below');
  const strip = $('.ruler-strip');
  const pointer = $('.ruler-word');
  const bar = $('.ruler-bar');

  // ── Measure the visual lines from the word boxes ──
  function measure() {
    const base = storyEl.getBoundingClientRect();
    lines = groupLines(
      words.map((el) => {
        const r = el.getBoundingClientRect();
        return r.width || r.height ? { top: r.top - base.top, bottom: r.bottom - base.top } : null;
      }),
    );
  }

  const lineOf = (wi) => {
    const k = lines.findIndex((l) => wi >= l.first && wi <= l.last);
    return k < 0 ? 0 : k;
  };

  // ── Draw ──
  function draw() {
    const line = lines[lineIdx];
    if (!line) return;
    const em = emOf();
    // Room above the line for the breve and macron the sound-colour scaffold
    // prints over short and long vowels — without it the ruler's veil would
    // clip the diacritic off the line the child is on.
    const padTop = em * 0.6;
    const barTop = line.bottom + em * 0.18;
    const barH = Math.max(12, em * 0.55);
    const height = storyEl.scrollHeight;

    above.style.height = `${Math.max(0, line.top - padTop)}px`;
    below.style.top = `${barTop + barH}px`;
    below.style.height = `${Math.max(0, height - barTop - barH)}px`;
    strip.style.top = `${line.top - padTop}px`;
    strip.style.height = `${barTop - (line.top - padTop)}px`;
    bar.style.top = `${barTop}px`;
    bar.style.height = `${barH}px`;

    const el = words[wordIdx];
    if (mode === 'word' && el) {
      const base = storyEl.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      pointer.style.left = `${r.left - base.left - 3}px`;
      pointer.style.width = `${r.width + 6}px`;
      pointer.style.top = `${r.top - base.top - 2}px`;
      pointer.style.height = `${r.height + 4}px`;
      bar.style.setProperty('--x', `${r.left - base.left + r.width / 2}px`);
    }
    words.forEach((w, i) => w.classList.toggle('is-pointed', mode === 'word' && i === wordIdx));
  }

  function report() {
    onMove?.({
      word: wordIdx,
      line: lineIdx,
      lines: lines.length,
      words: words.length,
      atEnd: mode === 'word' ? wordIdx >= words.length - 1 : lineIdx >= lines.length - 1,
    });
  }

  /** Keep the current line in the calm upper-middle of the screen. */
  function reveal() {
    const line = lines[lineIdx];
    if (!line) return;
    const base = storyEl.getBoundingClientRect();
    const em = emOf();
    const top = base.top + line.top - em * 0.6;
    const bottom = base.top + line.bottom + em * 1.2;
    const safe = safeArea();
    if (top >= safe.top && bottom <= safe.bottom) return;
    const target = safe.top + (safe.bottom - safe.top) * 0.28;
    const by = { top: top - target, behavior: reduceMotion() ? 'auto' : 'smooth' };
    (scrollHost(storyEl) ?? window).scrollBy(by);
  }

  function goLine(k, { scroll = true } = {}) {
    lineIdx = Math.max(0, Math.min(lines.length - 1, k));
    wordIdx = lines[lineIdx]?.first ?? 0;
    draw();
    report();
    if (scroll) reveal();
  }

  function goWord(i, { scroll = true } = {}) {
    wordIdx = Math.max(0, Math.min(words.length - 1, i));
    lineIdx = lineOf(wordIdx);
    draw();
    report();
    if (scroll) reveal();
  }

  /** The line whose band is nearest a viewport y coordinate. */
  function lineAtY(clientY) {
    const y = clientY - storyEl.getBoundingClientRect().top;
    let best = 0;
    let dist = Infinity;
    lines.forEach((l, k) => {
      const d = y < l.top ? l.top - y : y > l.bottom ? y - l.bottom : 0;
      if (d < dist) {
        dist = d;
        best = k;
      }
    });
    return best;
  }

  // ── Dragging the bar ──
  let dragging = false;
  bar.addEventListener('pointerdown', (e) => {
    dragging = true;
    bar.setPointerCapture?.(e.pointerId);
    layer.classList.add('is-dragging');
    e.preventDefault();
  });
  bar.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    // The ruler hangs under its line, so aim a little above the finger.
    const em = emOf();
    const k = lineAtY(e.clientY - em * 0.6);
    if (k !== lineIdx) goLine(k, { scroll: false });
  });
  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    layer.classList.remove('is-dragging');
    reveal();
  };
  bar.addEventListener('pointerup', endDrag);
  bar.addEventListener('pointercancel', endDrag);

  // ── Keep its place when the layout changes ──
  let raf = 0;
  const relayout = () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      measure();
      lineIdx = lineOf(wordIdx);
      if (mode !== 'word') wordIdx = lines[lineIdx]?.first ?? wordIdx;
      layer.classList.add('no-anim');
      draw();
      report();
      requestAnimationFrame(() => layer.classList.remove('no-anim'));
    });
  };
  const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(relayout) : null;
  ro?.observe(storyEl);
  document.fonts?.ready?.then(relayout).catch(() => {});

  // ── Start ──
  measure();
  if (word == null) {
    // Start on the first line the child can see, not back at the top.
    const safe = safeArea();
    const base = storyEl.getBoundingClientRect().top;
    const k = lines.findIndex((l) => base + l.top >= safe.top);
    lineIdx = Math.max(0, k);
    wordIdx = lines[lineIdx]?.first ?? 0;
  } else {
    wordIdx = Math.max(0, Math.min(words.length - 1, word));
    lineIdx = lineOf(wordIdx);
  }
  layer.classList.add('no-anim');
  draw();
  report();
  requestAnimationFrame(() => {
    layer.classList.remove('no-anim');
    if (word != null) reveal(); // coming back to a saved place: show it
  });

  return {
    next() {
      if (mode === 'word') goWord(wordIdx + 1);
      else goLine(lineIdx + 1);
    },
    prev() {
      if (mode === 'word') goWord(wordIdx - 1);
      else goLine(lineIdx - 1);
    },
    nextLine: () => goLine(lineIdx + 1),
    prevLine: () => goLine(lineIdx - 1),
    /** Tap: move to the tapped word (word mode) or the tapped line. */
    tap(clientY, wordEl) {
      const wi = wordEl ? words.indexOf(wordEl) : -1;
      if (wi >= 0) {
        if (mode === 'word') goWord(wi, { scroll: false });
        else goLine(lineOf(wi), { scroll: false });
      } else goLine(lineAtY(clientY), { scroll: false });
    },
    /** Follow a word element — used while Giri reads aloud. */
    follow(wordEl) {
      const wi = words.indexOf(wordEl);
      if (wi < 0) return;
      if (mode === 'word') {
        if (wi !== wordIdx) goWord(wi);
      } else if (lineOf(wi) !== lineIdx) goLine(lineOf(wi));
    },
    reveal,
    /** The word the ruler is on (Word mode: the pointed word). */
    current: () => words[wordIdx] ?? null,
    /** Jump to a word by its index in the story. */
    goTo(i) {
      if (mode === 'word') goWord(i);
      else goLine(lineOf(Math.max(0, Math.min(words.length - 1, i))));
    },
    destroy() {
      ro?.disconnect();
      cancelAnimationFrame(raf);
      words.forEach((w) => w.classList.remove('is-pointed'));
      storyEl.classList.remove('has-ruler');
      layer.remove();
    },
  };
}
