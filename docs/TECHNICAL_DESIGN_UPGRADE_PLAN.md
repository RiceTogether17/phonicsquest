# PhonicsQuest Upgrade Plan (Technical Design)

## 0) Context used
This plan is based on the benchmarking analysis provided in the task brief (competitive gaps, strengths, and the top-priority actions), plus the current PhonicsQuest architecture in this repo.

---

## 1) Architecture and Type Safety Modernization

### Goals
- Reduce complexity of `src/app.js` by splitting orchestration into focused controllers.
- Move from ad-hoc JS/JSDoc typing to incremental TypeScript with strict checks.
- Keep delivery low-risk by migrating module-by-module rather than big-bang rewrite.

### Target modular architecture

```text
src/
  app/
    AppShell.ts
    ScreenRouter.ts
    SessionController.ts
    ProfileController.ts
    DailyChallengeController.ts
    QuestUnlockController.ts
  domain/
    progress/
      ProgressEngine.ts
      AdaptiveSelector.ts
    speech/
      SpeechScorer.ts
    analytics/
      ParentReportService.ts
      TeacherReportService.ts
  ui/
    components/
      ChoiceGrid.ts
      RewardStrip.ts
      StoryProgressRail.ts
  data/
    curriculum/
      moe-phases.json
      psle-lo-map.json
    stories/
      stories.level1.json
      stories.level2.json
```

### Incremental TS migration strategy
1. Convert leaf utility modules first (`adaptiveSelection`, `questUnlocks`, `analyticsExport`).
2. Introduce typed contracts used across modules:
   - `Word`, `ProgressRecord`, `UserProfile`
   - `AttemptEvent`, `MasteryConfig`, `DashboardSnapshot`
3. Enable `checkJs: true` for selected directories once initial `.ts` modules stabilize.
4. Migrate `app.js` into `AppShell.ts` + controllers with thin dependency injection.

---

## 2) Adaptive Algorithms and Learning Logic

### Current gaps addressed
- Hard-coded thresholds/weights should be teacher-configurable.
- Distractor generation should use phoneme metadata (avoid grapheme-only ambiguity).
- Extend progression from words to morphology and sentence-level practice.

### Design updates
- **Mastery policy object** per profile/class:
  - attempts threshold
  - mastery threshold
  - review decay window
- **Distractor policy service**:
  - constrain distractors by phoneme class and difficulty bucket.
- **Morphology progression layer** after base mastery:
  - suffixes (`-s`, `-ed`, `-ing`), then prefixes (`un-`, `re-`).

### Pseudo-code (adaptive + distractors)

```ts
interface MasteryConfig {
  minAttempts: number;
  masteryAccuracy: number;
  weakAccuracy: number;
  mediumAccuracy: number;
  strongAccuracy: number;
  weights: {
    unseen: number;
    weak: number;
    medium: number;
    strong: number;
    default: number;
  };
}

function pickDistractors(target: Word, pool: Word[], level: number): Word[] {
  const targetPhoneme = getTargetPhoneme(target, level);
  return pool
    .filter(w => w.id !== target.id)
    .filter(w => phonemeDistance(getTargetPhoneme(w, level), targetPhoneme) >= 1)
    .filter(w => difficultyBand(w) === difficultyBand(target))
    .slice(0, 3);
}
```

---

## 3) Multi-profile, Parent/Teacher Dashboard, and New Modes

### Multi-profile evolution
- Keep current local profile model and add:
  - optional PIN gate for parent-only screens,
  - per-profile export/import token for backup/transfer,
  - migration audit marker (already present) with UI status.

### Dashboard expansion
- Parent dashboard: clearer outcomes + intervention suggestions.
- Teacher dashboard (basic):
  - class roster (local-first mock / CSV import),
  - per-learner mastery heatmap,
  - response-time distribution,
  - assignment completion.

### New modes to broaden pedagogy
1. **Word Builder** (morphology assembly).
2. **Fluency Sprint** (timed sentence reading + WCPM proxy).
3. **Comprehension Check** (MCQ/short answer for PSLE-style passages).

---

## 4) UX, Gamification, and First-session Delight

### UI/UX changes
- Home screen grouped by skill tabs:
  - Blend, Segment, Sound ID, Read & Comprehend.
- First-session guided path:
  - mascot-led 60-second tutorial with icon-first prompts.
