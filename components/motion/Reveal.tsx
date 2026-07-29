'use client';

import type {ReactNode} from 'react';
import {m, type MotionProps, type Variants} from 'framer-motion';
import {useLocale} from 'next-intl';
import {isRtlLocale} from '@/i18n/routing';
import {DUR, EASE_OUT, RISE, STAGGER, VIEWPORT} from './config';

/**
 * Reveal primitives.
 *
 * All three render *as* the element they replace — pass `as="li"` and you get an
 * `<li>`, not an `<li>` wrapped in a div. Nothing here adds a node to the tree,
 * so margins, grid placement and spacing are untouched.
 *
 * They are also client components that take server-rendered `children`, so the
 * content stays on the server; only the ~2kB of primitives reaches the browser.
 */

type Tag =
  | 'div'
  | 'span'
  | 'section'
  | 'article'
  | 'figure'
  | 'ol'
  | 'ul'
  | 'li'
  | 'dl'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'p';

/**
 * Only the props every motion element shares. Deriving these from `m.div` would
 * drag in div-shaped event handlers that `m.ol` and `m.li` reject.
 */
type MotionTagProps = Pick<
  MotionProps,
  'variants' | 'initial' | 'animate' | 'whileInView' | 'viewport' | 'whileHover'
> & {
  as: Tag;
  className?: string;
  children?: ReactNode;
  'data-motion'?: boolean;
};

/**
 * Renders one of a fixed set of motion elements.
 *
 * Written as a switch rather than a `TAGS[as]` lookup so the element type is
 * never bound to a variable that React sees as a component created during
 * render — that pattern remounts the subtree whenever the identity changes, and
 * remounting a reveal would replay it.
 */
function MotionTag({as, ...props}: MotionTagProps) {
  switch (as) {
    case 'span':
      return <m.span {...props} />;
    case 'section':
      return <m.section {...props} />;
    case 'article':
      return <m.article {...props} />;
    case 'figure':
      return <m.figure {...props} />;
    case 'ol':
      return <m.ol {...props} />;
    case 'ul':
      return <m.ul {...props} />;
    case 'li':
      return <m.li {...props} />;
    case 'dl':
      return <m.dl {...props} />;
    case 'h1':
      return <m.h1 {...props} />;
    case 'h2':
      return <m.h2 {...props} />;
    case 'h3':
      return <m.h3 {...props} />;
    case 'p':
      return <m.p {...props} />;
    default:
      return <m.div {...props} />;
  }
}

/** `view` waits for the scroll position; `mount` runs on load (above the fold). */
type Trigger = 'view' | 'mount';

function trigger(on: Trigger) {
  return on === 'mount'
    ? {initial: 'hidden', animate: 'shown'}
    : {initial: 'hidden', whileInView: 'shown', viewport: VIEWPORT};
}

/** Where an item travels from. `inline` follows the reading direction. */
type From = 'below' | 'inline';

const rise = (distance: number, delay: number): Variants => ({
  hidden: {opacity: 0, y: distance},
  shown: {opacity: 1, y: 0, transition: {duration: DUR.base, ease: EASE_OUT, delay}},
});

const drift = (distance: number, delay: number): Variants => ({
  hidden: {opacity: 0, x: distance},
  shown: {opacity: 1, x: 0, transition: {duration: DUR.base, ease: EASE_OUT, delay}},
});

/**
 * A single block that fades and settles upward. Use it for anything that should
 * arrive as one unit — a heading with its eyebrow and standfirst, a whole panel.
 */
export function Reveal({
  children,
  className,
  as = 'div',
  on = 'view',
  delay = 0,
  distance = RISE.text,
}: {
  children: ReactNode;
  className?: string;
  as?: Tag;
  on?: Trigger;
  delay?: number;
  distance?: number;
}) {
  return (
    <MotionTag
      as={as}
      data-motion
      className={className}
      variants={rise(distance, delay)}
      {...trigger(on)}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Orchestrates its `RevealItem` children so they arrive in document order.
 * One IntersectionObserver serves the whole group rather than one per card.
 */
export function RevealGroup({
  children,
  className,
  as = 'div',
  on = 'view',
  stagger = STAGGER.base,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  as?: Tag;
  on?: Trigger;
  stagger?: number;
  delay?: number;
}) {
  const variants: Variants = {
    hidden: {},
    shown: {transition: {staggerChildren: stagger, delayChildren: delay}},
  };
  return (
    <MotionTag as={as} className={className} variants={variants} {...trigger(on)}>
      {children}
    </MotionTag>
  );
}

/**
 * A child of `RevealGroup`. It declares no trigger of its own, which is what
 * lets the parent drive its timing — and lets an item that sets `stagger`
 * become a group in turn, so a row of buttons can cascade inside a column that
 * is itself cascading.
 */
export function RevealItem({
  children,
  className,
  as = 'div',
  from = 'below',
  distance,
  stagger,
  lift = false,
}: {
  children: ReactNode;
  className?: string;
  as?: Tag;
  from?: From;
  distance?: number;
  stagger?: number;
  /**
   * Raise the element 4px under the cursor. Framer drives this rather than a
   * `hover:-translate-y-1` class so the lift is covered by `reducedMotion`:
   * a CSS hover translate still moves the card when the OS asks for less
   * motion — the reduced-motion rule can only take the easing away, not the
   * movement itself.
   */
  lift?: boolean;
}) {
  const rtl = isRtlLocale(useLocale());
  const travel = distance ?? RISE.text;

  // Arabic reads right-to-left, so an item entering "from the start of the line"
  // has to come from the right. Hard-coding a negative x would run the sweep
  // backwards against the text in one of the seven locales.
  const variants =
    from === 'inline' ? drift(rtl ? travel : -travel, 0) : rise(travel, 0);

  const withStagger: Variants = stagger
    ? {
        hidden: variants.hidden,
        shown: {
          ...(variants.shown as object),
          transition: {
            duration: DUR.base,
            ease: EASE_OUT,
            staggerChildren: stagger,
          },
        },
      }
    : variants;

  return (
    <MotionTag
      as={as}
      data-motion
      className={className}
      variants={withStagger}
      whileHover={lift ? {y: -4, transition: {duration: DUR.quick, ease: EASE_OUT}} : undefined}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Photographs and large panels: the same fade, plus a scale that starts close
 * enough to 1 that you register the arrival without seeing the zoom.
 */
export function RevealMedia({
  children,
  className,
  as = 'div',
  on = 'view',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  as?: Tag;
  on?: Trigger;
  delay?: number;
}) {
  const variants: Variants = {
    hidden: {opacity: 0, scale: 0.98},
    shown: {
      opacity: 1,
      scale: 1,
      transition: {duration: DUR.media, ease: EASE_OUT, delay},
    },
  };
  return (
    <MotionTag as={as} data-motion className={className} variants={variants} {...trigger(on)}>
      {children}
    </MotionTag>
  );
}
