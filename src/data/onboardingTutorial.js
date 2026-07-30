/**
 * PhonicsQuest – First-run onboarding tutorial content.
 *
 * Four screens per reading band, shown once per install after the first
 * profile is created. They orient the *adult*: what the pathway is, the
 * order to follow each day, where the "Best Next Step" card lives, and
 * which activities are bonuses rather than the lesson.
 *
 * Authored markup, not user input — rendered as trusted HTML by
 * onboardingController.js. Keep it that way: never interpolate learner or
 * model text into these strings.
 *
 * All four bands now carry the same 4-screen deck:
 *   journey · daily order · Best Next Step · bonus activities
 *
 * They did not always. emerging-decoder and developing-reader shipped with
 * only the journey-overview screen, so a parent whose child placed into
 * either middle band — the most common mid-journey states — never saw the
 * daily order, the Best Next Step explanation, or which activities are
 * bonuses rather than the lesson. The missing screens were written to
 * mirror the pre-reader and reader decks, using each band's own activities
 * (Blend It! / Sight Words / Stories for emerging, Blend It! / Stories /
 * Sentence Forge for developing) rather than generic copy.
 *
 * If you add a band, give it the full four screens — a test asserts every
 * band has a deck, and `onboardingController.test.js` pins the count.
 *
 * Tab locations in the bonus screens are checked against index.html: only
 * Daily Challenge, Random Activity and My Trophy Room actually live in the
 * Extra tab. The original pre-reader and reader decks told parents Sight
 * Words, Giri Stories and Letter Sounds were there too — they are in the
 * Learn tab, so every deck now names the right tab for each activity.
 *
 * @typedef {{ icon: string, title: string, body: string }} TutorialScreen
 */

