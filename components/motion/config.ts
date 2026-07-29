/**
 * Motion tokens. One place, so every reveal on the site shares a pulse.
 *
 * The house curve is an expo-out: it leaves fast and lands slow, so elements
 * read as *settling* into place rather than springing. No overshoot anywhere —
 * produce is set down, not bounced.
 */

/** cubic-bezier(0.22, 1, 0.36, 1) — mirrors `--ease-expo` in globals.css. */
export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const DUR = {
  /** Micro-interactions and exits. */
  quick: 0.2,
  /** The default reveal. */
  base: 0.28,
  /** Large surfaces — photos, the CTA panel. */
  calm: 0.34,
  /** Photographs only: a slower settle suits a big image. */
  media: 0.5,
} as const;

/** Gap between siblings in an orchestrated group. */
export const STAGGER = {tight: 0.05, base: 0.06, wide: 0.08} as const;

/** Travel distance, in px. Text rises less than a card. */
export const RISE = {text: 14, card: 20} as const;

/**
 * Fire a little before the element is fully on screen, and never again.
 * `once` is what keeps scrolling back up from feeling like a slideshow.
 *
 * The enormous top margin is load-bearing, not a typo. A reveal waits on an
 * IntersectionObserver, and an observer only ever reports what is on screen —
 * so anything the viewport has already passed never gets told to appear. Reload
 * the page anywhere but the top (browsers restore scroll position) and every
 * section above you would stay at opacity 0 for good, going blank as you
 * scrolled back up. Extending the observer's root far upward means "already
 * behind the reader" counts as visible, while the -60px bottom edge still holds
 * the reveal back until the element is genuinely approaching.
 */
export const VIEWPORT = {
  once: true,
  amount: 0.15,
  margin: '200000px 0px -60px 0px',
} as const;
