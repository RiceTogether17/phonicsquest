import { escapeHtml } from '../utils/escapeHtml.js';

export function showAnswerReviewPanel({ host, title = 'Answer Review', rows = [], onContinue }) {
  if (!host) return;
  host.querySelector('#cloze-answer-review')?.remove();
  const overlay = document.createElement('div');
  overlay.id = 'cloze-answer-review';
  overlay.className = 'clue-explanation-overlay';

  const body = rows.map((row) => `
    <tr>
      <td>${escapeHtml(row.blank || '')}</td>
      <td>${escapeHtml(row.studentAnswer || '')}</td>
      <td>${escapeHtml(row.correctAnswer || '')}</td>
      <td>${escapeHtml(row.status || '')}</td>
      <td>${escapeHtml(row.clue || '')}</td>
      <td>${escapeHtml(row.explanation || '')}</td>
    </tr>
  `).join('');

  overlay.innerHTML = `
    <div class="clue-explanation-card">
      <p class="clue-explanation-title">${escapeHtml(title)}</p>
      <div class="clue-explanation-body">
        <table class="wv-review-table">
          <thead><tr><th>Blank</th><th>Your answer</th><th>Correct</th><th>Status</th><th>Clue</th><th>Explanation</th></tr></thead>
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
