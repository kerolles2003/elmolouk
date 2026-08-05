import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ArrowRight,
  Sprout,
  ShieldCheck,
  CalendarDays,
  Snowflake,
  Container,
  HandCoins,
  Sun,
  Cookie,
  Wheat,
  ChefHat,
  ThermometerSun,
  Layers,
  Package,
  Ship,
  Anchor,
  Scale,
  Mail,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { WhatsAppCta } from "@/components/WhatsAppCta";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/Eyebrow";
import { Photo } from "@/components/Photo";
import { Wave } from "@/components/Wave";
import { Faq } from "@/components/sections/Faq";
import { PackagingGrid } from "@/components/sections/PackagingGrid";
import {
  Reveal,
  RevealGroup,
  RevealItem,
  RevealMedia,
} from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/CountUp";
import { RISE, STAGGER } from "@/components/motion/config";
import { pageMetadata } from "@/lib/seo";

/*
  Every photograph on this page has to be El Molouk's business: this crop, these
  fields, this packhouse. `packing.jpg` (a mixed-vegetable market stall) and
  `field.jpg` (a corn combine) were dropped in the content audit — a grocery
  display contradicts an export-only supplier, and a maize harvester is not our
  crop. [[confirm: replace the remaining stock frames with El Molouk's own shoot]]
*/
/*
  `as const`, not `Record<string, string>`. Under the loose index signature a
  key that no longer exists reads as `undefined`, next/image receives an empty
  src, and the page ships with blank frames and a console error the build never
  fails on. Const-asserted, a stale key is a type error.
*/
const IMG = {
  hero: "/images/land.webp",
  flesh: "/images/Beauregard.webp",
  bellevue: "/images/Bellevue.webp",
  /** Lifted roots still in the soil — the harvest frame. */
  roots: "/images/products.webp",
  /** The grading and packing floor, stacked with export cartons. */
  packhouse: "/images/factory.webp",
  basket: "/images/basket.jpg",
} as const;

/** The frames this page can draw on. Dictionary `image` values must be one. */
type Shot = keyof typeof IMG;

/**
 * The hero's journey strip, in the order the crop travels: roots lifted out of
 * the soil, the packing floor, then the graded produce itself. Captions and alt
 * text live in the dictionaries; the shots stay here so seven files can't drift
 * out of step with each other.
 *
 * The third frame used to be a plated dish — `cooking.jpg`, which is a
 * photograph of spaghetti squash. A picture of a different vegetable captioned
 * as our own crop is the one thing a produce buyer spots instantly, so it is
 * gone and the variety macro stands in its place.
 */
const JOURNEY_SHOTS: Shot[] = ["roots", "packhouse", "flesh"];

/**
 * The product journey, field to packing floor, in the order it happens.
 *
 * The strip runs only as far as El Molouk has photographs. Cold store, loading
 * and shipping used to sit here as labelled empty frames; the section now stops
 * where the pictures do rather than advertising the gaps. Index-paired with
 * `gallery.steps` in the dictionaries — add a shot here and its caption there.
 */
const GALLERY_SHOTS: Shot[] = ["hero", "roots", "basket", "packhouse"];

