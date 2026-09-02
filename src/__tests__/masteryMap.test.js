import { describe, it, expect } from 'vitest';
import {
  recordMasteryAttempt,
  getTopMasteryGaps,
  summariseMasteryGap,
} from '../modes/masteryMap.js';
import { groupWrongLinesBySkill } from '../modes/clozeSessionSummary.js';

describe('recordMasteryAttempt', () => {
  it('returns the input unchanged when required keys are missing', () => {
    const out = recordMasteryAttempt({ current: { foo: 1 } });
    expect(out).toEqual({ foo: 1 });
  });

  it('builds nested structure on first call and bumps counters on second', () => {
    let map = recordMasteryAttempt({
      mode: 'clozeCastle',
      level: 'P4',
      category: 'tense',
      skill: 'tense',
      clueType: 'timeClue',
      wasWrong: true,
      example: {
        passageId: 'p1',
        blankIndex: 0,
        chosen: 'walk',
        correct: 'walked',
        clueType: 'timeClue',
      },
      now: 1000,
      current: {},
    });
    map = recordMasteryAttempt({
      mode: 'clozeCastle',
      level: 'P4',
      category: 'tense',
      skill: 'tense',
      clueType: 'timeClue',
      wasWrong: false,
      now: 2000,
      current: map,
    });
    const skill = map.clozeCastle.P4.tense;
    expect(skill.attempts).toBe(2);
    expect(skill.wrong).toBe(1);
    expect(skill.lastSeenAt).toBe(2000);
    expect(skill.byCategory.tense).toEqual({ attempts: 2, wrong: 1 });
    expect(skill.byClueType.timeClue).toEqual({ attempts: 2, wrong: 1 });
    expect(skill.recentExamples).toHaveLength(1);
    expect(skill.recentExamples[0].chosen).toBe('walk');
  });

  it('caps recentExamples at 5 most recent wrong slips', () => {
    let map = {};
    for (let i = 0; i < 7; i++) {
      map = recordMasteryAttempt({
        mode: 'clozeCastle',
        level: 'P5',
        category: 'connectors',
        skill: 'connectorLogic',
        clueType: 'connectorClue',
        wasWrong: true,
        example: {
          passageId: `p${i}`,
          blankIndex: i,
          chosen: 'and',
          correct: 'although',
          clueType: 'connectorClue',
        },
        now: 1000 + i,
        current: map,
      });
    }
    const examples = map.clozeCastle.P5.connectorLogic.recentExamples;
    expect(examples).toHaveLength(5);
    expect(examples[0].passageId).toBe('p6');
    expect(examples[examples.length - 1].passageId).toBe('p2');
  });

  it('does not erase tracking for other modes or levels', () => {
    let map = recordMasteryAttempt({
      mode: 'clozeCastle',
      level: 'P3',
      skill: 'tense',
      wasWrong: false,
      current: {},
    });
    map = recordMasteryAttempt({
      mode: 'wordVault',
      level: 'P5',
      skill: 'collocation',
      wasWrong: true,
      example: {
        passageId: 'v1',
        blankIndex: 0,
        chosen: 'do',
        correct: 'make',
        clueType: 'collocationClue',
      },
      current: map,
    });
    expect(map.clozeCastle.P3.tense.attempts).toBe(1);
    expect(map.wordVault.P5.collocation.attempts).toBe(1);
    expect(map.wordVault.P5.collocation.recentExamples[0].correct).toBe('make');
  });
});

describe('getTopMasteryGaps', () => {
  it('sorts by error rate then absolute wrong count', () => {
    const map = {
      clozeCastle: {
        P4: {
          tense: { attempts: 4, wrong: 3, byClueType: { timeClue: { attempts: 4, wrong: 3 } } },
          connectorLogic: { attempts: 5, wrong: 2 },
          collocation: { attempts: 2, wrong: 2 },
          grammar: { attempts: 8, wrong: 1 },
        },
      },
    };
    const gaps = getTopMasteryGaps({ mode: 'clozeCastle', level: 'P4', masteryMap: map });
    expect(gaps).toHaveLength(3);
    expect(gaps[0].skill).toBe('collocation');
    expect(gaps[1].skill).toBe('tense');
    expect(gaps[2].skill).toBe('connectorLogic');
    expect(gaps[0].accuracy).toBe(0);
    expect(gaps[1].topClueTypes).toContain('timeClue');
  });

  it('returns [] when the mode/level bucket is empty', () => {
    expect(getTopMasteryGaps({ mode: 'clozeCastle', level: 'P4', masteryMap: {} })).toEqual([]);
  });

  it('exposes the most recent example for the weakest skill', () => {
    const map = recordMasteryAttempt({
      mode: 'wordVault',
      level: 'P5',
      category: 'collocationCloze',
      skill: 'collocation',
      clueType: 'collocationClue',
      wasWrong: true,
      example: {
        passageId: 'v9',
        blankIndex: 1,
        chosen: 'do',
        correct: 'make',
        clueType: 'collocationClue',
      },
      current: {},
    });
    const top = getTopMasteryGaps({ mode: 'wordVault', level: 'P5', masteryMap: map });
    expect(top[0].lastExample.passageId).toBe('v9');
  });
});

describe('summariseMasteryGap', () => {
  it('returns empty-state copy when no attempts have been made', () => {
    expect(summariseMasteryGap({ skill: 'tense', skillLabel: 'Verb tense', attempts: 0 })).toMatch(
      /start tracking/i,
    );
  });

  it('encourages refinement when accuracy is high', () => {
    expect(
      summariseMasteryGap({ skill: 'tense', skillLabel: 'Verb tense', attempts: 4, accuracy: 90 }),
    ).toMatch(/almost mastered/i);
  });

  it('drills slowly when accuracy is low', () => {
    expect(
      summariseMasteryGap({ skill: 'tense', skillLabel: 'Verb tense', attempts: 4, accuracy: 25 }),
    ).toMatch(/drill/i);
  });
});

describe('groupWrongLinesBySkill', () => {
  it('groups exam-mode wrong rows under their skillLabel header', () => {
    const lines = groupWrongLinesBySkill([
      {
        skillLabel: 'Verb tense',
        passageTitle: 'Storm Day',
        blank: '#1',
        studentAnswer: 'walk',
        correctAnswer: 'walked',
      },
      {
        skillLabel: 'Verb tense',
        passageTitle: 'Storm Day',
        blank: '#2',
        studentAnswer: 'run',
        correctAnswer: 'ran',
      },
      {
        skillLabel: 'Connector logic',
        passageTitle: 'School Trip',
        blank: '#1',
        studentAnswer: 'and',
        correctAnswer: 'although',
      },
    ]);
    expect(lines[0]).toContain('Verb tense (2 wrong)');
    expect(lines[3]).toContain('Connector logic (1 wrong)');
    expect(lines).toContain('  - Storm Day #1: walk → walked');
  });

  it('returns [] for empty input', () => {
    expect(groupWrongLinesBySkill([])).toEqual([]);
  });

  it('falls back to "Other" when skillLabel is missing', () => {
    const lines = groupWrongLinesBySkill([
      { passageTitle: 'X', blank: '#1', studentAnswer: 'a', correctAnswer: 'an' },
    ]);
    expect(lines[0]).toContain('Other');
  });
});
