import type {MetadataRoute} from 'next';
import {routing} from '@/i18n/routing';
import {siteConfig} from '@/lib/site';
import {PAGES} from '@/lib/seo';

/**
 * `/rfq` is a Google-Ads landing page and carries `noindex` in its own
 * metadata. That is the directive that actually keeps it out of the index — a
 * `Disallow` alone would not, because a disallowed page can still be indexed
 * from an inbound link precisely by virtue of the crawler never being let in to
 * read the `noindex`.
 *
 * The rule below is therefore about crawl budget, not indexing: it asks
 * crawlers not to keep re-fetching a page that exists to receive paid clicks,
 * while `noindex` does the removing. Listed per locale, because
 * `localePrefix: 'always'` gives the page seven URLs and a bare `/rfq` matches
 * none of them.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: routing.locales.map((l) => `/${l}${PAGES.rfq.path}`),
    },
    sitemap: `${siteConfig.domain}/sitemap.xml`,
    host: siteConfig.domain,
  };
}
