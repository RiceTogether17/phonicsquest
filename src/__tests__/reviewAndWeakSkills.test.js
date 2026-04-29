import { describe, it, expect, beforeEach } from 'vitest';
import { showAnswerReviewPanel } from '../modes/clozeReviewPanel.js';
import { getTopWeakSkills, recordWeakSkills } from '../modes/clozeCompletionTracker.js';

describe('review enrichment', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="host"></div>';
  });

  it('renders enriched fields and escapes unsafe text', () => {
    const host = document.getElementById('host');
    showAnswerReviewPanel({
      host,
      rows: [{
        passageTitle: '<img onerror=1>',
        blank: '1',
        studentAnswer: '<script>x</script>',
        correctAnswer: 'went',
        skillLabel: 'Verb tense',
        clueTypeLabel: 'Time clue',
        clue: 'yesterday',
        explanation: 'past action',
        nextStepPrompt: 'Look for time words.',
      }],
    });

    const html = host.innerHTML;
    expect(html).toContain('Verb tense');
    expect(html).toContain('Time clue');
    expect(html).toContain('Look for time words.');
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('<img');
  });

  it('renders word-vault context review fields safely', () => {
    const host = document.getElementById('host');
    showAnswerReviewPanel({
      host,
      rows: [{
        passageTitle: 'Vault <b>1</b>',
        blank: '2',
        studentAnswer: 'assured',
        correctAnswer: 'lamented',
        skillLabel: 'Meaning in context',
        clueTypeLabel: 'Meaning clue',
        clue: 'It was hopeless',
        explanation: 'Trap check: positive meaning mismatches sad context.',
        nextStepPrompt: 'Use sentence clues. POS: verb. Writing tip: Use for disappointment.',
      }],
    });
    const html = host.innerHTML;
    expect(html).toContain('Meaning clue');
    expect(html).toContain('Trap check');
    expect(html).toContain('POS: verb');
    expect(html).not.toContain('<b>');
  });
});

describe('weak skills tracking', () => {
  it('records attempts and wrong without erasing other levels', () => {
    const current = { P3: { tense: { attempts: 1, wrong: 1, lastSeenAt: 1 } } };
    const next = recordWeakSkills({
      storageKey: 'ccqWeakSkills',
      level: 'P4',
      skills: ['tense', 'connectorLogic'],
      wrongSkillSet: new Set(['tense']),
      now: 100,
      current,
    });
    expect(next.P3.tense.attempts).toBe(1);
    expect(next.P4.tense.attempts).toBe(1);
    expect(next.P4.tense.wrong).toBe(1);
    expect(next.P4.connectorLogic.wrong).toBe(0);
  });

  it('returns top 3 weak skills', () => {
    const top = getTopWeakSkills({
      level: 'P4',
      weakSkillsMap: { P4: {
        tense: { attempts: 4, wrong: 3 },
        connectorLogic: { attempts: 5, wrong: 2 },
        collocation: { attempts: 2, wrong: 2 },
        grammar: { attempts: 8, wrong: 1 },
      } },
    });
    expect(top).toHaveLength(3);
    expect(top[0].skill).toBe('collocation');
  });
});
