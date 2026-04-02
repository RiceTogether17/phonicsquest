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
      <div class="dash-pattern-item" style="margin-top:10px">
        <h4>✅ ${_activeSession.level} Paper Complete</h4>
        <p class="sfq-instruction">Elapsed: ~${elapsedMins} min · Score entered: ${score.scored}/${score.total || 0}</p>
        <ol>
          ${_activeSession.marks.map((m, i) => `<li>Section ${i + 1}: ${(PAPER_SECTION_LABELS[m.key] || m.key)} — ${m.scored}/${m.total}</li>`).join('')}
        </ol>
      </div>`;
    return;
  }

  card.innerHTML = `
    <div class="dash-pattern-item" style="margin-top:10px">
      <h4>🧾 Active ${_activeSession.level} Paper Session</h4>
      <p class="sfq-instruction">Section ${_activeSession.index + 1}/${_activeSession.sections.length}: ${PAPER_SECTION_LABELS[current] || current}</p>
      <p class="sfq-instruction">Elapsed: ~${elapsedMins} min · Running score: ${score.scored}/${score.total || 0}</p>
      <div class="sfq-actions">
        <button class="btn btn--primary" id="paper-launch-current">Launch Current Section</button>
        <button class="btn btn--ghost" id="paper-mark-done">Mark Section Done</button>
      </div>
    </div>`;

  card.querySelector('#paper-launch-current')?.addEventListener('click', () => {
    _launchSection?.(current, _activeSession.level);
  });

  card.querySelector('#paper-mark-done')?.addEventListener('click', () => {
    const scoredRaw = window.prompt('Enter marks scored for this section (number):', '0');
    const totalRaw = window.prompt('Enter total marks for this section (number):', '5');
    const scored = Math.max(0, Number.parseInt(scoredRaw || '0', 10) || 0);
    const total = Math.max(scored, Number.parseInt(totalRaw || '0', 10) || 0);
    _activeSession.marks.push({ key: current, scored, total });
    _activeSession.index += 1;
    if (_activeSession.index >= _activeSession.sections.length) {
      _activeSession.complete = true;
    }
    _persistSession();
    _renderSessionCard();
  });
}
