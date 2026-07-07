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

      // The SW calls skipWaiting(), so an updated worker takes control
      // automatically; controllerchange is the reliable "new version live"
      // signal. Offer a one-tap refresh rather than auto-reloading — a
      // child may be mid-lesson.
      let hadController = !!navigator.serviceWorker.controller;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!hadController) {
          // First install taking control — nothing to refresh.
          hadController = true;
          return;
        }
        showUpdateToast();
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

/** Show an "Add to Home Screen" banner so parents can install the app */
export function initInstallPrompt() {
  // Already running as an installed PWA — nothing to do
  if (window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true) return;

  // Respect a recent dismiss (hidden for 14 days)
  const dismissed = localStorage.getItem('pwa-install-dismissed');
  if (dismissed && Date.now() - Number(dismissed) < 14 * 24 * 60 * 60 * 1000) return;

  const banner   = document.getElementById('install-banner');
  const btn      = document.getElementById('install-btn');
  const closeBtn = document.getElementById('install-dismiss');
  const subText  = document.getElementById('install-banner-sub');
  if (!banner || !btn || !closeBtn) return;

  function dismiss() {
    banner.hidden = true;
    localStorage.setItem('pwa-install-dismissed', String(Date.now()));
  }
  closeBtn.addEventListener('click', dismiss);

  // iOS Safari: no beforeinstallprompt — show manual instructions instead
  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
  if (isIos) {
    if (subText) subText.textContent = 'Tap Share ⎙ then "Add to Home Screen"';
    btn.textContent = 'Got it';
    btn.addEventListener('click', dismiss);
    setTimeout(() => { banner.hidden = false; }, 2500);
    return;
  }

  // Chrome / Edge / Samsung Internet: use the deferred install prompt
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    setTimeout(() => { banner.hidden = false; }, 2000);
  });

  btn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    banner.hidden = true;
    if (outcome === 'dismissed') {
      localStorage.setItem('pwa-install-dismissed', String(Date.now()));
    }
  });

  window.addEventListener('appinstalled', () => {
    banner.hidden = true;
    deferredPrompt = null;
  });
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

/** Update notice with a one-tap refresh (the new version is already live). */
function showUpdateToast() {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast toast--info';
  toast.setAttribute('role', 'status');

  const label = document.createElement('span');
  label.textContent = 'App updated! ';
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'btn btn--small';
  btn.textContent = 'Refresh';
  btn.addEventListener('click', () => window.location.reload());

  toast.append(label, btn);
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 10000);
}
