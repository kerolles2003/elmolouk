import {WhatsAppCta} from '@/components/WhatsAppCta';
import {buttonVariants} from '@/components/ui/button';
import {cn} from '@/lib/utils';

/**
 * Headline, one line of copy, and the two ways to act on it.
 *
 * The solid button opens a WhatsApp chat with `whatsappMessage` already typed —
 * the site's primary conversion path — and the outline beside it is the slower,
 * written route, normally the contact page. `secondaryHref` is a plain string
 * rather than a typed route because this block also serves the landing page,
 * which links out.
 */
export function CTABlock({
  title,
  sub,
  whatsappMessage,
  whatsappLabel,
  secondaryHref,
  secondaryLabel,
  className,
}: {
  title: string;
  sub?: string;
  /** The pre-filled enquiry, already translated. */
  whatsappMessage: string;
  whatsappLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
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
        <WhatsAppCta message={whatsappMessage} className={cn(buttonVariants({variant: 'wa'}))}>
          {whatsappLabel}
        </WhatsAppCta>
        {secondaryHref && secondaryLabel && (
          <a href={secondaryHref} className={cn(buttonVariants({variant: 'outline'}))}>
            {secondaryLabel}
          </a>
        )}
      </div>
    </div>
  );
}
