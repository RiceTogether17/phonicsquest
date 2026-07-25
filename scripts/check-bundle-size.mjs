#!/usr/bin/env node
/**
 * Bundle-size budget check (IMPROVEMENTS.md #26).
 *
 * The app targets low-end school tablets/Chromebooks, so the eagerly loaded
 * startup chunk (index-*.js) is budgeted. Lazy quest/data chunks load on
 * demand and get a looser per-chunk cap so a data bank never silently lands
 * back in the startup path.
 *
 * Run after `npm run build`:  node scripts/check-bundle-size.mjs
 * Exits non-zero when a budget is exceeded, so CI fails on regressions.
 */
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ASSETS_DIR = new URL('../docs/assets/', import.meta.url).pathname;

// Minified (pre-gzip) byte budgets.
const STARTUP_BUDGET = 700 * 1024; // index-*.js — currently ~623 kB
const LAZY_BUDGET    = 450 * 1024; // any single lazy chunk — largest today ~360 kB

let failed = false;
const rows = [];

for (const file of readdirSync(ASSETS_DIR).sort()) {
  if (!file.endsWith('.js')) continue;
  const size = statSync(join(ASSETS_DIR, file)).size;
  const isStartup = /^index-/.test(file);
  const budget = isStartup ? STARTUP_BUDGET : LAZY_BUDGET;
  const over = size > budget;
  if (over) failed = true;
  if (over || isStartup) {
    rows.push(`${over ? '✗' : '✓'} ${file}  ${(size / 1024).toFixed(1)} kB (budget ${(budget / 1024).toFixed(0)} kB)`);
  }
}

console.log('Bundle-size budget check');
console.log(rows.join('\n') || '(no JS assets found)');

if (rows.length === 0) {
  console.error('✗ No JS assets found in docs/assets — did the build run?');
  process.exit(1);
}
if (failed) {
  console.error('\n✗ Bundle budget exceeded. If a data bank grew, split it into a lazy chunk');
  console.error('  (see src/modes/lazy.js) before raising the budget.');
  process.exit(1);
}
console.log('\n✓ All chunks within budget.');
