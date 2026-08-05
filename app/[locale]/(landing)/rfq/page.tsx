import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Check, Mail, Phone} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {WhatsAppCta} from '@/components/WhatsAppCta';
import {Brand} from '@/components/layout/Brand';
import {Kicker} from '@/components/Kicker';
import {StatBand} from '@/components/sections/StatBand';
import {SpecTable} from '@/components/sections/SpecTable';
import {RfqForm} from '@/components/sections/RfqForm';
import {buttonVariants} from '@/components/ui/button';
import {contact} from '@/lib/site';
import {pageMetadata} from '@/lib/seo';
import {cn} from '@/lib/utils';

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  return pageMetadata('rfq', locale);
}

export default async function RfqPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('rfq');
  const tr = await getTranslations('rfqForm');
  const tc = await getTranslations('common');

  const chips = t.raw('hero.chips') as string[];
  const proof = t.raw('hero.proof') as string[];
  const trust = t.raw('hero.trust') as string[];

  return (
    <>
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
          <Brand />
          <span className="hidden font-mono text-[12px] text-ink-soft sm:block">
            {t('headerNote')}
          </span>
        </div>
      </header>

      <main id="main">
        <section className="mx-auto grid max-w-6xl gap-8 px-6 py-9 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:px-8">
          <div>
            <Kicker>{t('hero.kicker')}</Kicker>
            <h1 className="mt-3 max-w-[20ch] text-balance font-display text-[clamp(27px,7.2vw,32px)] font-semibold leading-[1.05] tracking-tight lg:text-[42px]">
              {t('hero.title')}
            </h1>
            <p className="mt-3 max-w-[46ch] text-[15px] text-ink-soft">{t('hero.sub')}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {chips.map((c) => (
                <span
                  key={c}
                  className="rounded-[5px] border border-line bg-white px-2.5 py-1.5 font-mono text-[12px] text-ink-soft"
                >
                  {c}
                </span>
              ))}
            </div>
            <ul className="mt-5 grid gap-2.5">
              {proof.map((p, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[14px]">
                  <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-sweet-deep" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              {trust.map((c) => (
                <span
                  key={c}
                  className="rounded-md border border-line bg-white px-3 py-2 text-[13px]"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-line bg-white shadow-card">
            <div className="bg-soil px-5 py-4 text-cream">
              <b className="block font-display text-[1.3rem] font-semibold">
                {tr('heading')}
              </b>
              <span className="text-[12px] text-cream/[0.78]">{t('formNote')}</span>
            </div>
            <div className="p-5">
              <RfqForm />
            </div>
          </div>
        </section>

        <StatBand items={t.raw('stats')} />

        <section className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
          <h2 className="font-display text-[clamp(1.25rem,5vw,1.4rem)] font-semibold tracking-tight">
            {t('glance.title')}
          </h2>
          <div className="mt-4">
            <SpecTable head={t.raw('glance.head')} rows={t.raw('glance.rows')} />
          </div>
          {/* Contract terms belong under the table that shows the formats, so a
              buyer reads the packaging and the minimum order in one glance. */}
          <p className="mt-3 max-w-[70ch] text-[13px] leading-relaxed text-ink-soft">
            {t('glance.note')}
          </p>
        </section>

        <section className="bg-sand">
          <div className="mx-auto max-w-6xl px-6 py-10 text-center lg:px-8">
            <h2 className="font-display text-[clamp(1.3rem,5.4vw,1.5rem)] font-semibold tracking-tight">
              {t('finalTitle')}
            </h2>
            {/* Paid traffic lands on this page with the form already beside the
                headline, so the closing pair is for the visitor who scrolled
                past it: a chat first, the contact page behind it. */}
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <WhatsAppCta
                message={tc('whatsappMessage')}
                className={cn(buttonVariants({variant: 'wa'}))}
              >
                {tc('whatsapp')}
              </WhatsAppCta>
              <Link href="/contact" className={cn(buttonVariants({variant: 'outline'}))}>
                {tc('contactTeam')}
              </Link>
            </div>
            {/*
              This landing page runs without the shared footer, so the phone and
              e-mail are spelled out here — otherwise it would be the one page on
              the site that shows neither. `dir="ltr"` keeps the leading `+` in
              place on the Arabic page.
            */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[14px]">
              <a
                href={contact.phoneHref}
                aria-label={`${tc('phone')}: ${contact.phone}`}
                className="inline-flex min-h-11 items-center gap-2 font-semibold text-ink transition-colors hover:text-sweet-deep"
              >
                <Phone className="h-4 w-4 text-sweet-deep" aria-hidden />
                <span dir="ltr">{contact.phone}</span>
              </a>
              <a
                href={contact.emailHref}
                aria-label={`${tc('email')}: ${contact.email}`}
                className="inline-flex min-h-11 items-center gap-2 font-semibold text-ink transition-colors hover:text-sweet-deep"
              >
                <Mail className="h-4 w-4 text-sweet-deep" aria-hidden />
                <span dir="ltr" className="break-all">
                  {contact.email}
                </span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="px-6 py-5 text-center font-mono text-[12px] text-ink-soft">
        {t('footerNote')}
      </footer>
    </>
  );
}
