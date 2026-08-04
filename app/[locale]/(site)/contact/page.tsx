import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  ChevronRight,
  Clock,
  FileText,
  Globe,
  Handshake,
  Languages,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Ship,
  Timer,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Photo } from "@/components/Photo";
import { Wave } from "@/components/Wave";
import { Eyebrow } from "@/components/Eyebrow";
import { ConfirmValue } from "@/components/ConfirmValue";
import { MapPlate } from "@/components/MapPlate";
import { Faq } from "@/components/sections/Faq";
import { RfqForm } from "@/components/sections/RfqForm";
import {
  Reveal,
  RevealGroup,
  RevealItem,
  RevealMedia,
} from "@/components/motion/Reveal";
import { RISE, STAGGER } from "@/components/motion/config";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { contact } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

const IMG = {
  /* The grower, not the produce: the headline offers a conversation with the
     people behind the crop, and the photograph has to be the same offer. */
  grower: "/images/factory.webp",
};

/** Icons run in the order the dictionaries list their items. */
const STRIP_ICONS = [Timer, CalendarDays, FileText, Ship];
const CHANNEL_ICONS = [Mail, Phone, MessageCircle];
const COMPANY_ICONS = [Building2, MapPin, Clock, Globe];
const WHY_ICONS = [Timer, FileText, Handshake, Languages];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata("contact", locale);
}

