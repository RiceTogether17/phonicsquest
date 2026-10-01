/**
 * PhonicsQuest – Visual Text stimulus rendering.
 *
 * Audit 2026-09-19, finding 18. `visualTextItems.js` stores every poster,
 * notice, menu, schedule and form as a plain string, and the section rendered
 * it inside `<pre>`. A screenshot of the result is a wall of monospaced text.
 *
 * That practises retrieving information from sentences, which is worth
 * something, but it is not what the Visual Text component assesses. Meaning in
 * a real poster is carried by layout: what is biggest, what is grouped with
 * what, what is set apart in a box, which column a row belongs to. A child
 * reading `<pre>` never has to do any of that.
 *
 * ## What this does, and what it does not
 *
 * It derives visual structure from the text's own structure — a headline, the
 * detail line under it, numbered rules, bulleted lists, key/value rows,
 * tabular columns — and renders each with real semantic HTML and a real visual
 * hierarchy. A schedule becomes a `<table>` with headers; a notice becomes a
 * framed notice with a headline and a body; a numbered list of rules becomes
 * an `<ol>`.
 *
 * It does **not** invent charts, photographs or graphic relationships that are
 * not in the data. Two items are typed `infographic` and one `chart`, and
 * their content is still text: giving them real data graphics is authoring
 * work, not rendering work. The audit's other half — adding MCQ-format
 * practice, since the official component is MCQ — is content work too, and
 * neither is attempted here.
 *
 * Accessibility: the markup IS the alternative. Headings, lists and tables
 * give a screen-reader user the same structure a sighted child sees, so no
 * summary text is added — a description of the poster would hand over the
 * answers the questions are asking for.
 */

import { escapeHtml } from '../utils/escapeHtml.js';

/** Types that read as a grid of rows and columns. */
const TABULAR_TYPES = new Set(['schedule', 'table', 'menu']);

/** A row separator used consistently enough to mean columns. */
const COLUMN_SPLIT = /\s{2,}|\s+·\s+|\s+\|\s+/;

/** `1.` / `1)` / `Step 1:` style. */
const ORDERED_RE = /^\s*(\d+)[.)]\s+(.*)$/;

/** `- ` / `• ` / `* ` style. */
const BULLET_RE = /^\s*[-•*]\s+(.*)$/;

/** `Label: value`, where the label is short enough to be a label. */
const PAIR_RE = /^\s*([A-Z][^:]{0,28}):\s+(.+)$/;

/** Split a poster string into blank-line-separated blocks of lines. */
function _blocks(text) {
  return String(text ?? '')
    .replace(/\r\n/g, '\n')
    .split(/\n\s*\n/)
    .map((b) => b.split('\n').filter((l) => l.trim().length))
    .filter((b) => b.length);
}

/** Render a run of `1. …` lines as an ordered list. */
function _orderedList(lines) {
  return `<ol class="vstim-ol">${lines
    .map((l) => `<li>${escapeHtml(l.replace(ORDERED_RE, '$2'))}</li>`)
    .join('')}</ol>`;
}

/** Render a run of bulleted or indented lines as an unordered list. */
function _bulletList(lines) {
  return `<ul class="vstim-ul">${lines
    .map((l) => `<li>${escapeHtml(l.replace(BULLET_RE, '$1').trim())}</li>`)
    .join('')}</ul>`;
}

/** Render `Label: value` runs as a description list — the shape of a form. */
function _pairList(lines) {
  return `<dl class="vstim-dl">${lines
    .map((l) => {
      const [, label, value] = l.match(PAIR_RE);
      return `<dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd>`;
    })
    .join('')}</dl>`;
}

/**
 * Render a run of multi-column lines as a real table.
 *
 * The first row becomes the header when every one of its cells is short and
 * none of them looks like data — a schedule's "Time / Event" line. Otherwise
 * the table is all body rows, which is still better than `<pre>`: a screen
 * reader gets row and column structure either way.
 */
