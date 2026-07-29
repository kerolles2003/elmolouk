/** Calm proof band — flat soil, hairline dividers, gold numerals. */
export function StatBand({items}: {items: {value: string; label: string}[]}) {
  return (
    <div className="grid grid-cols-2 border-y border-cream/10 bg-soil text-cream lg:grid-cols-4">
      {items.map((s, i) => (
        <div
          key={i}
          className="min-w-0 border-t border-cream/10 px-5 py-6 odd:border-e sm:px-6 sm:py-7 lg:border-e lg:last:border-e-0"
        >
          <span className="block font-display text-[clamp(1.6rem,6.5vw,2rem)] font-semibold leading-none tabular-nums text-gold">
            {s.value}
          </span>
          <span className="mt-2 block text-[12.5px] text-cream/65">{s.label}</span>
        </div>
      ))}
    </div>
  );
}