/** Eyebrow, heading and standfirst — the opening of every band on the site. */
function SectionIntro({
  eyebrow,
  title,
  sub,
  onDark = false,
  className,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <Reveal className={cn("max-w-[46ch]", className)}>
      <Eyebrow tone={onDark ? "amber" : "sweet"}>{eyebrow}</Eyebrow>
      <h2 className="mt-4 text-[clamp(25px,6.8vw,30px)] font-extrabold tracking-tight lg:text-[40px]">
        {title}
      </h2>
      {sub && (
        <p
          className={cn(
            "mt-3 text-[16px]",
            onDark ? "text-cream/80" : "text-ink-soft",
          )}
        >
          {sub}
        </p>
      )}
    </Reveal>
  );
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  /* The privacy link under the form: one label for the document, shared with
     the footer, so it is never called two different things on one site. */
  const tf = await getTranslations("footer");
  const tr = await getTranslations("rfqForm");

  const strip = t.raw("strip.items") as string[];
  const channels = t.raw("channels.items") as {
    name: string;
    desc: string;
    action: string;
  }[];
  const steps = t.raw("form.steps") as { name: string; desc: string }[];
  const company = t.raw("company.items") as {
    label: string;
    value: string;
    desc: string;
  }[];
  const rows = t.raw("location.rows") as { label: string; value: string }[];
  const why = t.raw("why.items") as { title: string; desc: string }[];
  const ctaTrust = t.raw("cta.trust") as string[];

  /*
    What each channel shows and where it goes, in the order the dictionaries
    list them: e-mail, phone, WhatsApp. Both halves come from lib/site.ts — the
    translations carry the label only, so the number a buyer reads is the same
    in all seven locales and can never drift from the link under it.
  */
  const channelContact = [
    { value: contact.email, href: contact.emailHref },
    { value: contact.phone, href: contact.phoneHref },
    { value: contact.phone, href: contact.whatsapp },
  ];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: "Home", path: "/" },
          { name: t("breadcrumb"), path: "/contact" },
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
          className="mx-auto flex max-w-7xl items-center gap-1.5 px-6 pt-5 text-[13px] text-ink-soft lg:px-10"
        >
          <Link href="/" className="transition-colors hover:text-sweet-deep">
            {t("breadcrumbHome")}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 rtl:-scale-x-100" aria-hidden />
          <span className="font-semibold text-ink">{t("breadcrumb")}</span>
        </nav>

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 pb-8 pt-6 lg:grid-cols-2 lg:gap-14 lg:px-10 lg:pb-16 lg:pt-10">
          {/*
            Same orchestrated entrance as the home page: the badge, headline,
            standfirst and buttons arrive as one phrase, with the photograph
            settling alongside. Everything further down the page waits for the
            scroll and moves less.
          */}
          <RevealGroup on="mount" stagger={STAGGER.base} delay={0.05}>
            <RevealItem
              as="span"
              className="inline-flex items-center gap-2 rounded-full bg-leaf/12 px-3.5 py-1.5 text-[13px] font-semibold text-leaf-deep"
            >
              <Timer className="h-4 w-4" aria-hidden />
              {t("hero.badge")}
            </RevealItem>
            <RevealItem
              as="h1"
              className="mt-5 text-balance text-[clamp(30px,8.4vw,38px)] font-extrabold leading-[1.05] tracking-tight lg:text-[54px]"
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
                <a
                  href="#enquiry"
                  className={cn(buttonVariants({ size: "lg" }))}
                >
                  {t("hero.ctaPrimary")}
                  <ArrowRight
                    className="h-4 w-4 rtl:-scale-x-100"
                    aria-hidden
                  />
                </a>
              </RevealItem>
              <RevealItem as="span" className="inline-flex">
                <a
                  href={contact.whatsapp}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                  )}
                >
                  <MessageCircle className="h-5 w-5" aria-hidden />
                  {t("hero.ctaSecondary")}
                </a>
              </RevealItem>
            </RevealItem>
            <RevealItem
              as="p"
              className="mt-6 max-w-[46ch] text-[14px] text-ink-soft"
            >
              {t("hero.note")}
            </RevealItem>
          </RevealGroup>

          <div className="relative">
            <RevealMedia on="mount" delay={0.08}>
              <Photo
                src={IMG.grower}
                alt={t("hero.imageAlt")}
                priority
                sizes="(max-width: 1024px) 100vw, 46vw"
                className="aspect-[4/5] rounded-[28px] shadow-lift lg:aspect-[5/5.2]"
              />
            </RevealMedia>
            <Reveal
              on="mount"
              delay={0.34}
              /* Low on the frame, where the photograph is dark enough to hold a
                 pale card. Level with the buttons, so the promise and the way
                 to act on it read as one line. */
              className="absolute bottom-5 end-4 rounded-2xl bg-card/95 px-4 py-3 shadow-card backdrop-blur"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full bg-leaf"
                  aria-hidden
                />
                <span className="text-[13px] font-bold text-ink">
                  {t("hero.cardTitle")}
                </span>
              </div>
              <div className="mt-0.5 text-[12.5px] text-ink-soft">
                {t("hero.cardSub")}
              </div>
            </Reveal>
          </div>
        </div>

        {/* the promise, in four facts — sweeps in along the reading direction */}
        <div className="border-y border-line bg-sand/60">
          <RevealGroup
            className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-7 gap-y-3 px-6 py-4 lg:px-10"
            stagger={STAGGER.tight}
          >
            {strip.map((item, i) => {
              const Icon = STRIP_ICONS[i] ?? Timer;
              return (
                <RevealItem
                  key={item}
                  as="span"
                  from="inline"
                  className="inline-flex items-center gap-1.5 text-[13px] font-bold text-ink"
                >
                  <Icon className="h-4 w-4 text-leaf" aria-hidden />
                  {item}
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      {/* ============ CHANNELS ============ */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <SectionIntro
          eyebrow={t("channels.eyebrow")}
          title={t("channels.title")}
          sub={t("channels.sub")}
        />
        <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {channels.map((c, i) => {
            const Icon = CHANNEL_ICONS[i] ?? Mail;
            const { value, href } = channelContact[i];
            const body: ReactNode = (
              <>
                <span
                  className={cn(
                    "grid h-12 w-12 place-items-center rounded-2xl",
                    i === 2
                      ? "bg-wa/15 text-wa-ink"
                      : "bg-sweet/12 text-sweet-deep",
                  )}
                >
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <h3 className="text-[18px] font-bold">{c.name}</h3>
                  {i === 0 && (
                    <span className="rounded-full bg-leaf/12 px-2.5 py-0.5 text-[11.5px] font-bold text-leaf-deep">
                      {t("channels.preferred")}
                    </span>
                  )}
                </div>
                {/* `dir="ltr"` isolates the value from the paragraph around it:
                    on the Arabic page an un-isolated "+20 111 990 0389" renders
                    with the plus sign thrown to the wrong end. */}
                <span
                  dir="ltr"
                  className="mt-2 block w-fit break-all text-[14px] font-semibold"
                >
                  {value}
                </span>
                <p className="mt-2 flex-1 text-[14px] leading-relaxed text-ink-soft">
                  {c.desc}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-bold text-sweet-deep">
                  {c.action}
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-200 ease-expo group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                    aria-hidden
                  />
                </span>
              </>
            );

            /* Every channel is a working link now that the real details are in,
               so all three cards are anchors — the phone one included. */
            return (
              <RevealItem key={c.name} distance={RISE.card} lift>
                <a
                  href={href}
                  className="group flex h-full flex-col rounded-3xl border border-line bg-card p-6 transition-[box-shadow,border-color] duration-300 ease-expo hover:border-sweet/40 hover:shadow-card"
                >
                  {body}
                </a>
              </RevealItem>
            );
          })}
        </RevealGroup>

        <RevealMedia className="mt-5 flex flex-col gap-4 rounded-3xl border border-line bg-sand p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <div className="flex items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-card text-sweet-deep">
              <Clock className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h3 className="text-[13px] font-bold uppercase tracking-[0.1em] text-ink-soft">
                {t("channels.hoursTitle")}
              </h3>
              <ConfirmValue
                value={t("channels.hoursValue")}
                className="mt-1.5 text-[16px] font-bold"
              />
            </div>
          </div>
          <p className="max-w-[44ch] text-[14px] leading-relaxed text-ink-soft">
            {t("channels.hoursNote")}
          </p>
        </RevealMedia>
      </section>

      {/* ============ ENQUIRY FORM ============ */}
      <section id="enquiry" className="scroll-mt-24 bg-sand">
        <Wave fill="fill-cream" />
        <div className="mx-auto max-w-7xl px-6 pb-16 lg:px-10 lg:pb-24">
          <SectionIntro
            eyebrow={t("form.eyebrow")}
            title={t("form.title")}
            sub={t("form.sub")}
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-8">
            <RevealMedia className="overflow-hidden rounded-[28px] border border-line bg-card shadow-card">
              <div className="bg-soil px-6 py-5 text-cream sm:px-8">
                <h3 className="text-[20px] font-bold">{tr("heading")}</h3>
                <p className="mt-1 text-[13.5px] text-cream/75">{tr("sub")}</p>
              </div>
              <div className="p-6 sm:p-8">
                <RfqForm />
              </div>
            </RevealMedia>

            <div className="grid gap-5 lg:sticky lg:top-24">
              {/*
                A real sequence — the brief has to arrive before it can be
                priced, and priced before a reefer is booked — so it is numbered
                and each step is joined to the next.
              */}
              <RevealMedia className="rounded-[28px] border border-line bg-card p-6 shadow-sm sm:p-7">
                <h3 className="text-[18px] font-bold">
                  {t("form.stepsTitle")}
                </h3>
                <ol className="mt-5 grid gap-5">
                  {steps.map((s, i) => (
                    <li
                      key={s.name}
                      className="relative flex gap-4 last:before:hidden before:absolute before:-bottom-5 before:start-[17px] before:top-10 before:w-px before:bg-line"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sweet/12 text-[14px] font-extrabold text-sweet-deep">
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <h4 className="text-[15.5px] font-bold">{s.name}</h4>
                        <p className="mt-1 text-[14px] leading-relaxed text-ink-soft">
                          {s.desc}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </RevealMedia>

              <RevealMedia className="rounded-[28px] border border-line bg-card p-6 shadow-sm sm:p-7">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-wa/15 text-wa-ink">
                  <MessageCircle className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-[18px] font-bold">
                  {t("form.asideTitle")}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
                  {t("form.asideDesc")}
                </p>
                <a
                  href={contact.whatsapp}
                  className={cn(
                    buttonVariants({ variant: "wa", block: true }),
                    "mt-5",
                  )}
                >
                  <MessageCircle className="h-5 w-5" aria-hidden />
                  {t("form.asideCta")}
                </a>
              </RevealMedia>

              <Reveal
                as="p"
                className="px-1 text-[12.5px] leading-relaxed text-ink-soft"
              >
                {t("form.privacy")}{" "}
                <Link
                  href="/privacy"
                  className="font-semibold underline-offset-2 hover:underline"
                >
                  {tf("privacy")}
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ============ COMPANY DETAILS ============ */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <SectionIntro
          eyebrow={t("company.eyebrow")}
          title={t("company.title")}
          sub={t("company.sub")}
        />
        <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2">
          {company.map((c, i) => {
            const Icon = COMPANY_ICONS[i] ?? Building2;
            return (
              <RevealItem
                key={c.label}
                distance={RISE.card}
                lift
                className="rounded-3xl border border-line bg-card p-6 transition-[box-shadow,border-color] duration-300 ease-expo hover:border-leaf/40 hover:shadow-card sm:p-7"
              >
                <div className="flex items-start gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-leaf/12 text-leaf-deep">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[13px] font-bold uppercase tracking-[0.1em] text-ink-soft">
                      {c.label}
                    </h3>
                    <ConfirmValue
                      value={c.value}
                      className="mt-1.5 text-[16px] font-bold"
                    />
                    <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
                      {c.desc}
                    </p>
                  </div>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </section>

      {/* ============ LOCATION ============ */}
      <section className="bg-soil text-cream">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
          <SectionIntro
            eyebrow={t("location.eyebrow")}
            title={t("location.title")}
            sub={t("location.sub")}
            onDark
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:gap-8">
            <RevealMedia>
              <MapPlate
                label={t("location.mapLabel")}
                pin={t("location.pin")}
                className="aspect-[16/11] w-full sm:aspect-[16/9] lg:h-full lg:aspect-auto lg:min-h-[360px]"
              />
            </RevealMedia>
            <RevealGroup
              className="flex flex-col rounded-[28px] border border-cream/12 bg-soil-2 p-6 sm:p-8"
              stagger={STAGGER.tight}
            >
              <dl className="grid gap-5">
                {rows.map((r) => (
                  <RevealItem key={r.label} as="div">
                    <dt className="text-[12.5px] font-bold uppercase tracking-[0.1em] text-amber">
                      {r.label}
                    </dt>
                    <dd className="mt-1 text-[15.5px] font-bold text-cream">
                      <ConfirmValue value={r.value} onDark />
                    </dd>
                  </RevealItem>
                ))}
              </dl>
              <RevealItem
                as="p"
                className="mt-6 border-t border-cream/12 pt-5 text-[13.5px] leading-relaxed text-cream/70"
              >
                {t("location.note")}
              </RevealItem>
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* ============ WHY WRITE TO US ============ */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <SectionIntro
          eyebrow={t("why.eyebrow")}
          title={t("why.title")}
          sub={t("why.sub")}
        />
        <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {why.map((w, i) => {
            const Icon = WHY_ICONS[i] ?? Timer;
            return (
              <RevealItem
                key={w.title}
                distance={RISE.card}
                lift
                className="rounded-3xl border border-line bg-card p-6 transition-[box-shadow,border-color] duration-300 ease-expo hover:border-sweet/40 hover:shadow-card"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sweet/12 text-sweet-deep">
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="mt-4 text-[18px] font-bold">{w.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
                  {w.desc}
                </p>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </section>

      {/* ============ FAQ ============ */}
      <section className="mx-auto max-w-3xl px-6 pb-16 lg:pb-24">
        <Reveal className="text-center">
          <Eyebrow>{t("faq.eyebrow")}</Eyebrow>
          <h2 className="mt-4 text-[clamp(25px,6.8vw,30px)] font-extrabold tracking-tight lg:text-[40px]">
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
                <a
                  href="#enquiry"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-bold text-sweet-deep shadow-sm transition-shadow duration-200 ease-expo hover:shadow-lift"
                >
                  {t("cta.primary")}
                  <ArrowRight
                    className="h-4 w-4 rtl:-scale-x-100"
                    aria-hidden
                  />
                </a>
              </RevealItem>
              <RevealItem as="span" className="inline-flex">
                <a
                  href={contact.whatsapp}
                  className="inline-flex items-center gap-2 rounded-full bg-white/15 px-7 py-3.5 font-bold text-white ring-1 ring-white/40 transition-colors duration-200 hover:bg-white/25"
                >
                  <MessageCircle className="h-5 w-5" aria-hidden />
                  {t("cta.whatsapp")}
                </a>
              </RevealItem>
            </RevealItem>
            <RevealItem
              className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[13px] font-semibold text-white/85"
              stagger={STAGGER.tight}
            >
              {ctaTrust.map((item) => (
                <RevealItem
                  key={item}
                  as="span"
                  from="inline"
                  className="inline-flex items-center gap-1.5"
                >
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 rounded-full bg-white/70"
                  />
                  {item}
                </RevealItem>
              ))}
            </RevealItem>
          </RevealGroup>
        </RevealMedia>
      </section>
    </>
  );
}
