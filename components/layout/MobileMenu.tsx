'use client';

import {useEffect, useState} from 'react';
import {AnimatePresence, m} from 'framer-motion';
import {Menu, X} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {NAV} from '@/lib/site';
import {WhatsAppCta} from '@/components/WhatsAppCta';
import {buttonVariants} from '@/components/ui/button';
import {cn} from '@/lib/utils';
import {DUR, EASE_OUT, STAGGER} from '@/components/motion/config';

/** The panel drops from under the header; its rows follow it down in order. */
const panel = {
  hidden: {opacity: 0, y: -10},
  shown: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DUR.base,
      ease: EASE_OUT,
      staggerChildren: STAGGER.tight,
      delayChildren: 0.04,
    },
  },
  // Leaving is quicker than arriving — a dismissal should feel immediate.
  gone: {opacity: 0, y: -8, transition: {duration: DUR.quick, ease: EASE_OUT}},
};

const row = {
  hidden: {opacity: 0, y: -6},
  shown: {opacity: 1, y: 0, transition: {duration: DUR.quick, ease: EASE_OUT}},
  gone: {opacity: 0},
};

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const t = useTranslations('nav');
  const tc = useTranslations('common');

  // Escape closes the menu, matching the language switcher's behaviour.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  /*
    Hold the page still while the panel is open. Without this a scroll that
    starts on the overlay runs the page underneath it, so dismissing the menu
    drops you somewhere you did not choose. Restoring the previous value rather
    than clearing it keeps this safe if anything else ever locks scrolling too.
  */
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={open ? 'mobile-menu' : undefined}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'grid h-11 w-11 place-items-center rounded-full border bg-card text-ink',
          'transition-colors duration-200 active:bg-beige',
          open ? 'border-sweet text-sweet-deep' : 'border-line',
        )}
      >
        <span className="sr-only">{open ? t('closeMenu') : t('openMenu')}</span>
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <AnimatePresence>
        {open && (
          <m.div
            key="mobile-menu"
            id="mobile-menu"
            variants={panel}
            initial="hidden"
            animate="shown"
            exit="gone"
            /*
              Capped to the space below the header and scrollable inside, so a
              short phone in landscape cannot push the language switcher and
              the quote button off the bottom with no way to reach them.
            */
            className="absolute inset-x-0 top-full z-40 max-h-[calc(100dvh-100%)] origin-top overflow-y-auto overscroll-contain border-t border-line bg-cream px-6 py-5 shadow-card"
          >
            <nav aria-label="Mobile" className="flex flex-col gap-1 text-[16px] font-semibold">
              {NAV.map((item) => (
                <m.span key={item.key} variants={row} className="block">
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-11 items-center rounded-xl px-3 py-2.5 transition-colors duration-150 hover:bg-beige active:bg-beige"
                  >
                    {t(item.key)}
                  </Link>
                </m.span>
              ))}
            </nav>
            {/* The language switcher moved out to the header bar, beside the
                button that opens this panel, so it is no longer duplicated
                here. The quote button inherits the links' inset above it rather
                than the end-alignment it needed when it shared this row. */}
            <m.div variants={row} className="mt-4 flex items-center gap-3 px-3">
              {/* Straight to a chat. The Contact row in the list above is
                  untouched, so the form and the e-mail address stay one tap
                  away for anyone who would rather write. */}
              <WhatsAppCta
                message={tc('whatsappMessage')}
                onClick={() => setOpen(false)}
                className={cn(buttonVariants({size: 'sm'}))}
              >
                {t('requestQuote')}
              </WhatsAppCta>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
