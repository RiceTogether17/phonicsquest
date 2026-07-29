/**
 * PhonicsQuest – Minimal IndexedDB key/value wrapper.
 *
 * Why: everything the app persists shares one ~5 MB localStorage quota, and
 * localStorage is synchronous — every save re-serialises the *entire* state.
 * The fine-grained learning-event log is by far the largest contributor
 * (1,000 records) while being the least critical data we hold, so it moves
 * here and stops being re-written on every answer.
 *
 * Deliberately tiny: one object store, promise-wrapped get/set/delete, and
 * a feature detection so callers can fall back. No dependency, no schema
 * migrations beyond the initial store creation.
 *
 * Every operation resolves rather than rejects on failure (returning null /
 * false), because none of this data is worth breaking a child's session
 * over — callers treat unavailability as "no cached value".
 */

const DB_NAME = 'phonicsquest';
const DB_VERSION = 1;
const STORE_NAME = 'kv';

/** @type {Promise<IDBDatabase|null>|null} */
let _dbPromise = null;

/**
 * Is IndexedDB usable here? False in some private-browsing modes and in
 * test environments without a shim.
 */
export function isAvailable() {
  try {
    return typeof indexedDB !== 'undefined' && indexedDB !== null;
  } catch (_) {
    // Accessing indexedDB can itself throw under strict privacy settings.
    return false;
  }
}

/**
 * Open (once) and cache the database handle.
 * @returns {Promise<IDBDatabase|null>} null when unavailable
 */
function _openDb() {
  if (_dbPromise) return _dbPromise;
  if (!isAvailable()) {
    _dbPromise = Promise.resolve(null);
    return _dbPromise;
  }

  _dbPromise = new Promise((resolve) => {
    let req;
    try {
      req = indexedDB.open(DB_NAME, DB_VERSION);
    } catch (_) {
      resolve(null);
      return;
    }

    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(null);
    req.onblocked = () => resolve(null);
  });

  return _dbPromise;
}

/**
 * Run `fn` inside a transaction, resolving to `fallback` on any failure.
 * @template T
 * @param {IDBTransactionMode} mode
 * @param {(store: IDBObjectStore) => IDBRequest} fn
 * @param {T} fallback
 * @returns {Promise<T|any>}
 */
async function _withStore(mode, fn, fallback) {
  const db = await _openDb();
  if (!db) return fallback;

  return new Promise((resolve) => {
    let tx;
    try {
      tx = db.transaction(STORE_NAME, mode);
    } catch (_) {
      resolve(fallback);
      return;
    }
    let req;
    try {
      req = fn(tx.objectStore(STORE_NAME));
    } catch (_) {
      resolve(fallback);
      return;
    }
    req.onsuccess = () => resolve(req.result === undefined ? fallback : req.result);
    req.onerror = () => resolve(fallback);
    tx.onabort = () => resolve(fallback);
  });
}

/**
 * Read a value.
 * @param {string} key
 * @returns {Promise<any|null>} null when missing or unavailable
 */
export function idbGet(key) {
  return _withStore('readonly', (store) => store.get(key), null);
}

/**
 * Write a value.
 * @param {string} key
 * @param {any} value  must be structured-cloneable
 * @returns {Promise<boolean>} false when the write did not land
 */
export async function idbSet(key, value) {
  const result = await _withStore('readwrite', (store) => store.put(value, key), false);
  return result !== false;
}

/**
 * Delete a value.
 * @param {string} key
 * @returns {Promise<boolean>}
 */
export async function idbDelete(key) {
  const result = await _withStore('readwrite', (store) => store.delete(key), false);
  return result !== false;
}

/** Reset the cached handle. Test-only seam. */
export function __resetForTests() {
  _dbPromise = null;
}
