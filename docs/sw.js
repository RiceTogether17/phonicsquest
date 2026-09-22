/**
 * PhonicsQuest Service Worker
 *
 * Strategy:
 *   - App shell (HTML): network-first, falling back to the cached shell
 *   - Built JS/CSS, audio, icons: cache-first, precached from the build manifest
 *   - Images: cache-first, filled on first fetch (21 MB of story art is too
 *     much to push at every child up front)
 *
 * ## Audit 2026-09-19, finding 22 — what each scenario now does
 *
 * **First install.** The shell is cached, then `sw-manifest.json` is read and
 * everything it lists is fetched: every built chunk, every phoneme MP3, the
 * icons. Progress is broadcast to the page. The install does not block on it —
 * a child can start straight away — but the app does not claim to be ready
 * offline until it finishes.
 *
 * **Offline revisit.** Navigation falls back to the cached shell; every
 * precached file is served from cache.
 *
 * **A module never opened online.** Works, because its chunk was precached at
 * install rather than on first use. This was the gap: `import()` of an
 * unvisited module previously went to the network and failed.
 *
 * **App upgrade.** `BUILD_ID` is stamped in by `scripts/gen-sw-manifest.mjs`
 * from a content hash of the build, so the worker's own bytes change whenever
 * the build does — which is the only thing that makes a browser reinstall it.
 * Cache names derive from it, so the new version fills fresh caches and the
 * old ones are deleted on activate. No hand-maintained version number, and no
 * unhashed asset served stale because someone forgot to bump one.
 *
 * **Cleanup.** Only PhonicsQuest's own caches are deleted. The previous
 * version deleted every cache name it did not recognise, which on a shared
 * origin — several projects on one `*.github.io` account, a school intranet —
 * destroyed an unrelated application's offline data.
 */

/** Replaced at build time with a content hash of the build. */
const BUILD_ID = '824d26661672';

/** Every cache this app owns starts with this, and nothing else may be touched. */
const CACHE_PREFIX = 'phonicsquest-';

const SHELL_CACHE = `${CACHE_PREFIX}shell-${BUILD_ID}`;
const ASSET_CACHE = `${CACHE_PREFIX}assets-${BUILD_ID}`;

const BASE = '/phonicsquest/';
const MANIFEST_URL = `${BASE}sw-manifest.json`;

/** Minimum shell, used when the manifest cannot be read. */
const FALLBACK_SHELL = [BASE, `${BASE}index.html`];

/** Prefixes served cache-first. Images are here but are not precached. */
const CACHEABLE_PREFIXES = [
  `${BASE}audio/`,
  `${BASE}images/`,
  `${BASE}icons/`,
  `${BASE}assets/`, // Vite-bundled JS/CSS chunks
];

// ── Install ─────────────────────────────────────────────────────────────────

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const manifest = await readManifest();

      // Cache the shell first, one file at a time: addAll() rejects the whole
      // install (and skipWaiting never runs) if any single URL 404s.
      const shellCache = await caches.open(SHELL_CACHE);
      await Promise.all((manifest?.shell || FALLBACK_SHELL).map((url) => put(shellCache, url)));

      await self.skipWaiting();

      // Everything else fills in behind the child rather than in front of
      // them. `waitUntil` still covers it, so the browser keeps the worker
      // alive, but the shell is usable long before it finishes.
      await precacheAll(manifest?.precache || []);
    })().catch((err) => console.warn('[SW] Install failed:', err)),
  );
});

/** The build manifest, or null when this is a dev server with no build. */
async function readManifest() {
  try {
    const response = await fetch(MANIFEST_URL, { cache: 'no-store' });
    if (!response.ok) return null;
    return await response.json();
  } catch (_) {
    return null;
  }
}

