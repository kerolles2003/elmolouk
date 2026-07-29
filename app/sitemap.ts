import type {MetadataRoute} from 'next';
import {routing} from '@/i18n/routing';
import {PAGES, INDEXABLE, absoluteUrl} from '@/lib/seo';

/**
 * One entry per page per locale, each listing every translation of itself.
 *
 * Derived from `PAGES` rather than a second list of paths: the old hand-kept
 * array had to be edited in step with the routes, and the failure mode of
 * forgetting — a page that quietly never gets crawled — leaves no trace in the
 * build. `INDEXABLE` drops `/rfq` by reading the same `noindex` flag the page's
 * own metadata is built from, so the sitemap and the robots directive cannot
 * disagree about which pages are public.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const page of INDEXABLE) {
    const {path} = PAGES[page];

    const languages: Record<string, string> = {};
    for (const l of routing.locales) {
      languages[l] = absoluteUrl(l, path);
    }
    languages['x-default'] = absoluteUrl(routing.defaultLocale, path);

    for (const l of routing.locales) {
      entries.push({
        url: absoluteUrl(l, path),
        alternates: {languages},
        changeFrequency: 'monthly',
        priority: page === 'home' ? 1 : 0.8,
      });
    }
  }

  return entries;
}
