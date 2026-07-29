import {getRequestConfig} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {routing} from './routing';
import en from '../messages/en.json';

type Dict = Record<string, unknown>;

/**
 * Deep-merge a locale dictionary over the English base so that any key not yet
 * translated falls back to English. This lets all six locales route and render
 * today without inventing foreign copy — human translations drop in later.
 */
function deepMerge(base: Dict, override: Dict): Dict {
  const out: Dict = {...base};
  for (const key of Object.keys(override)) {
    const value = override[key];
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      out[key] = deepMerge((base[key] as Dict) ?? {}, value as Dict);
    } else if (value !== undefined && value !== '') {
      out[key] = value;
    }
  }
  return out;
}

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  let messages = en as Dict;
  if (locale !== 'en') {
    try {
      const localeMessages = (await import(`../messages/${locale}.json`)).default as Dict;
      messages = deepMerge(en as Dict, localeMessages);
    } catch {
      messages = en as Dict;
    }
  }

  return {locale, messages};
});