- Reward loop:
  - streak state visuals (already started),
  - chapter unlock moments,
  - session-end reflection card (“easy/hard today?”).

### Sight Match alignment bug
- Keep `.sm-card-grid` centered with width cap and `margin: 0 auto`.
- Validate at small, medium, and desktop breakpoints; prevent left-tug under fullscreen.

---

## 5) Curriculum and Content Expansion (MOE/PSLE aligned)

### Content model
- Externalize to JSON by phase + LO mapping:
  - `moe-phases.json`
  - `psle-lo-map.json`
  - decodable sentence/passage packs with metadata tags.

### Content roadmap
- Expand Giri Stories to 100+ decodables, phase-locked.
- Add SG-context stories (hawker centre, MRT, festivals, neighbourhoods).
- Include passage question types:
  - literal comprehension,
  - inference,
  - vocabulary-in-context,
  - synthesis/transformation starter sets.

---

## 6) Analytics & Privacy Model

### Data collection plan
Store locally per attempt:
- `wordId`, `mode`, `correct`, `responseMs`, `speechScore`, `timestamp`, `hintsUsed`.

Aggregate derived metrics:
- per-word mastery trend,
- per-group mastery,
- median response time,
- streak stability,
- assignment completion rate.

### Privacy constraints
- Default local-only storage.
- Exports are explicit user actions (CSV/JSON).
- Parent/teacher view behind optional PIN.
- No background telemetry upload without explicit consent.

---

## 7) Roadmap (from benchmark priorities)

## Quick wins (2–4 weeks)
1. Story + Sight layouts hardening and responsive QA matrix.
2. Non-reader onboarding flow with mascot walkthrough.
3. Teacher summary CSV + parent JSON polish (done baseline, extend schema).
4. Configurable mastery thresholds in settings (parent/teacher mode).

**Competitor gaps closed:** better transparency vs ABCmouse; better intervention visibility than Starfall baseline.

## Medium builds (1–3 months)
1. 100+ phase-locked Giri Stories.
2. Morphology mode + sentence fluency mode.
3. Teacher assignment links + learner progress export bundles.
4. Refactor `app.js` into ScreenRouter/Profile/Daily controllers.

**Competitor gaps closed:** content depth vs Reading Eggs; teacher tooling vs SplashLearn/Reading Eggs.

## Strategic bets (3–12 months)
1. Speech scoring validation pipeline for SG English.
2. MOE STELLAR + PSLE LO mapping report cards.
3. Freemium packaging with intervention analytics premium tier.

**Competitor gaps closed:** localized moat vs KooBits breadth; habit + differentiation vs Duolingo ABC.

---

## 8) Critical TypeScript module outlines

```ts
// domain/analytics/TeacherReportService.ts
export interface TeacherSnapshot {
  learnerId: string;
  wordsMastered: number;
  overallAccuracy: number;
  medianResponseMs: number;
  groupMastery: Record<string, number>;
}

export class TeacherReportService {
  buildSnapshot(events: AttemptEvent[], profile: UserProfile): TeacherSnapshot {
    // aggregate + normalize + return
  }

  toCsv(snapshot: TeacherSnapshot): string {
    // stable export format for teachers
  }
}
```

```ts
// app/ScreenRouter.ts
export class ScreenRouter {
  constructor(private screens: Record<string, HTMLElement>) {}

  show(screenId: string) {
    // enforce single active screen, focus restoration, telemetry event
  }
}
```

```ts
// domain/progress/AdaptiveSelector.ts
export class AdaptiveSelector {
  constructor(private cfg: MasteryConfig) {}

  weight(stat?: ProgressRecord): number {
    // consistent configurable weighting
  }

  sample(words: Word[], stats: Record<string, ProgressRecord>, count: number): Word[] {
    // weighted without replacement
  }
}
```

---

## 9) Open questions / dependencies before full implementation

1. Should teacher/class features remain local-only MVP, or require cloud accounts in phase 1?
2. What is the canonical MOE/PSLE mapping source-of-truth format (JSON schema approval needed)?
3. Do we support bilingual UI now (EN + ZH) or keep i18n scaffolding only?
4. What minimum speech-scoring accuracy threshold is acceptable for launch in SG classrooms?
5. Are we prioritizing mobile web first or Chromebook classroom first for next milestone UX?
6. Is parent PIN mandatory for dashboard/exports, or optional in settings?
7. What commercial package is intended first (free educator, freemium parent, or tuition-centre pilot)?
