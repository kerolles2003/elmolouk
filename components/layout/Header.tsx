import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {NAV} from '@/lib/site';
import {Brand} from './Brand';
import {HeaderShell} from './HeaderShell';
import {LanguageSwitcher} from './LanguageSwitcher';
import {MobileMenu} from './MobileMenu';
import {buttonVariants} from '@/components/ui/button';
import {cn} from '@/lib/utils';

export async function Header() {
  const t = await getTranslations('nav');

  return (
    <HeaderShell>
      {/* `px-6` matches the page sections below, so the mark lines up with the
          content instead of sitting 4px proud of it. The row padding is tighter
          than the old text lockup needed: the artwork carries its own margin,
          so the bar keeps its height while the mark inside it grows. */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-6 py-2 lg:px-10 lg:py-2.5">
        <Brand />
        <nav
          aria-label="Primary"
          className="hidden items-center gap-7 text-[14.5px] font-medium text-ink-soft lg:flex"
        >
          {NAV.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="nav-underline transition-colors duration-200 hover:text-sweet-deep"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>
        {/* The switcher sits beside the menu button at every width — it used to
            be hidden below `sm` and reachable only inside the open panel, which
            buried the one control a visitor on the wrong language needs first.
            `inline-flex` is load-bearing, not cosmetic: as a plain block this
            wrapper would give its inline-flex button a text baseline, and the
            descender leading under it would knock the trigger a few pixels out
            of line with the burger. */}
        <div className="flex items-center gap-2.5">
          <LanguageSwitcher className="inline-flex" />
          <Link
            href="/contact"
            className={cn(buttonVariants({size: 'sm'}), 'hidden lg:inline-flex')}
          >
            {t('requestQuote')}
          </Link>
          <MobileMenu />
        </div>
      </div>
    </HeaderShell>
  );
}
