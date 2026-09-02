/**
 * PhonicsQuest – Lazy module loader
 *
 * Heavy modes and components pull in large data files (word banks, practice
 * tests, comprehension passages) and libraries (chart.js). Importing them
 * statically forced all of that into the initial JS bundle, which made first
 * load slow — especially on phones. These wrappers defer the dynamic import
 * until the feature is actually opened, so Vite splits each into its own chunk
 * that is fetched on demand (and then cached by the service worker).
 */

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
        pending = loader().then((m) => {
          mod = m;
          return m;
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
