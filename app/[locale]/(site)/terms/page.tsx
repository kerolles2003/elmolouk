import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LegalDoc } from "@/components/sections/LegalDoc";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata("terms", locale);
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");

  const sections = t.raw("terms.sections") as {
    title: string;
    body: string;
  }[];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: "Home", path: "/" },
          { name: t("terms.title"), path: "/terms" },
        ])}
      />
      <LegalDoc
        eyebrow={t("terms.title")}
        title={t("terms.title")}
        updated={t("updated")}
        intro={t("terms.intro")}
        sections={sections}
        contactHeading={t("contactHeading")}
      />
    </>
  );
}
