'use client';

import type {ReactNode} from 'react';
import {LazyMotion, MotionConfig, domAnimation} from 'framer-motion';
import {DUR, EASE_OUT} from './config';

/**
 * Site-wide motion boundary.
 *
 * `domAnimation` ships the animation, exit, in-view and gesture features but
 * leaves out layout projection and drag, which nothing here uses — roughly a
 * third of the full bundle. `strict` makes the omission enforceable: importing
 * `motion.div` instead of `m.div` throws in development rather than silently
 * pulling the whole library back in.
 *
 * `reducedMotion="user"` is the accessibility contract. When the OS asks for
 * reduced motion, Framer drops transform and layout animation but keeps opacity,
 * so reveals still resolve to visible content instead of being skipped. Because
 * it is handled inside Framer, there is no branch on a media query during render
 * and therefore no hydration mismatch.
 */
export function MotionProvider({children}: {children: ReactNode}) {
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{duration: DUR.base, ease: EASE_OUT}}
    >
      <LazyMotion features={domAnimation} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  );
}
