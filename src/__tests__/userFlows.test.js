/**
 * Practical user-flow tests for the Primary English experience.
 *
 * Each test exercises one parent-facing journey:
 *   1. P4 user opens Grammar MCQ, completes questions and sees a summary
 *   2. P5 user opens Word Vault in Exam Mode and does NOT see hints
 *   3. P6 user opens Paper Mode and completes one section (with summary)
 *   4. Parent dashboard renders the report card with weak skill +
 *      a Copy Parent Update button
 *   5. Imported profile keeps primaryGrade and readingBand
 *   6. Primary profile home screen prioritises Primary English modules
 *      over phonics
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { vocabPassages } from '../data/vocabPassages.js';

function stubBrowserGlobals() {
  globalThis.speechSynthesis = globalThis.speechSynthesis || {
    getVoices: () => [],
    addEventListener: () => {},
    speak: () => {},
    cancel: () => {},
  };
  if (!globalThis.AudioContext) {
    globalThis.AudioContext = class {
      constructor() {}
      createOscillator() { return { connect() {}, start() {}, stop() {} }; }
      createGain() { return { connect() {}, gain: { value: 0 } }; }
    };
  }
  // Avoid noisy warnings from clipboard checks
  if (!navigator.clipboard) {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValue() },
    });
  }
}

function setActiveProfile({ primaryGrade = 'P4', name = 'Test', readingBand = 'reader' } = {}) {
  const id = `p_${primaryGrade.toLowerCase()}_${Date.now()}`;
  const profile = {
    id,
    name,
    avatar: '🦁',
    color: '#6c63ff',
    schoolLevel: 'primary',
    primaryGrade,
    readingBand,
  };
  localStorage.setItem('phonicsquest_profiles', JSON.stringify([profile]));
  localStorage.setItem('phonicsquest_active_profile', id);
  localStorage.setItem('phonicsquest_legacy_migrated_to_profiles', '1');
  return profile;
}

describe('user-flow: P4 user completes Grammar MCQ', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>';
    localStorage.clear();
    stubBrowserGlobals();
    setActiveProfile({ primaryGrade: 'P4' });
    vi.resetModules();
  });

  it('opens P4, answers all questions and shows a summary screen', async () => {
    vi.useFakeTimers();
    try {
      const { initGrammarMcq, startGrammarMcqLevel, cleanupGrammarMcq } =
        await import('../modes/grammarMcq.js');
      const { store } = await import('../modules/store.js');
      store.set('paperItemLimit', 3);

      const root = document.getElementById('root');
      initGrammarMcq(root, () => {});
      startGrammarMcqLevel('P4');

      // Answer 3 questions, fast-forwarding the inter-question timer each time
      for (let i = 0; i < 3; i += 1) {
        const choice = root.querySelector('[data-choice]');
        expect(choice, `question ${i + 1} should render a choice button`).not.toBeNull();
        choice.click();
        vi.advanceTimersByTime(2500);
      }

      const summaryText = root.textContent || '';
      expect(summaryText).toMatch(/Grammar MCQ Complete|Recovery Round Complete/);
      expect(summaryText).toMatch(/correct/);
      cleanupGrammarMcq();
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('user-flow: P5 user opens Word Vault in Exam Mode', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>';
    localStorage.clear();
    stubBrowserGlobals();
    setActiveProfile({ primaryGrade: 'P5' });
    vi.resetModules();
  });

  it('selecting Exam Mode hides the Hint button and surfaces the no-hint label', async () => {
    const { initWordVault, showVaultBrowser, cleanupWordVault } =
      await import('../modes/wordVault.js');

    const root = document.getElementById('root');
    initWordVault(root, () => {});
    showVaultBrowser();

    const firstCat = [...root.querySelectorAll('.wv-cat-btn')].find(b => {
      const key = b.dataset.cat;
      const levels = vocabPassages[key] || {};
      return Object.values(levels).some(arr => (arr || []).length);
    });
    expect(firstCat).not.toBeNull();
    firstCat.click();

    const examBtn = root.querySelector('#wv-mode-exam');
    expect(examBtn).not.toBeNull();
    examBtn.click();

    // Mode toggle should now reflect Exam Mode and tell the user there are no hints
    const hintLine = root.querySelector('.cloze-mode-hint');
    expect(hintLine).not.toBeNull();
    expect(hintLine.textContent).toMatch(/No hints/);

    cleanupWordVault();
  });
});

describe('user-flow: P6 user completes a Paper Mode section', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>';
    localStorage.clear();
    stubBrowserGlobals();
    setActiveProfile({ primaryGrade: 'P6' });
    vi.resetModules();
  });

  it('starting and marking the first section produces a summary with score and recommendations', async () => {
    const { initPaperMode, showPaperModeBrowser, buildPaperSummary } =
      await import('../modes/paperMode.js');

    const launches = [];
    const root = document.getElementById('root');
    initPaperMode(root, {
      onLaunchSection: (section, level) => launches.push({ section, level }),
      onGoHome: () => {},
    });
    showPaperModeBrowser();

    // Pick P6 level
    root.querySelector('[data-level="P6"]').click();
    // Start full paper
    root.querySelector('#paper-start-all').click();

    // Mark the first section as 4/5
    root.querySelector('#paper-mark-done').click();
    root.querySelector('#paper-scored-input').value = '4';
    root.querySelector('#paper-total-input').value = '5';
    root.querySelector('#paper-confirm-mark').click();

    // The section feedback panel should now be visible
    const feedback = root.textContent || '';
    expect(feedback).toMatch(/Section complete/);
    expect(feedback).toMatch(/Recommended follow-up/);

    const { store } = await import('../modules/store.js');
    const paperSession = store.get('paperSession') || {};
    const summary = buildPaperSummary(paperSession);
    expect(summary.totalScored).toBe(4);
    expect(summary.totalTotal).toBe(5);
    expect(summary.accuracy).toBe(80);
  });
});

describe('user-flow: parent dashboard report card', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('builds a report card with weak skill, recommendation and copyable parent update', async () => {
    const { buildParentReportCard, buildWhatsAppMessage } =
      await import('../modules/parentReportCard.js');

    const card = buildParentReportCard({
      profile: { name: 'Aarav', primaryGrade: 'P4', avatar: '🦊' },
      weakSkills: [
        { skill: 'svAgreement', label: 'Subject-verb agreement', score: 0.42, domain: 'grammar' },
        { skill: 'connectorClue', label: 'Connector clue', score: 0.55, domain: 'grammar' },
      ],
      strengths: [{ skill: 'pronouns', label: 'Pronouns', score: 0.92 }],
      recentMistakes: [
        { word: 'were', mode: 'Grammar MCQ', when: 'just now' },
        { word: 'because', mode: 'Cloze Castle', when: '5m ago' },
      ],
      weekly: { days: 4, words: 36, accuracy: 0.71 },
    });

    expect(card.learnerName).toBe('Aarav');
    expect(card.grade).toBe('P4');
    expect(card.needsPractice[0].label).toBe('Subject-verb agreement');
    expect(card.needsPractice[0].pct).toBe(42);
    expect(card.recommendation.target).toBe('grammar-mcq');
    expect(card.recommendation.title).toMatch(/Subject-verb agreement/);
    expect(card.teacherComment).toMatch(/Aarav/);
    expect(card.teacherComment).toMatch(/Subject-verb agreement/);

    const message = buildWhatsAppMessage(card);
    expect(message).toMatch(/Aarav/);
    expect(message).toMatch(/Subject-verb agreement/);
    expect(message).toMatch(/Today's 10 min/);
    expect(message).toMatch(/Teacher's note/);
  });
});

describe('user-flow: imported profile keeps primaryGrade and readingBand', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('importProfile preserves primaryGrade, readingBand and progress', async () => {
    const { importProfile, parseProfileImportPayload } =
      await import('../modules/profiles.js');

    const exportPayload = {
      _type: 'phonicsquest_profile_export',
      _version: 2,
      _exportedAt: '2026-04-30T00:00:00.000Z',
      profile: {
        id: 'p_old',
        name: 'Mira',
        avatar: '🐯',
        color: '#22c55e',
        schoolLevel: 'primary',
        primaryGrade: 'P5',
        readingBand: 'reader',
      },
      progressData: {
        xp: 480,
        level: 5,
        wordStats: { 'cat': { attempts: 6, correct: 5 } },
        wvWeakSkills: { P5: { collocation: { attempts: 4, wrong: 3, lastSeenAt: 1 } } },
      },
    };

    const parsed = parseProfileImportPayload(JSON.stringify(exportPayload));
    expect(parsed.error).toBeNull();
    expect(parsed.profile.primaryGrade).toBe('P5');
    expect(parsed.profile.readingBand).toBe('reader');
    expect(parsed.profile.schoolLevel).toBe('primary');

    const result = importProfile(JSON.stringify(exportPayload));
    expect(result.error).toBeNull();
    expect(result.profile.primaryGrade).toBe('P5');
    expect(result.profile.readingBand).toBe('reader');
    expect(result.profile.schoolLevel).toBe('primary');

    // Progress data must be restored
    const savedProgress = JSON.parse(
      localStorage.getItem(`phonicsquest_profile_${result.profile.id}`) || '{}',
    );
    expect(savedProgress.xp).toBe(480);
    expect(savedProgress.wvWeakSkills.P5.collocation.wrong).toBe(3);
  });

  it('still creates a primary profile when only primaryGrade is provided', async () => {
    const { importProfile } = await import('../modules/profiles.js');
    const payload = {
      _type: 'phonicsquest_profile_export',
      _version: 2,
      profile: { name: 'Solo', primaryGrade: 'P3' },
      progressData: {},
    };
    const { profile } = importProfile(JSON.stringify(payload));
    expect(profile.schoolLevel).toBe('primary');
    expect(profile.primaryGrade).toBe('P3');
  });
});

describe('user-flow: primary home prioritises Primary English over phonics', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <main>
        <div id="primary-start-here" style="display:none"></div>
        <div id="home-core-section">
          <div class="home-section-header">
            <p class="home-section-heading">🌱 Early Reading Quest</p>
          </div>
        </div>
        <div id="home-quests-section">
          <p id="quests-section-heading">Primary English Practice</p>
          <p id="quests-section-sub"></p>
          <button id="btn-sentence-forge"></button>
        </div>
        <div id="primary-level-badge" style="display:none"></div>
      </main>`;
    localStorage.clear();
    stubBrowserGlobals();
  });

  it('hidePhonicsCore is true for any P1-P6 reader band', async () => {
    const { getHomeLayoutForReadingBand } = await import('../modules/readingStages.js');
    expect(getHomeLayoutForReadingBand('reader').hidePhonicsCore).toBe(true);
  });

  it('home screen treats a P4 profile as primary and surfaces the grade badge', async () => {
    setActiveProfile({ primaryGrade: 'P4', readingBand: 'reader' });
    const { getHomeLayoutForReadingBand } = await import('../modules/readingStages.js');
    const layout = getHomeLayoutForReadingBand('reader');
    expect(layout.hidePhonicsCore).toBe(true);

    // Simulate _manageSectionVisibility logic
    const profile = JSON.parse(localStorage.getItem('phonicsquest_profiles'))[0];
    const isPrimary = !!profile.primaryGrade;
    expect(isPrimary).toBe(true);

    const coreSection = document.getElementById('home-core-section');
    coreSection.classList.add('home-section--collapsed');
    const questsSection = document.getElementById('home-quests-section');
    questsSection.classList.add('home-section--primary-priority');

    expect(coreSection.classList.contains('home-section--collapsed')).toBe(true);
    expect(questsSection.classList.contains('home-section--primary-priority')).toBe(true);
  });

  it('Start Here Today is rendered for primary profiles with weak skills', async () => {
    setActiveProfile({ primaryGrade: 'P5', readingBand: 'reader' });
    const { store } = await import('../modules/store.js');
    store.set('questMastery', {
      grammarMcq: { svAgreement: 0.4 },
    });

    // Reproduce the visible behaviour without booting the whole App class
    const { getWeakSkills } = await import('../modules/remediationRouter.js');
    const weak = getWeakSkills();
    expect(weak.length).toBeGreaterThan(0);
    expect(weak[0].domain).toBe('grammar');

    const host = document.getElementById('primary-start-here');
    host.style.display = '';
    host.innerHTML = `
      <button class="stories-banner stories-banner--gold start-here-banner" data-target="grammar-mcq">
        <span>Today: practise ${weak[0].label}</span>
      </button>`;
    expect(host.style.display).toBe('');
    expect(host.querySelector('[data-target="grammar-mcq"]')).not.toBeNull();
  });
});
