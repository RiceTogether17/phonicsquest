/**
 * PhonicsQuest – Learning Roadmap (parent journey map)
 *
 * A plain-language, one-tap view for parents: where the child is on the
 * reading journey, what's mastered, what's locked and exactly why, and how
 * to help this week. Everything here is motivational progress info — it
 * mutates nothing, so it is deliberately NOT behind the parent PIN; the
 * footer links to the PIN-gated dashboard for scores/exports.
 *
 * Lazy-loaded by app.js (keeps curriculumMap out of the main bundle).
 *
 * Public API:
 *   renderRoadmap(container, { onClose, onOpenDashboard, onGoToday })
 */

import { store } from '../modules/store.js';
import { getActiveProfile } from '../modules/profiles.js';
import { isReadingBandMeasured, getReadingBand } from '../modules/readingStages.js';
import { buildJourneyBarHtml, JOURNEY_STAGES, STAGE_META } from './journeyBar.js';
import { buildPhaseCardsHtml, buildDomainCardsHtml } from './curriculumMap.js';
import {
  buildProgressionSnapshot,
  getUnlockedStages,
  getRecommendedStage,
  explainLockReason,
  getTrickyWordsForCurrentStage,
} from '../modules/progression.js';
import { getQuestUnlockStatus } from '../modules/questUnlocks.js';
import { getLearnerSummaryChips } from '../modules/recommendations.js';
import { CURRICULUM } from '../data/curriculum.js';
import { escapeHtml } from '../utils/escapeHtml.js';

/** What each reading band means, in parent language. */
const BAND_MEANING = {
  'pre-reader':
    'is learning what sounds the letters make — the foundation everything else builds on.',
  'emerging-decoder':
    'can sound out simple words like "cat" and "ship", and is building speed and confidence.',
  'developing-reader':
    'reads short stories and is bridging into sentence-level grammar and vocabulary.',
  reader:
    'reads fluently and is working on primary school English: grammar, vocabulary, comprehension and writing.',
};

const QUEST_LABELS = {
  sentenceForge: '🔨 Sentence Forge',
  clozeCastle: '🏰 Cloze Castle',
  wordVault: '🔑 Word Vault',
  editingQuest: '✏️ Editing Quest',
  writingQuest: '📝 Writing Quest',
};

/** Next 1–2 locked phonics stages with their plain-language unlock reasons. */
function _lockedStageRows(snapshot) {
  const unlocked = new Set(getUnlockedStages(snapshot));
  const rows = [];
  for (const stage of CURRICULUM) {
    if (unlocked.has(stage.id)) continue;
    const reason = explainLockReason(stage.id, snapshot);
    if (!reason) continue;
    rows.push({ stage, reason });
    if (rows.length >= 2) break;
  }
  return rows;
}

/** Locked primary quests with their progress toward unlock. */
function _lockedQuestRows(profile) {
  const status = getQuestUnlockStatus(
    store.get('wordStats') || {},
    profile,
    undefined,
    store.get('placementProfile') || null,
  );
  return Object.entries(QUEST_LABELS)
    .filter(([key]) => status[key] && !status[key].unlocked)
    .map(([key, label]) => ({
      label,
      current: status[key].current,
      required: status[key].required,
    }));
}

