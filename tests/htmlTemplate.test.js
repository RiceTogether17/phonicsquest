/**
 * Auto-escaping html`` tag: interpolations are escaped by default,
 * raw()/nested-html`` compose without double-escaping.
 */
import { describe, it, expect } from 'vitest';
import { html, raw } from '../src/utils/html.js';

describe('html tagged template', () => {
  it('escapes interpolated values by default', () => {
    const evil = '<img src=x onerror=alert(1)>';
    expect(String(html`<p>${evil}</p>`)).toBe('<p>&lt;img src=x onerror=alert(1)&gt;</p>');
  });

  it('leaves the literal template markup intact', () => {
    expect(String(html`<div class="a"><b>hi</b></div>`)).toBe('<div class="a"><b>hi</b></div>');
  });

  it('splices raw() content verbatim', () => {
    expect(String(html`<ul>${raw('<li>one</li>')}</ul>`)).toBe('<ul><li>one</li></ul>');
  });

  it('composes nested html`` without double-escaping', () => {
    const name = 'Tom & Jerry';
    const item = html`<li>${name}</li>`;
    expect(String(html`<ul>${item}</ul>`)).toBe('<ul><li>Tom &amp; Jerry</li></ul>');
  });

  it('joins arrays, applying the same rules per element', () => {
    const names = ['a<b', 'c>d'];
    expect(String(html`<ul>${names.map((n) => html`<li>${n}</li>`)}</ul>`)).toBe(
      '<ul><li>a&lt;b</li><li>c&gt;d</li></ul>',
    );
  });

  it('renders null/undefined/false as empty (conditional rendering)', () => {
    const show = false;
    expect(String(html`<p>${null}${undefined}${show && 'no'}</p>`)).toBe('<p></p>');
    expect(String(html`<p>${0}</p>`)).toBe('<p>0</p>'); // but 0 renders
  });

  it('works when assigned to innerHTML (coerces via toString)', () => {
    const el = document.createElement('div');
    el.innerHTML = html`<span>${'<script>x</script>'}</span>`;
    expect(el.querySelector('script')).toBeNull();
    expect(el.textContent).toBe('<script>x</script>');
  });
});
