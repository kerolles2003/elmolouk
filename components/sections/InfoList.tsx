export function InfoList({rows}: {rows: {label: string; value: string}[]}) {
  return (
    <dl className="grid gap-3.5">
      {rows.map((r, i) => (
        <div key={i}>
          <dt className="font-mono text-[12px] uppercase tracking-[0.1em] text-ink-soft">
            {r.label}
          </dt>
          <dd className="text-[15px] font-semibold">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}
