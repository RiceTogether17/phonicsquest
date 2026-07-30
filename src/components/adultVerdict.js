/**
 * Grown-up verdict bar.
 *
 * Preschool decoding cannot be assessed reliably by the child. Asking a
 * five-year-old "Did you blend it right?" measures confidence, not reading —
 * and no amount of button telemetry can tell whether they blended the word
 * or echoed the model. An adult sitting beside them can.
 *
 * When `adultObserverMode` is on, this bar renders under the mode area and
 * the grown-up marks each word:
 *
 *   Independent        → the child did it unaided        (correct, verified)
 *   With a little help → they got there with support     (correct, guided)
 *   Not yet            → not this time                   (wrong, guided)
 *
 * A verdict IS the result: tapping one finishes the word. `verified` is the
 * only evidence level nothing else can produce (see modules/evidence.js),
 * which is why this control exists at all.
 *
 * Off by default — a child practising alone should not see a control meant
 * for someone else.
 */

const CONTAINER_ID = 'adult-verdict-bar';

/** @typedef {'independent'|'help'|'not-yet'} AdultVerdict */

const OPTIONS = Object.freeze([
  { verdict: 'independent', label: 'Independent', icon: '✅', correct: true },
  { verdict: 'help', label: 'With a little help', icon: '🤝', correct: true },
  { verdict: 'not-yet', label: 'Not yet', icon: '🌱', correct: false },
]);

/**
 * Render the bar after `anchor`. Removes any previous instance first, so
 * calling this once per word is safe.
 *
 * @param {object} opts
 * @param {HTMLElement|null} opts.anchor  element to insert after (the mode area)
 * @param {(verdict: AdultVerdict, correct: boolean) => void} opts.onVerdict
 * @returns {boolean} true if the bar was rendered
 */
export function renderAdultVerdictBar({ anchor, onVerdict }) {
  removeAdultVerdictBar();
  if (!anchor?.parentNode) return false;

  const bar = document.createElement('div');
  bar.id = CONTAINER_ID;
  bar.className = 'adult-verdict';
  bar.setAttribute('role', 'group');
  bar.setAttribute('aria-label', 'Grown-up: how did that go?');

  const legend = document.createElement('p');
  legend.className = 'adult-verdict__legend';
  legend.textContent = '👋 Grown-up — how did that go?';
  bar.appendChild(legend);

  const row = document.createElement('div');
  row.className = 'adult-verdict__row';

  for (const opt of OPTIONS) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `btn btn--lg adult-verdict__btn adult-verdict__btn--${opt.verdict}`;
    btn.dataset.verdict = opt.verdict;
    btn.textContent = `${opt.icon} ${opt.label}`;
    btn.addEventListener(
      'click',
      () => {
        // Lock immediately: a double-tap must not commit two results.
        for (const b of row.querySelectorAll('button')) b.disabled = true;
        onVerdict?.(opt.verdict, opt.correct);
      },
      { once: true },
    );
    row.appendChild(btn);
  }

  bar.appendChild(row);
  anchor.parentNode.insertBefore(bar, anchor.nextSibling);
  return true;
}

/** Remove the bar if present. */
export function removeAdultVerdictBar() {
  document.getElementById(CONTAINER_ID)?.remove();
}
