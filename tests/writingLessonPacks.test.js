import { describe, it, expect, beforeEach } from 'vitest';
import { writingLessonPacks, WRITING_TRACKS, getLessonsForTrack, getTracksForLevel, validateLessonPackSchema } from '../src/data/writingLessonPacks.js';
import { evaluateWriting } from '../src/modules/writingEvaluator.js';
import { createPlanChecks, mergeLessonWithPlan, isPlanReady, getRemediationPath, getParagraphMissionStatus, getPlanDraftMatchReport, _extractPlanKeywords, _expandWithSynonyms, _splitIntoSections, _inferMissionSection } from '../src/modules/writingLessonEngine.js';
import { renderDrill, gradeDrills, DRILL_RENDERERS } from '../src/modules/writingReviseDrills.js';
import { store } from '../src/modules/store.js';
import { getTrackProgress, setTrackProgress, migrateLegacyWritingCompleted, getLevelTrackProgress, isLevelFullyComplete } from '../src/modules/writingTrackProgress.js';
import { scoreClimaxPresence, scoreResolutionPresence, scoreReflectionEnding, scoreDialoguePurpose, scoreNarrativeArc, scoreChronologicalFlow, computeNarrativeQuality } from '../src/modules/writingNarrativeHelpers.js';

// ── Lesson Pack Schema ──────────────────────────────────────────────────────

describe('writing lesson packs schema', () => {
  it('validates all packs in P3 tracks', () => {
    const lessons = [...getLessonsForTrack(WRITING_TRACKS.p3t1Creative.id), ...getLessonsForTrack(WRITING_TRACKS.p3t2Creative.id)];
    expect(lessons.length).toBeGreaterThanOrEqual(13);
    lessons.forEach((pack) => expect(validateLessonPackSchema(pack)).toBe(true));
  });

  it('supports multiple tracks for level 3', () => {
    const tracks = getTracksForLevel(3);
    expect(tracks.map((t) => t.id)).toContain('p3t1Creative');
    expect(tracks.map((t) => t.id)).toContain('p3t2Creative');
  });

  it('uses structured requiredChecks for non-quiz lessons', () => {
    Object.values(writingLessonPacks)
      .filter((pack) => pack.lessonType !== 'bossQuiz')
      .forEach((pack) => {
        expect(Array.isArray(pack.requiredChecks)).toBe(true);
        expect(pack.requiredChecks.length).toBeGreaterThan(0);
      });
  });

  it('boss quizzes support constructedItems', () => {
    const bosses = Object.values(writingLessonPacks).filter(p => p.lessonType === 'bossQuiz');
    expect(bosses.length).toBeGreaterThanOrEqual(2);
    const withConstructed = bosses.filter(b => b.bossQuiz.constructedItems?.length > 0);
    expect(withConstructed.length).toBeGreaterThanOrEqual(1);
    withConstructed.forEach(b => {
      b.bossQuiz.constructedItems.forEach(ci => {
        expect(ci.id).toBeTruthy();
        expect(['short_response', 'mini_revision']).toContain(ci.type);
        expect(ci.q).toBeTruthy();
      });
    });
  });
});

// ── Narrative Helpers ───────────────────────────────────────────────────────

