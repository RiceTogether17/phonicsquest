/**
 * PhonicsQuest – Curriculum Map
 *
 * Renders a visual "You Are Here" learning journey for the child and parent.
 * Shows all phonics phases (1–7) plus the Primary English quest domains,
 * marks completed and in-progress stages, and indicates the current position.
 *
 * Public API:
 *   renderCurriculumMap(container, { onClose })
 */

import { CURRICULUM, PHASES, PRE_PHASES } from '../data/curriculum.js';
import { store } from '../modules/store.js';
import { getActiveProfile } from '../modules/profiles.js';
import { escapeHtml } from '../utils/escapeHtml.js';
import { getDomainMastery } from '../modules/masteryEngine.js';
import { getPrePhaseProgress } from '../modules/prePhaseProgress.js';

// Phase display metadata is derived from the canonical PHASES table in
// curriculum.js. Don't redefine it here — a parallel table previously drifted
// out of sync (7 entries vs the curriculum's 10) and mislabelled stages.
const PHASE_META = PHASES.map(p => ({
  phase: p.phase,
  label: `Phase ${p.phase}`,
  title: p.title,
  icon:  p.icon,
  desc:  p.description,
  sightWords: p.sightWords || [],
}));

const PRIMARY_DOMAINS = [
  { id: 'sentenceSkills', label: 'Sentence Forge',   icon: '🔨', desc: 'Build and arrange sentences' },
  { id: 'grammarCloze',   label: 'Cloze Castle',     icon: '🏰', desc: 'Grammar in context' },
  { id: 'vocabCloze',     label: 'Word Vault',       icon: '🔑', desc: 'Vocabulary in context' },
  { id: 'editingQuest',   label: 'Editing Quest',    icon: '✏️', desc: 'Spot and fix errors' },
  { id: 'writingQuest',   label: 'Writing Quest',    icon: '📝', desc: 'Extended writing tasks' },
];

function _getGroupMastery(groupKey) {
  const gm = store.get('groupMastery') || {};
  return typeof gm[groupKey] === 'number' ? gm[groupKey] : null;
}

function _getPhaseStatus(phaseNum) {
  const stages = CURRICULUM.filter(s => s.phase === phaseNum);
  if (!stages.length) return { status: 'locked', pct: 0, masteredCount: 0, total: 0 };

  let masteredCount = 0;
  let inProgressCount = 0;
  for (const stage of stages) {
    const score = _getGroupMastery(stage.group);
    if (score === null) continue;
    if (score >= 0.80) masteredCount++;
    else if (score > 0) inProgressCount++;
  }

  const total = stages.length;
  const pct   = Math.round((masteredCount / total) * 100);

  let status;
  if (masteredCount === total) status = 'complete';
  else if (masteredCount > 0 || inProgressCount > 0) status = 'in-progress';
  else status = 'locked';

  return { status, pct, masteredCount, total };
}

function _getCurrentPhase() {
  // Current phase = highest phase with at least one in-progress stage.
  for (let p = PHASE_META.length; p >= 1; p--) {
    const { status } = _getPhaseStatus(p);
    if (status === 'in-progress' || status === 'complete') return p;
  }
  // No print work yet — the child is still in the foundation steps.
  // Place them at the first incomplete pre-phase.
  for (const pre of PRE_PHASES) {
    if (getPrePhaseProgress(pre.phase).status !== 'complete') return pre.phase;
  }
  return 1;
}

/** Foundation step cards (Step 0a/0b) shown ahead of Phase 1. */
function _buildPrePhaseCardsHtml(currentPhase, avatar) {
  return PRE_PHASES.map(pre => {
    const { status, pct } = getPrePhaseProgress(pre.phase);
    const isCurrent = pre.phase === currentPhase;
    const statusLabel = { complete: 'Complete ✅', 'in-progress': 'In progress', locked: 'Not started yet' }[status] || '';
    return `
      <div class="cm-phase cm-phase--${status} ${isCurrent ? 'cm-phase--current' : ''}"
           aria-label="${pre.title}${isCurrent ? ' – current stage' : ''}">
        ${isCurrent ? `<div class="cm-you-are-here">${avatar} You are here!</div>` : ''}
        <div class="cm-phase-header">
          <span class="cm-phase-icon">${pre.icon}</span>
          <div>
            <span class="cm-phase-label">${pre.label.split(' — ')[0]}</span>
            <span class="cm-phase-title">${pre.title}</span>
          </div>
          <span class="cm-phase-badge">${status === 'complete' ? '✅' : status === 'in-progress' ? `${pct}%` : '🔒'}</span>
        </div>
        <p class="cm-phase-desc">${pre.description}</p>
        ${status !== 'locked' ? `
          <div class="cm-phase-bar-track" aria-label="${pct}% complete">
            <div class="cm-phase-bar-fill" style="width:${pct}%"></div>
          </div>
          <span class="cm-phase-meta">${statusLabel}</span>
        ` : `<span class="cm-phase-meta cm-phase-meta--locked">${statusLabel}</span>`}
      </div>`;
  }).join('');
}

function _getDomainStatus(domainId) {
  const domains = getDomainMastery();
  const d = domains.find(x => x.id === domainId);
  if (!d || d.composite === null) return { status: 'not-started', pct: 0 };
  const pct = Math.round((d.composite ?? 0) * 100);
  const status = pct >= 80 ? 'strong' : pct >= 50 ? 'building' : pct > 0 ? 'starting' : 'not-started';
  return { status, pct };
}

