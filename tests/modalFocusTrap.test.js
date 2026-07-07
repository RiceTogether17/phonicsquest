/**
 * Modal keyboard accessibility: focus moves into the dialog on open, Tab and
 * Shift+Tab cycle inside it (never escape to the page behind), and closing
 * hands focus back to the control that opened it.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { modalManager } from '../src/modules/modalManager.js';

function pressTab(shiftKey = false) {
  const e = new KeyboardEvent('keydown', { key: 'Tab', shiftKey, bubbles: true, cancelable: true });
  document.dispatchEvent(e);
  return e;
}

describe('modalManager focus management', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <button id="opener">Open settings</button>
      <button id="background-btn">Background</button>
      <div id="test-modal" role="dialog" aria-modal="true" hidden>
        <button id="m-first">First</button>
        <input id="m-input" />
        <button id="m-last">Last</button>
      </div>
    `;
  });

  it('moves focus to the first control on open', () => {
    document.getElementById('opener').focus();
    modalManager.open('test-modal');
    expect(document.activeElement.id).toBe('m-first');
  });

  it('wraps Tab from the last control back to the first', () => {
    modalManager.open('test-modal');
    document.getElementById('m-last').focus();
    const e = pressTab();
    expect(e.defaultPrevented).toBe(true);
    expect(document.activeElement.id).toBe('m-first');
  });

  it('wraps Shift+Tab from the first control to the last', () => {
    modalManager.open('test-modal');
    document.getElementById('m-first').focus();
    const e = pressTab(true);
    expect(e.defaultPrevented).toBe(true);
    expect(document.activeElement.id).toBe('m-last');
  });

  it('pulls focus back inside if it ends up outside the dialog', () => {
    modalManager.open('test-modal');
    document.getElementById('background-btn').focus();
    pressTab();
    expect(document.getElementById('test-modal').contains(document.activeElement)).toBe(true);
  });

  it('does not interfere with Tab between middle controls', () => {
    modalManager.open('test-modal');
    document.getElementById('m-input').focus();
    const e = pressTab();
    expect(e.defaultPrevented).toBe(false); // browser default moves focus
  });

  it('restores focus to the opener on close', () => {
    document.getElementById('opener').focus();
    modalManager.open('test-modal');
    modalManager.close('test-modal');
    expect(document.activeElement.id).toBe('opener');
  });

  it('restores focus when closed via Escape', () => {
    document.getElementById('opener').focus();
    modalManager.open('test-modal');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(document.getElementById('test-modal').hidden).toBe(true);
    expect(document.activeElement.id).toBe('opener');
  });

  it('stops trapping after close', () => {
    modalManager.open('test-modal');
    modalManager.close('test-modal');
    document.getElementById('background-btn').focus();
    const e = pressTab();
    expect(e.defaultPrevented).toBe(false);
  });
});
