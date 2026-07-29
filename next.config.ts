import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  // Frontend-only. No backend, DB, CMS or auth (per scope).
  // Images are rendered as in-app placeholder surfaces until real assets are provided.
  poweredByHeader: false,
};

export default withNextIntl(nextConfig);
