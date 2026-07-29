import type {ReactNode} from 'react';
import {cn} from '@/lib/utils';

/** Mono, tracked, uppercase eyebrow label. */
export function Kicker({
  children,
  onDark = false,
  className,
}: {
  children: ReactNode;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'font-mono text-[12px] font-semibold uppercase tracking-[0.16em]',
        onDark ? 'text-gold' : 'text-sweet-deep',
        className,
      )}
    >
      {children}
    </span>
  );
}
