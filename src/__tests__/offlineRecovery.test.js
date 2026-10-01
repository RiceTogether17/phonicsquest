/*
 * Audit 2026-09-19, finding 22 — offline support and recovery need tighter
 * guarantees.
 *
 * Four separate defects, each with its own scenario in the audit's acceptance
 * criteria:
 *
 *   1. `activate` deleted every cache whose name it did not recognise. On a
 *      shared origin — several projects under one `*.github.io` account, a
 *      school intranet — that takes an unrelated application offline.
 *   2. Lazy chunks were cached on first fetch, so a module never opened online
 *      could not be opened offline, while the indicator said "Ready offline".
 *   3. `CACHE_VERSION = 'v8'` was hand-maintained, and a browser only
 *      reinstalls a worker whose own bytes changed — so a release that forgot
 *      to bump it served stale unhashed assets indefinitely.
 *   4. A storage-full warning told the user to clear browser data, which is
 *      where this app's only copy of a child's progress lives.
 *
 * The service worker cannot be imported here (it needs `self`, `caches` and
 * the install/activate lifecycle), so its behaviour is asserted by running its
 * two decision functions against fakes and by reading the shipped source for
 * the properties that have no runtime seam.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../..');
const swSource = readFileSync(resolve(root, 'public/sw.js'), 'utf8');

const CACHE_PREFIX = 'phonicsquest-';

describe('cache cleanup leaves other applications alone (finding 22)', () => {
  /**
   * The activate handler's rule, lifted out so it can be run against a
   * realistic set of cache names. Kept identical to the worker's own filter;
   * the test below checks the worker still expresses it this way.
   */
  const survives = (key, kept) => !(key.startsWith(CACHE_PREFIX) && !kept.has(key));

  it('deletes only this app’s superseded caches', () => {
    const kept = new Set([`${CACHE_PREFIX}shell-abc123`, `${CACHE_PREFIX}assets-abc123`]);
    const present = [
      `${CACHE_PREFIX}shell-abc123`, // current
      `${CACHE_PREFIX}assets-abc123`, // current
      `${CACHE_PREFIX}shell-v8`, // ours, superseded
      `${CACHE_PREFIX}assets-v8`, // ours, superseded
      'spellingbee-shell-v2', // a sibling project on the same origin
      'workbox-precache-v2-https://example.org/', // another app's tooling
      'my-school-portal', // anything at all
    ];

    const deleted = present.filter((key) => !survives(key, kept));
    expect(deleted).toEqual([`${CACHE_PREFIX}shell-v8`, `${CACHE_PREFIX}assets-v8`]);

    // The specific promise in the audit's acceptance criteria.
    const survivors = present.filter((key) => survives(key, kept));
    expect(survivors).toContain('spellingbee-shell-v2');
    expect(survivors).toContain('workbox-precache-v2-https://example.org/');
    expect(survivors).toContain('my-school-portal');
  });

  it('the worker filters on its own prefix, not on a keep-list alone', () => {
    // The original was `keys.filter((k) => !kept.includes(k))`, which is the
    // whole bug in one line. Require the prefix guard to be present.
    expect(swSource).toMatch(/key\.startsWith\(CACHE_PREFIX\)\s*&&\s*!kept\.has\(key\)/);
    expect(swSource).not.toMatch(/keys\.filter\(\(k\) => !kept\.includes\(k\)\)/);
  });
});

describe('the build stamps the cache version (finding 22)', () => {
  it('the source carries a placeholder rather than a hand-typed version', () => {
    expect(swSource).toContain("const BUILD_ID = '__BUILD_ID__'");
    expect(swSource, 'the hand-maintained version is gone').not.toMatch(/CACHE_VERSION = 'v\d+'/);
    // Cache names must derive from it, or a new build reuses the old caches.
    expect(swSource).toMatch(/SHELL_CACHE = `\$\{CACHE_PREFIX\}shell-\$\{BUILD_ID\}`/);
    expect(swSource).toMatch(/ASSET_CACHE = `\$\{CACHE_PREFIX\}assets-\$\{BUILD_ID\}`/);
  });

  it('the generator refuses to ship a worker it could not stamp', () => {
    const gen = readFileSync(resolve(root, 'scripts/gen-sw-manifest.mjs'), 'utf8');
    expect(gen).toContain('__BUILD_ID__');
    expect(gen).toMatch(/process\.exit\(1\)/);
  });

  it('runs as part of the build, not as a step someone must remember', () => {
    const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
    expect(pkg.scripts.build).toContain('gen-sw-manifest.mjs');
  });
});

