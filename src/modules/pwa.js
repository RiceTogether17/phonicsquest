/**
 * PhonicsQuest – PWA / Service Worker Registration
 */

const BASE = import.meta.env.BASE_URL;

export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register(`${BASE}sw.js`, {
        scope: BASE,
      });
      console.log('[PWA] Service worker registered:', reg.scope);

      // Listen for updates
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (!newWorker) return;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'activated') {
            showToast('App updated! Refresh for the latest version.', 'info');
          }
        });
      });
    } catch (err) {
      console.warn('[PWA] Service worker registration failed:', err);
    }
  });
}

/** Simple toast helper for PWA notifications */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}