/**
 * Phonics phase cards HTML (status, progress, "You are here!" marker).
 * Shared by the dashboard curriculum map and the parent Learning Roadmap.
 * @param {string} [avatar]
 * @returns {string}
 */
export function buildPhaseCardsHtml(avatar = '🦁') {
  const currentPhase = _getCurrentPhase();
  return _buildPrePhaseCardsHtml(currentPhase, avatar) + PHASE_META.map(pm => {
    const { status, pct, masteredCount, total } = _getPhaseStatus(pm.phase);
    const isCurrent = pm.phase === currentPhase && status !== 'complete';
    const statusLabel = { complete: 'Complete ✅', 'in-progress': 'In progress', locked: 'Not started yet' }[status] || '';
    const statusClass = `cm-phase--${status}`;

    return `
      <div class="cm-phase ${statusClass} ${isCurrent ? 'cm-phase--current' : ''}"
           aria-label="${pm.title}${isCurrent ? ' – current stage' : ''}">
        ${isCurrent ? `<div class="cm-you-are-here">${avatar} You are here!</div>` : ''}
        <div class="cm-phase-header">
          <span class="cm-phase-icon">${pm.icon}</span>
          <div>
            <span class="cm-phase-label">${pm.label}</span>
            <span class="cm-phase-title">${pm.title}</span>
          </div>
          <span class="cm-phase-badge">${status === 'complete' ? '✅' : status === 'in-progress' ? `${pct}%` : '🔒'}</span>
        </div>
        <p class="cm-phase-desc">${pm.desc}</p>
        ${pm.sightWords.length ? `<p class="cm-phase-sight">🃏 Tricky words: ${pm.sightWords.join(', ')}</p>` : ''}
        ${status !== 'locked' ? `
          <div class="cm-phase-bar-track" aria-label="${pct}% complete">
            <div class="cm-phase-bar-fill" style="width:${pct}%"></div>
          </div>
          <span class="cm-phase-meta">${masteredCount} / ${total} groups · ${statusLabel}</span>
        ` : `<span class="cm-phase-meta cm-phase-meta--locked">${statusLabel}</span>`}
      </div>`;
  }).join('');
}

/**
 * Primary English domain cards HTML. Shared by the dashboard map and the
 * parent Learning Roadmap.
 * @returns {string}
 */
export function buildDomainCardsHtml() {
  return PRIMARY_DOMAINS.map(pd => {
    const { status, pct } = _getDomainStatus(pd.id);
    const statusClass = `cm-domain--${status}`;
    const statusLabel = { strong: 'Strong ✅', building: 'Building', starting: 'Just started', 'not-started': 'Not started yet' }[status] || '';
    return `
      <div class="cm-domain ${statusClass}" aria-label="${pd.label}: ${statusLabel}">
        <div class="cm-domain-header">
          <span class="cm-domain-icon">${pd.icon}</span>
          <span class="cm-domain-label">${pd.label}</span>
          <span class="cm-domain-pct">${status !== 'not-started' ? `${pct}%` : '—'}</span>
        </div>
        <p class="cm-domain-desc">${pd.desc}</p>
        ${status !== 'not-started' ? `
          <div class="cm-phase-bar-track">
            <div class="cm-phase-bar-fill" style="width:${pct}%"></div>
          </div>` : ''}
      </div>`;
  }).join('');
}

export function renderCurriculumMap(container, { onClose } = {}) {
  if (!container) return;

  const profile      = getActiveProfile();
  const isPrimary    = profile?.schoolLevel === 'primary';
  const avatar       = profile?.avatar || '🦁';
  // Escaped once here: this reaches innerHTML in both the aria-label and
  // the title below, and profile names are user-supplied.
  const name         = escapeHtml(profile?.name?.split(' ')[0] || 'Learner');

  const phaseCards  = buildPhaseCardsHtml(avatar);
  const domainCards = buildDomainCardsHtml();

  container.innerHTML = `
    <div class="cm-wrapper" role="dialog" aria-label="${name}'s learning journey">
      <div class="cm-header">
        <div class="cm-header-left">
          <span class="cm-avatar" aria-hidden="true">${avatar}</span>
          <div>
            <h2 class="cm-title">${name}'s Learning Journey</h2>
            <p class="cm-subtitle">Track progress from phonics foundations to primary English</p>
          </div>
        </div>
        ${onClose ? `<button class="btn btn--ghost btn--sm cm-close" id="cm-close-btn" aria-label="Close map">✕</button>` : ''}
      </div>

      <div class="cm-section">
        <h3 class="cm-section-title">
          <span class="cm-section-icon">🔤</span>
          Phonics Foundations
        </h3>
        <p class="cm-section-desc">Master letter sounds before moving to reading and writing.</p>
        <div class="cm-phase-grid">
          ${phaseCards}
        </div>
      </div>

      <div class="cm-connector" aria-hidden="true">
        <div class="cm-connector-line"></div>
        <span class="cm-connector-label">→ Phonics mastery unlocks Primary English</span>
      </div>

      <div class="cm-section ${isPrimary ? '' : 'cm-section--future'}">
        <h3 class="cm-section-title">
          <span class="cm-section-icon">📚</span>
          Primary English Skills
          ${!isPrimary ? '<span class="cm-section-tag">Unlocks with phonics mastery</span>' : ''}
        </h3>
        <p class="cm-section-desc">Reading, grammar, vocabulary, and writing in authentic contexts.</p>
        <div class="cm-domain-grid">
          ${domainCards}
        </div>
      </div>
    </div>`;

  document.getElementById('cm-close-btn')?.addEventListener('click', () => onClose?.());
}
