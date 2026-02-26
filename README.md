# PhonicsQuest 🎯

**The phonics learning adventure for early readers — free, open-source, and runs in your browser.**

PhonicsQuest teaches children (ages 4–8) to blend, segment, and identify letter sounds through 8 interactive game modes, 16 decodable stories, a spinning category wheel, and Giri the mascot who reacts to every answer. No app store. No login. No ads. Just learning.

[Live demo →](https://jastonchamp.github.io/blending/)

---

## ✨ Features

### 8 Game Modes

| Mode | What it does |
|------|-------------|
| **Blend It!** | Guided step-by-step phoneme reveal — perfect for beginners |
| **Listen & Blend** | All tiles visible; teacher-friendly with speed control (slow / normal / fast) |
| **Hear & Choose** | Listen to a word, pick it from 4 choices |
| **Segment It** | Tap individual letters to group them into phoneme chunks |
| **Missing Sound** | Identify the hidden phoneme (shown as ?) |
| **First Sound** | Identify the initial phoneme from an image |
| **Last Sound** | Identify the final phoneme |
| **Middle Sound** | Find the medial vowel — especially useful for short-vowel practice |

### Bonus Content

- **16 decodable stories** — Giri the Steamy Dumpling characters; each story in Read Aloud + Decode mode
- **Letter Sounds reference** — tap any grapheme to hear it, organized by type (consonants, vowels, digraphs, blends, diphthongs…)
- **Spinning category wheel** — GSAP-animated canvas wheel picks word groups (Short A, Long E, digraphs, blends, etc.)

### Gamification

- XP system → 10 levels (0–3200 XP)
- Hearts (5 max, lose on wrong, refill after game over)
- Daily streak tracking with cross-midnight detection
- Configurable daily goal (5–30 words), bonus XP on completion
- **Achievement badges** — First Blend, Quick Fingers, 10-in-a-Row, Century Club, Week Warrior, and more
- Confetti + Giri celebrations on correct answers, level-ups, streaks, and daily goal

### Adaptive Learning

- Per-word accuracy tracking in localStorage
- Weighted word selection: low-accuracy words appear 5× more often
- Group mastery scores (0–100%) per phoneme category
- 6-stage curriculum progression with automatic unlocking
- Avoids repeating the last 5 words

### Audio

- Phoneme MP3 files cached via Web Audio API
- TTS (Web Speech API) fallback — works offline
- **Speech recognition** — tap the mic 🎙️, say the word, get a phonetic similarity score
- Configurable voice speed (0.5×–1.5×)
- Vowel-team and digraph audio aliases (ai → long_a, ea → long_e, ck → c, wh → w, etc.)

### Themes & Accessibility

- 5 visual themes: Default · Ocean · Forest · Sunset · High Contrast
- **Dyslexia-friendly mode** — OpenDyslexic font + increased letter spacing
- WCAG AA colour contrast across all themes
- ARIA live regions, skip link, keyboard navigation, focus management
- Color + diacritics (ă ā ĕ ē ĭ ī ŏ ō ŭ ū) — never color-only

### Parent Dashboard (PIN-gated)

- Chart.js mastery bar chart per phoneme group
- Words practiced / mastered / accuracy / best streak
- Learning path with unlock milestones
- Recent words table
- Export CSV

---

## 🚀 Getting Started

### Option A — Just open it

```
https://jastonchamp.github.io/blending/
```

No install needed. Works on desktop and mobile. Add to home screen for offline play (PWA).

### Option B — Run locally

```bash
git clone https://github.com/JastonChamp/blending.git
cd blending
npm install
npm run dev
```

Open `http://localhost:5173/blending/`

### Option C — Build for production

```bash
npm run build       # outputs to /dist
npm run preview     # preview the production build locally
```

GitHub Actions deploys `dist/` to GitHub Pages automatically on every push to `main`.

---

## ⌨️ Keyboard Shortcuts

| Key | Screen | Action |
|-----|--------|--------|
| `S` | Game | Replay word audio (Say It) |
| `Space` / `Enter` | Blend It! | Reveal next sound |
| `Escape` | Game | Back to menu |
| `N` | Result | Next word |

---

## 🏗️ Architecture

```
blending/
├── index.html               # App shell — semantic HTML, ARIA, modals
├── vite.config.js           # Vite build config (base: /blending/)
├── public/
│   ├── sw.js                # Service worker (cache-first audio & images)
│   ├── manifest.json        # PWA manifest
│   ├── audio/phonemes/      # Phoneme MP3 files (a.mp3, sh.mp3, long_a.mp3 …)
│   ├── audio/sfx/           # Sound effect MP3s
│   └── images/mascot/       # Giri PNG states (neutral, celebrate, thinking …)
└── src/
    ├── main.js              # Bootstrap (DOMContentLoaded → app.init())
    ├── app.js               # Orchestrator — screens, events, game loop
    ├── styles/main.css      # Design system (custom props, themes, components)
    ├── modules/
    │   ├── store.js         # Reactive state + localStorage persistence
    │   ├── gamification.js  # XP, levels, hearts, streaks, daily goal
    │   ├── badges.js        # Achievement system (earned badges + notifications)
    │   ├── progress.js      # Adaptive word selection + curriculum unlocking
    │   ├── audio.js         # Web Audio API + TTS + phoneme mapping
    │   ├── speech.js        # SpeechRecognition + Levenshtein scoring
    │   └── pwa.js           # Service worker registration
    ├── components/
    │   ├── mascot.js        # Giri — 11 emotional states + GSAP animations
    │   ├── wheel.js         # Canvas spinning wheel + letter-tile animations
    │   ├── phonemeDisplay.js# Color-coded phoneme tiles with diacritics
    │   ├── confettiHelper.js# canvas-confetti celebration wrappers
    │   └── dashboard.js     # Parent dashboard — Chart.js + analytics
    ├── modes/               # 8 game mode modules (blend, segment, hear …)
    └── data/
        ├── words.js         # ~500 word bank with phoneme metadata
        ├── curriculum.js    # 6-stage scope & sequence + XP constants
        ├── stories.js       # 16 decodable stories (4 levels × 4)
        └── hfw.js           # High-frequency / sight words
```

### State Management

Single reactive store (`store.js`) backed by one `localStorage` key (`phonicsquest_v2`). Subscribers get notified on change. No framework dependency.

### Tech Stack

| Library | Version | Purpose |
|---------|---------|---------|
| [Vite](https://vitejs.dev) | 5.x | Build tool + dev server |
| [GSAP](https://gsap.com) | 3.x | Wheel spin + mascot animations |
| [canvas-confetti](https://github.com/catdad/canvas-confetti) | 1.x | Celebration effects |
| [Chart.js](https://chartjs.org) | 4.x | Parent dashboard mastery charts |

Vanilla JS + ES modules. No UI framework. TypeScript migration is on the roadmap.

---

## 🗺️ Roadmap

- [ ] Multiple child profiles
- [ ] TypeScript migration
- [ ] Visual blending guide (animated mouth shapes)
- [ ] Sentence builder unlock after word mastery
- [ ] Adaptive difficulty per-mode (not just per-word)
- [ ] Custom word list import (CSV)
- [ ] Offline-first audio pre-bundling

---

## 🤝 Contributing

Pull requests welcome! Please:

1. Fork the repo and create a feature branch (`git checkout -b feature/my-thing`)
2. Run `npm run dev` and verify your changes
3. Run `npm run build` to confirm production build passes
4. Open a PR describing what changed and why

---

## 📄 License

[Apache 2.0](LICENSE) — open source, free to use, modify, and distribute.

Audio files are included for educational demonstration purposes.

---

*Built with ❤️ for early readers everywhere.*
