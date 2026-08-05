import {getTranslations} from 'next-intl/server';
import {Mail} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {WhatsAppCta} from '@/components/WhatsAppCta';
import {buttonVariants} from '@/components/ui/button';
import {cn} from '@/lib/utils';

/** Sticky mobile conversion bar. Hidden on desktop. */
export async function MobileBar() {
  const t = await getTranslations('common');

  return (
    /*
      The bar sits over the home indicator on a modern iPhone, so the bottom
      padding is the larger of the design value and the inset the device
      reports. On everything else `env()` is 0 and this is just `py-2.5`.
    */
    <div className="sticky bottom-0 z-30 flex gap-2 border-t border-line bg-cream/95 px-4 pb-[max(0.625rem,env(safe-area-inset-bottom))] pt-2.5 backdrop-blur lg:hidden">
      {/*
        The wide button is the whole point of the bar, so it takes the shortest
        route there is: one tap, straight into a chat with the enquiry already
        written. The square beside it keeps the slower channel available —
        it used to be a second WhatsApp target, which is a tap wasted now that
        the wide button does that job.
      */}
      <WhatsAppCta
        message={t('whatsappMessage')}
        className={cn(buttonVariants({block: true}), 'min-h-12')}
      >
        {t('requestQuote')}
      </WhatsAppCta>
      <Link
        href="/contact"
        aria-label={t('contactTeam')}
        className={cn(
          buttonVariants({variant: 'outline'}),
          'min-h-12 w-12 shrink-0 px-0',
        )}
      >
        <Mail className="h-5 w-5" aria-hidden />
      </Link>
    </div>
  );
}