function _table(lines) {
  const rows = lines.map((l) =>
    l
      .trim()
      .split(COLUMN_SPLIT)
      .map((c) => c.trim()),
  );
  const width = Math.max(...rows.map((r) => r.length));
  const pad = (r) => [...r, ...Array(width - r.length).fill('')];

  const first = rows[0];
  const looksLikeHeader =
    rows.length > 1 &&
    first.length === width &&
    first.every((c) => c.length <= 24 && !/\d{2}/.test(c));

  const head = looksLikeHeader
    ? `<thead><tr>${pad(first)
        .map((c) => `<th scope="col">${escapeHtml(c)}</th>`)
        .join('')}</tr></thead>`
    : '';
  const bodyRows = looksLikeHeader ? rows.slice(1) : rows;

  return `<table class="vstim-table">${head}<tbody>${bodyRows
    .map(
      (r) =>
        `<tr>${pad(r)
          .map((c) => `<td>${escapeHtml(c)}</td>`)
          .join('')}</tr>`,
    )
    .join('')}</tbody></table>`;
}

/** Group consecutive lines of the same shape, so each run renders as one element. */
function _renderBlock(lines, { tabular }) {
  const out = [];
  let run = [];
  let runKind = null;

  const kindOf = (line) => {
    if (ORDERED_RE.test(line)) return 'ol';
    if (BULLET_RE.test(line)) return 'ul';
    if (tabular && COLUMN_SPLIT.test(line.trim())) return 'table';
    if (PAIR_RE.test(line)) return 'dl';
    return 'p';
  };

  const flush = () => {
    if (!run.length) return;
    if (runKind === 'ol') out.push(_orderedList(run));
    else if (runKind === 'ul') out.push(_bulletList(run));
    else if (runKind === 'dl') out.push(_pairList(run));
    else if (runKind === 'table') out.push(_table(run));
    else out.push(run.map((l) => `<p class="vstim-p">${escapeHtml(l.trim())}</p>`).join(''));
    run = [];
  };

  for (const line of lines) {
    const kind = kindOf(line);
    if (kind !== runKind) {
      flush();
      runKind = kind;
    }
    run.push(line);
  }
  flush();
  return out.join('');
}

/**
 * Render one visual-text item as a laid-out stimulus.
 *
 * @param {{id?: string, type?: string, title?: string, poster: string}} item
 * @returns {string} HTML
 */
export function renderVisualStimulus(item) {
  const type = String(item?.type || 'poster').toLowerCase();
  const blocks = _blocks(item?.poster);
  if (!blocks.length) return '';

  const tabular = TABULAR_TYPES.has(type);

  // The first line of the first block is the headline; whatever follows it in
  // that block is the standfirst — the "when and where" under a poster title.
  const [headline, ...standfirst] = blocks[0];
  const rest = blocks.slice(1);

  return `
    <figure class="vstim vstim--${escapeHtml(type)}">
      <div class="vstim-sheet">
        <p class="vstim-headline">${escapeHtml(headline.trim())}</p>
        ${standfirst.length ? `<div class="vstim-standfirst">${_renderBlock(standfirst, { tabular })}</div>` : ''}
        ${rest.map((b) => `<div class="vstim-block">${_renderBlock(b, { tabular })}</div>`).join('')}
      </div>
      <figcaption class="vstim-caption">${escapeHtml(_typeLabel(type))}</figcaption>
    </figure>`;
}

/** A plain name for the kind of text this is, shown under the sheet. */
function _typeLabel(type) {
  return (
    {
      notice: 'A notice',
      poster: 'A poster',
      schedule: 'A schedule',
      menu: 'A menu',
      advertisement: 'An advertisement',
      infographic: 'An infographic',
      chart: 'A chart',
      table: 'A table',
      form: 'A form',
    }[type] || 'A visual text'
  );
}
