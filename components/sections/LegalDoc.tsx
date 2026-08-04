import { Mail, MapPin, Phone } from "lucide-react";
import { Eyebrow } from "@/components/Eyebrow";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { contact, siteConfig } from "@/lib/site";

type Section = { title: string; body: string };

/**
 * Shared shell for the two legal documents.
 *
 * Both pages are the same object — a dated preamble, numbered prose sections
 * and the company block — so they share one component and differ only in the
 * dictionary namespace they are handed. Prose measure is capped at 72ch: these
 * are read, not scanned, and a full-width legal paragraph is unreadable.
 *
 * The company block is built from `lib/site.ts`, never from the dictionary. A
 * privacy policy has to name its controller, and the one place this site keeps
 * that name and address is the same one every other page reads.
 */
export function LegalDoc({
  eyebrow,
  title,
  updated,
  intro,
  sections,
  contactHeading,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  intro: string;
  sections: Section[];
  contactHeading: string;
}) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-14 lg:px-10 lg:py-20">
      <Reveal className="max-w-[52ch]">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-4 text-[clamp(27px,7vw,32px)] font-extrabold leading-[1.15] tracking-tight rtl:leading-[1.45] lg:text-[42px]">
          {title}
        </h1>
        <p className="mt-3 text-[13px] font-semibold uppercase tracking-[0.1em] text-ink-soft rtl:tracking-normal">
          {updated}
        </p>
        <p className="mt-5 text-[16.5px] leading-relaxed text-ink-soft">
          {intro}
        </p>
      </Reveal>

      <RevealGroup as="ol" className="mt-12 grid max-w-[72ch] gap-9">
        {sections.map((s, i) => (
          <RevealItem as="li" key={s.title}>
            {/* The number is decorative — the heading text already orders the
                document for a screen reader, and an <ol> marker would fight
                the RTL layout. */}
            <span
              aria-hidden
              className="font-mono text-[12px] font-semibold tracking-[0.16em] text-sweet-deep"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <h2 className="mt-1.5 text-[19px] font-bold leading-snug lg:text-[21px]">
              {s.title}
            </h2>
            <p className="mt-2.5 text-[15.5px] leading-relaxed text-ink-soft">
              {s.body}
            </p>
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal className="mt-14 max-w-[72ch] rounded-3xl border border-line bg-card p-6 shadow-sm sm:p-8">
        <h2 className="text-[17px] font-bold">{contactHeading}</h2>
        <dl className="mt-4 grid gap-3 text-[14.5px]">
          <div>
            <dt className="text-ink-soft">{siteConfig.name}</dt>
            <dd className="font-semibold">{siteConfig.legalName}</dd>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sweet-deep" aria-hidden />
            <span>{siteConfig.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 shrink-0 text-sweet-deep" aria-hidden />
            <a
              href={contact.emailHref}
              dir="ltr"
              className="break-all font-semibold hover:text-sweet-deep"
            >
              {contact.email}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 shrink-0 text-sweet-deep" aria-hidden />
            <a href={contact.phoneHref} dir="ltr" className="font-semibold hover:text-sweet-deep">
              {contact.phone}
            </a>
          </div>
        </dl>
      </Reveal>
    </section>
  );
}
