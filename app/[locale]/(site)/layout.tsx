import {setRequestLocale, getTranslations} from 'next-intl/server';
import {Header} from '@/components/layout/Header';
import {Footer} from '@/components/layout/Footer';
import {MobileBar} from '@/components/layout/MobileBar';

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('nav');

  return (
    <>
      <a
        href="#main"
        className="sr-only-focusable absolute start-4 top-3 z-50 rounded-md bg-sweet-deep px-3 py-2 text-sm font-semibold text-white"
      >
        {t('skipToContent')}
      </a>
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <MobileBar />
    </>
  );
}
