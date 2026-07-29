import {defineRouting} from 'next-intl/routing';

// Seven launch locales: English + Arabic (RTL) plus five European markets, each
// with a full translated dictionary. Subdirectory routing (`/de/...`).
// `pt` is European Portuguese (pt-PT).
export const routing = defineRouting({
  locales: ['en', 'ar', 'de', 'nl', 'fr', 'es', 'pt'],
  defaultLocale: 'en',
  localePrefix: 'always',
});

export type Locale = (typeof routing.locales)[number];

export const RTL_LOCALES = ['ar'];
export const isRtlLocale = (locale: string) => RTL_LOCALES.includes(locale);
