/**
 * PhonicsQuest Service Worker
 *
 * Strategy:
 *   - App shell (HTML/JS/CSS): Cache-first, updated in background
 *   - Audio/Images: Cache-first, long-lived (assets don't change often)
 *   - Navigation: Network-first with offline fallback to cached shell
 */

const CACHE_VERSION = 'v2';
const SHELL_CACHE   = `phonicsquest-shell-${CACHE_VERSION}`;
const ASSET_CACHE   = `phonicsquest-assets-${CACHE_VERSION}`;

/** App shell files — always cache on install */
const SHELL_FILES = [
  '/blending/',
  '/blending/index.html',
];

/** Audio and image prefixes to cache on first fetch */
const CACHEABLE_PREFIXES = [
  '/blending/audio/',
  '/blending/images/',
  '/blending/icons/',
  '/blending/assets/',  // Vite-bundled JS/CSS chunks
];

// ── Install: pre-cache app shell ────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then(cache => cache.addAll(SHELL_FILES))
      .then(() => self.skipWaiting())
      .catch(err => console.warn('[SW] Install failed:', err))
  );
});

// ── Activate: delete old caches ─────────────────────────────────────────────
self.addEventListener('activate', event => {
  const kept = [SHELL_CACHE, ASSET_CACHE];
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => !kept.includes(k)).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: route requests ────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin GET requests
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  // Audio + images + built assets → cache-first
  if (CACHEABLE_PREFIXES.some(p => url.pathname.startsWith(p))) {
    event.respondWith(cacheFirst(request, ASSET_CACHE));
    return;
  }

  // Navigation → network-first with shell fallback
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstWithFallback(request));
    return;
  }

  // Everything else (fonts, etc.) → stale-while-revalidate
  event.respondWith(staleWhileRevalidate(request, SHELL_CACHE));
});

// ── Strategies ───────────────────────────────────────────────────────────────

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (_) {
    return new Response('Network error', { status: 503 });
  }
}

async function networkFirstWithFallback(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(SHELL_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (_) {
    const cached = await caches.match('/blending/') ||
                   await caches.match('/blending/index.html');
    return cached || new Response('Offline', { status: 503 });
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache  = await caches.open(cacheName);
  const cached = await cache.match(request);
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) cache.put(request, response.clone());
    return response;
  }).catch(() => cached);
  return cached || fetchPromise;
}
