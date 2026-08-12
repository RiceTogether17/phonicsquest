import { describe, expect, it } from 'vitest';
import { MCQ_ROUND_SIZE } from '../constants.js';
import { renderMcqQuickStart } from '../modes/mcqBrowserShell.js';

/**
 * The MCQ browsers opened on a three-step configuration screen — level, then
 * support level, then skill — 3,722 px and 40 buttons on a 390px viewport,
 * with the "just start" button buried at the bottom of step three. A child who
 * wants to practise should not configure a practice session first.
 */

const CHOOSER = '<section class="mcq-browser-section">chooser</section>';

describe('renderMcqQuickStart', () => {
  const html = renderMcqQuickStart({
    prefix: 'gmcq',
    level: 'P4',
    recommended: true,
    chooserHtml: CHOOSER,
  });

  it('leads with one button that says exactly what it starts', () => {
    expect(html).toContain('id="gmcq-quick-start"');
    expect(html).toContain(`Start ${MCQ_ROUND_SIZE} questions · P4`);
  });

  it('keeps the full chooser, one tap away and closed', () => {
    expect(html).toContain(CHOOSER);
    expect(html).toContain('<details class="mcq-chooser">');
    expect(html).not.toContain('<details class="mcq-chooser" open');
    expect(html).toContain('Change level, support or skill');
  });

  it('says why this level, when it is the recommended one', () => {
    expect(html).toContain('the level we recommend');
  });

  it('drops the recommendation claim when the level was chosen by hand', () => {
    const manual = renderMcqQuickStart({ prefix: 'vmcq', level: 'P2', chooserHtml: CHOOSER });
    expect(manual).not.toContain('recommend');
    expect(manual).toContain('Practising at P2.');
    expect(manual).toContain('id="vmcq-quick-start"');
  });

  it('escapes the level rather than splicing it raw', () => {
    const nasty = renderMcqQuickStart({
      prefix: 'gmcq',
      level: '<img src=x onerror=alert(1)>',
      chooserHtml: '',
    });
    expect(nasty).not.toContain('<img');
    expect(nasty).toContain('&lt;img');
  });
});
