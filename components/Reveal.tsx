'use client';

import type {ReactNode} from 'react';
import {motion, useReducedMotion} from 'framer-motion';

/** Minimal, tasteful reveal-on-scroll. Honors prefers-reduced-motion. */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{opacity: 0, y: 14}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: '-60px'}}
      transition={{duration: 0.4, delay, ease: [0.2, 0.7, 0.2, 1]}}
    >
      {children}
    </motion.div>
  );
}
