/**
 * PhonicsQuest – Entry Point
 *
 * Imports all modules and boots the application.
 * Vite will tree-shake and bundle everything.
 */

import './styles/main.css';
import { app } from './app.js';
import { registerServiceWorker } from './modules/pwa.js';

// Boot the application
document.addEventListener('DOMContentLoaded', () => {
  app.init();
  registerServiceWorker();
});
