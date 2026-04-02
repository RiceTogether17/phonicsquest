import { PAPER_LEVELS, PAPER_MODE_PLAYLISTS, PAPER_SECTION_LABELS } from '../data/paperPlaylists.js';

let _container = null;
let _launchSection = null;
let _onGoHome = null;

export function initPaperMode(container, { onLaunchSection, onGoHome }) {
  _container = container;
  _launchSection = onLaunchSection;
  _onGoHome = onGoHome;
}

export function cleanupPaperMode() {
  if (_container) _container.innerHTML = '';
}

export function showPaperModeBrowser() {
  if (!_container) return;
  _container.innerHTML = `
    <div class="sfq-browser">
      <h2 class="sfq-title">📝 Paper Mode</h2>
      <p class="sfq-instruction">Choose a level to run exam-style section playlists.</p>
      <div class="sfq-browser-grid">
        ${PAPER_LEVELS.map(l => `<button class="sfq-level-btn" data-level="${l}">${l}</button>`).join('')}
      </div>
      <div class="sfq-actions"><button class="btn btn--ghost" id="paper-home">← Home</button></div>
      <div id="paper-playlist"></div>
    </div>`;

  _container.querySelectorAll('[data-level]').forEach(btn => {
    btn.addEventListener('click', () => _renderPlaylist(btn.dataset.level));
  });
  _container.querySelector('#paper-home')?.addEventListener('click', () => _onGoHome?.());
}

function _renderPlaylist(level) {
  const sections = PAPER_MODE_PLAYLISTS[level] || [];
  const holder = _container?.querySelector('#paper-playlist');
  if (!holder) return;
  holder.innerHTML = `
    <div class="dash-pattern-item" style="margin-top:12px">
      <h3>${level} Paper Playlist</h3>
      <ol>
        ${sections.map((s, i) => `<li><button class="btn btn--ghost" data-section="${s}">Section ${i + 1}: ${PAPER_SECTION_LABELS[s] || s}</button></li>`).join('')}
      </ol>
      <button class="btn btn--primary" id="paper-start-all">Start Section 1</button>
    </div>`;

  holder.querySelectorAll('[data-section]').forEach(btn => {
    btn.addEventListener('click', () => _launchSection?.(btn.dataset.section, level));
  });
  holder.querySelector('#paper-start-all')?.addEventListener('click', () => {
    if (sections[0]) _launchSection?.(sections[0], level);
  });
}
