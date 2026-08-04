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
  return pageMetadata("privacy", locale);
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");

  const sections = t.raw("privacy.sections") as {
    title: string;
    body: string;
  }[];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: "Home", path: "/" },
          { name: t("privacy.title"), path: "/privacy" },
        ])}
      />
      <LegalDoc
        eyebrow={t("privacy.title")}
        title={t("privacy.title")}
        updated={t("updated")}
        intro={t("privacy.intro")}
        sections={sections}
        contactHeading={t("contactHeading")}
      />
    </>
  );
}
