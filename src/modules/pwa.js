/**
 * PhonicsQuest – PWA / Service Worker Registration
 */

const BASE = import.meta.env.BASE_URL;

/** Set once the worker reports every precached file stored. */
let _offlineReady = false;

/** Has the service worker finished saving everything for offline use? */
export function isOfflineReady() {
  return _offlineReady;
}

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

  // Offline-readiness progress from the service worker.
  //
  // Audit 2026-09-19, finding 22. This used to say "Ready offline" once the
  // phoneme MP3s were cached, while every lazy module still needed the
  // network — so a child who went offline and opened an activity they had
  // never visited got a blank screen from an app that had told them it was
  // ready. The worker now precaches every built chunk too, and this reports
  // that whole job.
  navigator.serviceWorker.addEventListener('message', (event) => {
    const { type, done, total, failed } = event.data || {};
    const indicator = document.getElementById('offline-indicator');
    if (!indicator) return;

    if (type === 'offline-progress') {
      const pct = total ? Math.round((done / total) * 100) : 100;
      indicator.hidden = false;
      indicator.innerHTML = `<span class="offline-indicator__icon">⬇</span> Saving for offline… ${pct}%`;
      indicator.className = 'offline-indicator offline-indicator--loading';
    } else if (type === 'offline-ready') {
      indicator.hidden = false;
      if (failed === 0) {
        _offlineReady = true;
        indicator.innerHTML =
          '<span class="offline-indicator__icon">✓</span> Every activity works offline';
        indicator.className = 'offline-indicator offline-indicator--ready';
      } else {
        // Name the shortfall rather than rounding it up to "ready".
        indicator.innerHTML = `<span class="offline-indicator__icon">⚠</span> ${total - failed} of ${total} files saved — some activities need the internet`;
        indicator.className = 'offline-indicator offline-indicator--partial';
      }
      setTimeout(() => {
        indicator.hidden = true;
      }, 4000);
    }
  });

  // Show offline/online status
  window.addEventListener('online', () => _updateNetworkStatus(true));
  window.addEventListener('offline', () => _updateNetworkStatus(false));
}

/** Show an "Add to Home Screen" banner so parents can install the app */
export function initInstallPrompt() {
  // Already running as an installed PWA — nothing to do
  if (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  )
    return;

  // Respect a recent dismiss (hidden for 14 days)
  const dismissed = localStorage.getItem('pwa-install-dismissed');
  if (dismissed && Date.now() - Number(dismissed) < 14 * 24 * 60 * 60 * 1000) return;

  const banner = document.getElementById('install-banner');
  const btn = document.getElementById('install-btn');
  const closeBtn = document.getElementById('install-dismiss');
  const subText = document.getElementById('install-banner-sub');
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
    setTimeout(() => {
      banner.hidden = false;
    }, 2500);
    return;
  }

  // Chrome / Edge / Samsung Internet: use the deferred install prompt
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    setTimeout(() => {
      banner.hidden = false;
    }, 2000);
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
    // Say which of the two offline states this is. "Offline — audio cached"
    // was true of the audio and silent about everything else.
    indicator.innerHTML = _offlineReady
      ? '<span class="offline-indicator__icon">⊘</span> Offline — everything still works'
      : '<span class="offline-indicator__icon">⊘</span> Offline — activities you have not opened yet may not load';
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
