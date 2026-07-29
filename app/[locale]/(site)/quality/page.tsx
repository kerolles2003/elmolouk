import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  Container,
  FlaskConical,
  MessageCircle,
  Package,
  Ruler,
  ShieldCheck,
  Snowflake,
  Thermometer,
  TriangleAlert,
  Users,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { buttonVariants, textLinkClass } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/Eyebrow";
import { Photo } from "@/components/Photo";
import { Wave } from "@/components/Wave";
import { Faq } from "@/components/sections/Faq";
import {
  Reveal,
  RevealGroup,
  RevealItem,
  RevealMedia,
} from "@/components/motion/Reveal";
import { RISE, STAGGER } from "@/components/motion/config";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { siteConfig } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

/*
  The facility strip walks the same order as the rest of the site — fields,
  harvest, grading, packing. `packing.jpg` (a mixed-vegetable market stall) and
  `field.jpg` (a corn combine) were removed in the content audit: neither shows
  this business, and a grocery display on a page about export-only supply
  contradicts the copy beside it.
*/
const IMG = {
  hero: "/images/hero.jpg",
  flesh: "/images/Beauregard.webp",
  /** Lifted roots still in the soil. */
  roots: "/images/harvest.jpg",
  /** Graded roots off the inspection bench. */
  basket: "/images/basket.jpg",
  /** The grading and packing floor, stacked with export cartons. */
  packhouse: "/images/factory.webp",
} as const;

/** The frames this page can draw on. Dictionary `image` values must be one. */
type Shot = keyof typeof IMG;

const STANDARD_ICONS = [
  BadgeCheck,
  Ruler,
  FlaskConical,
  Snowflake,
  Package,
  Users,
];
const STORAGE_ICONS = [Thermometer, Snowflake, Container];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata("quality", locale);
}

