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

  // Listen for audio cache progress from service worker
  navigator.serviceWorker.addEventListener('message', (event) => {
    const { type, cached, total, failed } = event.data || {};
    const indicator = document.getElementById('offline-indicator');
    if (!indicator) return;

    if (type === 'audio-cache-progress') {
      const pct = Math.round((cached / total) * 100);
      indicator.hidden = false;
      indicator.innerHTML = `<span class="offline-indicator__icon">⬇</span> Caching audio… ${pct}%`;
      indicator.className = 'offline-indicator offline-indicator--loading';
    } else if (type === 'audio-cache-complete') {
      indicator.hidden = false;
      if (failed === 0) {
        indicator.innerHTML = '<span class="offline-indicator__icon">✓</span> Ready offline';
        indicator.className = 'offline-indicator offline-indicator--ready';
      } else {
        indicator.innerHTML = `<span class="offline-indicator__icon">⚠</span> ${total - failed}/${total} audio cached`;
        indicator.className = 'offline-indicator offline-indicator--partial';
      }
      setTimeout(() => { indicator.hidden = true; }, 4000);
    }
  });

  // Show offline/online status
  window.addEventListener('online', () => _updateNetworkStatus(true));
  window.addEventListener('offline', () => _updateNetworkStatus(false));
}

function _updateNetworkStatus(isOnline) {
  const indicator = document.getElementById('offline-indicator');
  if (!indicator) return;
  if (!isOnline) {
    indicator.hidden = false;
    indicator.innerHTML = '<span class="offline-indicator__icon">⊘</span> Offline — audio cached';
    indicator.className = 'offline-indicator offline-indicator--offline';
  } else {
    indicator.hidden = true;
  }
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
