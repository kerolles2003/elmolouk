import {getTranslations} from 'next-intl/server';
import {MessageCircle} from 'lucide-react';
import {WhatsAppCta} from '@/components/WhatsAppCta';

/**
 * The persistent way back to a chat on desktop.
 *
 * Deliberately the quietest conversion element on the page: one 56px disc in
 * the trailing corner, no label bubble, no attention-seeking pulse, no dismiss
 * button to have to deal with. It answers the case a sticky bar cannot — a
 * buyer three screens into the specification page who has decided to ask.
 *
 * `lg:` only, because below that width `MobileBar` already sits across the foot
 * of the screen with the same offer; two floating targets in one thumb zone is
 * one too many, and the disc would land on top of the bar.
 *
 * `end-6` rather than `right-6` so it follows the reading direction and lands
 * bottom-left on the Arabic pages, mirroring the layout rather than fighting it.
 */
export async function WhatsAppFab() {
  const t = await getTranslations('common');

  return (
    <WhatsAppCta
      message={t('whatsappMessage')}
      ariaLabel={t('whatsapp')}
      className="fixed bottom-6 end-6 z-30 hidden h-14 w-14 place-items-center rounded-full bg-wa text-wa-ink shadow-lift ring-1 ring-black/5 transition-transform duration-200 ease-expo hover:scale-105 active:scale-95 lg:grid"
    >
      <MessageCircle className="h-6 w-6" aria-hidden />
    </WhatsAppCta>
  );
}
