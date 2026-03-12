import { describe, it, expect } from 'vitest';
import { editingPassages } from '../src/data/editingPassages.js';
import { writingPrompts } from '../src/data/writingPrompts.js';
import { evaluateWritingSubmission } from '../src/modes/writingQuest.js';

describe('editing and writing depth guardrails', () => {
  it('provides at least 3 editing passages per level', () => {
    for (const level of Object.keys(editingPassages)) {
      expect(editingPassages[level].length).toBeGreaterThanOrEqual(3);
    }
  });

  it('provides at least 3 writing prompts per level', () => {
    for (const level of Object.keys(writingPrompts)) {
      expect(writingPrompts[level].length).toBeGreaterThanOrEqual(3);
    }
  });

  it('writing rubric evaluator rewards richer responses', () => {
    const prompt = writingPrompts[3][0];
    const weak = evaluateWritingSubmission(prompt, 'This is short', 3);
    const strong = evaluateWritingSubmission(
      prompt,
      'The campaign opened with a clear goal, and students understood why it mattered. However, the first day revealed weak planning because bins were mixed and labels were unclear. Consequently, our team created clearer signs, demonstrated sorting routines, and assigned group leaders to monitor each station. Moreover, class monitors reminded everyone to reduce waste during recess. In conclusion, the project succeeded because we reviewed mistakes and improved quickly.',
      3,
    );

    expect(strong.score).toBeGreaterThan(weak.score);
    expect(strong.score).toBeGreaterThan(0.6);
  });
});
