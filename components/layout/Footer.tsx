import type {ReactNode} from 'react';
import {getLocale, getTranslations} from 'next-intl/server';
import {Mail, MapPin, MessageCircle, Phone} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {Brand} from './Brand';
import {LOCALES} from '@/lib/locales';
import {contact, siteConfig} from '@/lib/site';

function Col({title, children}: {title: string; children: ReactNode}) {
  return (
    <div>
      <h2 className="mb-2 text-[12px] font-bold uppercase tracking-[0.14em] text-amber">
        {title}
      </h2>
      {/*
        Footer links were 22px tall — readable, but a poor thumb target at the
        very bottom of a long page. `min-h-11` on each link buys the height back
        and the column gap drops to compensate, so the block ends up about the
        size it was while every link is now comfortably tappable. Scoped to
        direct-child links: the plain <span> rows are not interactive, and the
        language list nests spans that must stay inline text.
      */}
      <div className="flex flex-col gap-1 text-[14px] text-cream/75 [&>a]:flex [&>a]:min-h-11 [&>a]:items-center">
        {children}
      </div>
    </div>
  );
}

/**
 * One contact row. The label is translated, the value never is — it is printed
 * inside `dir="ltr"` so a phone number keeps its leading `+` on the Arabic page,
 * and the label is carried on `aria-label` because the visible text is the raw
 * value a screen reader would otherwise announce without context.
 */
function ContactLink({
  href,
  icon,
  label,
  value,
  iconClass = 'text-amber',
}: {
  href: string;
  icon: ReactNode;
  label: string;
  value: string;
  iconClass?: string;
}) {
  return (
    <a
      href={href}
      aria-label={`${label}: ${value}`}
      className="flex min-h-11 items-center gap-2 text-[13.5px] text-cream/75 transition-colors hover:text-cream"
    >
      <span className={iconClass} aria-hidden>
        {icon}
      </span>
      <span dir="ltr" className="break-all">
        {value}
      </span>
    </a>
  );
}

export async function Footer() {
  const t = await getTranslations('footer');
  const tn = await getTranslations('nav');
  const tc = await getTranslations('common');
  const locale = await getLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-soil text-cream">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-2 md:gap-10 md:py-14 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:px-10">
        <div>
          <Brand />
          <p className="mt-4 max-w-[38ch] text-[14px] leading-relaxed text-cream/75">
            {t('tagline')}
          </p>
          <p className="mt-4 inline-flex items-center gap-2 text-[13px] text-cream/60">
            <MapPin className="h-4 w-4 text-amber" aria-hidden />
            {/* Unlike the phone and the e-mail, an address is words, not digits —
                so the Arabic page gets the Arabic line rather than a
                transliteration the reader would have to decode. */}
            {locale === 'ar' ? siteConfig.addressAr : siteConfig.address}
          </p>
          {/* The three ways to reach the export desk, together and above the
              fold of the footer rather than buried in the logistics column. */}
          <div className="mt-2 flex flex-col">
            <ContactLink
              href={contact.phoneHref}
              icon={<Phone className="h-4 w-4" />}
              label={tc('phone')}
              value={contact.phone}
            />
            <ContactLink
              href={contact.emailHref}
              icon={<Mail className="h-4 w-4" />}
              label={tc('email')}
              value={contact.email}
            />
            <ContactLink
              href={contact.whatsapp}
              icon={<MessageCircle className="h-4 w-4" />}
              label={tc('whatsappShort')}
              value={contact.phone}
              iconClass="text-wa"
            />
          </div>
        </div>
        <Col title={t('export')}>
          <Link href="/sweet-potatoes" className="transition-colors hover:text-cream">
            {tn('sweetPotatoes')}
          </Link>
          <Link href="/quality" className="transition-colors hover:text-cream">
            {t('quality')}
          </Link>
          <Link href="/contact" className="transition-colors hover:text-cream">
            {tn('requestQuote')}
          </Link>
        </Col>
        <Col title={t('logistics')}>
          <span>{t('ports')}</span>
          <span>{t('freight')}</span>
          <span>{t('moq')}</span>
          <span>{t('incoterms')}</span>
          {/* The WhatsApp link that used to sit here moved into the contact
              block above — one footer should not offer it twice. */}
        </Col>
        <Col title={t('languages')}>
          <span className="text-[13px] leading-relaxed">
            {LOCALES.map((l, i) => (
              <span key={l.code}>
                {i > 0 && <span aria-hidden> · </span>}
                <span lang={l.code} dir={l.dir}>
                  {l.native}
                </span>
              </span>
            ))}
          </span>
        </Col>
      </div>
      <div className="border-t border-cream/10">
        {/* Copyright line and the two legal documents on one bar. They wrap to
            their own line on a phone rather than becoming a fifth column: a
            procurement team looks for them here, at the very foot. */}
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-2 px-6 py-5 text-[12px] text-cream/55 lg:px-10">
          <span>
            © {year} {siteConfig.name} · {t('rights')} ·{' '}
            <span className="text-cream/70">{siteConfig.legal}</span>
          </span>
          <span className="flex items-center gap-x-4">
            <Link href="/privacy" className="transition-colors hover:text-cream">
              {t('privacy')}
            </Link>
            <Link href="/terms" className="transition-colors hover:text-cream">
              {t('terms')}
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
