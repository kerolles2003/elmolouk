import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {routing, type Locale} from '@/i18n/routing';
import {siteConfig, OG_CARDS, type OgCard} from '@/lib/site';

/**
 * Every route on the site, in one table.
 *
 * Metadata in the App Router merges *shallowly*: a page that defines
 * `openGraph` replaces the layout's `openGraph` wholesale rather than adding to
 * it. Written out by hand per page that guarantees drift — one page keeps its
 * `og:image`, the next silently loses it. So no page writes an Open Graph or
 * Twitter block of its own; they all call `pageMetadata()`, and this table is
 * the only place a route's SEO identity is described.
 */
export const PAGES = {
  home: {path: '/', card: 'default'},
  sweetPotatoes: {path: '/sweet-potatoes', card: 'product'},
  quality: {path: '/quality', card: 'quality'},
  contact: {path: '/contact', card: 'default'},
  /** Google-Ads landing page: paid traffic only, deliberately out of the index. */
  rfq: {path: '/rfq', card: 'default', noindex: true},
} as const satisfies Record<string, {path: string; card: OgCard; noindex?: boolean}>;

export type PageKey = keyof typeof PAGES;

/** The pages that belong in the sitemap — everything the crawler may index. */
export const INDEXABLE = (Object.keys(PAGES) as PageKey[]).filter(
  (k) => !('noindex' in PAGES[k]),
);

/**
 * `og:locale` takes `language_TERRITORY`, not the bare subtag used for routing
 * and `hreflang`. The territories are the ones these markets actually are:
 * Arabic is Egypt's, because the company is Egyptian and writing to Egyptian
 * readers, and English is Britain's, because the buyers are European and the
 * copy is metric throughout.
 */
const OG_LOCALE: Record<Locale, string> = {
  en: 'en_GB',
  ar: 'ar_EG',
  de: 'de_DE',
  nl: 'nl_NL',
  fr: 'fr_FR',
  es: 'es_ES',
  pt: 'pt_PT',
};

/** `/quality` → `https://elmolouk.com/de/quality`, with `/` collapsing cleanly. */
export function absoluteUrl(locale: string, path: string) {
  return `${siteConfig.domain}/${locale}${path === '/' ? '' : path}`;
}

/** Build canonical + hreflang alternates (incl. x-default) for a page path. */
export function alternates(locale: string, path: string) {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = absoluteUrl(l, path);
  }
  // x-default is where a crawler sends a reader it has no better match for.
  languages['x-default'] = absoluteUrl(routing.defaultLocale, path);
  return {canonical: absoluteUrl(locale, path), languages};
}

/**
 * The complete metadata for one route in one language.
 *
 * Titles, descriptions, keywords and image alt text all come out of the locale
 * dictionary, so a German share card is German down to the alt text on its
 * photograph. Everything that is a fact about the company rather than a piece
 * of prose — names, URLs, image dimensions — comes from `siteConfig`.
 */
export async function pageMetadata(page: PageKey, locale: string): Promise<Metadata> {
  const t = await getTranslations({locale, namespace: 'metadata'});
  const entry: {path: string; card: OgCard; noindex?: boolean} = PAGES[page];
  const noindex = entry.noindex === true;

  const title = t(`${page}.title`);
  const description = t(`${page}.description`);
  const card = OG_CARDS[entry.card];
  const alt = t(`ogAlt.${entry.card}`);
  const url = absoluteUrl(locale, entry.path);

  /*
    The document title of every page but the home page runs through the
    localised `%s · El Molouk` template. A share card carries no <title>, so
    left as the bare page title, og:title would put a card reading "Contact"
    into a feed with no company attached to it. Applying the same template by
    hand keeps the card and the tab saying the same thing — and keeps the home
    page, whose title already names the company's trade and crop, from being
    made longer still.
  */
  const socialTitle = page === 'home' ? title : t('titleTemplate').replace('%s', title);

  return {
    /*
      The home title already runs 71 characters and names the trade, the crop
      and the market. Through the template it reaches 85, and the twelve
      characters a search result would drop first are exactly the brand the
      suffix was added to show. `absolute` opts it out; the brand still reaches
      the result page through `WebSite.name` in the structured data, which is
      what Google reads for the site name above a listing.
    */
    title: page === 'home' ? {absolute: title} : title,
    description,
    // Deliberately absent on /rfq: keywords on a noindex page are read by
    // nothing, and the page exists to convert ad clicks, not to rank.
    ...(noindex ? {} : {keywords: t.raw(`${page}.keywords`) as string[]}),
    alternates: alternates(locale, entry.path),
    openGraph: {
      type: 'website',
      siteName: siteConfig.name,
      title: socialTitle,
      description,
      url,
      locale: OG_LOCALE[locale as Locale],
      // Every other language this exact page exists in, so a scraper can offer
      // the reader their own.
      alternateLocale: routing.locales
        .filter((l) => l !== locale)
        .map((l) => OG_LOCALE[l]),
      images: [
        {url: card.url, width: card.width, height: card.height, type: card.type, alt},
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: [{url: card.url, alt}],
    },
    robots: noindex
      ? {index: false, follow: false, nocache: true, googleBot: {index: false, follow: false}}
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            // Without these Google caps the snippet and shows a thumbnail
            // rather than the share card, which is the point of the card.
            'max-snippet': -1,
            'max-image-preview': 'large',
            'max-video-preview': -1,
          },
        },
  };
}
