import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderReadFirstScan } from '../modes/readFirstScan.js';

describe('renderReadFirstScan', () => {
  let host;
  beforeEach(() => {
    document.body.innerHTML = '<div id="host"></div>';
    host = document.getElementById('host');
  });

  it('renders Castle Scan defaults for cloze and escapes the title', () => {
    renderReadFirstScan({
      host,
      quest: 'cloze',
      passageTitle: '<img onerror=alert(1)>',
      onContinue: () => {},
    });
    const html = host.innerHTML;
    expect(html).toContain('Castle Scan');
    expect(html).toContain('Read the whole passage first.');
    expect(html).toContain('What is the passage mostly about?');
    expect(html).toContain('I have read the passage');
    expect(html).not.toContain('<img');
    expect(host.querySelector('#cloze-read-first')).not.toBeNull();
    expect(host.querySelector('#cloze-quit')).not.toBeNull();
  });

  it('renders the passage text on the read-first screen and escapes unsafe text', () => {
    renderReadFirstScan({
      host,
      quest: 'cloze',
      passageTitle: 'Storm Day',
      passageText: 'Yesterday, I ___ to the park. <script>alert(1)</script>',
      onContinue: () => {},
    });
    const html = host.innerHTML;
    expect(html).toContain('Yesterday, I ___ to the park.');
    expect(html).not.toContain('<script>');
  });

  it('omits the passage block when no text is provided', () => {
    renderReadFirstScan({ host, quest: 'cloze', passageTitle: 'X', onContinue: () => {} });
    expect(host.querySelector('.cloze-game-scan-passage')).toBeNull();
  });

  it('renders Vault Scan defaults for vault quest', () => {
    renderReadFirstScan({
      host,
      quest: 'vault',
      passageTitle: 'A Stormy Night',
      onContinue: () => {},
    });
    const html = host.innerHTML;
    expect(html).toContain('Vault Scan');
    expect(html).toContain('Read the sentence first.');
    expect(html).toContain('I have read the sentence');
    expect(host.querySelector('#wv-read-first')).not.toBeNull();
    expect(host.querySelector('#wv-quit')).not.toBeNull();
  });

  it('invokes onContinue once when the acknowledgement button is clicked', () => {
    const onContinue = vi.fn();
    renderReadFirstScan({ host, quest: 'cloze', passageTitle: 'T', onContinue });
    host.querySelector('#cloze-read-first').click();
    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it('invokes onQuit when the menu button is clicked', () => {
    const onQuit = vi.fn();
    renderReadFirstScan({ host, quest: 'vault', passageTitle: 'T', onContinue: () => {}, onQuit });
    host.querySelector('#wv-quit').click();
    expect(onQuit).toHaveBeenCalledTimes(1);
  });

  it('returns silently when host is missing', () => {
    expect(() => renderReadFirstScan({ host: null, onContinue: () => {} })).not.toThrow();
  });
});
