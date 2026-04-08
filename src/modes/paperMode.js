import { PAPER_LEVELS, PAPER_MODE_PLAYLISTS, PAPER_SECTION_LABELS } from '../data/paperPlaylists.js';
import { store } from '../modules/store.js';

let _container = null;
let _launchSection = null;
let _onGoHome = null;
let _activeSession = null;

function _persistSession() {
  store.set('paperSession', _activeSession);
}

export function initPaperMode(container, { onLaunchSection, onGoHome }) {
  _container = container;
  _launchSection = onLaunchSection;
  _onGoHome = onGoHome;
  _activeSession = store.get('paperSession') || null;
}

export function cleanupPaperMode() {
  if (_container) _container.innerHTML = '';
}

export function showPaperModeBrowser() {
  if (!_container) return;
  _container.innerHTML = `
    <div class="sfq-browser" role="region" aria-label="Paper Mode level selection">
      <h2 class="sfq-title">📝 Paper Mode</h2>
      <p class="sfq-instruction">Choose a level to run exam-style section playlists.</p>
      <div class="sfq-browser-grid" role="group" aria-label="Level buttons">
        ${PAPER_LEVELS.map(l => `<button class="sfq-level-btn" data-level="${l}" aria-label="Start ${l} paper">${l}</button>`).join('')}
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
  const canResume = _activeSession && _activeSession.level === level && !_activeSession.complete;
  holder.innerHTML = `
    <div class="dash-pattern-item" style="margin-top:12px">
      <h3>${level} Paper Playlist</h3>
      <ol>
        ${sections.map((s, i) => `<li><button class="btn btn--ghost" data-section="${s}">Section ${i + 1}: ${PAPER_SECTION_LABELS[s] || s}</button></li>`).join('')}
      </ol>
      <div class="sfq-actions" style="margin-top:8px">
        <button class="btn btn--primary" id="paper-start-all">Start Full Paper</button>
        ${canResume ? '<button class="btn btn--ghost" id="paper-resume">Resume Session</button>' : ''}
      </div>
      <div id="paper-session-card"></div>
    </div>`;

  holder.querySelectorAll('[data-section]').forEach(btn => {
    btn.addEventListener('click', () => _launchSection?.(btn.dataset.section, level));
  });
  holder.querySelector('#paper-start-all')?.addEventListener('click', () => _startFullPaper(level, sections));
  holder.querySelector('#paper-resume')?.addEventListener('click', () => _renderSessionCard());
  if (canResume) _renderSessionCard();
}

function _startFullPaper(level, sections) {
  _activeSession = {
    level,
    sections,
    index: 0,
    startedAt: Date.now(),
    marks: [],
    complete: false,
  };
  _persistSession();
  _renderSessionCard();
}

function _renderSessionCard() {
  const card = _container?.querySelector('#paper-session-card');
  if (!card || !_activeSession) return;

  const current = _activeSession.sections[_activeSession.index];
  const elapsedMins = Math.max(1, Math.round((Date.now() - _activeSession.startedAt) / 60000));
  const score = _activeSession.marks.reduce((acc, m) => {
    acc.scored += m.scored;
    acc.total += m.total;
    return acc;
  }, { scored: 0, total: 0 });

  if (_activeSession.complete || !current) {
    card.innerHTML = `
      <div class="dash-pattern-item" style="margin-top:10px" role="region" aria-label="Paper results">
        <h4>✅ ${_activeSession.level} Paper Complete</h4>
        <p class="sfq-instruction">Elapsed: ~${elapsedMins} min · Score entered: ${score.scored}/${score.total || 0}</p>
        <ol>
          ${_activeSession.marks.map((m, i) => `<li>Section ${i + 1}: ${(PAPER_SECTION_LABELS[m.key] || m.key)} — ${m.scored}/${m.total}</li>`).join('')}
        </ol>
      </div>`;
    return;
  }

  card.innerHTML = `
    <div class="dash-pattern-item" style="margin-top:10px" role="region" aria-label="Active paper session">
      <h4>🧾 Active ${_activeSession.level} Paper Session</h4>
      <p class="sfq-instruction">Section ${_activeSession.index + 1}/${_activeSession.sections.length}: ${PAPER_SECTION_LABELS[current] || current}</p>
      <p class="sfq-instruction">Elapsed: ~${elapsedMins} min · Running score: ${score.scored}/${score.total || 0}</p>
      <div class="sfq-actions">
        <button class="btn btn--primary" id="paper-launch-current">Launch Current Section</button>
        <button class="btn btn--ghost" id="paper-mark-done">Mark Section Done</button>
      </div>
      <div id="paper-mark-form" hidden>
        <div class="dash-pattern-item" style="margin-top:8px; display:flex; flex-direction:column; gap:8px;">
          <label for="paper-scored-input">Marks scored:</label>
          <input id="paper-scored-input" class="cp-name-input" type="number" min="0" value="0" aria-label="Marks scored" />
          <label for="paper-total-input">Total marks:</label>
          <input id="paper-total-input" class="cp-name-input" type="number" min="0" value="5" aria-label="Total marks" />
          <div class="sfq-actions" style="margin-top:4px">
            <button class="btn btn--primary btn--sm" id="paper-confirm-mark">Confirm</button>
            <button class="btn btn--ghost btn--sm" id="paper-cancel-mark">Cancel</button>
          </div>
        </div>
      </div>
    </div>`;

  card.querySelector('#paper-launch-current')?.addEventListener('click', () => {
    if (!_activeSession || _activeSession.complete) return;
    _launchSection?.(current, _activeSession.level);
  });

  card.querySelector('#paper-mark-done')?.addEventListener('click', () => {
    const form = card.querySelector('#paper-mark-form');
    if (form) form.hidden = false;
  });

  card.querySelector('#paper-cancel-mark')?.addEventListener('click', () => {
    const form = card.querySelector('#paper-mark-form');
    if (form) form.hidden = true;
  });

  card.querySelector('#paper-confirm-mark')?.addEventListener('click', () => {
    const scoredInput = /** @type {HTMLInputElement} */ (card.querySelector('#paper-scored-input'));
    const totalInput = /** @type {HTMLInputElement} */ (card.querySelector('#paper-total-input'));
    const scored = Math.max(0, Number.parseInt(scoredInput?.value || '0', 10) || 0);
    const total = Math.max(scored, Number.parseInt(totalInput?.value || '0', 10) || 0);
    _activeSession.marks.push({ key: current, scored, total });
    _activeSession.index += 1;
    if (_activeSession.index === _activeSession.sections.length) {
      _activeSession.complete = true;
    }
    _persistSession();
    _renderSessionCard();
  });
}
