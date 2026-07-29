import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

// NOTE: `\\.` is required — a single `\.` inside a JS string literal collapses to
// `.`, which turns the exclusion into `.*..*` and matches every path with at
// least one character, so the proxy would only ever run on `/`.
export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
