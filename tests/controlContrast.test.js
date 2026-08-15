import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Two contrast defects this guards against, both found by measuring the real
 * app rather than reading the stylesheet:
 *
 * 1. `.primary-placeholder .ptg-launcher-card .btn { color: var(--color-primary) }`
 *    tinted every button in a launcher card to the brand colour — including
 *    `.btn--primary`, whose *fill* is that same colour. The "Start paper"
 *    buttons rendered as blank purple slabs: rgb(90,82,224) text on an
 *    rgb(90,82,224) background, a 1:1 contrast ratio.
 *
 * 2. Controls that draw themselves with only a border used `--border`
 *    (#e5e3fa, 1.26:1 on white) — a divider tint, well under the 3:1 WCAG
 *    1.4.11 asks for a UI component boundary. Level cards and ghost buttons
 *    read as blank white space.
 *
 * These are string checks on the stylesheet: jsdom does not compute
 * `color-mix()` or cascade specificity, so the measured ratios live in the
 * browser sweep, not here. What is testable is that the rules stay as they
 * were left.
 */

// Vitest runs from the repo root; import.meta.url is not a file URL here.
const CSS = readFileSync(resolve(process.cwd(), 'src/styles/main.css'), 'utf8');

describe('button colour inside placeholder cards', () => {
  it('never re-tints a .btn to the brand colour it may be filled with', () => {
    expect(CSS).not.toContain('.primary-placeholder .ptg-launcher-card .btn,');
    expect(CSS).not.toMatch(/\.ptg-launcher-card \.btn\s*\{[^}]*color:\s*var\(--color-primary\)/);
  });

  it('excludes buttons from the blanket dark-text override', () => {
    // Each .btn variant owns its foreground/background pair; forcing only the
    // foreground breaks the pairing.
    for (const scope of ['.p1pt-paper', '.ptg-stage', '.ptg-launcher-card']) {
      expect(CSS).toContain(`.primary-placeholder ${scope} *:not(.btn):not(.btn *)`);
    }
    expect(CSS).not.toContain('.primary-placeholder .ptg-stage *,');
    expect(CSS).not.toContain('.primary-placeholder .ptg-launcher-card * {');
  });
});

describe('control boundaries', () => {
  it('defines a control border derived from the theme text colour', () => {
    expect(CSS).toMatch(
      /--border-control:\s*color-mix\(in srgb, var\(--text\) 56%, var\(--surface\)\)/,
    );
  });

  it('keeps pure black in the high-contrast theme rather than softening it', () => {
    const contrastBlock = CSS.slice(CSS.indexOf("[data-theme='contrast']"));
    expect(contrastBlock.slice(0, 600)).toContain('--border-control: #000000');
  });

  it('applies it to the controls the browser sweep found flat', () => {
    for (const sel of [
      '.btn--ghost',
      '.sfq-level-btn',
      '.cloze-level-btn',
      '.mcq-skill-card',
      '.wv-cat-btn',
      '.exam-hub-mode-btn',
      '.ptg-mode-btn',
      '.mission-step',
      '.home-group',
      '.mcq-chooser',
      '.dash-group',
      '.early-reading-toggle',
      '.open-response__input',
    ]) {
      expect(CSS.includes(`\n${sel},`) || CSS.includes(`\n${sel} {`)).toBe(true);
    }
    expect(CSS).toMatch(/border-color:\s*var\(--border-control\)/);
  });

  it("moves the ghost button's shadow lip with its border", () => {
    expect(CSS).toMatch(/box-shadow:\s*0 3px 0 var\(--border-control\)/);
  });

  it('leaves selected states on the primary colour', () => {
    expect(CSS).toMatch(
      /\.sfq-level-btn--done,\s*\n\.mcq-level-card--active,[\s\S]{0,120}border-color:\s*var\(--color-primary\)/,
    );
  });
});
