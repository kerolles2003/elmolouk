/**
 * Native <details> accordion — accessible, zero JS.
 *
 * The open/close height transition lives in globals.css via
 * `::details-content`, so this stays script-free. The indicator is drawn as two
 * rules rather than a `+`/`–` glyph pair: collapsing the vertical one turns the
 * plus into a minus in a single scale, which a swapped character cannot animate.
 */
export function Faq({items}: {items: {q: string; a: string}[]}) {
  return (
    <div className="border-t border-line">
      {items.map((f, i) => (
        <details key={i} className="group border-b border-line" open={i === 0}>
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 py-3.5 text-[15px] font-semibold transition-colors duration-200 hover:text-sweet-deep [&::-webkit-details-marker]:hidden">
            {f.q}
            <span
              aria-hidden
              className="relative h-3.5 w-3.5 shrink-0 text-sweet-deep"
            >
              <span className="absolute inset-x-0 top-1/2 h-[1.5px] -translate-y-1/2 rounded-full bg-current" />
              <span className="absolute inset-y-0 start-1/2 w-[1.5px] -translate-x-1/2 rounded-full bg-current transition-transform duration-200 ease-expo group-open:scale-y-0 rtl:translate-x-1/2" />
            </span>
          </summary>
          <p className="max-w-[66ch] pb-3.5 text-[14.5px] leading-relaxed text-ink-soft">
            {f.a}
          </p>
        </details>
      ))}
    </div>
  );
}
