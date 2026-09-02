/**
 * Story-bank decodability audit.
 *
 * Read-only by default: prints, for every story in src/data/stories.js:
 *   - computed word count / decodable ratio / refrain count vs declared
 *   - band/format word-range, level and HFW-tier-cap compliance
 *   - stretch words (not decodable at the story's tier and not covered by
 *     any allowance) with the tier each would need
 *   - capitalised mid-sentence names missing from PROPER_NOUNS
 *
 * With --fix it rewrites the declared `actualWordCount`, `decodableRatio`
 * and `refrainCount` of every story in src/data/stories.js to the
 * computed values (the canonical counting convention lives in
 * src/modules/decodability.js).
 *
 * Usage:  node scripts/audit-stories.mjs [--json] [--fix] [storyId…]
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { STORIES } from '../src/data/stories.js';
import {
  analyzeStory,
  getStoryPhase,
  getStoryRules,
  findUnknownCapitalised,
} from '../src/modules/decodability.js';

const args = process.argv.slice(2);
const asJson = args.includes('--json');
const doFix = args.includes('--fix');
const onlyIds = args.filter((a) => !a.startsWith('--'));

const reports = [];
for (const story of STORIES) {
  if (onlyIds.length && !onlyIds.includes(story.id)) continue;
  const { computed } = analyzeStory(story);
  const rules = getStoryRules(story);
  const phase = getStoryPhase(story.phase);
  const problems = [];

  if (!phase) problems.push(`unknown phase '${story.phase}'`);
  if (!rules) problems.push(`unknown band '${story.band}'`);
  if (rules && story.level !== rules.level) {
    problems.push(`level ${story.level} ≠ band ${story.band} level ${rules.level}`);
  }
  if (rules && (computed.wordCount < rules.min || computed.wordCount > rules.max)) {
    problems.push(`word count ${computed.wordCount} outside range ${rules.min}–${rules.max}`);
  }
  if (computed.wordCount !== story.actualWordCount) {
    problems.push(`actualWordCount ${story.actualWordCount} ≠ computed ${computed.wordCount}`);
  }
  if (rules && story.allowedHFWTier > rules.hfwCap) {
    problems.push(`allowedHFWTier ${story.allowedHFWTier} > cap ${rules.hfwCap}`);
  }
  if (Math.abs(computed.decodableRatio - story.decodableRatio) > 0.02) {
    problems.push(
      `decodableRatio ${story.decodableRatio} ≠ computed ${computed.decodableRatio.toFixed(2)}`,
    );
  }
  if (computed.refrainCount !== story.refrainCount) {
    problems.push(`refrainCount ${story.refrainCount} ≠ computed ${computed.refrainCount}`);
  }
  const caps = findUnknownCapitalised(story);
  if (caps.length) problems.push(`unwhitelisted name(s): ${caps.join(', ')}`);
  for (const s of computed.stretchWords) {
    problems.push(
      `stretch: "${s.word}"×${s.count} needs tier ${s.requiredTier} (story tier ${phase?.tier})`,
    );
  }

  reports.push({ id: story.id, band: story.band, phase: story.phase, computed, problems });
}

if (doFix) {
  const storiesPath = fileURLToPath(new URL('../src/data/stories.js', import.meta.url));
  let src = readFileSync(storiesPath, 'utf8');
  for (const r of reports) {
    const idIdx = src.indexOf(`id: '${r.id}'`);
    if (idIdx === -1) continue;
    // Patch only within this story's block (up to the next id: or EOF).
    const next = src.indexOf("\n    id: '", idIdx + 1);
    const end = next === -1 ? src.length : next;
    let block = src.slice(idIdx, end);
    block = block
      .replace(/actualWordCount: \d+/, `actualWordCount: ${r.computed.wordCount}`)
      .replace(/decodableRatio: [\d.]+/, `decodableRatio: ${r.computed.decodableRatio.toFixed(2)}`)
      .replace(/refrainCount: \d+/, `refrainCount: ${r.computed.refrainCount}`);
    src = src.slice(0, idIdx) + block + src.slice(end);
  }
  writeFileSync(storiesPath, src);
  console.log(`Rewrote declared metadata for ${reports.length} stories in src/data/stories.js`);
}

if (asJson) {
  console.log(JSON.stringify(reports, null, 2));
} else {
  let bad = 0;
  for (const r of reports) {
    if (!r.problems.length) continue;
    bad += 1;
    console.log(
      `\n■ ${r.id}  [Band ${r.band} · ${r.phase}]  words=${r.computed.wordCount} ratio=${r.computed.decodableRatio.toFixed(2)}`,
    );
    for (const p of r.problems) console.log(`   - ${p}`);
  }
  const ratios = {};
  for (const r of reports) {
    (ratios[r.band] ??= []).push(r.computed.decodableRatio);
  }
  console.log(`\n${reports.length} stories audited, ${bad} with problems.`);
  for (const [band, list] of Object.entries(ratios).sort()) {
    const min = Math.min(...list);
    console.log(`Band ${band}: min computed ratio ${min.toFixed(3)} across ${list.length} stories`);
  }
}
