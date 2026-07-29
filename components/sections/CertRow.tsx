import {BadgeCheck} from 'lucide-react';
import {RevealGroup, RevealItem} from '@/components/motion/Reveal';
import {STAGGER} from '@/components/motion/config';

/**
 * The certification strip that sits directly under a hero — the trust claim a
 * European buyer checks before reading a single spec.
 *
 * Items sweep in along the reading direction rather than rising, so the strip
 * reads as one line being drawn instead of five badges popping.
 */
export function CertRow({
  label,
  items,
  note,
}: {
  label?: string;
  items: string[];
  note?: string;
}) {
  return (
    <RevealGroup
      className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-7 gap-y-3 px-6 py-4 lg:px-10"
      stagger={STAGGER.tight}
    >
      {label && (
        <RevealItem as="span" from="inline" className="text-[13px] font-semibold text-ink-soft">
          {label}
        </RevealItem>
      )}
      {items.map((c) => (
        <RevealItem
          key={c}
          as="span"
          from="inline"
          className="inline-flex items-center gap-1.5 text-[13px] font-bold text-ink"
        >
          <BadgeCheck className="h-4 w-4 text-leaf" aria-hidden />
          {c}
        </RevealItem>
      ))}
      {note && (
        <RevealItem as="span" from="inline" className="text-[12px] text-ink-soft/70">
          {note}
        </RevealItem>
      )}
    </RevealGroup>
  );
}