describe('narrative analysis helpers', () => {
  it('detects climax markers and tension verbs', () => {
    expect(scoreClimaxPresence('suddenly the door slammed and i gasped')).toBeGreaterThan(0.3);
    expect(scoreClimaxPresence('the cat sat on the mat')).toBe(0);
  });

  it('detects resolution markers and actions', () => {
    expect(scoreResolutionPresence('in the end we found the key and solved the puzzle')).toBeGreaterThan(0.3);
    expect(scoreResolutionPresence('i walked to school')).toBe(0);
  });

  it('detects reflection near the end of text', () => {
    const textWithEndReflection = 'The day began with sunshine. We played all morning. After lunch we explored the garden. I learned that teamwork makes things easier.';
    expect(scoreReflectionEnding(textWithEndReflection)).toBeGreaterThan(0.4);

    const textNoReflection = 'The cat sat on the mat. It was a nice day.';
    expect(scoreReflectionEnding(textNoReflection)).toBe(0);
  });

  it('scores reflection higher when at the end vs start', () => {
    const reflectionAtEnd = 'We went to the park. We played games. We had fun. After everything, I learned to be patient.';
    const reflectionAtStart = 'I learned to be patient. We went to the park. We played games. We had fun all day long.';
    expect(scoreReflectionEnding(reflectionAtEnd)).toBeGreaterThan(scoreReflectionEnding(reflectionAtStart));
  });

  it('scores purposeful dialogue higher than weak dialogue', () => {
    const purposeful = '"Quick, run behind the wall!" Zara whispered, pulling my arm.';
    const weak = '"Hi," said Tom. "Hello," I replied.';
    const noDialogue = 'We walked to school together.';
    expect(scoreDialoguePurpose(purposeful)).toBeGreaterThan(scoreDialoguePurpose(weak));
    expect(scoreDialoguePurpose(noDialogue)).toBe(0);
  });

  it('scores narrative arc completeness', () => {
    const fullArc = 'The school hall was quiet that morning. But then I noticed something strange under the bench. Suddenly a cat leaped out and startled everyone. In the end the teacher laughed and we all felt relieved.';
    const noArc = 'I like cats. Cats are nice. They purr.';
    expect(scoreNarrativeArc(fullArc)).toBeGreaterThan(scoreNarrativeArc(noArc));
  });

  it('scores chronological flow with correct order bonus', () => {
    const ordered = 'First I packed my bag. Then I walked to school. Suddenly the bell rang. Finally I reached my class.';
    expect(scoreChronologicalFlow(ordered)).toBeGreaterThan(0.7);

    const sparse = 'I went to school. It was nice.';
    expect(scoreChronologicalFlow(sparse)).toBeLessThan(0.3);
  });

  it('computes aggregate narrative quality', () => {
    const goodNarrative = 'The corridor was dark and cold. I heard footsteps behind me. "Run!" whispered my friend, grabbing my sleeve. Suddenly the lights went out. We stumbled forward, hearts pounding. In the end we found the exit and I learned to trust my instincts.';
    const quality = computeNarrativeQuality(goodNarrative);
    expect(quality.combined).toBeGreaterThan(0.2);
    expect(quality.climax).toBeGreaterThan(0);
    expect(quality.resolution).toBeGreaterThan(0);
    expect(quality.dialogue).toBeGreaterThan(0);
  });
});

// ── Improved Evaluator ──────────────────────────────────────────────────────

describe('improved evaluator with narrative quality', () => {
  it('includes narrativeQuality in metrics', () => {
    const lesson = writingLessonPacks['p3-lesson-rainy-court'];
    const text = 'The court was empty. First I found an umbrella. Suddenly a cat appeared. Finally I went home. In the end I learned to be careful.';
    const result = evaluateWriting(lesson, text, 3);
    expect(result.metrics.narrativeQuality).toBeDefined();
    expect(result.metrics.narrativeQuality.climax).toBeGreaterThan(0);
    expect(result.metrics.narrativeQuality.resolution).toBeGreaterThan(0);
  });

  it('rewards richer narratives with higher scores', () => {
    const lesson = writingLessonPacks['p3-lesson-midnight-noise'];
    const flat = 'I heard a noise. I went to the kitchen. It was my brother. The end.';
    const rich = 'A thud jolted me awake. I tiptoed to the dark kitchen, heart pounding. "Who is there?" I whispered. Suddenly my brother popped up, laughing. He was making noodles. In the end I learned not to panic before checking.';
    const flatResult = evaluateWriting(lesson, flat, 3);
    const richResult = evaluateWriting(lesson, rich, 3);
    expect(richResult.score).toBeGreaterThan(flatResult.score);
  });

  it('enriched remediation includes narrative prompts', () => {
    const lesson = writingLessonPacks['p3-lesson-lost-key'];
    const text = 'I walked into the library and looked around for a while.';
    const result = evaluateWriting(lesson, text, 3);
    const remediation = getRemediationPath(result);
    expect(remediation.narrativePrompts).toBeDefined();
    expect(Array.isArray(remediation.narrativePrompts)).toBe(true);
  });
});

// ── Section-Aware Paragraph Missions ────────────────────────────────────────

