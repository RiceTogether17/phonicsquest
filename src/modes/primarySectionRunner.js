/**
 * PhonicsQuest – Primary section runner: catalogue, then one task at a time.
 *
 * Audit 2026-09-19, finding 17. The primary libraries rendered every item of
 * every grade into one page. A synthetic P6 profile opened Visual Text at P1
 * with **63 answer boxes**, Open-ended Comprehension at P1 with **107**, and
 * Situational Writing with **20**.
 *
 * Three things go wrong at once there. A P6 child starts five years below
 * their grade and has to scroll past work that is not theirs. Holding the
 * instructions in mind while hunting for the next task is load that has
 * nothing to do with English. And a page with no boundary has no end — there
 * is no moment where a child has finished something.
 *
 * So this module gives every section the shape the audit asks for:
 *
 *   1. a catalogue, defaulting to the learner's own grade, with a deliberate
 *      switch to reach another;
 *   2. one stimulus at a time, with its own questions and nothing else;
 *   3. visible progress, Previous/Next, and a clear end.
 *
 * Drafts survive navigation. A child who types half an answer, looks at the
 * next passage and comes back finds their words still there — losing them
 * would teach that moving around the app is dangerous.
 *
 * It is deliberately generic: Visual Text, Open-ended Comprehension and
 * Situational Writing differ only in how one item's body is drawn, so they
 * pass a `renderItem` and share everything else.
 */

import { escapeHtml, escapeAttr } from '../utils/escapeHtml.js';
import { getActiveProfile } from '../modules/profiles.js';

/** Grades the app teaches, in order. */
const GRADES = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'];

/**
 * The grade a section should open at.
 *
 * The learner's own, when they have one and the section has items for it.
 * Otherwise the nearest grade at or below theirs that does have items — a P6
 * child meeting a P5-only section should land on P5, not P1. Falls back to the
 * first grade present, which is also what a profile-less visitor gets.
 *
 * @param {string[]} availableLevels — levels this section actually has items for
 * @param {string|null} [profileGrade]
 * @returns {string}
 */
export function defaultLevelFor(availableLevels, profileGrade = null) {
  const present = GRADES.filter((g) => availableLevels.includes(g));
  if (!present.length) return availableLevels[0] ?? '';

  const grade = profileGrade || getActiveProfile()?.primaryGrade || null;
  if (grade && present.includes(grade)) return grade;

  if (grade && GRADES.includes(grade)) {
    const atOrBelow = present.filter((g) => GRADES.indexOf(g) <= GRADES.indexOf(grade));
    if (atOrBelow.length) return atOrBelow[atOrBelow.length - 1];
  }
  return present[0];
}

/**
 * Mount a catalogue-then-one-task section.
 *
 * @param {HTMLElement} host
 * @param {object} opts
 * @param {object[]} opts.items          every item, each with `level` and `title`
 * @param {string} opts.kind             section key, used for ids and drafts
 * @param {string} opts.unit             what one item is called ("passage", "poster")
 * @param {(item: object, index: number) => string} opts.renderItem
 * @param {(container: HTMLElement) => void} [opts.onItemMounted]
 *   Called after an item is painted, so the caller can wire its answer boxes.
 */
