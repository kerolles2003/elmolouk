import {PlaceholderImage, type PlaceholderTone} from '@/components/PlaceholderImage';

/** Farm-to-container process. Horizontal on desktop, stacked on mobile. */
export function Timeline({
  steps,
}: {
  steps: {label: string; sub: string; tone: PlaceholderTone}[];
}) {
  return (
    <ol className="mt-7 grid gap-4 lg:grid-cols-6">
      {steps.map((s, i) => (
        <li key={i} className="flex items-start gap-3.5 lg:flex-col">
          <PlaceholderImage
            tone={s.tone}
            decorative
            showIcon={false}
            className="min-h-[60px] w-[84px] shrink-0 lg:min-h-[76px] lg:w-full"
          />
          <div>
            <span className="block text-[13.5px] font-semibold">{s.label}</span>
            <span className="block text-[12px] text-ink-soft">{s.sub}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}
