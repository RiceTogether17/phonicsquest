import { escapeHtml } from '../utils/escapeHtml.js';

const QUEST_DEFAULTS = {
  cloze: {
    badge: 'Castle Scan',
    titleFallback: 'Cloze Castle',
    primaryPrompt: 'Read the whole passage first.',
    secondaryPrompt: 'What is the passage mostly about?',
    continueLabel: 'I have read the passage',
    continueId: 'cloze-read-first',
    quitId: 'cloze-quit',
    rootClass: 'cloze-game',
    instructionClass: 'cloze-instruction',
    titleClass: 'cloze-title',
    badgeClass: 'cloze-badge',
    headerClass: 'cloze-game-header',
  },
  vault: {
    badge: 'Vault Scan',
    titleFallback: 'Word Vault',
    primaryPrompt: 'Read the sentence first.',
    secondaryPrompt: 'What clue helps you?',
    continueLabel: 'I have read the sentence',
    continueId: 'wv-read-first',
    quitId: 'wv-quit',
    rootClass: 'wv-game',
    instructionClass: 'wv-instruction',
    titleClass: 'wv-passage-title',
    badgeClass: 'wv-game-badge',
    headerClass: 'wv-game-header',
  },
};

/**
 * Render a child-friendly read-first acknowledgement screen.
 * Returns nothing; wires up `onContinue` and optional `onQuit`.
 *
 * Keeps all dynamic text safe via escapeHtml.  Designed to be called from
 * Cloze Castle and Word Vault before the playable passage is shown.
 */
export function renderReadFirstScan({
  host,
  quest = 'cloze',
  passageTitle = '',
  primaryPrompt,
  secondaryPrompt,
  continueLabel,
  onContinue,
  onQuit,
}) {
  if (!host) return;
  const cfg = QUEST_DEFAULTS[quest] || QUEST_DEFAULTS.cloze;
  const title = passageTitle || cfg.titleFallback;
  const primary = primaryPrompt || cfg.primaryPrompt;
  const secondary = secondaryPrompt || cfg.secondaryPrompt;
  const buttonLabel = continueLabel || cfg.continueLabel;

  host.innerHTML = `
    <div class="${cfg.rootClass} ${cfg.rootClass}--scan" role="region" aria-label="${escapeHtml(cfg.badge)}">
      <div class="${cfg.headerClass}">
        <span class="${cfg.badgeClass}">${escapeHtml(cfg.badge)}</span>
      </div>
      <h3 class="${cfg.titleClass}">${escapeHtml(title)}</h3>
      <p class="${cfg.instructionClass}">${escapeHtml(primary)}</p>
      <p class="${cfg.instructionClass}">${escapeHtml(secondary)}</p>
      <button class="btn btn--primary" id="${cfg.continueId}">${escapeHtml(buttonLabel)}</button>
      <button class="btn btn--ghost btn--sm" id="${cfg.quitId}">Menu</button>
    </div>`;

  host.querySelector(`#${cfg.continueId}`)?.addEventListener('click', () => {
    onContinue?.();
  });
  host.querySelector(`#${cfg.quitId}`)?.addEventListener('click', () => {
    onQuit?.();
  });
}
