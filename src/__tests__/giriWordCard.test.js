/**
 * Giri word card.
 *
 * Puts the mascot inside the lesson instead of only in celebrations. The
 * subject of the scene is the word's own emoji, which is why this covers
 * all 1,080 words with no per-word art.
 *
 * The accessibility contract is the point of most of these tests: a screen
 * reader should hear the word's picture once, and never a description of
 * the mascot decorating it.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { renderGiriWordCard, setGiriPose, CARD_POSES } from '../components/giriWordCard.js';

const CAT = { id: 'cat', word: 'cat', emoji: '🐱', graphemes: ['c', 'a', 't'] };

let host;
beforeEach(() => {
  document.body.innerHTML = '<div id="host"></div>';
  host = document.getElementById('host');
});

describe('rendering', () => {
  it('shows the word picture and a Giri pose', () => {
    renderGiriWordCard(CAT, host);
    expect(host.querySelector('.giri-word-card__picture').textContent).toBe('🐱');
    expect(host.querySelector('.giri-word-card__giri')).toBeTruthy();
  });

  it('defaults to the presenting pose', () => {
    renderGiriWordCard(CAT, host);
    expect(host.dataset.pose).toBe('present');
    expect(host.querySelector('.giri-word-card__giri').src).toContain('giri-hold-card');
  });

  it('honours an explicit pose', () => {
    renderGiriWordCard(CAT, host, { pose: 'celebrate' });
    expect(host.dataset.pose).toBe('celebrate');
    expect(host.querySelector('.giri-word-card__giri').src).toContain('giri-celebrate');
  });

  it('falls back to the default pose for an unknown one', () => {
    renderGiriWordCard(CAT, host, { pose: 'nonsense' });
    expect(host.querySelector('.giri-word-card__giri').src).toContain('giri-hold-card');
  });

  it('exposes a pose for every teaching moment a mode needs', () => {
    for (const key of ['present', 'think', 'point', 'encourage', 'celebrate']) {
      expect(CARD_POSES[key], key).toBeTruthy();
    }
  });

  it('renders an optional caption', () => {
    renderGiriWordCard(CAT, host, { caption: 'Tap the sounds you hear' });
    expect(host.querySelector('.giri-word-card__caption').textContent).toBe(
      'Tap the sounds you hear',
    );
  });

  it('omits the caption element entirely when not given one', () => {
    renderGiriWordCard(CAT, host);
    expect(host.querySelector('.giri-word-card__caption')).toBeNull();
  });

  it('clears the previous card when rendering a new word', () => {
    renderGiriWordCard(CAT, host);
    renderGiriWordCard({ ...CAT, word: 'dog', emoji: '🐶' }, host);
    expect(host.querySelectorAll('.giri-word-card__picture').length).toBe(1);
    expect(host.querySelector('.giri-word-card__picture').textContent).toBe('🐶');
  });

  it('is a no-op for a missing host or word', () => {
    expect(() => renderGiriWordCard(CAT, null)).not.toThrow();
    renderGiriWordCard(null, host);
    expect(host.querySelector('.giri-word-card__picture')).toBeNull();
  });

  it('survives a word with no emoji rather than rendering "undefined"', () => {
    renderGiriWordCard({ word: 'zzz', graphemes: ['z'] }, host);
    expect(host.querySelector('.giri-word-card__picture').textContent).toBe('');
  });
});

describe('listening-first modes', () => {
  it('withholds the picture when showEmoji is false', () => {
    renderGiriWordCard(CAT, host, { showEmoji: false });
    const pic = host.querySelector('.giri-word-card__picture');
    // The answer must not be visible — these modes work from sound alone.
    expect(pic.textContent).not.toBe('🐱');
    expect(pic.classList.contains('giri-word-card__picture--hidden')).toBe(true);
  });

  it('does not leak the word to assistive tech when hidden', () => {
    renderGiriWordCard(CAT, host, { showEmoji: false });
    expect(host.textContent).not.toContain('cat');
    expect(host.querySelector('[aria-label*="cat"]')).toBeNull();
  });
});

describe('accessibility', () => {
  it('labels the picture as the word, matching renderWordImage', () => {
    renderGiriWordCard(CAT, host);
    const pic = host.querySelector('.giri-word-card__picture');
    expect(pic.getAttribute('role')).toBe('img');
    expect(pic.getAttribute('aria-label')).toBe('Picture of cat');
  });

  it('marks Giri decorative so the mascot is not announced', () => {
    renderGiriWordCard(CAT, host);
    const giri = host.querySelector('.giri-word-card__giri');
    expect(giri.getAttribute('aria-hidden')).toBe('true');
    expect(giri.getAttribute('alt')).toBe('');
  });

  it('announces the picture exactly once', () => {
    renderGiriWordCard(CAT, host);
    expect(host.querySelectorAll('[role="img"]').length).toBe(1);
  });
});

describe('pose swapping', () => {
  it('changes pose without rebuilding the picture', () => {
    renderGiriWordCard(CAT, host);
    const pic = host.querySelector('.giri-word-card__picture');

    setGiriPose(host, 'celebrate');

    // Same picture node — a rebuild would flash the emoji mid-interaction.
    expect(host.querySelector('.giri-word-card__picture')).toBe(pic);
    expect(host.dataset.pose).toBe('celebrate');
    expect(host.querySelector('.giri-word-card__giri').src).toContain('giri-celebrate');
  });

  it('ignores an unknown pose rather than clearing the mascot', () => {
    renderGiriWordCard(CAT, host);
    const before = host.querySelector('.giri-word-card__giri').src;
    setGiriPose(host, 'nope');
    expect(host.querySelector('.giri-word-card__giri').src).toBe(before);
  });

  it('is a no-op on a host with no card', () => {
    expect(() => setGiriPose(host, 'celebrate')).not.toThrow();
    expect(() => setGiriPose(null, 'celebrate')).not.toThrow();
  });
});

describe('robustness', () => {
  it('removes Giri if the pose image fails to load', () => {
    renderGiriWordCard(CAT, host);
    const giri = host.querySelector('.giri-word-card__giri');
    giri.dispatchEvent(new Event('error'));

    // A broken-image icon must never appear in a child's lesson; the word
    // picture stands alone instead.
    expect(host.querySelector('.giri-word-card__giri')).toBeNull();
    expect(host.querySelector('.giri-word-card__picture').textContent).toBe('🐱');
  });
});