const WHY_ICONS = [
  Sprout,
  ShieldCheck,
  CalendarDays,
  Snowflake,
  Container,
  HandCoins,
];
const BENEFIT_ICONS = [Sun, Cookie, Wheat, ChefHat];
const PROCESS_ICONS = [
  Sprout,
  ThermometerSun,
  Layers,
  Package,
  Snowflake,
  Ship,
];
/** Ports · export modes · minimum order · cold chain, in `shipping.items` order. */
const SHIP_ICONS = [Anchor, Ship, Scale, Snowflake];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata("home", locale);
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  /* The pre-filled chat text and the "prefer e-mail" fallback label — shared
     with every other page, so the enquiry the export desk receives reads the
     same however the buyer arrived at it. */
  const tc = await getTranslations("common");

  const trust = t.raw("trust.items") as string[];
  const journey = t.raw("hero.journey") as { caption: string; alt: string }[];
  const featured = t.raw("featured.items") as {
    name: string;
    desc: string;
    weight: string;
    origin: string;
    image: Shot;
  }[];
  const why = t.raw("why.items") as { title: string; desc: string }[];
  const process = t.raw("process.steps") as { name: string; desc: string }[];
  const benefits = t.raw("benefits.items") as { title: string; desc: string }[];
  const shipping = t.raw("shipping.items") as {
    title: string;
    value: string;
  }[];
  const gallery = t.raw("gallery.steps") as {
    caption: string;
    alt: string;
  }[];
  /*
    Packaging is read from the `product` namespace rather than restated here.
    One list, one set of net weights: the home page and the spec page cannot
    contradict each other about what we sell if they read the same key.
  */
  const packaging = await getTranslations("product");
  const packs = packaging.raw("packaging.items") as {
    title: string;
    specs: string[][];
  }[];

  return (
    <>
      {/* ============ HERO ============ */}
      {/*
        The one orchestrated moment on the page, and the only place the story is
        told rather than listed.

        It is laid out as a masthead — eyebrow, a headline that runs the full
        measure, then a split of story against pictures — instead of the usual
        text-beside-photo hero, because what is being sold is a journey and the
        page has to read as one. The picture column is that journey in order:
        the land on top, then harvest, packing and the table beneath it.
        Everything below the fold is deliberately quieter than this.
      */}
      <section>
        <div className="mx-auto grid max-w-7xl gap-x-12 gap-y-10 px-6 pb-12 pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] lg:gap-y-14 lg:px-10 lg:pb-20 lg:pt-16 xl:gap-x-16">
          {/* Where the journey starts, and what it is. */}
          <RevealGroup
            on="mount"
            delay={0.05}
            stagger={STAGGER.base}
            className="lg:col-span-2"
          >
            <RevealItem
              as="p"
              className="max-w-[52ch] text-[13.5px] font-medium leading-relaxed text-ink-soft"
            >
              <span aria-hidden className="mb-4 block h-px w-10 bg-sweet/70" />
              {t("hero.eyebrow")}
            </RevealItem>
            {/*
              One heading, two type sizes. The crop gets the display size; the
              sentence carrying the promise sits beside it at deck size, split
              at its own comma so the two ends of the journey — where it begins,
              where it arrives — land separately. The destination clause takes
              the sweet-potato orange; nothing else in the hero does.
            */}
            <h1 className="mt-6 lg:mt-8 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] lg:items-end lg:gap-x-12 xl:gap-x-16">
              <RevealItem
                as="span"
                className="block text-balance text-[clamp(42px,11.5vw,58px)] font-extrabold leading-[1.02] tracking-[-0.03em] rtl:leading-[1.3] rtl:tracking-normal lg:text-[64px] xl:text-[74px]"
              >
                {t("hero.titleLead")}
              </RevealItem>
              {/*
                Cairo sets Arabic on a taller body than Jakarta sets Latin, so
                every tight leading here carries an `rtl:` release — without it
                the dots and the hamza collide with the line above.
              */}
              <span className="mt-5 block text-balance text-[clamp(19px,4.8vw,22px)] font-semibold leading-[1.35] rtl:leading-[1.7] lg:mt-0 lg:text-[26px] xl:text-[29px]">
                <RevealItem as="span" className="block">
                  {t("hero.titleA")}
                </RevealItem>
                <RevealItem as="span" className="block text-sweet-deep">
                  {t("hero.titleB")}
                </RevealItem>
              </span>
            </h1>
          </RevealGroup>

          {/*
            On a phone this sits between the headline and the story, the way a
            magazine runs its opening photograph — so the journey is seen before
            it is read, and the story is not eleven lines of type on arrival.
          */}
          <div className="lg:col-start-2 lg:row-start-2">
            <RevealMedia on="mount" delay={0.26}>
              <Photo
                src={IMG.hero}
                alt={t("hero.imageAlt")}
                priority
                sizes="(max-width: 1024px) 100vw, 46vw"
                className="aspect-[4/3] rounded-xl shadow-lift sm:aspect-[3/2]"
              />
            </RevealMedia>
            {/*
              An ordered list, because the order is the point: these three
              frames are what happens to the crop after the field, and they
              arrive one after another for the same reason.
            */}
            <RevealGroup
              as="ol"
              on="mount"
              delay={0.44}
              stagger={STAGGER.wide}
              className="mt-3 grid grid-cols-3 gap-3"
            >
              {journey.map((s, i) => (
                <RevealItem as="li" key={s.caption}>
                  <Photo
                    src={IMG[JOURNEY_SHOTS[i]]}
                    alt={s.alt}
                    sizes="(max-width: 1024px) 30vw, 15vw"
                    className="aspect-square rounded-md"
                  />
                  {/* 0.1em, not the 0.14em used on wider labels: in a 100px
                      cell on a phone these captions are one long word away from
                      wrapping, and letterspacing is what pushes them over. */}
                  <span className="mt-2.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-ink-soft rtl:tracking-normal">
                    {s.caption}
                  </span>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>

          {/* The story, the belief behind it, and what to do next. */}
          <div className="lg:col-start-1 lg:row-start-2">
            {/*
              The prose carries its own measure rather than inheriting the
              column's: 120 words set to the full 590px ran past 70 characters a
              line, which is where a story stops being read and starts being
              skimmed. The buttons and the figures below keep the whole column,
              so the ragged right edge of the text reads as a margin.
            */}
            <RevealGroup on="mount" delay={0.34} stagger={STAGGER.base}>
              <RevealItem
                as="p"
                className="max-w-[31rem] text-[16.5px] leading-[1.8] text-ink-soft lg:text-[17px]"
              >
                {t("hero.storyP1")}
              </RevealItem>
              <RevealItem
                as="p"
                className="mt-4 max-w-[31rem] text-[16.5px] leading-[1.8] text-ink-soft lg:text-[17px]"
              >
                {t("hero.storyP2")}
              </RevealItem>
              {/*
                A rule and a shift in weight is all the quote gets. No oversized
                quotation glyph: that mark belongs to words that are somebody
                else's, and this line is the house speaking — so it is set as
                type rather than dressed as a testimonial.
              */}
              <RevealItem className="mt-8 max-w-[33rem] border-s-2 border-sweet/45 ps-5 lg:ps-6">
                <blockquote className="text-[18px] font-semibold leading-[1.6] text-soil rtl:leading-[1.8] lg:text-[20px]">
                  {t("hero.quote")}
                </blockquote>
              </RevealItem>
              <RevealItem
                className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
                stagger={STAGGER.tight}
              >
                {/* The shortest path on the site: the first button a visitor
                    meets opens a chat with the enquiry already drafted, rather
                    than sending them to a page to find a form. */}
                <RevealItem as="span" className="flex w-full sm:w-auto">
                  <WhatsAppCta
                    message={tc("whatsappMessage")}
                    className={cn(
                      buttonVariants({ size: "lg", block: true }),
                      "sm:w-auto",
                    )}
                  >
                    {t("hero.ctaPrimary")}
                    <ArrowRight
                      className="h-4 w-4 rtl:-scale-x-100"
                      aria-hidden
                    />
                  </WhatsAppCta>
                </RevealItem>
                <RevealItem as="span" className="flex w-full sm:w-auto">
                  <Link
                    href="/sweet-potatoes"
                    className={cn(
                      buttonVariants({
                        variant: "outline",
                        size: "lg",
                        block: true,
                      }),
                      "sm:w-auto",
                    )}
                  >
                    {t("hero.ctaSecondary")}
                  </Link>
                </RevealItem>
              </RevealItem>
              {/* One quiet line, not a third button: the buyers who want a
                  written trail rather than a chat are the minority here, and
                  the page should say where they go without competing with the
                  button above it. */}
              <RevealItem
                as="p"
                className="mt-4 text-[14px] text-ink-soft"
                from="inline"
              >
                <Link
                  href="/contact"
                  className="inline-flex min-h-11 items-center font-semibold underline-offset-4 transition-colors hover:text-sweet-deep hover:underline"
                >
                  {tc("preferEmail")}
                </Link>
              </RevealItem>
              {/*
                Label above figure, spec-sheet fashion. One of these two is a
                quantity and the other is a place, and putting the labels on top
                is what keeps them reading as one row instead of two mismatched
                columns when the second figure wraps.
              */}
              <RevealItem
                as="dl"
                className="mt-10 grid gap-6 border-t border-line pt-7 sm:grid-cols-2 sm:gap-0"
                stagger={STAGGER.tight}
              >
                <RevealItem className="sm:pe-8">
                  <dt className="text-[11.5px] font-bold uppercase tracking-[0.14em] text-ink-soft rtl:tracking-normal">
                    {t("hero.stat1Label")}
                  </dt>
                  <dd className="mt-2 text-[clamp(24px,6.4vw,27px)] font-extrabold leading-[1.15] tracking-tight text-sweet-deep rtl:leading-[1.5] rtl:tracking-normal lg:text-[29px]">
                    {/* Counts once the entrance has landed, so the two don't compete. */}
                    <CountUp value={t("hero.stat1Value")} delay={0.72} />
                  </dd>
                </RevealItem>
                <RevealItem className="sm:border-s sm:border-line sm:ps-8">
                  <dt className="text-[11.5px] font-bold uppercase tracking-[0.14em] text-ink-soft rtl:tracking-normal">
                    {t("hero.stat2Label")}
                  </dt>
                  <dd className="mt-2 text-[clamp(24px,6.4vw,27px)] font-extrabold leading-[1.15] tracking-tight text-sweet-deep rtl:leading-[1.5] rtl:tracking-normal lg:text-[29px]">
                    {t("hero.stat2Value")}
                  </dd>
                </RevealItem>
              </RevealItem>
            </RevealGroup>
          </div>
        </div>

        {/*
          Credentials, stated and then left alone. No lead-in sentence and no
          row of check marks: the audit names are the evidence, and a buyer who
          knows what GLOBALG.A.P costs to hold reads more into the bare list
          than into anything we could claim above it.
        */}
        <div className="border-y border-line bg-sand/60">
          <RevealGroup
            className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-9 gap-y-2.5 px-6 py-4 lg:px-10"
            stagger={STAGGER.tight}
          >
            {trust.map((c) => (
              <RevealItem
                key={c}
                as="span"
                from="inline"
                className="text-[12px] font-bold uppercase tracking-[0.13em] text-ink-soft rtl:tracking-normal"
              >
                {c}
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ============ FEATURED PRODUCTS ============ */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <Reveal className="max-w-[44ch]">
          <Eyebrow>{t("featured.eyebrow")}</Eyebrow>
          <h2 className="mt-4 text-[clamp(25px,6.8vw,30px)] font-extrabold tracking-tight lg:text-[40px]">
            {t("featured.title")}
          </h2>
          <p className="mt-3 text-[16px] text-ink-soft">{t("featured.sub")}</p>
        </Reveal>
        {/*
          Two varieties, two cards. El Molouk grows Beauregard and Bellevue and
          nothing else, so the grid pairs rather than the old four-up that had
          to be padded with a retail pack we do not sell. Capped at ~5xl so a
          pair of cards on a wide screen stays a product row, not two banners.
        */}
        <RevealGroup className="mt-10 grid max-w-5xl gap-6 sm:grid-cols-2">
          {featured.map((p) => (
            <RevealItem
              key={p.name}
              as="article"
              distance={RISE.card}
              lift
              className="group overflow-hidden rounded-3xl border border-line bg-card shadow-sm transition-[box-shadow,border-color] duration-300 ease-expo hover:border-sweet/40 hover:shadow-card"
            >
              <Photo
                src={IMG[p.image]}
                alt={p.name}
                sizes="(max-width: 640px) 100vw, 45vw"
                className="aspect-[4/3]"
                imgClassName="transition-transform duration-500 ease-expo group-hover:scale-[1.04]"
              />
              <div className="p-6">
                <h3 className="text-[21px] font-bold">{p.name}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
                  {p.desc}
                </p>
                <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-4 text-[13px]">
                  <div>
                    <dt className="text-ink-soft">
                      {t("featured.weightLabel")}
                    </dt>
                    <dd className="font-bold">{p.weight}</dd>
                  </div>
                  <div>
                    <dt className="text-ink-soft">
                      {t("featured.originLabel")}
                    </dt>
                    <dd className="font-bold">{p.origin}</dd>
                  </div>
                </dl>
                {/* Asking about a variety is the moment to start the
                    conversation, so the card ends in one — the pre-filled
                    message already carries the three things we would have to
                    ask for anyway. */}
                <WhatsAppCta
                  message={tc("whatsappMessage")}
                  className={cn(
                    buttonVariants({ size: "sm", block: true }),
                    "mt-5",
                  )}
                >
                  {t("featured.cta")}
                  <ArrowRight
                    className="h-4 w-4 rtl:-scale-x-100"
                    aria-hidden
                  />
                </WhatsAppCta>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* ============ EXPORT PACKAGING ============ */}
      {/*
        This replaces the old "ways to buy" tiles, which offered retail
        pre-packs, private label and 550 kg bulk bins — none of which El Molouk
        supplies. What is left is the three formats that do exist, shown as
        spec cards rather than photographs: we have no shot of a 3 kg carton,
        and a photograph of something else would be a claim about the goods.
      */}
      <section className="bg-sand">
        <Wave fill="fill-cream" />
        <div className="mx-auto max-w-7xl px-6 pb-16 lg:px-10 lg:pb-24">
          <Reveal className="max-w-[46ch]">
            <Eyebrow>{t("packaging.eyebrow")}</Eyebrow>
            <h2 className="mt-4 text-[clamp(25px,6.8vw,30px)] font-extrabold tracking-tight lg:text-[40px]">
              {t("packaging.title")}
            </h2>
            <p className="mt-3 text-[16px] text-ink-soft">
              {t("packaging.sub")}
            </p>
          </Reveal>
          <Reveal className="mt-8 lg:mt-10" delay={0.06}>
            <PackagingGrid items={packs} />
          </Reveal>
          <Reveal className="mt-6" delay={0.1}>
            <p className="inline-flex items-center gap-2.5 rounded-full border border-line bg-card px-4 py-2.5 text-[13.5px] font-semibold text-ink">
              <Scale className="h-4 w-4 shrink-0 text-sweet-deep" aria-hidden />
              {t("packaging.moq")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ WHY CHOOSE US ============ */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <Reveal className="max-w-[44ch]">
          <Eyebrow>{t("why.eyebrow")}</Eyebrow>
          <h2 className="mt-4 text-[clamp(25px,6.8vw,30px)] font-extrabold tracking-tight lg:text-[40px]">
            {t("why.title")}
          </h2>
          <p className="mt-3 text-[16px] text-ink-soft">{t("why.sub")}</p>
        </Reveal>
        <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {why.map((w, i) => {
            const Icon = WHY_ICONS[i] ?? Sprout;
            return (
              <RevealItem
                key={w.title}
                distance={RISE.card}
                lift
                className="rounded-3xl border border-line bg-card p-6 transition-[box-shadow,border-color] duration-300 ease-expo hover:border-leaf/40 hover:shadow-card"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-leaf/12 text-leaf-deep">
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

      {/* ============ FARM STORY ============ */}
      <section className="bg-soil text-cream">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-24">
          <div className="relative">
            <RevealMedia>
              {/* Soil first, packhouse as the inset — the two paragraphs beside
                  it run the same way: the land we were given, then the fact
                  that we see the crop through ourselves. */}
              <Photo
                src={IMG.roots}
                alt={t("farm.imageAlt")}
                sizes="(max-width: 1024px) 100vw, 46vw"
                className="aspect-[5/4] rounded-[28px] shadow-lift"
              />
            </RevealMedia>
            <RevealMedia
              delay={0.16}
              className="absolute -bottom-5 end-5 hidden w-36 overflow-hidden rounded-2xl border-[5px] border-soil shadow-card sm:block"
            >
              <Photo
                src={IMG.packhouse}
                alt={gallery[3].alt}
                className="aspect-square"
              />
            </RevealMedia>
          </div>
          <RevealGroup stagger={STAGGER.tight}>
            <RevealItem
              as="span"
              className="inline-block rounded-full bg-amber/20 px-3.5 py-1.5 text-[12.5px] font-bold uppercase tracking-[0.1em] text-amber"
            >
              {t("farm.eyebrow")}
            </RevealItem>
            <RevealItem
              as="h2"
              className="mt-4 text-[clamp(25px,6.8vw,30px)] font-extrabold tracking-tight lg:text-[40px]"
            >
              {t("farm.title")}
            </RevealItem>
            <RevealItem
              as="p"
              className="mt-5 text-[16px] leading-relaxed text-cream/80"
            >
              {t("farm.p1")}
            </RevealItem>
            <RevealItem
              as="p"
              className="mt-4 text-[16px] leading-relaxed text-cream/80"
            >
              {t("farm.p2")}
            </RevealItem>
            <RevealItem as="span" className="mt-5 inline-flex">
              <Link
                href="/quality"
                className="group inline-flex min-h-11 items-center gap-1.5 font-bold text-amber transition-colors duration-200 hover:text-white"
              >
                {t("farm.cta")}
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 ease-expo group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                  aria-hidden
                />
              </Link>
            </RevealItem>
          </RevealGroup>
        </div>
      </section>

      {/* ============ QUALITY PROCESS ============ */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <Reveal className="max-w-[46ch]">
          <Eyebrow>{t("process.eyebrow")}</Eyebrow>
          <h2 className="mt-4 text-[clamp(25px,6.8vw,30px)] font-extrabold tracking-tight lg:text-[40px]">
            {t("process.title")}
          </h2>
          <p className="mt-3 text-[16px] text-ink-soft">{t("process.sub")}</p>
        </Reveal>
        {/*
          The only place on the page that stretches the stagger to 80ms. These
          six steps are a sequence — curing has to follow harvest — so the delay
          between them is doing the same work as the ordinals, and it is worth
          feeling. Every other grid is a set, and cascades faster.
        */}
        <RevealGroup
          as="ol"
          stagger={STAGGER.wide}
          className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {process.map((s, i) => {
            const Icon = PROCESS_ICONS[i] ?? Sprout;
            return (
              <RevealItem
                key={s.name}
                as="li"
                distance={RISE.card}
                className="relative rounded-3xl border border-line bg-card p-6 transition-colors duration-300 ease-expo hover:border-sweet/40"
              >
                <span className="absolute end-5 top-5 text-[34px] font-extrabold text-line">
                  {i + 1}
                </span>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sweet/12 text-sweet-deep">
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="mt-4 text-[18px] font-bold">{s.name}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
                  {s.desc}
                </p>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </section>

      {/* ============ BENEFITS ============ */}
      <section className="bg-leaf-deep text-cream">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
          <Reveal className="max-w-[46ch]">
            <span className="inline-block rounded-full bg-cream/15 px-3.5 py-1.5 text-[12.5px] font-bold uppercase tracking-[0.1em] text-cream">
              {t("benefits.eyebrow")}
            </span>
            <h2 className="mt-4 text-[clamp(25px,6.8vw,30px)] font-extrabold tracking-tight lg:text-[40px]">
              {t("benefits.title")}
            </h2>
            <p className="mt-3 text-[16px] text-cream/80">
              {t("benefits.sub")}
            </p>
          </Reveal>
          <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b, i) => {
              const Icon = BENEFIT_ICONS[i] ?? Sun;
              return (
                <RevealItem
                  key={b.title}
                  distance={RISE.card}
                  lift
                  className="rounded-3xl bg-cream/10 p-6 backdrop-blur-sm transition-colors duration-300 ease-expo hover:bg-cream/15"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber text-soil">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <h3 className="mt-4 text-[18px] font-bold">{b.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-cream/80">
                    {b.desc}
                  </p>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      {/* ============ THE JOURNEY ============ */}
      {/*
        Was a scrapbook mosaic in no particular order. It is now the export
        journey in sequence — field, harvest, sorting, packing — which is what a
        buyer is actually trying to picture, and it is an <ol> because the order
        is the content. It runs as far as the photographs do; see GALLERY_SHOTS.
      */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <Reveal className="max-w-[46ch]">
          <Eyebrow>{t("gallery.eyebrow")}</Eyebrow>
          <h2 className="mt-4 text-[clamp(25px,6.8vw,30px)] font-extrabold tracking-tight lg:text-[40px]">
            {t("gallery.title")}
          </h2>
          <p className="mt-3 text-[16px] text-ink-soft">{t("gallery.sub")}</p>
        </Reveal>
        <RevealGroup
          as="ol"
          className="mt-10 grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 sm:gap-x-4 lg:grid-cols-4"
          stagger={STAGGER.tight}
        >
          {/* Driven by GALLERY_SHOTS, not the dictionary: the strip is as long
              as the photography, and a caption without a frame draws nothing. */}
          {GALLERY_SHOTS.map((shot, i) => (
            <RevealItem as="li" key={shot}>
              <Photo
                src={IMG[shot]}
                alt={gallery[i].alt}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="aspect-[4/3] rounded-2xl shadow-sm"
              />
              <span className="mt-2.5 block text-[11.5px] font-bold uppercase tracking-[0.1em] text-ink-soft rtl:tracking-normal">
                {gallery[i].caption}
              </span>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* ============ SHIPPING ============ */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
        <RevealMedia className="rounded-[24px] border border-line bg-card p-5 shadow-card sm:rounded-[32px] sm:p-8 lg:p-12">
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1fr_2fr] lg:items-center">
            <Reveal delay={0.08}>
              <Eyebrow>{t("shipping.eyebrow")}</Eyebrow>
              <h2 className="mt-4 text-[clamp(23px,6vw,26px)] font-extrabold tracking-tight lg:text-[32px]">
                {t("shipping.title")}
              </h2>
              <p className="mt-3 text-[15px] text-ink-soft">
                {t("shipping.sub")}
              </p>
            </Reveal>
            <RevealGroup
              className="grid grid-cols-2 gap-4 lg:grid-cols-4"
              stagger={STAGGER.tight}
              delay={0.14}
            >
              {shipping.map((s, i) => {
                const Icon = SHIP_ICONS[i] ?? Anchor;
                return (
                  <RevealItem
                    key={s.title}
                    className="min-w-0 rounded-2xl bg-sand p-4 transition-colors duration-300 ease-expo hover:bg-beige sm:p-5"
                  >
                    <Icon className="h-6 w-6 text-sweet-deep" aria-hidden />
                    <div className="mt-3 text-[12.5px] text-ink-soft">
                      {s.title}
                    </div>
                    <div className="text-[15px] font-bold">{s.value}</div>
                  </RevealItem>
                );
              })}
            </RevealGroup>
          </div>
        </RevealMedia>
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
              {/*
                The pair swapped jobs. The solid button — the one the eye lands
                on — now opens the chat, and the ghost button beside it carries
                what used to be the whole conversion path: the contact page,
                with its form, its address and its e-mail.
              */}
              <RevealItem as="span" className="inline-flex" lift>
                <WhatsAppCta
                  message={tc("whatsappMessage")}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-bold text-sweet-deep shadow-sm transition-shadow duration-200 ease-expo hover:shadow-lift"
                >
                  {t("cta.primary")}
                  <ArrowRight
                    className="h-4 w-4 rtl:-scale-x-100"
                    aria-hidden
                  />
                </WhatsAppCta>
              </RevealItem>
              <RevealItem as="span" className="inline-flex">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-white/15 px-7 py-3.5 font-bold text-white ring-1 ring-white/40 transition-colors duration-200 hover:bg-white/25"
                >
                  <Mail className="h-5 w-5" aria-hidden />
                  {tc("contactTeam")}
                </Link>
              </RevealItem>
            </RevealItem>
          </RevealGroup>
        </RevealMedia>
      </section>
    </>
  );
}