describe('section-aware paragraph missions', () => {
  it('splits text into sections by paragraphs', () => {
    const text = 'The rain poured down.\n\nI searched for my umbrella everywhere.\n\nFinally I found it under the bench.';
    const sections = _splitIntoSections(text);
    expect(sections.opening).toContain('rain');
    expect(sections.ending).toContain('found');
  });

  it('splits text into sections by sentences for single-paragraph text', () => {
    const text = 'The court was empty. I found an umbrella on the ground. A classmate was searching nearby. Finally we found the keychain together.';
    const sections = _splitIntoSections(text);
    expect(sections.opening.length).toBeGreaterThan(0);
    expect(sections.ending.length).toBeGreaterThan(0);
  });

  it('infers mission section from text', () => {
    expect(_inferMissionSection('Open with a scene')).toBe('opening');
    expect(_inferMissionSection('Add one surprise event')).toBe('middle');
    expect(_inferMissionSection('End with reflection')).toBe('ending');
    expect(_inferMissionSection('Use a connector')).toBe('any');
  });

  it('checks missions against expected sections', () => {
    const lesson = writingLessonPacks['p3-lesson-rainy-court'];
    const text = 'The court glistened with rain and puddles.\n\nSuddenly I heard a noise behind the bench.\n\nIn the end I learned to stay calm.';
    const status = getParagraphMissionStatus(lesson, text);
    expect(status.length).toBe(3);
    // Opening mission should match in opening section
    const openingMission = status.find(m => m.text.includes('setting'));
    expect(openingMission.hit).toBe(true);
    expect(openingMission.sectionMatch).toBeDefined();
  });

  it('backward-compatible: missions still match on full text', () => {
    const lesson = writingLessonPacks['p3t2-lesson-market-rush'];
    const text = 'Steam rose from the stall. Suddenly I slipped, but finally we were safe in the end.';
    const status = getParagraphMissionStatus(lesson, text);
    expect(status.some((m) => m.hit)).toBe(true);
  });
});

// ── Improved Plan-to-Draft Validation ───────────────────────────────────────

describe('plan-to-draft validation', () => {
  it('requires complete plot fields before drafting', () => {
    expect(isPlanReady({ introduction: 'a', risingAction: 'b', climax: 'c', fallingAction: 'd', conclusion: 'e' })).toBe(false);
    expect(isPlanReady({
      introduction: 'The hall was dark and quiet.',
      risingAction: 'I heard a noise and looked behind me.',
      climax: 'A cat jumped from the shelf.',
      fallingAction: 'I laughed and opened the window.',
      conclusion: 'I learned to check before panicking.',
    })).toBe(true);
  });

  it('extracts keywords and phrases from plan text', () => {
    const result = _extractPlanKeywords('The rainy basketball court was empty');
    expect(result.words).toContain('rainy');
    expect(result.words).toContain('basketball');
    expect(result.phrases.length).toBeGreaterThan(0);
  });

  it('expands keywords with synonyms', () => {
    const expanded = _expandWithSynonyms(['scared', 'walked']);
    expect(expanded).toContain('scared');
    expect(expanded).toContain('afraid');
    expect(expanded).toContain('terrified');
    expect(expanded).toContain('strolled');
  });

  it('creates plan checks with synonym-expanded keywords', () => {
    const checks = createPlanChecks({ introduction: 'Rainy court with scared children' });
    expect(checks.length).toBeGreaterThan(0);
    const keywords = checks[0].keywordsAny;
    // Should include both original and synonym-expanded words
    expect(keywords.length).toBeGreaterThan(2);
    expect(keywords.some(k => k === 'rainy' || k === 'court' || k === 'scared' || k === 'afraid')).toBe(true);
  });

  it('generates plan-draft match report with section scores', () => {
    const plan = {
      introduction: 'Rainy basketball court with puddles',
      climax: 'Found the missing keychain under bench',
    };
    const draft = 'The basketball court was wet with rain and puddles everywhere. I searched under the bench and found the missing keychain.';
    const report = getPlanDraftMatchReport(plan, draft);
    expect(report.overallScore).toBeGreaterThan(0.3);
    expect(report.sections.introduction).toBeDefined();
    expect(report.sections.introduction.score).toBeGreaterThan(0);
  });

  it('identifies weak plan sections in match report', () => {
    const plan = {
      introduction: 'Forest trail with fog',
      climax: 'Bear appeared suddenly',
    };
    const draft = 'We walked along the misty forest path.';
    const report = getPlanDraftMatchReport(plan, draft);
    expect(report.weakSections).toContain('climax');
  });

  it('converts plan points into extra required checks', () => {
    const lesson = writingLessonPacks['p3-lesson-rainy-court'];
    const merged = mergeLessonWithPlan(lesson, {
      introduction: 'Rainy court with broken umbrella',
      climax: 'Found the missing keychain',
    });
    expect(merged.requiredChecks.length).toBeGreaterThan(lesson.requiredChecks.length);
  });

  it('flags missing checks and routes remediation mission', () => {
    const lesson = writingLessonPacks['p3-lesson-lost-key'];
    const result = evaluateWriting(lesson, 'I walked into the library. I looked around.', 3);
    const remediation = getRemediationPath(result);
    expect(result.metrics.requiredHits).toBeLessThan(result.metrics.requiredTotal);
    expect(remediation.missingChecks.length).toBeGreaterThan(0);
    expect(remediation.weakestDimension).toBeTruthy();
  });
});

