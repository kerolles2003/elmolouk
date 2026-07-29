import {cn} from '@/lib/utils';

// 0 = out of season · 1 = cold-store supply · 2 = peak harvest  [[confirm season profile]]
const STATES = [0, 0, 1, 1, 1, 0, 0, 2, 2, 2, 2, 2] as const;

/** Collapse the twelve months into the spans a buyer actually plans against. */
function runs() {
  const out: {state: number; start: number; length: number}[] = [];
  for (const [i, state] of STATES.entries()) {
    const last = out.at(-1);
    if (last && last.state === state) last.length += 1;
    else out.push({state, start: i, length: 1});
  }
  return out;
}

export function SeasonCalendar({
  locale,
  peakLabel,
  storeLabel,
  note,
}: {
  locale: string;
  peakLabel: string;
  storeLabel: string;
  note: string;
}) {
  const narrow = new Intl.DateTimeFormat(locale, {month: 'narrow'});
  const short = new Intl.DateTimeFormat(locale, {month: 'short'});
  const long = new Intl.DateTimeFormat(locale, {month: 'long'});
  const months = Array.from({length: 12}, (_, i) => new Date(2020, i, 1));
  const label = (state: number) =>
    state === 2 ? peakLabel : state === 1 ? storeLabel : null;

  return (
    <div className="rounded-3xl border border-line bg-card p-5 shadow-sm sm:p-7">
      {/*
        Two rows on one twelve-column grid: the supply spans on top, the months
        beneath them. A run of five cells that says "peak harvest" once carries
        the shape of the season better than five cells that each repeat it —
        and the span is the thing a buyer plans a programme against.
      */}
      <div className="grid grid-cols-12 gap-1 sm:gap-1.5" aria-hidden>
        {runs().map((run) => (
          <div
            key={run.start}
            style={{gridColumn: `span ${run.length}`}}
            className={cn(
              'flex h-7 items-center justify-center overflow-hidden rounded-full px-2 text-[11px] font-bold',
              run.state === 2 && 'bg-sweet-deep text-white',
              run.state === 1 && 'bg-sweet/15 text-sweet-deep',
            )}
          >
            <span className="hidden truncate sm:block">{label(run.state)}</span>
          </div>
        ))}
      </div>

      {/*
        Twelve single-letter months fit a 320px screen, so the strip is sized to
        fit rather than to scroll: a calendar you have to drag sideways hides
        half the season. Full names arrive at `lg`, where there is room.
      */}
      <ul className="mt-1 grid grid-cols-12 gap-1 sm:mt-1.5 sm:gap-1.5">
        {months.map((month, i) => (
          <li
            key={i}
            className={cn(
              'rounded-xl border px-0.5 py-2.5 text-center text-[12px] font-semibold',
              STATES[i] === 2 && 'border-sweet-deep bg-sweet-deep text-white',
              STATES[i] === 1 && 'border-sweet/50 bg-sweet/10 text-sweet-deep',
              STATES[i] === 0 && 'border-line bg-cream text-ink-soft/70',
            )}
          >
            {/* The visible label shortens with the viewport; the accessible
                name stays the full month in every locale. */}
            <span className="sr-only">
              {long.format(month)}
              {label(STATES[i]) ? ` — ${label(STATES[i])}` : ''}
            </span>
            <span aria-hidden className="lg:hidden">
              {narrow.format(month)}
            </span>
            <span aria-hidden className="hidden lg:inline">
              {short.format(month)}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-4 text-[13.5px]">
        <span className="inline-flex items-center gap-2 font-semibold">
          <span aria-hidden className="h-3 w-3 rounded-[4px] bg-sweet-deep" />
          {peakLabel}
        </span>
        <span className="inline-flex items-center gap-2 font-semibold">
          <span
            aria-hidden
            className="h-3 w-3 rounded-[4px] border border-sweet/60 bg-sweet/15"
          />
          {storeLabel}
        </span>
        <span className="text-ink-soft">{note}</span>
      </div>
    </div>
  );
}
