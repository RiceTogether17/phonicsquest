import { describe, it, expect, beforeEach } from 'vitest';
import { buildCopySummaryText, getModeConfig } from '../modes/clozeSessionSummary.js';
import { showAnswerReviewPanel } from '../modes/clozeReviewPanel.js';

describe('mode config', () => {
  it('practice mode allows hints and immediate feedback', () => {
    const cfg = getModeConfig('practice');
    expect(cfg.allowHints).toBe(true);
    expect(cfg.showImmediateFeedback).toBe(true);
    expect(cfg.showPerPassageReview).toBe(true);
  });

  it('exam mode hides inline hints and delays immediate feedback flag', () => {
    const cfg = getModeConfig('exam');
    expect(cfg.allowHints).toBe(false);
    expect(cfg.allowInfoPanel).toBe(false);
    expect(cfg.showImmediateFeedback).toBe(false);
    expect(cfg.showFinalReviewOnly).toBe(true);
  });

  it('practice mode keeps teaching flow on', () => {
    const cfg = getModeConfig('practice');
    expect(cfg.allowInfoPanel).toBe(true);
    expect(cfg.confettiPerPassage).toBe(true);
  });
});

describe('copy summary', () => {
  it('contains all required summary fields', () => {
    const text = buildCopySummaryText({
      modeLabel: 'Exam Mode',
      title: 'Passage A',
      category: 'connectors',
      level: 'P5',
      scoreLine: '8/10',
      accuracy: 80,
      timeTaken: '95s',
      hintsUsed: 1,
      clueScore: 70,
      wrongLines: ['- P5 Passage #3: because → although', '- P5 Passage #7: since → however'],
      nextStep: 'Revise connector clues',
    });
    expect(text).toContain('Mode: Exam Mode');
    expect(text).toContain('Passage: Passage A');
    expect(text).toContain('Score: 8/10');
    expect(text).toContain('Time: 95s');
    expect(text).toContain('Hints used: 1');
    expect(text).toContain('Clue score: 70%');
    expect(text).toContain('- P5 Passage #7: since → however');
    expect(text).toContain('Next Step: Revise connector clues');
  });
});

describe('review panel safety', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="host"></div>';
  });

  it('escapes explanation and answer text in review rows', () => {
    const host = document.getElementById('host');
    showAnswerReviewPanel({
      host,
      rows: [{
        blank: '#1',
        studentAnswer: '<img src=x onerror=alert(1)>',
        correctAnswer: 'answer',
        status: 'Try again',
        clue: '<script>alert(1)</script>',
        explanation: 'Use <b>context</b>',
      }],
    });

    expect(host.innerHTML).not.toContain('<script>');
    expect(host.innerHTML).toContain('&lt;img src=x onerror=alert(1)&gt;');
    expect(host.innerHTML).toContain('Use &lt;b&gt;context&lt;/b&gt;');
  });
});
