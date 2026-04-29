import { escapeHtml } from '../utils/escapeHtml.js';

function _td(value) {
  return `<td>${escapeHtml(value || '')}</td>`;
}

function _whyCell(row) {
  const lines = [];
  if (row.whyWrong) lines.push(`<p class="review-why review-why--wrong"><strong>Why wrong:</strong> ${escapeHtml(row.whyWrong)}</p>`);
  if (row.whyRight) lines.push(`<p class="review-why review-why--right"><strong>Why right:</strong> ${escapeHtml(row.whyRight)}</p>`);
  if (row.missedClue) lines.push(`<p class="review-why review-why--clue"><strong>Missed clue:</strong> ${escapeHtml(row.missedClue)}</p>`);
  if (lines.length) return `<td>${lines.join('')}</td>`;
  return _td(row.explanation || '');
}

export function showAnswerReviewPanel({ host, title = 'Answer Review', rows = [], onContinue }) {
  if (!host) return;
  host.querySelector('#cloze-answer-review')?.remove();
  const overlay = document.createElement('div');
  overlay.id = 'cloze-answer-review';
  overlay.className = 'clue-explanation-overlay';

  const body = rows.map((row) => `
    <tr>
      ${_td(row.passageTitle)}
      ${_td(row.blank || '')}
      ${_td(row.studentAnswer || '')}
      ${_td(row.correctAnswer || '')}
      ${_td(row.skillLabel || '')}
      ${_td(row.clueTypeLabel || '')}
      ${_td(row.clue || '')}
      ${_whyCell(row)}
      ${_td(row.examTip || row.nextStepPrompt || row.status || '')}
    </tr>
  `).join('');

  overlay.innerHTML = `
    <div class="clue-explanation-card">
      <p class="clue-explanation-title">${escapeHtml(title)}</p>
      <div class="clue-explanation-body">
        <table class="wv-review-table">
          <thead><tr><th>Passage</th><th>Blank</th><th>Your answer</th><th>Correct</th><th>Skill</th><th>Clue type</th><th>Clue</th><th>Why</th><th>Exam tip</th></tr></thead>
          <tbody>${body}</tbody>
        </table>
      </div>
      <button class="btn btn--primary" id="cloze-answer-review-next">Continue →</button>
    </div>`;

  host.appendChild(overlay);
  overlay.querySelector('#cloze-answer-review-next')?.addEventListener('click', () => {
    overlay.remove();
    onContinue?.();
  });
}
