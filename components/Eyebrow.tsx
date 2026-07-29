import type {ReactNode} from 'react';
import {cn} from '@/lib/utils';

/**
 * Section eyebrow pill. One definition so every page opens a section the same
 * way; `tone` only picks the surface it is sitting on.
 */
const TONES = {
  /** Cream and sand sections. */
  sweet: 'bg-sweet/12 text-sweet-deep',
  /** The espresso band. */
  amber: 'bg-amber/20 text-amber',
  /** The leaf-deep band. */
  cream: 'bg-cream/15 text-cream',
} as const;

export type EyebrowTone = keyof typeof TONES;

export function Eyebrow({
  children,
  tone = 'sweet',
  className,
}: {
  children: ReactNode;
  tone?: EyebrowTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-block rounded-full px-3.5 py-1.5 text-[12.5px] font-bold uppercase tracking-[0.1em]',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
