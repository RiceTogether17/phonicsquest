/**
 * PhonicsQuest – Confetti Celebrations
 * Thin wrapper around canvas-confetti for different celebration moments.
 */

import confetti from 'canvas-confetti';

const canvas = () => document.getElementById('confetti-canvas');

/** Big celebration for correct answers */
export function celebrateCorrect() {
  const c = canvas();
  if (!c) return;
  const myConfetti = confetti.create(c, { resize: true, useWorker: true });

  myConfetti({
    particleCount: 60,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#6c63ff', '#ff6b8a', '#22c55e', '#f59e0b', '#3b82f6'],
    shapes: ['circle', 'square'],
    gravity: 1.2,
    scalar: 0.9,
  });
}

/** Huge celebration for level-ups */
export function celebrateLevelUp() {
  const c = canvas();
  if (!c) return;
  const myConfetti = confetti.create(c, { resize: true, useWorker: true });

  const duration = 2000;
  const end = Date.now() + duration;

  const frame = () => {
    myConfetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#6c63ff', '#ff6b8a', '#f59e0b'],
    });
    myConfetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#22c55e', '#3b82f6', '#a855f7'],
    });

    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}

/** Stars/sparkles for streak milestones */
export function celebrateStreak() {
  const c = canvas();
  if (!c) return;
  const myConfetti = confetti.create(c, { resize: true, useWorker: true });

  myConfetti({
    particleCount: 30,
    spread: 360,
    ticks: 60,
    origin: { x: 0.5, y: 0.5 },
    colors: ['#f59e0b', '#fbbf24', '#fde68a'],
    shapes: ['star'],
    gravity: 0.6,
    scalar: 1.2,
  });
}

/** Daily goal celebration */
export function celebrateDailyGoal() {
  const c = canvas();
  if (!c) return;
  const myConfetti = confetti.create(c, { resize: true, useWorker: true });

  // Fireworks from bottom
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      myConfetti({
        particleCount: 40,
        startVelocity: 30,
        spread: 360,
        origin: { x: 0.2 + Math.random() * 0.6, y: 0.9 },
        colors: ['#6c63ff', '#ff6b8a', '#22c55e', '#f59e0b'],
        gravity: 0.8,
      });
    }, i * 400);
  }
}