/**
 * Read one of our caches by URL, whatever headers the asking request carries.
 *
 * `Cache.match` honours the stored response's `Vary` header by default, and
 * both the preview server and GitHub Pages send `Vary: Origin` for assets.
 * A precached entry is stored from a plain same-origin `fetch`, which sends no
 * `Origin`; the page then asks for the same file from a `<script crossorigin>`
 * tag, which does. Those two do not match under `Vary: Origin`, so every
 * precached chunk missed and the app would not boot offline at all — the
 * precache made this worse than caching on first fetch, where the stored
 * request was the page's own.
 *
 * One canonical copy per URL is exactly what a precache means, so vary is
 * ignored deliberately.
 */
function matchCached(cache, request) {
  return cache.match(request, { ignoreVary: true });
}

/** Fetch and store one URL, tolerating a miss. */
async function put(cache, url) {
  try {
    const response = await fetch(url, { cache: 'reload' });
    if (!response.ok) return false;
    await cache.put(url, response);
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * Precache the manifest, reporting progress.
 *
 * Six at a time. All at once saturates a phone's connection and starves the
 * requests the child is actually waiting for; one at a time takes minutes.
 */
async function precacheAll(urls) {
  const cache = await caches.open(ASSET_CACHE);
  const total = urls.length;
  if (!total) {
    broadcast({ type: 'offline-ready', total: 0, failed: 0 });
    return;
  }

  let done = 0;
  let failed = 0;
  const queue = [...urls];

  async function worker() {
    for (let url = queue.shift(); url !== undefined; url = queue.shift()) {
      // A file is already in THIS build's cache only if this install put it
      // there; a new build opens a new cache and refetches. That is the point.
      const existing = await matchCached(cache, url);
      if (!existing && !(await put(cache, url))) failed += 1;
      done += 1;
      broadcast({ type: 'offline-progress', done, total, failed });
    }
  }

  await Promise.all(Array.from({ length: 6 }, worker));
  broadcast({ type: 'offline-ready', total, failed });
}

/** Send a message to every open page. */
function broadcast(msg) {
  self.clients.matchAll({ type: 'window' }).then((clients) => {
    for (const client of clients) client.postMessage(msg);
  });
}

// ── Activate ────────────────────────────────────────────────────────────────

self.addEventListener('activate', (event) => {
  const kept = new Set([SHELL_CACHE, ASSET_CACHE]);
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            // Ours, and not one of ours that is still current. A cache that is
            // not ours is none of our business — deleting it would take an
            // unrelated app on this origin offline.
            .filter((key) => key.startsWith(CACHE_PREFIX) && !kept.has(key))
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// ── Messages ────────────────────────────────────────────────────────────────

self.addEventListener('message', (event) => {
  // The page sends this after a dynamic import fails: when the chunk is gone
  // because a new build replaced it, the fix is to take the new worker.
  if (event.data?.type === 'skip-waiting') self.skipWaiting();
});

// ── Fetch ───────────────────────────────────────────────────────────────────

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin GET requests
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  // The manifest must never be answered out of an older build's cache.
  if (url.pathname === MANIFEST_URL) return;

  if (CACHEABLE_PREFIXES.some((p) => url.pathname.startsWith(p))) {
    event.respondWith(cacheFirst(request, ASSET_CACHE));
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(networkFirstWithFallback(request));
    return;
  }

  event.respondWith(staleWhileRevalidate(request, SHELL_CACHE));
});

// ── Strategies ──────────────────────────────────────────────────────────────

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await matchCached(cache, request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch (_) {
    return new Response('Network error', { status: 503 });
  }
}

async function networkFirstWithFallback(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      // Store under the canonical shell URL, not the navigated URL: caching
      // every query-string variant grows the shell cache without bound and
      // the offline fallback only ever reads the canonical entry anyway.
      const cache = await caches.open(SHELL_CACHE);
      cache.put(BASE, response.clone());
    }
    return response;
  } catch (_) {
    const shell = await caches.open(SHELL_CACHE);
    const cached =
      (await matchCached(shell, BASE)) || (await matchCached(shell, `${BASE}index.html`));
    return cached || new Response('Offline', { status: 503 });
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await matchCached(cache, request);
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => cached);
  return cached || fetchPromise;
}
