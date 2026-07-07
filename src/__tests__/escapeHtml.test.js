/**
 * Tests for the HTML-escaping utilities. These are the last line of defence
 * before child- or AI-authored text reaches innerHTML, so every metacharacter
 * must be covered.
 */
import { describe, it, expect } from 'vitest';
import { escapeHtml, escapeAttr } from '../utils/escapeHtml.js';

describe('escapeHtml', () => {
  it('escapes all five HTML metacharacters', () => {
    expect(escapeHtml(`<img src=x onerror="alert('xss')" & more>`)).toBe(
      '&lt;img src=x onerror=&quot;alert(&#39;xss&#39;)&quot; &amp; more&gt;',
    );
  });

  it('escapes ampersands first so entities are not double-decoded', () => {
    expect(escapeHtml('&lt;script&gt;')).toBe('&amp;lt;script&amp;gt;');
  });

  it('neutralises a script tag', () => {
    const out = escapeHtml('<script>alert(1)</script>');
    expect(out).not.toContain('<script>');
    expect(out).toBe('&lt;script&gt;alert(1)&lt;/script&gt;');
  });

  it('passes plain text through unchanged', () => {
    expect(escapeHtml('The cat sat on the mat.')).toBe('The cat sat on the mat.');
  });

  it('coerces null, undefined and numbers to safe strings', () => {
    expect(escapeHtml(null)).toBe('');
    expect(escapeHtml(undefined)).toBe('');
    expect(escapeHtml(42)).toBe('42');
  });
});

describe('escapeAttr', () => {
  it('additionally escapes backticks for attribute contexts', () => {
    expect(escapeAttr('`bad` & <worse>')).toBe('&#96;bad&#96; &amp; &lt;worse&gt;');
  });
});
