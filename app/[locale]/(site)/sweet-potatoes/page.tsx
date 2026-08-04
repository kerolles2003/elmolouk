import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ArrowRight,
  BadgeCheck,
  Container,
  FileText,
  MessageCircle,
  Package,
  Ruler,
  Scale,
  Snowflake,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/Eyebrow";
import { Photo } from "@/components/Photo";
import { Wave } from "@/components/Wave";
import { SpecTable } from "@/components/sections/SpecTable";
import { PackagingGrid } from "@/components/sections/PackagingGrid";
import { FactGrid } from "@/components/sections/FactGrid";
import { Faq } from "@/components/sections/Faq";
import { CertRow } from "@/components/sections/CertRow";
import { SeasonCalendar } from "@/components/sections/SeasonCalendar";
import { RfqForm } from "@/components/sections/RfqForm";
import {
  Reveal,
  RevealGroup,
  RevealItem,
  RevealMedia,
} from "@/components/motion/Reveal";
import { RISE, STAGGER } from "@/components/motion/config";
import { JsonLd } from "@/components/JsonLd";
import { productJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { siteConfig } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

const IMG = {
  field: "/images/land.webp",
  flesh: "/images/Beauregard.webp",
  bellevue: "/images/Bellevue.webp",
  /** Lifted roots still in the soil. */
  roots: "/images/products.webp",
  /** Graded roots off the sorting bench. */
  basket: "/images/basket.jpg",
  /** The grading and packing floor, stacked with export cartons. */
  packhouse: "/images/factory.webp",
} as const;

/** Grade · export packing · minimum order · cold chain, in `hero.highlights` order. */
const HIGHLIGHT_ICONS = [BadgeCheck, Package, Scale, Snowflake];

/** The journey the gallery walks, field to packing floor. */
const GALLERY_SHOTS = [IMG.field, IMG.roots, IMG.basket, IMG.packhouse];

/** The section heading used by every band, so the scale never drifts. */
const H2 =
  "mt-4 text-[clamp(25px,6.8vw,30px)] font-extrabold tracking-tight lg:text-[40px]";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata("sweetPotatoes", locale);
}