export function renderRoadmap(container, { onClose, onOpenDashboard, onGoToday } = {}) {
  if (!container) return;

  const profile = getActiveProfile();
  const placement = store.get('placementProfile') || null;
  const readingBand = getReadingBand(profile, placement);
  const name = profile?.name?.split(' ')[0] || 'Your child';
  const avatar = profile?.avatar || '🦁';
  const isPrimary = profile?.schoolLevel === 'primary' || readingBand === 'reader';

  const snapshot = buildProgressionSnapshot();
  const journeyBarHtml = buildJourneyBarHtml(readingBand, snapshot.groupMastery || {}, {
    measured: isReadingBandMeasured(profile, placement),
  });
  const bandLabel = JOURNEY_STAGES.find((s) => s.key === readingBand)?.label || 'Pre-reader';
  const bandIcon = STAGE_META[readingBand]?.icon || '🌱';

  const lockedStages = isPrimary ? [] : _lockedStageRows(snapshot);
  const lockedQuests = _lockedQuestRows(profile);
  const recommended = getRecommendedStage(snapshot);
  const trickyWords = (getTrickyWordsForCurrentStage(snapshot) || []).slice(0, 8);
  const chips = getLearnerSummaryChips();

  const lockedHtml =
    lockedStages.length || lockedQuests.length
      ? `
    <div class="roadmap-section">
      <h3 class="cm-section-title"><span class="cm-section-icon">🔓</span> What's locked, and why</h3>
      <p class="cm-section-desc">Nothing is locked forever — each gate opens automatically as ${escapeHtml(name)} practises. Here's exactly what each one is waiting for:</p>
      ${lockedStages
        .map(
          ({ stage, reason }) => `
        <div class="roadmap-lock-card">
          <p class="roadmap-lock-title">${stage.icon} <strong>${escapeHtml(stage.name)}</strong> unlocks when:</p>
          <p class="roadmap-lock-reason">${escapeHtml(reason)}</p>
        </div>`,
        )
        .join('')}
      ${lockedQuests
        .map(
          (q) => `
        <div class="roadmap-lock-card">
          <p class="roadmap-lock-title"><strong>${q.label}</strong> opens after <strong>${q.required}</strong> mastered words</p>
          <p class="roadmap-lock-reason">${q.current} mastered so far — every word counts.</p>
        </div>`,
        )
        .join('')}
    </div>`
      : '';

  const helpHtml = `
    <div class="roadmap-section">
      <h3 class="cm-section-title"><span class="cm-section-icon">🤝</span> How to help this week</h3>
      ${
        recommended && !isPrimary
          ? `
        <p class="cm-section-desc">The app recommends focusing on <strong>${recommended.icon} ${escapeHtml(recommended.name)}</strong> — ${escapeHtml(recommended.description || '')}</p>`
          : `
        <p class="cm-section-desc">Today's guided lesson always picks the most useful next step automatically — one sitting a day goes a long way.</p>`
      }
      ${
        trickyWords.length
          ? `
        <p class="roadmap-tricky-label">Tricky words to practise out loud together:</p>
        <div class="progress-chips" aria-label="Tricky words to practise">
          ${trickyWords.map((t) => `<span class="progress-chip">${escapeHtml(t.word)}</span>`).join('')}
        </div>`
          : ''
      }
      ${
        chips.length
          ? `
        <p class="roadmap-tricky-label">Progress snapshot:</p>
        <div class="progress-chips" aria-label="Progress snapshot">
          ${chips.map((c) => `<span class="progress-chip">${escapeHtml(c)}</span>`).join('')}
        </div>`
          : ''
      }
      <button class="btn btn--primary" id="roadmap-go-today">🎯 Start today's lesson together →</button>
    </div>`;

  container.innerHTML = `
    <div class="roadmap-wrapper">
      <div class="cm-header">
        <div class="cm-header-left">
          <span class="cm-avatar" aria-hidden="true">${avatar}</span>
          <div>
            <h2 class="cm-title">${escapeHtml(name)}'s Learning Roadmap</h2>
            <p class="cm-subtitle">Where ${escapeHtml(name)} is · what's next · how to help</p>
          </div>
        </div>
      </div>

      <div class="roadmap-section">
        <h3 class="cm-section-title"><span class="cm-section-icon">${bandIcon}</span> Where ${escapeHtml(name)} is now</h3>
        ${journeyBarHtml}
        <p class="roadmap-band-meaning"><strong>${bandLabel}</strong> means ${escapeHtml(name)} ${BAND_MEANING[readingBand] || BAND_MEANING['pre-reader']}</p>
      </div>

      <div class="roadmap-section">
        <h3 class="cm-section-title"><span class="cm-section-icon">🔤</span> Phonics foundations</h3>
        <p class="cm-section-desc">Each phase builds on the last. ✅ mastered · % in progress · 🔒 coming up.</p>
        <div class="cm-phase-grid">${buildPhaseCardsHtml(avatar)}</div>
      </div>

      ${lockedHtml}

      ${helpHtml}

      <div class="roadmap-section ${isPrimary ? '' : 'cm-section--future'}">
        <h3 class="cm-section-title">
          <span class="cm-section-icon">📚</span> Primary English skills
          ${!isPrimary ? '<span class="cm-section-tag">Unlocks with phonics mastery</span>' : ''}
        </h3>
        <p class="cm-section-desc">Grammar, vocabulary, editing and writing — the school-paper skills.</p>
        <div class="cm-domain-grid">${buildDomainCardsHtml()}</div>
      </div>

      <div class="roadmap-footer">
        <p class="roadmap-footer-note">Want detailed scores, the report card, and exports? They live in the Parent Dashboard (PIN-protected).</p>
        <button class="btn btn--ghost" id="roadmap-open-dashboard">📊 Open Parent Dashboard</button>
      </div>
    </div>`;

  container.querySelector('#roadmap-go-today')?.addEventListener('click', () => onGoToday?.());
  container
    .querySelector('#roadmap-open-dashboard')
    ?.addEventListener('click', () => onOpenDashboard?.());
}