// ── Richer Revise Drills ────────────────────────────────────────────────────

describe('revise drills', () => {
  it('has renderers for all drill types', () => {
    expect(DRILL_RENDERERS.vocab_mcq).toBeDefined();
    expect(DRILL_RENDERERS.sentence_upgrade).toBeDefined();
    expect(DRILL_RENDERERS.arrange_sequence).toBeDefined();
    expect(DRILL_RENDERERS.choose_best_revision).toBeDefined();
    expect(DRILL_RENDERERS.dialogue_improve).toBeDefined();
  });

  it('grades MCQ drills correctly', () => {
    const drills = [
      { type: 'vocab_mcq', correctIndex: 1 },
      { type: 'spelling_pick', correctIndex: 0 },
      { type: 'dialogue_tag', correctIndex: 2 },
    ];
    const result = gradeDrills(drills, [1, 0, 1]);
    expect(result.correctCount).toBe(2);
    expect(result.passed).toBe(true);
  });

  it('grades sentence_upgrade drills with options', () => {
    const drills = [{ type: 'sentence_upgrade', options: ['Weak.', 'Strong and vivid.', 'Bad.'], correctIndex: 1 }];
    expect(gradeDrills(drills, ['1']).correctCount).toBe(1);
    expect(gradeDrills(drills, ['0']).correctCount).toBe(0);
  });

  it('grades arrange_sequence drills', () => {
    const drills = [{
      type: 'arrange_sequence',
      sentences: ['First', 'Then', 'Finally'],
      correctOrder: [0, 1, 2],
    }];
    expect(gradeDrills(drills, ['0,1,2']).correctCount).toBe(1);
    expect(gradeDrills(drills, ['2,0,1']).correctCount).toBe(0);
  });

  it('grades choose_best_revision as MCQ', () => {
    const drills = [{ type: 'choose_best_revision', correctIndex: 1, options: ['Weak', 'Strong'] }];
    expect(gradeDrills(drills, ['1']).correctCount).toBe(1);
    expect(gradeDrills(drills, ['0']).correctCount).toBe(0);
  });

  it('grades dialogue_improve as MCQ', () => {
    const drills = [{ type: 'dialogue_improve', correctIndex: 1, options: ['Weak dialogue', 'Strong dialogue'] }];
    expect(gradeDrills(drills, ['1']).correctCount).toBe(1);
  });

  it('renders different drill types with distinct markup', () => {
    const mcq = renderDrill({ type: 'vocab_mcq', question: 'Pick one.', options: ['a', 'b'] }, 0);
    expect(mcq).toContain('data-drill-type="vocab_mcq"');

    const upgrade = renderDrill({ type: 'sentence_upgrade', weakSentence: 'Bad.', options: ['a', 'b'], correctIndex: 1 }, 1);
    expect(upgrade).toContain('Sentence Upgrade');

    const arrange = renderDrill({ type: 'arrange_sequence', sentences: ['A.', 'B.'], correctOrder: [0, 1] }, 2);
    expect(arrange).toContain('Arrange the Story');

    const revision = renderDrill({ type: 'choose_best_revision', original: 'Old.', options: ['a', 'b'], correctIndex: 1 }, 3);
    expect(revision).toContain('Better Revision');

    const dialogue = renderDrill({ type: 'dialogue_improve', weakDialogue: '"Hi."', options: ['a', 'b'], correctIndex: 1 }, 4);
    expect(dialogue).toContain('Improve the Dialogue');
  });

  it('passes threshold with 60%', () => {
    const drills = Array(5).fill({ type: 'vocab_mcq', correctIndex: 0 });
    expect(gradeDrills(drills, [0, 0, 0, 1, 1]).passed).toBe(true); // 3/5
    expect(gradeDrills(drills, [0, 0, 1, 1, 1]).passed).toBe(false); // 2/5
  });

  it('lesson packs use the new drill types', () => {
    const allDrills = Object.values(writingLessonPacks)
      .flatMap(p => p.reviseDrills || []);
    const drillTypes = new Set(allDrills.map(d => d.type));
    expect(drillTypes.has('arrange_sequence')).toBe(true);
    expect(drillTypes.has('sentence_upgrade')).toBe(true);
    expect(drillTypes.has('choose_best_revision')).toBe(true);
    expect(drillTypes.has('dialogue_improve')).toBe(true);
  });
});

