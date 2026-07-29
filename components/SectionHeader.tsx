import {cn} from '@/lib/utils';
import {Kicker} from './Kicker';

/** Kicker + display title (+ optional sub). Type carries the hierarchy. */
export function SectionHeader({
  kicker,
  title,
  sub,
  onDark = false,
  as: As = 'h2',
  className,
}: {
  kicker?: string;
  title: string;
  sub?: string;
  onDark?: boolean;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
}) {
  return (
    <div className={cn('max-w-[52ch]', className)}>
      {kicker && <Kicker onDark={onDark}>{kicker}</Kicker>}
      <As
        className={cn(
          'mt-3 text-balance font-display text-[1.9rem] font-semibold leading-tight tracking-tight lg:text-[2.3rem]',
          onDark ? 'text-cream' : 'text-ink',
        )}
      >
        {title}
      </As>
      {sub && (
        <p className={cn('mt-2 text-[15px]', onDark ? 'text-cream/75' : 'text-ink-soft')}>
          {sub}
        </p>
      )}
    </div>
  );
}
