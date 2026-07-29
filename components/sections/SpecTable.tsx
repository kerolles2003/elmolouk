import {cn} from '@/lib/utils';
import {ConfirmValue} from '@/components/ConfirmValue';

/**
 * Procurement-grade table: soil header, warm hairlines, tabular numerals.
 *
 * The card and the scroller are separate elements on purpose — `scroll-hint-x`
 * sets `overflow-x: auto`, which would fight a rounded `overflow: hidden` on
 * the same box and clip the corners it is meant to round.
 */
export function SpecTable({
  caption,
  head,
  rows,
}: {
  caption?: string;
  head: string[];
  rows: string[][];
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-card shadow-sm">
      <div className="scroll-hint-x">
        <table className="w-full min-w-[400px] border-collapse text-[14px] sm:min-w-[440px]">
          {caption && (
            <caption className="px-5 pt-5 pb-3 text-start text-[18px] font-bold">
              {caption}
            </caption>
          )}
          <thead>
            <tr>
              {head.map((h, i) => (
                <th
                  key={i}
                  scope="col"
                  className="snap-start bg-soil px-4 py-3 text-start text-[11.5px] font-bold uppercase tracking-[0.08em] text-cream lg:px-5"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr
                key={ri}
                className="transition-colors duration-200 ease-expo hover:bg-sand/60"
              >
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className={cn(
                      'border-t border-line px-4 py-3.5 lg:px-5',
                      ci === 0 ? 'font-semibold' : 'tabular-nums',
                    )}
                  >
                    {/* A figure the client has not verified stays bracketed in
                        the dictionary and is drawn as an open slot, never as a
                        number a buyer could quote back at us. */}
                    <ConfirmValue value={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
