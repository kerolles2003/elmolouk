import type {MetadataRoute} from 'next';
import {siteConfig} from '@/lib/site';

/**
 * Served at `/manifest.webmanifest` and linked from the root layout.
 *
 * `start_url` carries a locale because every route on this site does — there is
 * no unprefixed `/`, and `localePrefix: 'always'` would bounce an installed app
 * through a redirect on every cold start. English is the default locale, so
 * that is where an installed icon lands.
 *
 * Two icon purposes, not one. Android crops a plain icon to its own mask and
 * would take a bite out of the crown; the `maskable` pair carries the same
 * emblem inset inside the guaranteed-safe middle 80% on an opaque cream ground,
 * and Android picks whichever it needs.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — ${siteConfig.businessType}`,
    short_name: siteConfig.shortName,
    description:
      'Bulk Egyptian orange-fleshed sweet potatoes for European importers — Beauregard and Bellevue, Class I, cured and cold-chain monitored.',
    id: '/',
    start_url: '/en',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    lang: 'en',
    dir: 'ltr',
    categories: ['business', 'food', 'shopping'],
    theme_color: siteConfig.themeColor,
    background_color: siteConfig.backgroundColor,
    icons: [
      {src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any'},
      {src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any'},
      {
        src: '/icons/icon-maskable-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
