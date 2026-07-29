import {setRequestLocale} from 'next-intl/server';

/** Stripped layout for the Google-Ads landing page — no shared nav or footer. */
export default async function LandingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  return <div className="flex flex-1 flex-col">{children}</div>;
}
