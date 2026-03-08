/**
 * PhonicsQuest Service Worker
 *
 * Strategy:
 *   - App shell (HTML/JS/CSS): Cache-first, updated in background
 *   - Audio/Images: Cache-first, long-lived (assets don't change often)
 *   - Navigation: Network-first with offline fallback to cached shell
 */

const CACHE_VERSION = 'v3';
const SHELL_CACHE   = `phonicsquest-shell-${CACHE_VERSION}`;
const ASSET_CACHE   = `phonicsquest-assets-${CACHE_VERSION}`;

/** App shell files — always cache on install */
const SHELL_FILES = [
  '/phonicsquest/',
  '/phonicsquest/index.html',
];

/** All phoneme MP3 files — pre-bundled for offline use */
const PHONEME_FILES = [
  'a','air','ar','b','c','ch','d','e','ear','er','f','g','h','i','j','k',
  'l','long_a','long_e','long_i','long_o','long_u','m','n','ng','o','oi',
  'or','ow','p','q','r','s','sh','soft_c','soft_g','t','th','u','v','w',
  'x','y','z'
].map(f => `/phonicsquest/audio/phonemes/${f}.mp3`);

/** Audio and image prefixes to cache on first fetch */
const CACHEABLE_PREFIXES = [
  '/phonicsquest/audio/',
  '/phonicsquest/images/',
  '/phonicsquest/icons/',
  '/phonicsquest/assets/',  // Vite-bundled JS/CSS chunks
];

// ── Install: pre-cache app shell + all phoneme audio ────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    (async () => {
      // Cache app shell first
      const shellCache = await caches.open(SHELL_CACHE);
      await shellCache.addAll(SHELL_FILES);

      // Pre-cache all phoneme audio with progress reporting
      const assetCache = await caches.open(ASSET_CACHE);
      const total = PHONEME_FILES.length;
      let cached = 0;
      let failed = 0;

      await Promise.all(PHONEME_FILES.map(async (url) => {
        try {
          const existing = await assetCache.match(url);
          if (!existing) {
            const response = await fetch(url);
            if (response.ok) {
              await assetCache.put(url, response);
            } else {
              failed++;
            }
          }
        } catch (_) {
          failed++;
        }
        cached++;
        broadcastProgress({ type: 'audio-cache-progress', cached, total, failed });
      }));

      broadcastProgress({ type: 'audio-cache-complete', total, failed });
      await self.skipWaiting();
    })().catch(err => console.warn('[SW] Install failed:', err))
  );
});

/** Send a message to all connected clients */
function broadcastProgress(msg) {
  self.clients.matchAll({ type: 'window' }).then(clients => {
    for (const client of clients) {
      client.postMessage(msg);
    }
  });
}

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
    const cached = await caches.match('/phonicsquest/') ||
                   await caches.match('/phonicsquest/index.html');
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
