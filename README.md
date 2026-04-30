# PhonicsQuest 🎯

**English learning adventure for K1–P6 — Early Reading Quest, Primary English Quest, and Exam Practice Hub. Free, open-source, runs in any browser.**

PhonicsQuest started as a phonics blender for early readers and now spans the full primary-school English journey, all the way to PSLE-style paper practice. Two clearly-separated learning pathways live in the same app:

- **🌱 Early Reading Quest** — phonics, blending, sight words, letter sounds, decodable Giri stories. K1–K2 / early P1.
- **🏫 Primary English Quest** — Grammar MCQ, Vocabulary MCQ, Cloze Castle (Grammar Cloze), Word Vault (Vocabulary Cloze), Comprehension Cloze, Open-ended Comprehension, Visual Text Comprehension, Sentence Forge, Synthesis & Transformation, Editing Quest, Writing Quest and Situational Writing. P1–P6.
- **📋 Exam Practice Hub** — full-paper practice with **Practice Mode**, **Test Mode** and **Review Mistakes Mode**, section timing, marks, weak-skill tags and follow-up module recommendations.
- **👨‍👩‍👧 Parent Dashboard** — a parent-friendly Report Card (Strengths · Needs Practice · Recent Mistakes · 10-min recommendation · Teacher's note), a one-click "Copy Parent Update" WhatsApp message, plus full CSV/JSON exports for advanced users.

[Live demo →](https://jastonchamp.github.io/phonicsquest/)

---

## ✨ Features by pathway

### 🌱 Early Reading Quest (K1–K2 / early P1)

| Mode | What it does |
|------|-------------|
| **Blend It!** | Guided step-by-step phoneme reveal — perfect for beginners |
| **Listen & Blend** | All tiles visible; teacher-friendly with speed control |
| **Hear & Choose** | Listen to a word, pick it from 4 choices |
| **Segment It** | Tap individual letters to group them into phoneme chunks |
| **Missing Sound** | Identify the hidden phoneme |
| **First / Last / Middle Sound** | Phonemic awareness drills |
| **Sight Words** | 35 high-frequency word matching games |
| **Letter Sounds** | Tap any grapheme to hear it (consonants, vowels, digraphs, blends, diphthongs) |
| **Giri Stories** | 16 decodable phonics stories in Read-Aloud + Decode mode |

### 🏫 Primary English Quest (P1–P6)

Grouped by school-paper component so parents and teachers can match each module to a real exam section:

| Group | Module | Helps with (paper component) |
|-------|--------|------------------------------|
| Language Use | 🧠 Grammar MCQ | Paper 2 Booklet A · Grammar MCQ |
| Vocabulary & Cloze | 📖 Vocabulary MCQ | Paper 2 Booklet A · Vocabulary MCQ |
| Vocabulary & Cloze | 🏰 Cloze Castle | Paper 2 · Grammar Cloze |
| Vocabulary & Cloze | 🔑 Word Vault | Paper 2 · Vocabulary Cloze |
| Vocabulary & Cloze | 📰 Comprehension Cloze | Paper 2 · Comprehension Cloze (P3–P6) |
| Sentence Skills | 🔨 Sentence Forge | Word order & sentence building |
| Sentence Skills | 🔁 Synthesis & Transformation | Paper 2 Booklet B · Synthesis (P4–P6) |
| Writing & Editing | ✏️ Editing Quest | Paper 2 · Editing for Spelling & Grammar |
| Writing & Editing | 📝 Writing Quest | Paper 1 · Continuous Writing |
| Writing & Editing | ✉️ Situational Writing | Paper 1 · Situational Writing (P5–P6) |
| Comprehension | 🖼️ Visual Text Comprehension | Paper 2 · Visual Text (P3–P6) |
| Comprehension | 📚 Open-ended Comprehension | Paper 2 · Comprehension Open-ended (P3–P6) |
| Exam Practice Hub | 📋 Full Paper Practice | Practice / Test / Review Mistakes — see below |

P1–P6 profiles see a Primary English-first home screen with:

- A **Start Here Today** strip surfacing a 10-minute task picked from the child's weakest skill
- The Primary English Quest grid grouped by paper component (Language Use, Vocabulary & Cloze, Sentence Skills, Writing & Editing, Comprehension, Exam Practice Hub)
- The Early Reading Quest is collapsed below — phonics is still available as a warm-up

### 📋 Exam Practice Hub

The Exam Practice Hub turns Paper Mode from a playlist into an exam-revision experience:

- **Practice Mode** — hints + per-section feedback, no timer
- **Test Mode** — timed, no hints, mirrors the real paper
- **Review Mistakes Mode** — replay only the questions you got wrong last time
- Each section shows section timing, marks, question count and completion status (○ / ✓)
- After each section: score, weak-skill tags, wrong answers and a recommended follow-up module
- After the full paper: a summary screen with totals, a green/amber/red flag per section, and one-click "Open Grammar MCQ / Cloze Castle / Word Vault" follow-up buttons targeting the weakest sections

### 👨‍👩‍👧 Parent Dashboard

The dashboard now opens with a **Parent Report Card** designed for non-technical parents:

| Cell | What it shows |
|------|---------------|
| ✅ Strengths | Up to three strongest skills with mastery % |
| 🎯 Needs Practice | Up to three weak skills with current % |
| 📝 Recent Mistakes | Last 5 wrong answers with mode and time |
| ⏱️ Recommended 10-min practice | One specific module the child should open |
| 💬 Teacher's note | A short, encouraging written summary |

A **📲 Copy Parent Update** button generates a WhatsApp-ready message that captures the same information in plain language. CSV and JSON exports are still available for power users but are no longer the headline parent feature.

### Adaptive Learning

- Per-word accuracy tracking in localStorage (per-profile)
- Weighted word selection: low-accuracy words appear 5× more often
- Per-skill mastery scores (0–100%) for grammar and vocabulary categories
- Cross-quest remediation router: weak skills in Grammar MCQ pipe through to Cloze Castle → Sentence Forge → Editing Quest

### Audio

- Phoneme MP3 files cached via Web Audio API
- TTS (Web Speech API) fallback — works offline
- Speech recognition for self-scoring
- Configurable voice speed and accent (en-SG, en-GB, en-AU, en-IN, en-US)

### Accessibility & themes

- 5 visual themes plus dyslexia-friendly Lexend font
- WCAG AA contrast across all themes
- ARIA live regions, skip link, keyboard navigation, focus management
- Reduce-motion and font-size scaling

### Profiles

- Multiple child profiles, each with their own progress
- Each profile carries: `name`, `avatar`, `color`, `schoolLevel`, `primaryGrade`, `readingBand`, `classId` and full progress (XP, mastery, weak-skill maps, paper sessions)
- Export / Import preserves every one of those fields so a parent can move a profile across devices without losing the child's grade or weak-skill history

---

## 🚀 Getting Started

### Option A — Just open it

```
https://jastonchamp.github.io/phonicsquest/
```

No install needed. Works on desktop and mobile. Add to home screen for offline play (PWA).

### Option B — Run locally

```bash
git clone https://github.com/JastonChamp/phonicsquest.git
cd phonicsquest
npm install
npm run dev
```

Open `http://localhost:3000/phonicsquest/` (Vite dev server).

### Option C — Build for production

```bash
npm run build       # bundles into ./docs (so GitHub Pages serves it directly)
npm run preview     # preview the production build locally
```

GitHub Actions deploys `docs/` to GitHub Pages on push to `main`.

---

## 🧪 Running tests

```bash
npm test            # one-shot vitest run
npm run test:watch  # watch mode
npm run typecheck   # tsc --noEmit
npm run check:syntax # node --check across src/
```

The repo ships with 350+ tests covering data integrity, learning logic, mode flows, the Exam Practice Hub framework, parent reporting and several end-to-end user journeys (P4 Grammar MCQ, P5 Word Vault Exam Mode, P6 Paper Mode, parent dashboard, profile import/export, primary-first home).

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
phonicsquest/
├── index.html               # App shell — semantic HTML, ARIA, modals, two pathways
├── vite.config.js           # Vite build config (base: /phonicsquest/, outDir: docs)
├── public/
│   ├── manifest.json        # PWA manifest
│   ├── audio/phonemes/      # Phoneme MP3 files
│   ├── audio/sfx/           # Sound effect MP3s
│   └── images/mascot/       # Giri PNG states
└── src/
    ├── main.js              # Bootstrap (DOMContentLoaded → app.init())
    ├── app.js               # Orchestrator — screens, events, navigation
    ├── styles/main.css      # Design system (themes, components)
    ├── modules/
    │   ├── store.js                # Reactive state + per-profile localStorage
    │   ├── profiles.js             # Profile CRUD + import/export (preserves grade & band)
    │   ├── parentReportCard.js     # Parent-facing report card builder + WhatsApp copy
    │   ├── remediationRouter.js    # Cross-quest weak-skill chains
    │   └── …
    ├── components/
    │   ├── dashboard.js     # Parent dashboard — Report Card + analytics
    │   └── …
    ├── modes/
    │   ├── paperMode.js              # Exam Practice Hub (Practice/Test/Review)
    │   ├── primaryPlaceholders.js    # Visual Text · Comprehension Cloze · Open-ended · Synthesis · Situational
    │   ├── grammarMcq.js / vocabMcq.js
    │   ├── clozeCastle.js / wordVault.js
    │   ├── sentenceForge.js / editingQuest.js / writingQuest.js
    │   └── (early reading) blend.js, segment.js, hearChoose.js, …
    └── data/
        ├── grammarMcq.js / vocabMcq.js
        ├── paperPlaylists.js
        ├── stories.js / hfw.js / words.js
        └── …
```

### Supported levels

| Pathway | Levels |
|---------|--------|
| Early Reading Quest | K1–K2, early P1 (decoding, blending, sight words) |
| Primary English Quest | P1–P6 (grouped by school-paper component) |
| Exam Practice Hub | P1–P6 (PSLE-aligned playlists for P3–P6) |

### State management

A single reactive store (`store.js`) backed by one per-profile localStorage key. Profile metadata (name, avatar, primaryGrade, readingBand, classId) lives in `phonicsquest_profiles`; per-profile progress in `phonicsquest_profile_<id>`. No framework dependency.

### Tech stack

| Library | Version | Purpose |
|---------|---------|---------|
| [Vite](https://vitejs.dev) | 5.x | Build tool + dev server |
| [GSAP](https://gsap.com) | 3.x | Mascot & wheel animations |
| [canvas-confetti](https://github.com/catdad/canvas-confetti) | 1.x | Celebration effects |
| [Chart.js](https://chartjs.org) | 4.x | Dashboard mastery charts |

Vanilla JS + ES modules. No UI framework.

---

## 🤝 Contributing

Pull requests welcome. Please:

1. Fork and create a feature branch (`git checkout -b feature/my-thing`)
2. Run `npm run dev` and verify your changes
3. Run `npm test` and `npm run build` before opening the PR
4. Open a PR describing what changed and why

---

## 📄 License

[Apache 2.0](LICENSE) — open source, free to use, modify, and distribute. Audio files are included for educational demonstration purposes.

---

*Built for early readers and primary English learners everywhere.*
