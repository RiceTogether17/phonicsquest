# PhonicsQuest — Migration Guide (v1 → v2)

## Overview

PhonicsQuest v2 is a complete rebuild with modular architecture.
If you're migrating from the monolithic v1 (single `script.js` + `style.css` + `index.html`),
here's what changed and how to preserve user progress.

## File Structure Changes

```
v1 (old)                          v2 (new)
─────────                         ─────────
index.html                →       index.html (new semantic shell)
script.js (170KB monolith) →       src/ (modular ES modules)
style.css (67KB)           →       src/styles/main.css (CSS custom properties)
*.mp3 (root)              →       public/audio/phonemes/*.mp3
                                   public/audio/sfx/*.mp3
                                   public/images/mascot/*.png
                                   public/icons/*.svg
```

## localStorage Key Changes

### v1 keys (old)
```
wordSpinnerXP
wordSpinnerLevel
wordSpinnerHearts
wordSpinnerStreak
wordSpinnerDailyGoal
wordSpinnerDailyDone
wordSpinnerWordHistory
wordSpinnerMastery
wordSpinnerTheme
wordSpinnerSettings
```

### v2 key (new)
All state is now stored under a single key:
```
phonicsquest_v2
```

The value is a JSON object with all state fields.

## Automatic Migration

To migrate v1 data to v2, run this in the browser console **before** clearing v1 data:

```js
(function migrateV1toV2() {
  const v2 = JSON.parse(localStorage.getItem('phonicsquest_v2') || '{}');

  // Map old keys to new fields
  const mappings = {
    'wordSpinnerXP':        'xp',
    'wordSpinnerLevel':     'level',
    'wordSpinnerHearts':    'hearts',
    'wordSpinnerStreak':    'streak',
    'wordSpinnerDailyGoal': 'dailyGoal',
    'wordSpinnerDailyDone': 'dailyDone',
    'wordSpinnerTheme':     'theme',
  };

  for (const [oldKey, newKey] of Object.entries(mappings)) {
    const val = localStorage.getItem(oldKey);
    if (val !== null) {
      try {
        v2[newKey] = JSON.parse(val);
      } catch {
        v2[newKey] = val;
      }
    }
  }

  // Migrate word history
  const history = localStorage.getItem('wordSpinnerWordHistory');
  if (history) {
    try {
      v2.wordHistory = JSON.parse(history);
    } catch {}
  }

  // Migrate mastery
  const mastery = localStorage.getItem('wordSpinnerMastery');
  if (mastery) {
    try {
      v2.groupMastery = JSON.parse(mastery);
    } catch {}
  }

  // Migrate settings
  const settings = localStorage.getItem('wordSpinnerSettings');
  if (settings) {
    try {
      const s = JSON.parse(settings);
      v2.sfxEnabled = s.sfxEnabled ?? true;
      v2.autoplay = s.autoplay ?? true;
      v2.voiceSpeed = s.voiceSpeed ?? 0.8;
      v2.difficulty = s.difficulty ?? 1;
    } catch {}
  }

  localStorage.setItem('phonicsquest_v2', JSON.stringify(v2));
  console.log('Migration complete!', v2);
})();
```

## New Features in v2

1. **Modular Vite build** — tree-shaken, code-split, fast HMR
2. **5 game modes** — Blend It, Hear & Choose, Segment It, Missing Sound, First Sound
3. **Giri mascot** — reactive character with 11 emotional states
4. **Spinning category wheel** — Canvas-based with GSAP animation
5. **Speech recognition** — Web Speech API for pronunciation scoring
6. **Adaptive learning** — weak words repeat 3-5× more often
7. **PWA** — full offline support with service worker
8. **Parent dashboard** — Chart.js mastery charts + CSV export
9. **5 themes** — Default, Ocean, Forest, Sunset, High Contrast
10. **ARIA accessibility** — live regions, focus management, screen-reader support

## Deployment

### GitHub Pages (recommended)
The included GitHub Actions workflow auto-deploys on push to `main`:
```
.github/workflows/deploy.yml
```

### Manual
```bash
npm install
npm run build
# Deploy contents of dist/ to your web server
```

## Development
```bash
npm install
npm run dev     # Start dev server at http://localhost:3000
npm run build   # Production build to dist/
npm run preview # Preview production build locally
```