export function mountSectionRunner(host, { items, kind, unit, renderItem, onItemMounted }) {
  if (!host) return;

  const levels = [...new Set(items.map((i) => i.level))].sort();
  let level = defaultLevelFor(levels);
  let index = -1; // -1 = catalogue
  /** Typed answers, kept while the child moves around. */
  const drafts = new Map();

  const itemsAt = () => items.filter((i) => i.level === level);

  /** Remember whatever is typed before the DOM is replaced. */
  function captureDrafts() {
    host.querySelectorAll('textarea[id], input[type="text"][id]').forEach((el) => {
      if (el.value) drafts.set(el.id, el.value);
      else drafts.delete(el.id);
    });
  }

  /** Put remembered answers back after a repaint. */
  function restoreDrafts() {
    host.querySelectorAll('textarea[id], input[type="text"][id]').forEach((el) => {
      const saved = drafts.get(el.id);
      if (saved !== undefined && !el.value) el.value = saved;
    });
  }

  function renderCatalogue() {
    const list = itemsAt();
    const grade = getActiveProfile()?.primaryGrade;
    const isOwnGrade = grade && grade === level;

    host.innerHTML = `
      <div class="psr" data-psr-view="catalogue">
        <div class="psr-levelbar" role="group" aria-label="Choose a level">
          ${levels
            .map(
              (lv) => `
            <button type="button" class="psr-level ${lv === level ? 'psr-level--active' : ''}"
                    data-psr-level="${escapeAttr(lv)}" aria-pressed="${lv === level}">
              ${escapeHtml(lv)}${grade === lv ? '<span class="psr-level-mine"> · yours</span>' : ''}
            </button>`,
            )
            .join('')}
        </div>

        <p class="psr-intro">
          ${
            isOwnGrade
              ? `Showing ${escapeHtml(level)} — your level. ${list.length} ${escapeHtml(unit)}${list.length === 1 ? '' : 's'} to choose from.`
              : `Showing ${escapeHtml(level)}. ${list.length} ${escapeHtml(unit)}${list.length === 1 ? '' : 's'}${grade ? ` — your level is ${escapeHtml(grade)}.` : '.'}`
          }
        </p>

        <ul class="psr-catalogue">
          ${list
            .map(
              (item, i) => `
            <li class="psr-catalogue-item">
              <button type="button" class="psr-open" data-psr-open="${i}">
                <span class="psr-open-title">${escapeHtml(item.title || `${unit} ${i + 1}`)}</span>
                <span class="psr-open-meta">${(item.questions || []).length || 1} question${((item.questions || []).length || 1) === 1 ? '' : 's'}</span>
              </button>
            </li>`,
            )
            .join('')}
        </ul>
      </div>`;

    host.querySelectorAll('[data-psr-level]').forEach((btn) => {
      btn.addEventListener('click', () => {
        captureDrafts();
        level = btn.getAttribute('data-psr-level');
        index = -1;
        renderCatalogue();
      });
    });
    host.querySelectorAll('[data-psr-open]').forEach((btn) => {
      btn.addEventListener('click', () => {
        index = Number(btn.getAttribute('data-psr-open'));
        renderItemView();
      });
    });
  }

  /**
   * Bring the new task's heading into view after a move.
   *
   * Guarded: `scrollIntoView` is absent in JSDOM and in some embedded
   * browsers, and an exception here would leave the child on a screen whose
   * Next button appears to do nothing. Scrolling is a nicety; navigating is
   * not.
   */
  function focusTop() {
    const top = host.querySelector('.psr-progress');
    if (!top) return;
    try {
      top.scrollIntoView?.({ block: 'start' });
    } catch (_) {
      /* no scrolling available — the repaint already happened */
    }
  }

  function renderItemView() {
    const list = itemsAt();
    const item = list[index];
    if (!item) {
      index = -1;
      renderCatalogue();
      return;
    }

    host.innerHTML = `
      <div class="psr" data-psr-view="item">
        <div class="psr-taskbar">
          <button type="button" class="btn btn--ghost btn--sm" data-psr-back>← All ${escapeHtml(unit)}s</button>
          <p class="psr-progress" aria-live="polite">
            ${escapeHtml(level)} · ${escapeHtml(unit)} ${index + 1} of ${list.length}
          </p>
        </div>

        <article class="placeholder-card psr-item">
          ${renderItem(item, index)}
        </article>

        <nav class="psr-nav" aria-label="Move between ${escapeHtml(unit)}s">
          <button type="button" class="btn btn--ghost" data-psr-prev ${index === 0 ? 'disabled' : ''}>
            ← Previous
          </button>
          <button type="button" class="btn btn--primary" data-psr-next>
            ${index === list.length - 1 ? 'Finish' : 'Next →'}
          </button>
        </nav>
      </div>`;

    restoreDrafts();
    onItemMounted?.(host);

    host.querySelector('[data-psr-back]')?.addEventListener('click', () => {
      captureDrafts();
      index = -1;
      renderCatalogue();
    });
    host.querySelector('[data-psr-prev]')?.addEventListener('click', () => {
      captureDrafts();
      if (index > 0) index -= 1;
      renderItemView();
      focusTop();
    });
    host.querySelector('[data-psr-next]')?.addEventListener('click', () => {
      captureDrafts();
      if (index >= list.length - 1) {
        renderDone(list.length);
        return;
      }
      index += 1;
      renderItemView();
      focusTop();
    });
  }

  /**
   * A clear end. The old page had none — a child scrolled until the scrolling
   * stopped, which is not the same as finishing.
   */
  function renderDone(total) {
    host.innerHTML = `
      <div class="psr" data-psr-view="done">
        <div class="psr-done">
          <p class="psr-done-icon" aria-hidden="true">🎉</p>
          <h3 class="psr-done-title">That's the last ${escapeHtml(unit)} in ${escapeHtml(level)}.</h3>
          <p class="psr-done-sub">You worked through ${total} of them.</p>
          <div class="psr-nav">
            <button type="button" class="btn btn--ghost" data-psr-back>← Back to the list</button>
            ${
              GRADES.indexOf(level) < GRADES.length - 1 &&
              levels.includes(GRADES[GRADES.indexOf(level) + 1])
                ? `<button type="button" class="btn btn--primary" data-psr-nextlevel>Try ${escapeHtml(GRADES[GRADES.indexOf(level) + 1])} →</button>`
                : ''
            }
          </div>
        </div>
      </div>`;

    host.querySelector('[data-psr-back]')?.addEventListener('click', () => {
      index = -1;
      renderCatalogue();
    });
    host.querySelector('[data-psr-nextlevel]')?.addEventListener('click', () => {
      level = GRADES[GRADES.indexOf(level) + 1];
      index = -1;
      renderCatalogue();
    });
  }

  renderCatalogue();
  return {
    /** Exposed for tests: what the runner decided to open at. */
    get level() {
      return level;
    },
  };
}
