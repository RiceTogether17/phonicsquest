/**
 * PhonicsQuest – Lazy module loader
 *
 * Heavy modes and components pull in large data files (word banks, practice
 * tests, comprehension passages) and libraries (chart.js). Importing them
 * statically forced all of that into the initial JS bundle, which made first
 * load slow — especially on phones. These wrappers defer the dynamic import
 * until the feature is actually opened, so Vite splits each into its own chunk
 * that is fetched on demand.
 *
 * Offline, the chunks are already there: the service worker precaches every
 * one from the build manifest rather than waiting for a first visit (audit
 * 2026-09-19, finding 22).
 */

/**
 * Key under which a chunk-recovery reload is remembered, so a genuinely
 * broken build cannot put the app into a reload loop.
 */
const RELOAD_KEY = 'phonicsquest_chunk_reload';

/** How long a recovery reload counts as "we already tried that". */
const RELOAD_COOLDOWN_MS = 60_000;

/**
 * Recover from a chunk that is no longer on the server.
 *
 * The app-upgrade case, and why it happens: a deploy replaces `index.html`
 * and every content-hashed chunk, but a page loaded before the deploy still
 * holds the old chunk names. Opening a module it has not loaded yet then
 * 404s, and the child sees a button that does nothing.
 *
 * The page usually has the new service worker downloaded and waiting in that
 * situation, so telling it to take over and reloading lands on the new build.
 * Guarded by a timestamp because an import can also fail for reasons a reload
 * will not fix (a corrupt cache entry, a proxy), and looping on those would be
 * worse than the original failure.
 *
 * @returns {boolean} whether a reload was started
 */
function recoverFromStaleChunk() {
  // Offline is not a stale chunk. Reloading would drop the child out of an
  // app that is otherwise working.
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return false;

  try {
    const last = Number(sessionStorage.getItem(RELOAD_KEY) || 0);
    if (Date.now() - last < RELOAD_COOLDOWN_MS) return false;
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
  } catch (_) {
    // No sessionStorage (private mode): one reload still beats a dead button,
    // and without a record there is nothing to rate-limit against.
  }

  try {
    navigator.serviceWorker?.controller?.postMessage({ type: 'skip-waiting' });
  } catch (_) {
    /* no worker — the reload alone still picks up the new index.html */
  }
  window.location.reload();
  return true;
}

/**
 * A missing chunk, as distinct from a module that threw while evaluating.
 *
 * Browsers word this differently — Chrome "Failed to fetch dynamically
 * imported module", Firefox "error loading dynamically imported module",
 * Safari "Importing a module script failed" — so match all of them rather
 * than reloading on any import error, which would hide real bugs behind a
 * refresh.
 */
function isChunkLoadFailure(err) {
  const message = String(err?.message || err || '');
  return (
    /dynamically imported module/i.test(message) ||
    /Importing a module script failed/i.test(message) ||
    /Failed to fetch/i.test(message)
  );
}

/**
 * @template T
 * @param {() => Promise<T>} loader  dynamic import, e.g. () => import('./foo.js')
 * @returns {{ load: () => Promise<T>, get: () => T | null }}
 */
export function lazyModule(loader) {
  /** @type {T | null} */
  let mod = null;
  /** @type {Promise<T> | null} */
  let pending = null;

  return {
    /** Load (or return the cached) module namespace. */
    load() {
      if (mod) return Promise.resolve(mod);
      if (!pending)
        pending = loader()
          .then((m) => {
            mod = m;
            return m;
          })
          .catch((err) => {
            // Clear the cached rejection so a second tap can try again,
            // rather than handing every future caller the same failure.
            pending = null;
            if (isChunkLoadFailure(err)) recoverFromStaleChunk();
            throw err;
          });
      return pending;
    },
    /**
     * Synchronously get the loaded namespace, or null if it was never loaded.
     * Use for cleanup paths: a module that was never opened has nothing to tear
     * down, so `mod.get()?.cleanupX()` is a safe no-op.
     */
    get() {
      return mod;
    },
  };
}

/** Exposed for tests; not part of the module's contract. */
export const _internals = { isChunkLoadFailure, recoverFromStaleChunk, RELOAD_KEY };
