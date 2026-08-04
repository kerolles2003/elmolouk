import {Fragment} from 'react';
import {Package} from 'lucide-react';
import {ConfirmValue} from '@/components/ConfirmValue';

/**
 * Export packing options as cards.
 *
 * One mark at three sizes rather than three different marks. These are the only
 * formats El Molouk supplies — bulk export cartons of 3, 6 and 10 kg — and they
 * are the same carton scaled up, so drawing three distinct silhouettes would
 * invent a difference the goods do not have. The glyph grows with the net
 * weight, which is the difference that is real.
 */
const SIZES = ['h-5 w-5', 'h-6 w-6', 'h-7 w-7'];

export function PackagingGrid({items}: {items: {title: string; specs: string[][]}[]}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
      {items.map((p, i) => {
        const size = SIZES[i] ?? SIZES[SIZES.length - 1];
        return (
          // `min-w-0` so a long spec value wraps inside the card rather than
          // widening it and, through the grid, the page.
          <div
            key={i}
            className="min-w-0 rounded-3xl border border-line bg-card p-5 transition-[box-shadow,border-color] duration-300 ease-expo hover:border-sweet/40 hover:shadow-card sm:p-6"
          >
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sweet/12 text-sweet-deep">
              <Package className={size} aria-hidden />
            </span>
            <h3 className="mt-4 text-[17px] font-bold">{p.title}</h3>
            <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 border-t border-line pt-4 text-[13px]">
              {p.specs.map(([label, value], j) => (
                <Fragment key={j}>
                  <dt className="text-ink-soft">{label}</dt>
                  {/* `text-end`, not `text-right` — the column flips in Arabic.
                      Container capacity is a range, not a fixed count, so the
                      value wraps rather than sitting on one line. Anything still
                      bracketed is drawn as an open slot by `ConfirmValue`. */}
                  <dd className="flex justify-end text-end font-bold tabular-nums">
                    <ConfirmValue value={value} />
                  </dd>
                </Fragment>
              ))}
            </dl>
          </div>
        );
      })}
    </div>
  );
}
