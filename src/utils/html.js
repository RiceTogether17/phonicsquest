// @ts-check
/**
 * PhonicsQuest – auto-escaping HTML template tag.
 *
 * The codebase builds UI with template literals assigned to innerHTML —
 * ~350 call sites, each relying on the author remembering to escape. This
 * tag flips the default: every interpolated value is HTML-escaped unless
 * explicitly marked trusted with raw().
 *
 *   import { html, raw } from '../utils/html.js';
 *   el.innerHTML = html`<p>Hello ${childName}!</p>`;          // escaped
 *   el.innerHTML = html`<ul>${raw(items.map(...).join(''))}</ul>`; // opt-out
 *
 * Composition: the result of one html`...` call is already-safe markup, so
 * nesting works without double-escaping — html`` returns a Raw that a
 * parent html`` splices in verbatim. Arrays are joined with '' (each
 * element escaped or spliced by the same rules), so `.map(...)` works
 * without the trailing `.join('')`.
 *
 * New render code should use this instead of bare template literals;
 * migrate old call sites opportunistically (IMPROVEMENTS.md #27).
 */

import { escapeHtml } from './escapeHtml.js';

/** Wrapper marking a string as trusted, pre-escaped markup. */
class Raw {
  /** @param {string} value */
  constructor(value) {
    this.value = value;
  }
  toString() {
    return this.value;
  }
}

/**
 * Mark markup as trusted so html`` splices it verbatim. Only pass strings
 * you built yourself from escaped parts — never child or AI text.
 * @param {string} value
 */
export function raw(value) {
  return new Raw(String(value ?? ''));
}

/**
 * @param {unknown} value
 * @returns {string}
 */
function _render(value) {
  if (value == null || value === false) return ''; // allow `${cond && html`...`}`
  if (value instanceof Raw) return value.value;
  if (Array.isArray(value)) return value.map(_render).join('');
  return escapeHtml(value);
}

/**
 * Tagged template: escapes every interpolation, returns a Raw so nested
 * html`` calls compose. Assign `.toString()`d result (or the object —
 * innerHTML coerces) to innerHTML.
 *
 * @param {TemplateStringsArray} strings
 * @param {...unknown} values
 * @returns {Raw}
 */
export function html(strings, ...values) {
  let out = '';
  for (let i = 0; i < strings.length; i++) {
    out += strings[i];
    if (i < values.length) out += _render(values[i]);
  }
  return new Raw(out);
}
