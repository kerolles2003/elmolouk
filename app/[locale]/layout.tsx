import type {Metadata, Viewport} from 'next';
import {Plus_Jakarta_Sans, Cairo} from 'next/font/google';
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {setRequestLocale, getTranslations, getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing, isRtlLocale} from '@/i18n/routing';
import {siteConfig} from '@/lib/site';
import {JsonLd} from '@/components/JsonLd';
import {organizationJsonLd, websiteJsonLd} from '@/lib/jsonld';
import {MotionProvider} from '@/components/motion/MotionProvider';
import '../globals.css';

/**
 * Reveals are rendered hidden in the server HTML so the page never flashes its
 * final state before hydration. Without JavaScript nothing would ever reveal
 * them, so when scripting is off this hands every one of them straight back.
 */
const NO_JS_FALLBACK = '[data-motion]{opacity:1!important;transform:none!important}';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});
const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-cairo',
  display: 'swap',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

/**
 * Mobile browser chrome takes its colour from here, so the address bar blends
 * into the cream page instead of capping it with a white band. `viewportFit`
 * lets the sticky bar reach into the home-indicator area, which it then pads
 * back out with `env(safe-area-inset-bottom)`.
 *
 * One theme colour, not a light/dark pair: the site declares `colorScheme:
 * 'light'` and has no dark surface to match, so offering a dark chrome colour
 * would tint the address bar to a page that never appears beneath it.
 */
export const viewport: Viewport = {
  themeColor: siteConfig.themeColor,
  colorScheme: 'light',
  viewportFit: 'cover',
};

/**
 * Everything true of the whole site in this language. Per-page titles,
 * descriptions, keywords, canonicals and share cards are built by
 * `pageMetadata()` — a page defining `openGraph` replaces this one wholesale
 * (App Router metadata merges shallowly), so nothing here may be the only place
 * a social tag is set.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'metadata'});

  return {
    metadataBase: new URL(siteConfig.domain),
    title: {default: t('home.title'), template: t('titleTemplate')},
    description: t('home.description'),
    applicationName: siteConfig.shortName,
    // The company is the author of its own catalogue; there is no by-line to
    // credit, so all three point at the registered entity rather than inventing
    // an agency or a person.
    authors: [{name: siteConfig.legalName, url: siteConfig.domain}],
    creator: siteConfig.legalName,
    publisher: siteConfig.legalName,
    category: siteConfig.category,
    /*
      Egyptian phone numbers and the metric weights in the spec tables both get
      caught by iOS auto-detection, which wraps them in blue tap targets the
      design never accounted for. The real telephone link is explicit in the
      footer and on the contact page, so nothing is lost by turning the guessing
      off.
    */
    formatDetection: {telephone: false, date: false, address: false, email: false},
    manifest: '/manifest.webmanifest',
    /*
      `app/favicon.ico` is picked up by the file convention and needs no entry
      here. These are the sizes a .ico cannot serve well: the PNGs an Android
      home screen and a Retina tab want, and the opaque touch icon iOS composites
      onto a home screen without honouring alpha. All are generated from the
      same lockup by `scripts/generate-brand-assets.mjs`.

      No `mask-icon`: Safari's pinned-tab mask takes a single-path monochrome
      SVG, the source lockup is a raster with a gold gradient and green leaves,
      and hand-tracing the client's crown would be drawing new brand artwork.
      Safari 12 and later fall back to these icons anyway.
    */
    icons: {
      icon: [
        {url: '/icons/icon-16.png', sizes: '16x16', type: 'image/png'},
        {url: '/icons/icon-32.png', sizes: '32x32', type: 'image/png'},
        {url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png'},
        {url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png'},
      ],
      shortcut: ['/favicon.ico'],
      apple: [{url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png'}],
    },
    appleWebApp: {
      capable: true,
      title: siteConfig.shortName,
      // Cream chrome with dark text — 'black-translucent' would run the page
      // under the status bar, which this layout does not pad for.
      statusBarStyle: 'default',
    },
    other: {
      // Next emits the modern `mobile-web-app-capable` from `appleWebApp`;
      // iOS still reads the prefixed name, so both ship.
      'apple-mobile-web-app-capable': 'yes',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const rtl = isRtlLocale(locale);
  // Load only the font the locale needs.
  const fontVariable = rtl ? cairo.variable : jakarta.variable;

  const messages = await getMessages();
  const clientMessages = {
    nav: messages.nav,
    common: messages.common,
    rfqForm: messages.rfqForm,
  };

  return (
    <html lang={locale} dir={rtl ? 'rtl' : 'ltr'} className={fontVariable}>
      {/* Browser extensions (e.g. ClickUp) inject classes on <body> before hydration. */}
      <body
        className="flex min-h-dvh flex-col bg-cream font-sans text-ink antialiased"
        suppressHydrationWarning
      >
        <noscript>
          <style>{NO_JS_FALLBACK}</style>
        </noscript>
        {/*
          Who the company is and what the site is, on every route in every
          locale — including /rfq, which sits outside the (site) group and used
          to describe nobody. Both nodes are keyed by a locale-independent
          `@id`, so seven translations resolve to one company rather than seven.
        */}
        <JsonLd data={organizationJsonLd(locale)} />
        <JsonLd data={websiteJsonLd(locale)} />
        <NextIntlClientProvider messages={clientMessages}>
          <MotionProvider>{children}</MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
