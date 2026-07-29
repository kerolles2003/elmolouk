import {cn} from '@/lib/utils';

/**
 * Organic soil-furrow / rolling-hill divider between sections.
 * `fill` is the colour of the section the wave belongs to; place it at the
 * boundary so it reads as land curving into the next band.
 */
export function Wave({
  fill = 'fill-cream',
  flip = false,
  className,
}: {
  fill?: string;
  flip?: boolean;
  className?: string;
}) {
  return (
    <div aria-hidden className={cn('pointer-events-none -mb-px w-full leading-[0]', className)}>
      <svg
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        className={cn('block h-[48px] w-full md:h-[72px]', fill, flip && 'rotate-180')}
      >
        <path d="M0,40 C240,90 480,90 720,55 C960,20 1200,20 1440,55 L1440,90 L0,90 Z" />
      </svg>
    </div>
  );
}