export default async function QualityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("quality");
  const tc = await getTranslations("common");

  const highlights = t.raw("hero.highlights") as string[];
  const facts = t.raw("facts.items") as { label: string; value: string }[];
  const standards = t.raw("standards.items") as {
    title: string;
    desc: string;
  }[];
  const steps = t.raw("inspection.steps") as {
    name: string;
    desc: string;
    checks: string[];
  }[];
  const points = t.raw("safety.points") as string[];
  const storage = t.raw("safety.storage") as {
    title: string;
    value: string;
    note: string;
  }[];
  const certs = t.raw("certs.items") as {
    code: string;
    name: string;
    rows: string[][];
  }[];
  const facility = t.raw("facility.items") as {
    caption: string;
    desc: string;
    image: Shot;
  }[];
  const risks = t.raw("trust.items") as { risk: string; fix: string }[];
  const ctaPoints = t.raw("cta.points") as string[];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: "Home", path: "/" },
          { name: t("breadcrumb"), path: "/quality" },
        ])}
      />

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 end-[-10%] h-[420px] w-[420px] rounded-full bg-leaf/18 blur-3xl"
        />
        {/*
          Same orchestrated load as the home page, tuned to what this page is
          for: the proof points sit directly under the buttons rather than a
          pair of counters, because the promise here is verifiability.
        */}
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 pb-10 pt-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-10 lg:pb-16 lg:pt-14">
          <RevealGroup on="mount" stagger={STAGGER.base} delay={0.05}>
            <RevealItem
              as="span"
              className="inline-flex items-center gap-2 rounded-full bg-leaf/12 px-3.5 py-1.5 text-[13px] font-semibold text-leaf-deep"
            >
              <ShieldCheck className="h-4 w-4" aria-hidden />
              {t("hero.eyebrow")}
            </RevealItem>
            <RevealItem
              as="h1"
              className="mt-5 text-balance text-[clamp(30px,8.4vw,38px)] font-extrabold leading-[1.05] tracking-tight rtl:leading-[1.32] lg:text-[56px]"
            >
              {t("hero.title")}
            </RevealItem>
            <RevealItem
              as="p"
              className="mt-5 max-w-[50ch] text-[17px] leading-relaxed text-ink-soft"
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
                <Link
                  href="/sweet-potatoes"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                  )}
                >
                  {t("hero.ctaSecondary")}
                </Link>
              </RevealItem>
            </RevealItem>
            <RevealItem
              as="ul"
              className="mt-8 flex flex-wrap gap-x-6 gap-y-2.5"
              stagger={STAGGER.tight}
            >
              {highlights.map((h) => (
                <RevealItem
                  key={h}
                  as="li"
                  from="inline"
                  className="inline-flex items-center gap-2 text-[14px] font-semibold text-ink"
                >
                  <BadgeCheck
                    className="h-4 w-4 shrink-0 text-leaf"
                    aria-hidden
                  />
                  {h}
                </RevealItem>
              ))}
            </RevealItem>
          </RevealGroup>

          <div className="relative">
            <RevealMedia on="mount" delay={0.08}>
              <Photo
                src={IMG.roots}
                alt={t("hero.imageAlt")}
                priority
                sizes="(max-width: 1024px) 100vw, 46vw"
                className="aspect-[4/3] rounded-[28px] shadow-lift lg:aspect-[5/4.2]"
              />
            </RevealMedia>
            <RevealMedia
              on="mount"
              delay={0.3}
              className="absolute -bottom-6 start-4 hidden w-36 rotate-[-5deg] overflow-hidden rounded-3xl border-[5px] border-cream shadow-card sm:block"
            >
              <Photo
                src={IMG.basket}
                alt={t("hero.insetAlt")}
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
                {t("hero.badge")}
              </span>
            </Reveal>
          </div>
        </div>

        {/* evidence strip — the numbers a buyer's QA team asks for first */}
        <div className="border-y border-line bg-sand/60">
          <div className="mx-auto max-w-7xl px-6 py-6 lg:px-10">
            <RevealGroup
              className="grid gap-5 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-12"
              stagger={STAGGER.tight}
            >
              <RevealItem
                as="p"
                from="inline"
                className="text-[13px] font-semibold text-ink-soft"
              >
                {t("facts.label")}
              </RevealItem>
              <RevealItem
                className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4"
                stagger={STAGGER.tight}
              >
                {facts.map((f) => (
                  <RevealItem key={f.label} from="inline" className="min-w-0">
                    <span className="block text-[12.5px] text-ink-soft">
                      {f.label}
                    </span>
                    <span className="block text-[16px] font-extrabold tracking-tight text-sweet-deep">
                      {f.value}
                    </span>
                  </RevealItem>
                ))}
              </RevealItem>
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* ============ EXPORT STANDARDS ============ */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <Reveal className="max-w-[46ch]">
          <Eyebrow>{t("standards.eyebrow")}</Eyebrow>
          <h2 className="mt-4 text-[clamp(25px,6.8vw,30px)] font-extrabold leading-[1.15] tracking-tight rtl:leading-[1.45] lg:text-[40px]">
            {t("standards.title")}
          </h2>
          <p className="mt-3 text-[16px] text-ink-soft">{t("standards.sub")}</p>
        </Reveal>
        <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {standards.map((s, i) => {
            const Icon = STANDARD_ICONS[i] ?? BadgeCheck;
            return (
              <RevealItem
                key={s.title}
                distance={RISE.card}
                lift
                className="rounded-3xl border border-line bg-card p-6 transition-[box-shadow,border-color] duration-300 ease-expo hover:border-leaf/40 hover:shadow-card"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-leaf/12 text-leaf-deep">
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="mt-4 text-[18px] font-bold">{s.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
                  {s.desc}
                </p>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </section>

      {/* ============ INSPECTION ============ */}
      <section className="bg-sand">
        <Wave fill="fill-cream" />
        <div className="mx-auto max-w-7xl px-6 pb-16 lg:px-10 lg:pb-24">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-16">
            <div>
              {/*
                The heading stays alongside the rail on desktop. Six checkpoints
                run long, and a buyer scrolling the list should not lose the
                sentence that tells them what the list is proving.
              */}
              <Reveal className="lg:sticky lg:top-24">
                <Eyebrow>{t("inspection.eyebrow")}</Eyebrow>
                <h2 className="mt-4 text-balance text-[clamp(25px,6.8vw,30px)] font-extrabold leading-[1.15] tracking-tight rtl:leading-[1.45] lg:text-[40px]">
                  {t("inspection.title")}
                </h2>
                <p className="mt-3 max-w-[42ch] text-[16px] text-ink-soft">
                  {t("inspection.sub")}
                </p>
              </Reveal>
            </div>

            {/*
              A connected rail rather than a grid of cards: these six stages are
              an order of operations, and the line between the nodes is the part
              that says so. The stagger is the wide one for the same reason.
            */}
            <RevealGroup as="ol" stagger={STAGGER.wide}>
              {steps.map((s, i) => (
                <RevealItem
                  key={s.name}
                  as="li"
                  distance={RISE.card}
                  className="relative grid grid-cols-[2.75rem_1fr] gap-4 pb-5 last:pb-0 sm:gap-5"
                >
                  {i < steps.length - 1 && (
                    <span
                      aria-hidden
                      className="absolute bottom-0 start-[1.375rem] top-12 w-px bg-line"
                    />
                  )}
                  <span className="relative grid h-11 w-11 place-items-center rounded-full border border-sweet/25 bg-card text-[15px] font-extrabold text-sweet-deep">
                    {i + 1}
                  </span>
                  <div className="rounded-3xl border border-line bg-card p-5 transition-colors duration-300 ease-expo hover:border-sweet/40 sm:p-6">
                    <h3 className="text-[18px] font-bold">{s.name}</h3>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">
                      {s.desc}
                    </p>
                    <ul className="mt-4 grid gap-2 border-t border-line pt-4 sm:grid-cols-2">
                      {s.checks.map((c) => (
                        <li
                          key={c}
                          className="flex items-start gap-2 text-[13px] text-ink-soft"
                        >
                          <Check
                            className="mt-[3px] h-3.5 w-3.5 shrink-0 text-leaf"
                            aria-hidden
                          />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* ============ FOOD SAFETY ============ */}
      <section className="bg-soil text-cream">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <RevealMedia>
              <Photo
                src={IMG.flesh}
                alt={t("safety.imageAlt")}
                sizes="(max-width: 1024px) 100vw, 46vw"
                className="aspect-[5/4] rounded-[28px] shadow-lift"
              />
            </RevealMedia>

            <RevealGroup stagger={STAGGER.tight}>
              <RevealItem as="span" className="inline-flex">
                <Eyebrow tone="amber">{t("safety.eyebrow")}</Eyebrow>
              </RevealItem>
              <RevealItem
                as="h2"
                className="mt-4 text-[clamp(25px,6.8vw,30px)] font-extrabold leading-[1.15] tracking-tight rtl:leading-[1.45] lg:text-[40px]"
              >
                {t("safety.title")}
              </RevealItem>
              <RevealItem
                as="p"
                className="mt-4 text-[16px] leading-relaxed text-cream/80"
              >
                {t("safety.lead")}
              </RevealItem>
              <RevealItem
                as="ul"
                className="mt-6 grid gap-3"
                stagger={STAGGER.tight}
              >
                {points.map((p) => (
                  <RevealItem
                    key={p}
                    as="li"
                    from="inline"
                    className="flex items-start gap-3 text-[14.5px] leading-relaxed text-cream/85"
                  >
                    <Check
                      className="mt-1 h-4 w-4 shrink-0 text-amber"
                      aria-hidden
                    />
                    <span>{p}</span>
                  </RevealItem>
                ))}
              </RevealItem>
            </RevealGroup>
          </div>

          <Reveal className="mt-14 text-[12.5px] font-bold uppercase tracking-[0.1em] text-cream/60">
            {t("safety.storageTitle")}
          </Reveal>
          <RevealGroup
            className="mt-4 grid gap-4 sm:grid-cols-3"
            stagger={STAGGER.tight}
          >
            {storage.map((s, i) => {
              const Icon = STORAGE_ICONS[i] ?? Thermometer;
              return (
                <RevealItem
                  key={s.title}
                  distance={RISE.card}
                  lift
                  className="rounded-2xl bg-cream/10 p-5 transition-colors duration-300 ease-expo hover:bg-cream/15"
                >
                  <Icon className="h-6 w-6 text-amber" aria-hidden />
                  <div className="mt-3 text-[12.5px] text-cream/70">
                    {s.title}
                  </div>
                  <div className="text-[20px] font-extrabold tracking-tight">
                    {s.value}
                  </div>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-cream/70">
                    {s.note}
                  </p>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      {/* ============ CERTIFICATIONS ============ */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <Reveal className="max-w-[54ch]">
          <Eyebrow>{t("certs.eyebrow")}</Eyebrow>
          <h2 className="mt-4 text-[clamp(25px,6.8vw,30px)] font-extrabold leading-[1.15] tracking-tight rtl:leading-[1.45] lg:text-[40px]">
            {t("certs.title")}
          </h2>
          <p className="mt-3 text-[16px] text-ink-soft">{t("certs.lead")}</p>
        </Reveal>
        <RevealGroup className="mt-10 grid gap-5 md:grid-cols-2">
          {certs.map((c) => {
            /*
              The card labels itself while the values are still placeholders,
              and stops doing so on its own the moment real ones land — the
              status is derived from the data, never set by hand.
            */
            const pending = c.rows.every(([, value]) =>
              value.includes("[[confirm"),
            );
            return (
              <RevealItem
                key={c.code}
                as="article"
                distance={RISE.card}
                lift
                className="rounded-3xl border border-line bg-card p-6 shadow-sm transition-[box-shadow,border-color] duration-300 ease-expo hover:border-leaf/40 hover:shadow-card"
              >
                <div className="flex items-start gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-leaf/12 text-[15px] font-extrabold tracking-wide text-leaf-deep">
                    {c.code}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[18px] font-bold leading-snug">
                      {c.name}
                    </h3>
                    {pending && (
                      <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-sand px-2.5 py-1 text-[11.5px] font-semibold text-ink-soft">
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-gold"
                          aria-hidden
                        />
                        {t("certs.statusLabel")}
                      </span>
                    )}
                  </div>
                </div>
                <dl className="mt-5 grid gap-2 border-t border-line pt-4 text-[13.5px]">
                  {c.rows.map(([label, value], i) => (
                    <div
                      key={i}
                      className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1"
                    >
                      <dt className="text-ink-soft">{label}</dt>
                      <dd className="rounded-md bg-sand px-2 py-0.5 font-semibold text-ink-soft">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
                <Link
                  href="/contact"
                  className={cn(textLinkClass, "mt-5 min-h-11 text-[14px]")}
                >
                  {t("certs.request")}
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform duration-200 ease-expo group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              </RevealItem>
            );
          })}
        </RevealGroup>
        <Reveal as="p" className="mt-6 max-w-[70ch] text-[13px] text-ink-soft">
          {t("certs.note")}
        </Reveal>
      </section>

      {/* ============ FACILITY & OPERATIONS ============ */}
      <section className="bg-sand">
        <Wave fill="fill-cream" />
        <div className="mx-auto max-w-7xl px-6 pb-16 lg:px-10 lg:pb-24">
          <Reveal className="max-w-[46ch]">
            <Eyebrow>{t("facility.eyebrow")}</Eyebrow>
            <h2 className="mt-4 text-[clamp(25px,6.8vw,30px)] font-extrabold leading-[1.15] tracking-tight rtl:leading-[1.45] lg:text-[40px]">
              {t("facility.title")}
            </h2>
            <p className="mt-3 text-[16px] text-ink-soft">
              {t("facility.sub")}
            </p>
          </Reveal>
          {/*
            Captions sit under the photographs rather than over them. On the
            home page the overlay sells the produce; here the picture is
            evidence, and evidence gets a label, not a gradient.
          */}
          <RevealGroup
            className="mt-10 grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-5 lg:grid-cols-4"
            stagger={STAGGER.tight}
          >
            {facility.map((f) => (
              <RevealItem
                key={f.caption}
                as="figure"
                distance={RISE.card}
                className="group min-w-0"
              >
                <Photo
                  src={IMG[f.image]}
                  alt={f.caption}
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="aspect-[4/3] rounded-2xl shadow-card sm:rounded-3xl"
                  imgClassName="transition-transform duration-500 ease-expo group-hover:scale-[1.04]"
                />
                <figcaption className="mt-3">
                  <span className="block text-[14.5px] font-bold">
                    {f.caption}
                  </span>
                  <span className="mt-0.5 block text-[12.5px] leading-snug text-ink-soft">
                    {f.desc}
                  </span>
                </figcaption>
              </RevealItem>
            ))}
          </RevealGroup>
          <Reveal
            as="p"
            className="mt-8 max-w-[72ch] text-[12.5px] leading-relaxed text-ink-soft"
          >
            {t("facility.note")}
          </Reveal>
        </div>
      </section>

      {/* ============ WHY BUYERS TRUST US ============ */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <Reveal className="max-w-[48ch]">
          <Eyebrow>{t("trust.eyebrow")}</Eyebrow>
          <h2 className="mt-4 text-balance text-[clamp(25px,6.8vw,30px)] font-extrabold leading-[1.15] tracking-tight rtl:leading-[1.45] lg:text-[40px]">
            {t("trust.title")}
          </h2>
          <p className="mt-3 text-[16px] text-ink-soft">{t("trust.sub")}</p>
        </Reveal>
        <RevealMedia className="mt-10 overflow-hidden rounded-[24px] border border-line bg-card shadow-card sm:rounded-[32px]">
          <div className="hidden grid-cols-2 border-b border-line text-[12px] font-bold uppercase tracking-[0.08em] text-ink-soft sm:grid">
            <span className="bg-sand/40 px-6 py-3.5">
              {t("trust.riskLabel")}
            </span>
            <span className="border-s border-line px-6 py-3.5">
              {t("trust.fixLabel")}
            </span>
          </div>
          <RevealGroup
            as="ul"
            className="divide-y divide-line"
            stagger={STAGGER.tight}
            delay={0.1}
          >
            {risks.map((r) => (
              <RevealItem key={r.risk} as="li" className="grid sm:grid-cols-2">
                <div className="flex items-start gap-3 bg-sand/40 px-5 py-5 sm:px-6">
                  <TriangleAlert
                    className="mt-0.5 h-4 w-4 shrink-0 text-gold"
                    aria-hidden
                  />
                  <p className="text-[14.5px] leading-relaxed text-ink-soft">
                    {r.risk}
                  </p>
                </div>
                <div className="flex items-start gap-3 px-5 py-5 sm:border-s sm:border-line sm:px-6">
                  <ShieldCheck
                    className="mt-0.5 h-4 w-4 shrink-0 text-leaf"
                    aria-hidden
                  />
                  <p className="text-[14.5px] font-semibold leading-relaxed text-ink">
                    {r.fix}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </RevealMedia>
      </section>

      {/* ============ FAQ ============ */}
      <section className="mx-auto max-w-3xl px-6 pb-16 lg:pb-24">
        <Reveal className="text-center">
          <Eyebrow>{t("faq.eyebrow")}</Eyebrow>
          <h2 className="mt-4 text-[clamp(25px,6.8vw,30px)] font-extrabold leading-[1.15] tracking-tight rtl:leading-[1.45] lg:text-[40px]">
            {t("faq.title")}
          </h2>
        </Reveal>
        <Reveal className="mt-8" delay={0.08}>
          <Faq items={t.raw("faq.items")} />
        </Reveal>
      </section>

      {/* ============ CTA ============ */}
      <section className="px-6 pb-16 lg:pb-24">
        <RevealMedia className="relative mx-auto max-w-6xl overflow-hidden rounded-[28px] bg-gradient-to-br from-sweet to-sweet-deep px-5 py-12 text-center text-white shadow-lift sm:rounded-[36px] sm:px-8 sm:py-14 lg:px-16 lg:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute -end-16 -top-16 h-64 w-64 rounded-full bg-white/10"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-20 -start-10 h-64 w-64 rounded-full bg-black/10"
          />
          <RevealGroup
            className="relative"
            stagger={STAGGER.tight}
            delay={0.12}
          >
            <RevealItem
              as="h2"
              className="mx-auto max-w-[22ch] text-balance text-[clamp(25px,6.8vw,30px)] font-extrabold tracking-tight lg:text-[44px]"
            >
              {t("cta.title")}
            </RevealItem>
            <RevealItem
              as="p"
              className="mx-auto mt-4 max-w-[52ch] text-[16px] text-white/90"
            >
              {t("cta.sub")}
            </RevealItem>
            <RevealItem
              className="mt-8 flex flex-wrap justify-center gap-3"
              stagger={STAGGER.tight}
            >
              <RevealItem as="span" className="inline-flex" lift>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-bold text-sweet-deep shadow-sm transition-shadow duration-200 ease-expo hover:shadow-lift"
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
                  className="inline-flex items-center gap-2 rounded-full bg-white/15 px-7 py-3.5 font-bold text-white ring-1 ring-white/40 transition-colors duration-200 hover:bg-white/25"
                >
                  <MessageCircle className="h-5 w-5" aria-hidden />
                  {t("cta.whatsapp")}
                </a>
              </RevealItem>
            </RevealItem>
            <RevealItem
              as="ul"
              className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 border-t border-white/20 pt-6"
              stagger={STAGGER.tight}
            >
              {ctaPoints.map((p) => (
                <RevealItem
                  key={p}
                  as="li"
                  from="inline"
                  className="inline-flex items-center gap-2 text-[13.5px] font-semibold text-white/90"
                >
                  <Check className="h-4 w-4 shrink-0" aria-hidden />
                  {p}
                </RevealItem>
              ))}
            </RevealItem>
          </RevealGroup>
        </RevealMedia>
      </section>
    </>
  );
}
