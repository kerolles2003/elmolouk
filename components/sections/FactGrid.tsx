import {cn} from '@/lib/utils';

/**
 * Label-over-value tiles for the numbers that do not need a sentence around
 * them — storage temperature, humidity, shelf life.
 *
 * `tone` exists because the same eight facts read once on cream and once on
 * the espresso band; `columns` because a full-width row wants four and a
 * half-width column wants two.
 */
export function FactGrid({
  items,
  tone = 'light',
  columns = 4,
}: {
  items: {label: string; value: string}[];
  tone?: 'light' | 'dark';
  columns?: 2 | 4;
}) {
  const dark = tone === 'dark';
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-3',
        columns === 4 && 'lg:grid-cols-4',
      )}
    >
      {items.map((f, i) => (
        <div
          key={i}
          className={cn(
            'min-w-0 rounded-2xl px-4 py-3.5 transition-colors duration-300 ease-expo',
            dark
              ? 'bg-cream/10 backdrop-blur-sm hover:bg-cream/15'
              : 'border border-line bg-card hover:border-sweet/40',
          )}
        >
          <span
            className={cn(
              'block text-[12.5px]',
              dark ? 'text-cream/70' : 'text-ink-soft',
            )}
          >
            {f.label}
          </span>
          <span
            className={cn(
              'text-[17px] font-bold tabular-nums',
              dark ? 'text-cream' : 'text-ink',
            )}
          >
            {f.value}
          </span>
        </div>
      ))}
    </div>
  );
}