export default async function SweetPotatoesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("product");
  const tc = await getTranslations("common");
  const tr = await getTranslations("rfqForm");

  const highlights = t.raw("hero.highlights") as {
    label: string;
    value: string;
  }[];
  const certs = t.raw("certifications.items") as string[];
  const varietyHead = t.raw("varieties.head") as string[];
  const varietyRows = t.raw("varieties.rows") as string[][];
  const varietyShots = [IMG.flesh, IMG.bellevue];
  /*
    Four frames in the order the crop moves: field, harvest, sorting, packing.
    Every shot here has to be the crop or the place it is handled — the wider
    farm stock in /public/images is a corn harvester and a mixed-vegetable
    market stall, neither of which belongs on an export spec page.
    [[confirm: swap all four for El Molouk's own photography]]
  */
  const gallerySteps = t.raw("gallery.steps") as {
    caption: string;
    alt: string;
  }[];

  return (
    <>
      <JsonLd data={productJsonLd(locale)} />
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: "Home", path: "/" },
          { name: t("breadcrumb"), path: "/sweet-potatoes" },
        ])}
      />

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-28 end-[-8%] h-[440px] w-[440px] rounded-full bg-amber/25 blur-3xl"
        />
        <nav
          aria-label="Breadcrumb"
          className="relative mx-auto max-w-7xl px-6 pt-6 text-[13px] text-ink-soft lg:px-10"
        >
          <Link
            href="/"
            className="transition-colors duration-200 hover:text-sweet-deep"
          >
            {siteConfig.name}
          </Link>
          <span aria-hidden className="px-2 text-ink-soft/40">
            /
          </span>
          <span className="font-semibold text-ink">{t("breadcrumb")}</span>
        </nav>

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 pb-8 pt-6 lg:grid-cols-2 lg:gap-14 lg:px-10 lg:pb-16 lg:pt-10">
          {/*
            Same orchestrated arrival as the home hero — kicker, title, lead,
            buttons and the export figures land as one phrase, with the macro
            overlapping the middle of it. Everything below this point waits for
            the scroll.
          */}
          <RevealGroup on="mount" stagger={STAGGER.base} delay={0.05}>
            <RevealItem as="span" className="inline-flex">
              <Eyebrow>{t("hero.kicker")}</Eyebrow>
            </RevealItem>
            <RevealItem
              as="h1"
              className="mt-5 max-w-[17ch] text-balance text-[clamp(30px,8.4vw,38px)] font-extrabold leading-[1.05] tracking-tight lg:text-[54px]"
            >
              {t("hero.title")}
            </RevealItem>
            <RevealItem
              as="p"
              className="mt-5 max-w-[50ch] text-[16.5px] leading-relaxed text-ink-soft"
            >
              {t("hero.sub")}
            </RevealItem>
            <RevealItem
              className="mt-7 flex flex-wrap gap-3"
              stagger={STAGGER.tight}
            >
              <RevealItem as="span" className="inline-flex">
                <Link
                  href="/contact"
                  className={cn(buttonVariants({ size: "lg" }))}
                >
                  {tc("requestQuote")}
                  <ArrowRight
                    className="h-4 w-4 rtl:-scale-x-100"
                    aria-hidden
                  />
                </Link>
              </RevealItem>
              <RevealItem as="span" className="inline-flex">
                <a
                  href={siteConfig.whatsapp}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                  )}
                >
                  <MessageCircle className="h-5 w-5" aria-hidden />
                  {tc("whatsapp")}
                </a>
              </RevealItem>
            </RevealItem>
            {/*
              The spec sheet is written but not yet a file, so it is set as a
              plain line rather than a third button: a pill that cannot be
              pressed reads as a broken download.
              [[confirm: link the PDF and promote this to a button]]
            */}
            <RevealItem
              as="p"
              className="mt-4 inline-flex items-center gap-2 text-[13.5px] font-semibold text-ink-soft"
            >
              <FileText className="h-4 w-4 text-sweet-deep" aria-hidden />
              {t("downloadSpec")}
            </RevealItem>
            <RevealItem
              className="mt-8 grid max-w-md grid-cols-2 gap-3"
              stagger={STAGGER.tight}
            >
              {highlights.map((h, i) => {
                const Icon = HIGHLIGHT_ICONS[i] ?? BadgeCheck;
                return (
                  <RevealItem
                    key={h.label}
                    className="min-w-0 rounded-2xl border border-line bg-card px-4 py-3.5 transition-colors duration-300 ease-expo hover:border-sweet/40"
                  >
                    <Icon className="h-5 w-5 text-sweet-deep" aria-hidden />
                    <div className="mt-2 text-[12.5px] text-ink-soft">
                      {h.label}
                    </div>
                    <div className="text-[15px] font-bold">{h.value}</div>
                  </RevealItem>
                );
              })}
            </RevealItem>
          </RevealGroup>

          <div className="relative">
            <RevealMedia on="mount" delay={0.08}>
              <Photo
                src={IMG.flesh}
                alt={t("hero.imageAlt")}
                priority
                sizes="(max-width: 1024px) 100vw, 46vw"
                className="aspect-[4/5] rounded-[28px] shadow-lift lg:aspect-[5/5.6]"
              />
            </RevealMedia>
            <RevealMedia
              on="mount"
              delay={0.3}
              className="absolute -bottom-6 start-4 hidden w-40 rotate-[-5deg] overflow-hidden rounded-3xl border-[5px] border-cream shadow-card sm:block"
            >
              <Photo
                src={IMG.roots}
                alt={t("gallery.alt")}
                className="aspect-square"
              />
            </RevealMedia>
            <Reveal
              on="mount"
              delay={0.38}
              className="absolute end-4 top-6 flex items-center gap-2 rounded-2xl bg-card/95 px-4 py-2.5 shadow-card backdrop-blur"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-leaf" aria-hidden />
              <span className="text-[13px] font-bold text-ink">
                {t("hero.availability")}
              </span>
            </Reveal>
          </div>
        </div>

        {/* Certifications before specifications: the claim a buyer checks first. */}
        <div className="border-y border-line bg-sand/60">
          <CertRow
            label={t("certifications.title")}
            items={certs}
            note={t("certifications.note")}
          />
        </div>
      </section>

      {/* ============ VARIETIES ============ */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <Reveal className="max-w-[46ch]">
          <Eyebrow>{t("eyebrow.varieties")}</Eyebrow>
          <h2 className={H2}>{t("varieties.title")}</h2>
          <p className="mt-3 text-[16px] text-ink-soft">
            {t("varieties.lead")}
          </p>
        </Reveal>
        {/*
          The rows of a four-column table, opened out into cards. With a handful
          of varieties the comparison is easier side by side than line by line,
          and it is the one place on the page where the crop can be shown at
          the size it deserves.
        */}
        <RevealGroup className="mt-10 grid max-w-5xl gap-6 sm:grid-cols-2">
          {varietyRows.map((row, i) => (
            <RevealItem
              key={row[0]}
              as="article"
              distance={RISE.card}
              lift
              className="group overflow-hidden rounded-3xl border border-line bg-card shadow-sm transition-[box-shadow,border-color] duration-300 ease-expo hover:border-sweet/40 hover:shadow-card"
            >
              <Photo
                src={varietyShots[i] ?? IMG.roots}
                alt={row[0]}
                sizes="(max-width: 640px) 100vw, 45vw"
                className="aspect-[16/10]"
                imgClassName="transition-transform duration-500 ease-expo group-hover:scale-[1.04]"
              />
              <div className="p-6 lg:p-7">
                <h3 className="text-[22px] font-bold">{row[0]}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-ink-soft">
                  {row[3]}
                </p>
                <dl className="mt-5 flex flex-wrap gap-x-10 gap-y-3 border-t border-line pt-4 text-[13.5px]">
                  {[1, 2].map((c) => (
                    <div key={c}>
                      <dt className="text-ink-soft">{varietyHead[c]}</dt>
                      <dd className="font-bold">{row[c]}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* ============ CALIBRE & GRADING ============ */}
      <section className="bg-sand">
        <Wave fill="fill-cream" />
        <div className="mx-auto max-w-7xl px-6 pb-16 lg:px-10 lg:pb-24">
          <Reveal className="max-w-[48ch]">
            <Eyebrow>{t("eyebrow.calibre")}</Eyebrow>
            <h2 className={H2}>{t("calibre.title")}</h2>
            <p className="mt-3 text-[16px] text-ink-soft">
              {t("calibre.lead")}
            </p>
          </Reveal>
          {/*
            The calibre ladder used to print six grades from "S · < 150 g" to
            "G · 900–1500 g". None of it came from the client, and a size table
            is the one thing on this page a buyer will hold us to on arrival —
            so it is an open slot until the packhouse confirms the real bands.
            `CalibreLadder` stays in the codebase, ready for the day they do.
          */}
          <RevealMedia className="mt-10">
            <div className="rounded-3xl border border-dashed border-gold bg-card/60 p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-gold bg-gold/8 px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.1em] text-ink-soft rtl:tracking-normal">
                  <Ruler className="h-3.5 w-3.5" aria-hidden />
                  {tc("placeholderTag")}
                </span>
                <p className="text-[16px] font-bold">
                  {t("calibre.placeholder")}
                </p>
              </div>
              <p className="mt-3 max-w-[60ch] text-[14.5px] leading-relaxed text-ink-soft">
                {t("calibre.note")}
              </p>
              <Link
                href="/contact"
                className={cn(buttonVariants({ size: "sm" }), "mt-5")}
              >
                {t("calibre.cta")}
                <ArrowRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden />
              </Link>
            </div>
          </RevealMedia>
        </div>
      </section>

      {/* ============ PACKAGING & LOADING ============ */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <Reveal className="max-w-[46ch]">
          <Eyebrow>{t("eyebrow.packaging")}</Eyebrow>
          <h2 className={H2}>{t("packaging.title")}</h2>
          <p className="mt-3 text-[16px] text-ink-soft">
            {t("packaging.lead")}
          </p>
        </Reveal>
        <Reveal className="mt-10" delay={0.06}>
          <PackagingGrid items={t.raw("packaging.items")} />
        </Reveal>
        <Reveal className="mt-6" delay={0.1}>
          <p className="inline-flex items-center gap-2.5 rounded-full border border-line bg-sand px-4 py-2.5 text-[13.5px] font-semibold text-ink">
            <Scale className="h-4 w-4 shrink-0 text-sweet-deep" aria-hidden />
            {t("packaging.moq")}
          </p>
        </Reveal>

        <Reveal className="mt-14 lg:mt-20">
          <h3 className="text-[21px] font-bold lg:text-[26px]">
            {t("container.title")}
          </h3>
        </Reveal>
        <RevealMedia className="mt-5">
          <SpecTable
            head={t.raw("container.head")}
            rows={t.raw("container.rows")}
          />
        </RevealMedia>
        <Reveal className="mt-4" delay={0.06}>
          <p className="max-w-[62ch] text-[13px] leading-relaxed text-ink-soft/80">
            {t("container.note")}
          </p>
        </Reveal>
      </section>

      {/* ============ POST-HARVEST & COLD CHAIN ============ */}
      <section className="bg-soil text-cream">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:px-10 lg:py-24">
          <RevealMedia>
            <Photo
              src={IMG.basket}
              alt={t("gallery.alt")}
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="aspect-[5/4] rounded-[28px] shadow-lift"
            />
          </RevealMedia>
          <div>
            <Reveal>
              <Eyebrow tone="amber">{t("eyebrow.postHarvest")}</Eyebrow>
              <h2 className={H2}>{t("postHarvest.title")}</h2>
            </Reveal>
            <Reveal className="mt-8" delay={0.08}>
              <FactGrid
                items={t.raw("postHarvest.facts")}
                tone="dark"
                columns={2}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ SEASON ============ */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <Reveal className="max-w-[48ch]">
          <Eyebrow>{t("eyebrow.season")}</Eyebrow>
          <h2 className={H2}>{t("season.title")}</h2>
          <p className="mt-3 text-[16px] text-ink-soft">{t("season.lead")}</p>
        </Reveal>
        <RevealMedia className="mt-10">
          <SeasonCalendar
            locale={locale}
            peakLabel={t("season.peakLabel")}
            storeLabel={t("season.storeLabel")}
            note={t("season.note")}
          />
        </RevealMedia>
      </section>

      {/*
        The "Egypt vs USA vs Spain" band that stood here was deleted in the
        content audit. Ranking our origin against other countries is a claim
        about their crop as much as ours, and none of it was sourced.
      */}

      {/* ============ GALLERY ============ */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <Reveal className="max-w-[44ch]">
          <Eyebrow>{t("eyebrow.gallery")}</Eyebrow>
          <h2 className={H2}>{t("gallery.title")}</h2>
        </Reveal>
        {/*
          One aspect ratio for all four, captioned and in sequence: field,
          harvest, sorting, packing. A product page is a record, and a record
          keeps its frames the same size and in the order things happened.
        */}
        <RevealGroup
          as="ol"
          className="mt-10 grid grid-cols-2 gap-x-3 gap-y-5 sm:gap-x-4 lg:grid-cols-4"
          stagger={STAGGER.tight}
        >
          {gallerySteps.map((step, i) => (
            <RevealItem as="li" key={step.caption} className="group">
              <Photo
                src={GALLERY_SHOTS[i]}
                alt={step.alt}
                sizes="(max-width: 768px) 50vw, 25vw"
                className="aspect-[4/3] overflow-hidden rounded-2xl shadow-sm"
                imgClassName="transition-transform duration-500 ease-expo group-hover:scale-[1.05]"
              />
              <span className="mt-2.5 block text-[11.5px] font-bold uppercase tracking-[0.1em] text-ink-soft rtl:tracking-normal">
                {step.caption}
              </span>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* ============ FAQ ============ */}
      <section className="bg-sand">
        <Wave fill="fill-cream" />
        <div className="mx-auto max-w-3xl px-6 pb-16 lg:pb-24">
          <Reveal className="text-center">
            <Eyebrow>{t("eyebrow.faq")}</Eyebrow>
            <h2 className={H2}>{t("faq.title")}</h2>
          </Reveal>
          <Reveal className="mt-8" delay={0.08}>
            <Faq items={t.raw("faq.items")} />
          </Reveal>
        </div>
      </section>

      {/* ============ RFQ ============ */}
      <section className="px-6 py-16 lg:py-24">
        <RevealMedia className="relative mx-auto max-w-6xl overflow-hidden rounded-[28px] bg-gradient-to-br from-sweet to-sweet-deep p-5 text-white shadow-lift sm:rounded-[36px] sm:p-8 lg:p-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -end-16 -top-16 h-64 w-64 rounded-full bg-white/10"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-20 -start-10 h-64 w-64 rounded-full bg-black/10"
          />
          <div className="relative grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-14">
            <RevealGroup stagger={STAGGER.tight} delay={0.12}>
              <RevealItem
                as="h2"
                className="max-w-[18ch] text-balance text-[clamp(25px,6.8vw,30px)] font-extrabold tracking-tight lg:text-[40px]"
              >
                {tr("heading")}
              </RevealItem>
              <RevealItem
                as="p"
                className="mt-4 max-w-[46ch] text-[16px] text-white/90"
              >
                {tr("sub")}
              </RevealItem>
              {/* The reply time is already in the standfirst above, so this
                  line carries what the standfirst does not: the audits. */}
              <RevealItem
                as="ul"
                className="mt-7 grid gap-3 text-[14.5px]"
                stagger={STAGGER.tight}
              >
                <RevealItem as="li" className="flex items-center gap-2.5">
                  <BadgeCheck
                    className="h-5 w-5 shrink-0 text-white/80"
                    aria-hidden
                  />
                  {certs.slice(0, 3).join(" · ")}
                </RevealItem>
                <RevealItem as="li" className="flex items-center gap-2.5">
                  <Container
                    className="h-5 w-5 shrink-0 text-white/80"
                    aria-hidden
                  />
                  {highlights[2].label} — {highlights[2].value}
                </RevealItem>
              </RevealItem>
              <RevealItem as="span" className="mt-7 inline-flex">
                <a
                  href={siteConfig.whatsapp}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white/15 px-6 py-3 font-bold text-white ring-1 ring-white/40 transition-colors duration-200 hover:bg-white/25"
                >
                  <MessageCircle className="h-5 w-5" aria-hidden />
                  {tc("whatsapp")}
                </a>
              </RevealItem>
            </RevealGroup>
            <Reveal
              delay={0.16}
              className="rounded-[22px] bg-card p-5 text-ink shadow-lift sm:rounded-[26px] sm:p-7"
            >
              <RfqForm />
            </Reveal>
          </div>
        </RevealMedia>
      </section>
    </>
  );
}