describe('every module is available offline (finding 22)', () => {
  const manifestPath = resolve(root, 'docs/sw-manifest.json');

  it('the build lists every chunk for precaching', () => {
    // docs/ is committed, so the manifest is checkable. If it is missing the
    // build did not run, which is itself the failure this guards.
    expect(existsSync(manifestPath), 'docs/sw-manifest.json — run npm run build').toBe(true);
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

    expect(manifest.buildId).toMatch(/^[0-9a-f]{12}$/);
    expect(manifest.shell).toContain('/phonicsquest/');

    const chunks = manifest.precache.filter((url) => url.startsWith('/phonicsquest/assets/'));
    // The lazy modules are the point: an app with one chunk would pass a
    // "some chunks are listed" assertion while proving nothing.
    expect(chunks.length).toBeGreaterThan(20);
    expect(chunks.every((url) => /\.(js|css)$/.test(url))).toBe(true);

    // Audio too — the app cannot teach sounds without it.
    expect(manifest.precache.some((url) => url.endsWith('.mp3'))).toBe(true);
  });

  it('is honest about what it does not precache', () => {
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    // 21 MB of story illustrations is not something to push at every child.
    // The exclusion is recorded so the wording in the UI can match it.
    expect(manifest.offline.onFirstVisit).toContain('images');
    expect(manifest.precache.some((url) => url.startsWith('/phonicsquest/images/'))).toBe(false);
  });

  it('the indicator no longer calls the app ready when only audio is cached', () => {
    const pwa = readFileSync(resolve(root, 'src/modules/pwa.js'), 'utf8');
    expect(pwa).not.toContain('audio-cache-complete');
    expect(pwa).toContain('offline-ready');
    expect(pwa).toContain('Every activity works offline');
  });
});

describe('a stale chunk after a deploy recovers itself (finding 22)', () => {
  let internals;

  beforeEach(async () => {
    vi.resetModules();
    sessionStorage.clear();
    ({ _internals: internals } = await import('../modes/lazy.js'));
  });

  it('recognises a missing chunk in all three browsers’ wording', () => {
    const { isChunkLoadFailure } = internals;
    // Chrome, Firefox, Safari.
    expect(
      isChunkLoadFailure(new TypeError('Failed to fetch dynamically imported module: /x.js')),
    ).toBe(true);
    expect(isChunkLoadFailure(new Error('error loading dynamically imported module'))).toBe(true);
    expect(isChunkLoadFailure(new TypeError('Importing a module script failed.'))).toBe(true);
  });

  it('does not treat a module that threw while evaluating as a stale chunk', () => {
    // Reloading on any import error hides real bugs behind a refresh.
    const { isChunkLoadFailure } = internals;
    expect(isChunkLoadFailure(new TypeError('Cannot read properties of undefined'))).toBe(false);
    expect(isChunkLoadFailure(new Error('store is not defined'))).toBe(false);
  });

  it('reloads once, then stops', () => {
    const { recoverFromStaleChunk, RELOAD_KEY } = internals;
    const reload = vi.fn();
    vi.spyOn(window, 'location', 'get').mockReturnValue({ reload });
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);

    expect(recoverFromStaleChunk()).toBe(true);
    expect(reload).toHaveBeenCalledTimes(1);
    expect(sessionStorage.getItem(RELOAD_KEY)).toBeTruthy();

    // A build that is genuinely broken must not loop the child through
    // reloads — the second attempt within the cooldown does nothing.
    expect(recoverFromStaleChunk()).toBe(false);
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('does not reload when the device is simply offline', () => {
    const { recoverFromStaleChunk } = internals;
    const reload = vi.fn();
    vi.spyOn(window, 'location', 'get').mockReturnValue({ reload });
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);

    expect(recoverFromStaleChunk()).toBe(false);
    expect(reload).not.toHaveBeenCalled();
  });

  it('lets the next attempt retry instead of caching the rejection', async () => {
    vi.resetModules();
    const { lazyModule } = await import('../modes/lazy.js');
    let calls = 0;
    const mod = lazyModule(() => {
      calls += 1;
      return calls === 1
        ? Promise.reject(new Error('store is not defined'))
        : Promise.resolve({ ok: true });
    });

    await expect(mod.load()).rejects.toThrow();
    await expect(mod.load()).resolves.toEqual({ ok: true });
    expect(calls).toBe(2);
  });
});

describe('a storage-full warning does not invite progress loss (finding 22)', () => {
  /** Render the real warning and read what a parent would see. */
  async function warn() {
    vi.resetModules();
    document.body.innerHTML = '<div id="toast-container"></div>';
    const { store } = await import('../modules/store.js');
    store._storageWarningShown = false;
    store._showStorageWarning();
    return document.querySelector('#toast-container .toast');
  }

  it('no longer tells the user to clear the data that holds their progress', async () => {
    const toast = await warn();
    expect(toast).toBeTruthy();
    expect(toast.textContent).not.toMatch(/clearing browser data/i);
  });

  it('says the progress is only on this device, and offers a backup first', async () => {
    const toast = await warn();
    expect(toast.textContent).toMatch(/on this device only/i);

    const buttons = [...toast.querySelectorAll('button')].map((b) => b.textContent);
    expect(buttons[0], 'the backup is the first thing offered').toBe('Save a backup');
    expect(buttons).toContain('Dismiss');
  });

  it('stays on screen until dismissed', async () => {
    vi.useFakeTimers();
    try {
      const toast = await warn();
      vi.advanceTimersByTime(60_000);
      expect(document.querySelector('#toast-container .toast'), 'still there').toBeTruthy();

      toast.querySelector('button:last-of-type').click();
      expect(document.querySelector('#toast-container .toast')).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it('exports through the credential-free path rather than serialising state here', () => {
    // Finding 5 made `exportProfile` withhold the PIN and the AI key. A
    // storage warning that wrote its own export would reintroduce them.
    const storeSource = readFileSync(resolve(root, 'src/modules/store.js'), 'utf8');
    const body = storeSource.slice(
      storeSource.indexOf('_showStorageWarning() {'),
      storeSource.indexOf('Read a value from state'),
    );
    expect(body).toMatch(/exportProfile/);
    expect(body).not.toMatch(/JSON\.stringify/);
  });
});