/** @type {Record<string, TutorialScreen[]>} */
export const ONBOARDING_TUTORIAL = {
    'pre-reader': [
      {
        icon: '🌱',
        title: "Your child's Pre-reader Journey",
        body: `<p class="ob-intro">PhonicsQuest guides your child through three daily activities:</p>
               <ul class="ob-list">
                 <li><strong>👂 First Sound</strong> — listening-first sound awareness</li>
                 <li><strong>👂 Sound skills</strong> — first, last &amp; middle sounds</li>
                 <li><strong>🔤 Letter Sounds</strong> — adult-guided sound-to-print bridge</li>
               </ul>`,
      },
      {
        icon: '📋',
        title: 'Follow this order each day',
        body: `<div class="ob-steps">
                 <div class="ob-step">
                   <span class="ob-step-num">1</span>
                   <div><strong>Start with First Sound</strong><br><small>No-print listening warm-up</small></div>
                 </div>
                 <div class="ob-step">
                   <span class="ob-step-num">2</span>
                   <div><strong>Practise Hear &amp; Choose</strong><br><small>Sound-to-picture matching</small></div>
                 </div>
                 <div class="ob-step">
                   <span class="ob-step-num">3</span>
                   <div><strong>Add Letter Sounds</strong><br><small>Teacher-supported print bridge</small></div>
                 </div>
               </div>`,
      },
      {
        icon: '⭐',
        title: 'Look for this card every day',
        body: `<div class="ob-highlight-card">
                 <div class="ob-highlight-eyebrow">TODAY'S START POINT</div>
                 <p class="ob-highlight-title">Best Next Step</p>
                 <p class="ob-highlight-body">This card is always first on the home screen. It tells you <strong>exactly which activity</strong> to start with today, based on your child's progress.</p>
               </div>
               <p class="ob-highlight-hint">👆 Just tap the big button — the app guides you from there.</p>`,
      },
      {
        icon: '🎮',
        title: 'Bonus activities — use after the main lesson',
        body: `<div class="ob-bonus-list">
                 <div class="ob-bonus-item">⚡ <strong>Daily Challenge</strong> — 5-word bonus round, earns extra XP</div>
                 <div class="ob-bonus-item">🎡 <strong>Random Activity</strong> — spin the wheel for a surprise</div>
                 <div class="ob-bonus-item">🏆 <strong>My Trophy Room</strong> — your child’s own bests, never a ranking</div>
               </div>
               <p class="ob-bonus-note">Find these in the <strong>🎁 Extra</strong> tab. Sight Words and Letter Sounds are in the <strong>📚 Learn</strong> tab.</p>`,
      },
    ],
    'emerging-decoder': [
      {
        icon: '🧩',
        title: "Your child's Emerging Decoder Journey",
        body: `<p class="ob-intro">This stage strengthens early reading fluency:</p>
               <ul class="ob-list">
                 <li><strong>🎯 Blend It!</strong> — decode step by step</li>
                 <li><strong>🃏 Sight Words</strong> — build automatic word reading</li>
                 <li><strong>📚 Giri Stories</strong> — short connected reading</li>
               </ul>`,
      },
      {
        icon: '📋',
        title: 'Follow this order each day',
        body: `<div class="ob-steps">
                 <div class="ob-step">
                   <span class="ob-step-num">1</span>
                   <div><strong>Start with Blend It!</strong><br><small>Sound out words step by step</small></div>
                 </div>
                 <div class="ob-step">
                   <span class="ob-step-num">2</span>
                   <div><strong>Practise Sight Words</strong><br><small>Words that can't be sounded out</small></div>
                 </div>
                 <div class="ob-step">
                   <span class="ob-step-num">3</span>
                   <div><strong>Finish with a Giri Story</strong><br><small>Put those words together in real reading</small></div>
                 </div>
               </div>`,
      },
      {
        icon: '⭐',
        title: 'Look for this card every day',
        body: `<div class="ob-highlight-card">
                 <div class="ob-highlight-eyebrow">TODAY'S START POINT</div>
                 <p class="ob-highlight-title">Best Next Step</p>
                 <p class="ob-highlight-body">This card is always first on the home screen. It tells you <strong>exactly which sound or word group</strong> to practise today, based on what your child has found tricky.</p>
               </div>
               <p class="ob-highlight-hint">👆 Just tap the big button — the app guides you from there.</p>`,
      },
      {
        icon: '🎮',
        title: 'Bonus activities — use after the main lesson',
        body: `<div class="ob-bonus-list">
                 <div class="ob-bonus-item">⚡ <strong>Daily Challenge</strong> — 5-word bonus round, earns extra XP</div>
                 <div class="ob-bonus-item">🎡 <strong>Random Activity</strong> — spin the wheel for a surprise</div>
                 <div class="ob-bonus-item">🏆 <strong>My Trophy Room</strong> — your child’s own bests, never a ranking</div>
               </div>
               <p class="ob-bonus-note">Find these in the <strong>🎁 Extra</strong> tab. Sight Words and Giri Stories are in the <strong>📚 Learn</strong> tab.</p>`,
      },
    ],
    'developing-reader': [
      {
        icon: '📘',
        title: "Your child's Developing Reader Bridge",
        body: `<p class="ob-intro">Keep decoding active while adding sentence work:</p>
               <ul class="ob-list">
                 <li><strong>🎯 Blend It!</strong> — quick phonics review</li>
                 <li><strong>📚 Giri Stories</strong> — sentence &amp; paragraph reading</li>
                 <li><strong>🔨 Sentence Forge</strong> — begin sentence building</li>
               </ul>`,
      },
      {
        icon: '📋',
        title: 'Follow this order each day',
        body: `<div class="ob-steps">
                 <div class="ob-step">
                   <span class="ob-step-num">1</span>
                   <div><strong>Warm up with Blend It!</strong><br><small>A quick phonics review keeps decoding sharp</small></div>
                 </div>
                 <div class="ob-step">
                   <span class="ob-step-num">2</span>
                   <div><strong>Read a Giri Story</strong><br><small>Sentences and paragraphs, not single words</small></div>
                 </div>
                 <div class="ob-step">
                   <span class="ob-step-num">3</span>
                   <div><strong>Try Sentence Forge</strong><br><small>Start building sentences of their own</small></div>
                 </div>
               </div>`,
      },
      {
        icon: '⭐',
        title: 'Look for this card every day',
        body: `<div class="ob-highlight-card">
                 <div class="ob-highlight-eyebrow">TODAY'S START POINT</div>
                 <p class="ob-highlight-title">Best Next Step</p>
                 <p class="ob-highlight-body">This card is always first on the home screen. It picks up wherever your child left off — a phonics gap to close, or the next story on their shelf.</p>
               </div>
               <p class="ob-highlight-hint">👆 Just tap the big button — the app guides you from there.</p>`,
      },
      {
        icon: '🎮',
        title: 'Bonus activities — use after the main lesson',
        body: `<div class="ob-bonus-list">
                 <div class="ob-bonus-item">⚡ <strong>Daily Challenge</strong> — 5-word bonus round, earns extra XP</div>
                 <div class="ob-bonus-item">🎡 <strong>Random Activity</strong> — spin the wheel for a surprise</div>
                 <div class="ob-bonus-item">🏆 <strong>My Trophy Room</strong> — your child’s own bests, never a ranking</div>
               </div>
               <p class="ob-bonus-note">Find these in the <strong>🎁 Extra</strong> tab. Giri Stories and Fluency Sprint are in the <strong>📚 Learn</strong> tab.</p>`,
      },
    ],
    reader: [
      {
        icon: '🏫',
        title: "Your child's Reader Journey",
        body: `<p class="ob-intro">PhonicsQuest guides your child through three daily quests:</p>
               <ul class="ob-list">
                 <li><strong>🔨 Sentence Forge</strong> — unscramble &amp; build sentences</li>
                 <li><strong>🏰 Cloze Castle</strong> — grammar cloze passages P1–P6</li>
                 <li><strong>🔑 Word Vault</strong> — vocabulary in context</li>
               </ul>`,
      },
      {
        icon: '📋',
        title: 'Follow this order each day',
        body: `<div class="ob-steps">
                 <div class="ob-step">
                   <span class="ob-step-num">1</span>
                   <div><strong>Start with Sentence Forge</strong><br><small>Build sentence structure skills</small></div>
                 </div>
                 <div class="ob-step">
                   <span class="ob-step-num">2</span>
                   <div><strong>Do Cloze Castle</strong><br><small>Grammar cloze with clue detection</small></div>
                 </div>
                 <div class="ob-step">
                   <span class="ob-step-num">3</span>
                   <div><strong>Finish with Word Vault</strong><br><small>Vocabulary in context practice</small></div>
                 </div>
               </div>`,
      },
      {
        icon: '⭐',
        title: 'Look for this card every day',
        body: `<div class="ob-highlight-card">
                 <div class="ob-highlight-eyebrow">TODAY'S START POINT</div>
                 <p class="ob-highlight-title">Best Next Step</p>
                 <p class="ob-highlight-body">This card is always first on the home screen. It targets your child's <strong>weakest skill</strong> so every session has a clear, focused starting point.</p>
               </div>
               <p class="ob-highlight-hint">👆 Just tap the big button — the app guides you from there.</p>`,
      },
      {
        icon: '🎮',
        title: 'Bonus activities — use after the main lesson',
        body: `<div class="ob-bonus-list">
                 <div class="ob-bonus-item">⚡ <strong>Daily Challenge</strong> — 5-word bonus round, earns extra XP</div>
                 <div class="ob-bonus-item">🎡 <strong>Random Activity</strong> — spin the wheel for a surprise</div>
                 <div class="ob-bonus-item">🏆 <strong>My Trophy Room</strong> — your child’s own bests, never a ranking</div>
               </div>
               <p class="ob-bonus-note">Find these in the <strong>🎁 Extra</strong> tab. Giri Stories and Sight Words are in the <strong>📚 Learn</strong> tab.</p>`,
      },
    ],
};

/** Fallback band when a profile has no placement yet. */
export const DEFAULT_TUTORIAL_BAND = 'pre-reader';

/**
 * Screens for a reading band, falling back to the pre-reader set.
 * @param {string} band
 * @returns {TutorialScreen[]}
 */
export function getTutorialScreens(band) {
  return ONBOARDING_TUTORIAL[band] || ONBOARDING_TUTORIAL[DEFAULT_TUTORIAL_BAND];
}
