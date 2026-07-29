import {Fragment} from 'react';
import {ArrowRight} from 'lucide-react';
import {textLinkClass} from '@/components/ui/button';
import {cn} from '@/lib/utils';

/** Certification card. Values stay [[confirm]] until the client verifies them. */
export function CertCard({
  code,
  name,
  rows,
  downloadLabel,
}: {
  code: string;
  name: string;
  rows: string[][];
  downloadLabel: string;
}) {
  return (
    <div className="grid grid-cols-[auto_1fr] items-start gap-3.5 rounded-lg border border-line bg-white p-4">
      <div className="grid h-11 w-11 place-items-center rounded-[10px] bg-leaf font-mono text-[13px] font-bold text-cream">
        {code}
      </div>
      <div>
        <h3 className="font-display text-[1.1rem] font-semibold">{name}</h3>
        <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-[13px]">
          {rows.map(([label, value], i) => (
            <Fragment key={i}>
              <dt className="text-ink-soft">{label}</dt>
              <dd className="font-mono font-semibold text-sweet-deep">{value}</dd>
            </Fragment>
          ))}
        </dl>
        <button
          type="button"
          className={cn(textLinkClass, 'mt-1.5 min-h-11 text-[14px]')}
        >
          {downloadLabel}
          <ArrowRight aria-hidden className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
