import {cn} from '@/lib/utils';

/**
 * The calibre table, drawn as a ladder.
 *
 * Grading is the one spec a produce buyer reads first, and a row of numbers
 * makes them do the arithmetic to picture it. Here the tuber glyph beside each
 * grade grows with the grade, so S → G is legible before a single figure is
 * read; the figures are still there, in the same four columns the source data
 * has always had.
 *
 * The glyph is scaled from the row's *position*, not by parsing its weight —
 * the rows are ordered smallest-first in every locale, while "< 150 g" is
 * written seven different ways.
 */

/**
 * A tuber in one path: blunt at the stem end, tapering to the root. Drawn at
 * 120×34 so it stays plump at the small end of the ladder instead of thinning
 * into a chilli.
 */
const TUBER =
  'M7 17C7 9.5 19 4.5 42 4.5 72 4.5 106 8.5 114.5 14.8 116.5 16.2 116.5 17.8 114.5 19.2 106 25.5 72 29.5 42 29.5 19 29.5 7 24.5 7 17Z';

export function CalibreLadder({head, rows}: {head: string[]; rows: string[][]}) {
  const last = Math.max(rows.length - 1, 1);

  return (
    // The ladder's reach is a custom property rather than a fixed pixel span:
    // the same six steps have to fit beside a badge on a 320px phone and still
    // carry a 1440px column, and only the top of the range needs to change.
    <div
      className="overflow-hidden rounded-3xl border border-line bg-card shadow-sm [--tuber-max:136px] [--tuber-min:52px] lg:[--tuber-max:210px] lg:[--tuber-min:64px]"
    >
      {/*
        A real table, laid out as blocks on a phone and as a table from `sm` up.
        Four columns of procurement data do not reflow into one readable column,
        and a grade chart that scrolls sideways hides the comparison it exists
        to make — so below `sm` each grade becomes its own labelled card.
      */}
      <table className="block w-full text-[14px] sm:table sm:border-collapse">
        <thead className="sr-only sm:not-sr-only sm:table-header-group">
          <tr>
            {head.map((h, i) => (
              <th
                key={i}
                scope="col"
                className={cn(
                  'bg-soil py-3 text-start text-[11.5px] font-bold uppercase tracking-[0.08em] text-cream',
                  i === 0 ? 'px-5 sm:w-[42%] lg:px-7' : 'px-4 lg:px-5',
                )}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="block sm:table-row-group">
          {rows.map((row, i) => (
            <tr
              key={i}
              className="block border-t border-line px-5 py-4 transition-colors duration-200 ease-expo first:border-t-0 hover:bg-sand/60 sm:table-row sm:border-t-0 sm:p-0"
            >
              <th
                scope="row"
                className="block p-0 text-start font-normal sm:table-cell sm:border-t sm:border-line sm:px-5 sm:py-3.5 sm:align-middle lg:px-7"
              >
                <span className="flex items-center gap-3.5">
                  <span className="grid h-9 w-11 shrink-0 place-items-center rounded-xl bg-sweet/12 text-[14px] font-extrabold text-sweet-deep">
                    {row[0]}
                  </span>
                  <svg
                    aria-hidden
                    viewBox="0 0 120 34"
                    style={{
                      width: `calc(var(--tuber-min) + (var(--tuber-max) - var(--tuber-min)) * ${(
                        i / last
                      ).toFixed(4)})`,
                    }}
                    className="h-auto max-w-full shrink"
                  >
                    <path d={TUBER} className="fill-sweet" />
                  </svg>
                </span>
              </th>
              {row.slice(1).map((cell, ci) => (
                <td
                  key={ci}
                  className="mt-2 flex items-baseline justify-between gap-4 p-0 text-[13.5px] sm:mt-0 sm:table-cell sm:border-t sm:border-line sm:px-4 sm:py-3.5 sm:align-middle lg:px-5"
                >
                  {/* The header row is `sr-only` on a phone, so each value
                      carries its own label there and drops it from `sm` up. */}
                  <span className="text-ink-soft sm:hidden">{head[ci + 1]}</span>
                  <span className="font-semibold tabular-nums">{cell}</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
