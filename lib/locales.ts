import {routing, type Locale} from '@/i18n/routing';

export type LocaleMeta = {
  code: Locale;
  /** Endonym — the language's own name, in its own script. */
  native: string;
  /** English exonym, shown as a quiet secondary hint for international buyers. */
  english: string;
  /** Direction of the label itself, which is not the direction of the page. */
  dir: 'ltr' | 'rtl';
};

const META: Record<Locale, Omit<LocaleMeta, 'code'>> = {
  en: {native: 'English', english: 'English', dir: 'ltr'},
  ar: {native: 'العربية', english: 'Arabic', dir: 'rtl'},
  de: {native: 'Deutsch', english: 'German', dir: 'ltr'},
  nl: {native: 'Nederlands', english: 'Dutch', dir: 'ltr'},
  fr: {native: 'Français', english: 'French', dir: 'ltr'},
  es: {native: 'Español', english: 'Spanish', dir: 'ltr'},
  pt: {native: 'Português', english: 'Portuguese', dir: 'ltr'},
};

/**
 * Single source of truth for how a locale is presented to a human. Derived from
 * `routing.locales`, so adding a locale there surfaces it in the switcher and
 * the footer without touching either component.
 */
export const LOCALES: LocaleMeta[] = routing.locales.map((code) => ({
  code,
  ...META[code],
}));
