#!/usr/bin/env node
/**
 * Generate the service worker's precache manifest, and stamp the build id
 * into the copy of `sw.js` that ships.
 *
 * Audit 2026-09-19, finding 22. Two problems this solves.
 *
 * **Unopened modules were not guaranteed offline.** The service worker cached
 * lazy chunks on first fetch, so a child who had never opened Cloze Castle
 * online could not open it offline — and nothing told them that before they
 * tried. The manifest lists every built chunk, so the worker can fetch them
 * all in the background and then say, truthfully, that the app is ready.
 *
 * **The cache version was hand-maintained.** `CACHE_VERSION = 'v8'` had to be
 * remembered on every release that changed an unhashed asset; forgetting it
 * serves a stale file forever, and a browser only reinstalls a worker whose
 * own bytes changed, so a new manifest alone would never be read. The build id
 * is written into `sw.js`, which changes its bytes exactly when the build
 * changes, and the cache names derive from it.
 *
 * The id is a content hash of the precache list, not a timestamp: rebuilding
 * the same source twice produces byte-identical output, which the deploy
 * workflow depends on (finding 21 ships the artifact CI verified).
 *
 * Run by `npm run build`, after `vite build`.
 */

import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const OUT_DIR = join(ROOT, 'docs');
const BASE = '/phonicsquest/';

/** Where the manifest itself is written, and what the worker fetches. */
const MANIFEST_FILE = join(OUT_DIR, 'sw-manifest.json');

/**
 * Directories whose every file is precached, and why each earns its bytes.
 *
 * `images/` is deliberately absent: it is 21 MB, most of it illustrations for
 * stories a given child may never open. Those stay cache-on-first-fetch, and
 * the offline promise is worded to match — every activity runs, but a picture
 * from a story never visited online may not appear.
 */
const PRECACHE_DIRS = [
  ['assets', 'Built JS and CSS — every lazy module, so none needs the network'],
  ['audio', 'Phoneme MP3s — the app cannot teach sounds without them'],
  ['icons', 'App icons, needed by the installed PWA shell'],
];

/** Files at the root of the build that the app needs before anything else. */
const SHELL_FILES = ['index.html', 'manifest.json'];

/** Every file under `dir`, as a build-relative path. */
function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out; // an optional directory this build did not produce
  }
  for (const entry of entries) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else out.push(relative(OUT_DIR, full).split('\\').join('/'));
  }
  return out;
}

const shell = [BASE, ...SHELL_FILES.map((f) => BASE + f)];

const precache = [];
for (const [dir] of PRECACHE_DIRS) {
  precache.push(...walk(join(OUT_DIR, dir)).map((p) => BASE + p));
}
precache.sort();

// Content hash of what is being cached. Vite gives assets content-hashed
// names, so this changes exactly when the build's contents change.
const buildId = createHash('sha256')
  .update([...shell, ...precache].join('\n'))
  .digest('hex')
  .slice(0, 12);

const manifest = {
  buildId,
  // Recorded so the app can tell a parent what "ready offline" covers,
  // without the wording and the behaviour drifting apart.
  offline: {
    precached: PRECACHE_DIRS.map(([dir, why]) => ({ dir, why })),
    onFirstVisit: ['images'],
  },
  shell,
  precache,
};

writeFileSync(MANIFEST_FILE, `${JSON.stringify(manifest, null, 2)}\n`);

// Stamp the id into the shipped worker. The source in `public/sw.js` keeps
// the placeholder so it is obvious the value is generated, and a dev server
// (which serves public/ unbuilt) falls back to the placeholder as its id.
const swPath = join(OUT_DIR, 'sw.js');
const sw = readFileSync(swPath, 'utf8');
if (!sw.includes('__BUILD_ID__')) {
  console.error(
    `[sw-manifest] ${relative(ROOT, swPath)} has no __BUILD_ID__ placeholder — refusing to ship a worker whose cache version cannot change.`,
  );
  process.exit(1);
}
writeFileSync(swPath, sw.replaceAll('__BUILD_ID__', buildId));

const bytes = precache.reduce((sum, url) => {
  try {
    return sum + statSync(join(OUT_DIR, url.slice(BASE.length))).size;
  } catch {
    return sum;
  }
}, 0);

console.log(
  `[sw-manifest] build ${buildId}: ${precache.length} files precached (${(bytes / 1024 / 1024).toFixed(1)} MB), ${shell.length} shell entries.`,
);
