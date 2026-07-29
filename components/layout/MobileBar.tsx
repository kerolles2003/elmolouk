import {getTranslations} from 'next-intl/server';
import {MessageCircle} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {siteConfig} from '@/lib/site';
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
      <Link href="/contact" className={cn(buttonVariants({block: true}), 'min-h-12')}>
        {t('requestQuote')}
      </Link>
      <a
        href={siteConfig.whatsapp}
        aria-label={t('whatsapp')}
        className={cn(buttonVariants({variant: 'wa'}), 'min-h-12 w-12 shrink-0 px-0')}
      >
        <MessageCircle className="h-5 w-5" aria-hidden />
      </a>
    </div>
  );
}
