import {Link} from '@/i18n/navigation';
import {buttonVariants} from '@/components/ui/button';
import {cn} from '@/lib/utils';

export function CTABlock({
  title,
  sub,
  primaryHref,
  primaryLabel,
  whatsappHref,
  whatsappLabel,
  className,
}: {
  title: string;
  sub?: string;
  primaryHref: string;
  primaryLabel: string;
  whatsappHref?: string;
  whatsappLabel?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'grid gap-5 rounded-lg bg-soil px-5 py-7 text-cream sm:px-8 sm:py-9 lg:grid-cols-[1.4fr_auto] lg:items-center',
        className,
      )}
    >
      <div>
        <h2 className="max-w-[20ch] text-balance font-display text-[clamp(1.4rem,6vw,1.7rem)] font-semibold tracking-tight">
          {title}
        </h2>
        {sub && <p className="mt-2 max-w-[46ch] text-[14.5px] text-cream/[0.78]">{sub}</p>}
      </div>
      <div className="flex flex-wrap gap-3">
        <Link href={primaryHref} className={cn(buttonVariants())}>
          {primaryLabel}
        </Link>
        {whatsappHref && whatsappLabel && (
          <a href={whatsappHref} className={cn(buttonVariants({variant: 'wa'}))}>
            {whatsappLabel}
          </a>
        )}
      </div>
    </div>
  );
}