// ── Track Progress and Migration ────────────────────────────────────────────

describe('track progress and migration', () => {
  beforeEach(() => {
    store.reset();
  });

  it('stores and retrieves track progress', () => {
    setTrackProgress('p3t1Creative', 2, 6, 3);
    expect(getTrackProgress('p3t1Creative').completedLessons).toBe(2);
    expect(getTrackProgress('p3t1Creative').completed).toBe(false);
  });

  it('setTrackProgress never reduces completedLessons', () => {
    setTrackProgress('p3t1Creative', 4, 6, 3);
    setTrackProgress('p3t1Creative', 2, 6, 3);
    expect(getTrackProgress('p3t1Creative').completedLessons).toBe(4);
  });

  it('marks track as complete when all lessons done', () => {
    setTrackProgress('p3t1Creative', 6, 6, 3);
    expect(getTrackProgress('p3t1Creative').completed).toBe(true);
  });

  it('migrates legacy writingCompleted to first track', () => {
    store.set('writingCompleted', { 3: 5 });
    const migrated = migrateLegacyWritingCompleted(['p3t2Creative'], 7, 3);
    expect(migrated.p3t2Creative.completedLessons).toBe(5);
    expect(migrated.p3t2Creative.migratedFromLevel).toBe(3);
  });

  it('skips migration if track already has progress', () => {
    setTrackProgress('p3t1Creative', 3, 6, 3);
    store.set('writingCompleted', { 3: 1 });
    const result = migrateLegacyWritingCompleted(['p3t1Creative'], 6, 3);
    expect(result.p3t1Creative?.completedLessons).toBe(3); // not overwritten
  });

  it('getLevelTrackProgress sums across tracks', () => {
    setTrackProgress('p3t1Creative', 3, 6, 3);
    setTrackProgress('p3t2Creative', 2, 7, 3);
    const tracks = getTracksForLevel(3);
    const progress = getLevelTrackProgress(tracks);
    expect(progress.done).toBe(5);
    expect(progress.total).toBe(13);
  });

  it('isLevelFullyComplete checks all tracks', () => {
    const tracks = getTracksForLevel(3);
    setTrackProgress('p3t1Creative', 6, 6, 3);
    setTrackProgress('p3t2Creative', 5, 7, 3);
    expect(isLevelFullyComplete(tracks)).toBe(false);
    setTrackProgress('p3t2Creative', 7, 7, 3);
    expect(isLevelFullyComplete(tracks)).toBe(true);
  });
});

// ── Boss Check Constructed Items ────────────────────────────────────────────

describe('boss check data', () => {
  it('T1 boss has constructedItems', () => {
    const boss = writingLessonPacks['p3-boss-quiz'];
    expect(boss.bossQuiz.constructedItems).toBeDefined();
    expect(boss.bossQuiz.constructedItems.length).toBeGreaterThanOrEqual(1);
    expect(boss.bossQuiz.constructedItems[0].type).toBe('mini_revision');
  });

  it('T2 boss has multiple constructed item types', () => {
    const boss = writingLessonPacks['p3t2-boss-quiz'];
    expect(boss.bossQuiz.constructedItems.length).toBeGreaterThanOrEqual(2);
    const types = boss.bossQuiz.constructedItems.map(ci => ci.type);
    expect(types).toContain('short_response');
    expect(types).toContain('mini_revision');
  });

  it('pass marks account for total items including constructed', () => {
    const boss1 = writingLessonPacks['p3-boss-quiz'];
    const totalItems = boss1.bossQuiz.questions.length + (boss1.bossQuiz.constructedItems?.length || 0);
    expect(boss1.bossQuiz.passMark).toBeLessThanOrEqual(totalItems);
  });
});
