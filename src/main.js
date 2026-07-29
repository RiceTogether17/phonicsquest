/**
 * PhonicsQuest – Entry Point
 *
 * Imports all modules and boots the application.
 * Vite will tree-shake and bundle everything.
 */

import './styles/main.css';
import './styles/journey.css';
import { app } from './app.js';
import { store } from './modules/store.js';
import { registerServiceWorker, initInstallPrompt } from './modules/pwa.js';
import { loadCustomWords } from './data/words.js';

document.addEventListener('DOMContentLoaded', () => {
  loadCustomWords();
  app.init();
  registerServiceWorker();
  initInstallPrompt();

  // The learning-event log lives in IndexedDB (see OFFLOADED_KEYS in
  // store.js) and loads asynchronously, so it is pulled in after the app
  // has rendered rather than blocking first paint. Consumers read it
  // defensively and simply see fewer events until this resolves.
  store.hydrateOffloadedKeys();
});
