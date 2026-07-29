import {ImageIcon} from 'lucide-react';
import {cn} from '@/lib/utils';

const TONES = {
  flesh: 'bg-ph-flesh',
  field: 'bg-ph-field',
  crate: 'bg-ph-crate',
  cure: 'bg-ph-cure',
} as const;

export type PlaceholderTone = keyof typeof TONES;

/**
 * Flat, low-chroma placeholder surface standing in for real company photography.
 * `label` doubles as the accessible name and the visible "expected shot" note, so
 * swapping in a real <Image alt={…}> later is a one-line change. `decorative`
 * renders a bare tone block (aria-hidden) for repeating thumbnails.
 */
export function PlaceholderImage({
  tone = 'crate',
  label,
  tag,
  className,
  rounded = 'rounded-md',
  showIcon = true,
  decorative = false,
}: {
  tone?: PlaceholderTone;
  label?: string;
  tag?: string;
  className?: string;
  rounded?: string;
  showIcon?: boolean;
  decorative?: boolean;
}) {
  return (
    <div
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : (label ?? 'Placeholder image')}
      className={cn(
        'relative flex items-end overflow-hidden border border-ink/10',
        TONES[tone],
        rounded,
        className,
      )}
    >
      {tag && !decorative && (
        <span className="absolute start-2 top-2 rounded-[4px] bg-ink/50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-white">
          {tag}
        </span>
      )}
      {showIcon && (
        <ImageIcon
          aria-hidden
          strokeWidth={1.4}
          className="pointer-events-none absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-[70%] text-white/40"
        />
      )}
      {label && !decorative && (
        <p className="relative w-full bg-ink/55 px-2.5 py-2 font-mono text-[11px] leading-snug text-[#F7F0E4]">
          {label}
        </p>
      )}
    </div>
  );
}
