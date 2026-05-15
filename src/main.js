/**
 * PhonicsQuest – Entry Point
 *
 * Imports all modules and boots the application.
 * Vite will tree-shake and bundle everything.
 */

import './styles/main.css';
import { app } from './app.js';
import { registerServiceWorker, initInstallPrompt } from './modules/pwa.js';
import { loadCustomWords } from './data/words.js';

document.addEventListener('DOMContentLoaded', () => {
  loadCustomWords();
  app.init();
  registerServiceWorker();
  initInstallPrompt();
});
