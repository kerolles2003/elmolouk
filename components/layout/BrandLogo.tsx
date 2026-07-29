import Image from "next/image";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

type Artwork = {
  src: string;
  /** The brand name itself — with no wordmark beside it, this names the link. */
  alt: string;
  /** True pixels. Fixes the aspect ratio so `w-auto` resolves before load. */
  width: number;
  height: number;
};

/**
 * The Latin lockup is the fallback, not a listed case. Only locales whose
 * script needs artwork of its own appear in `BY_LOCALE`, so adding a market to
 * `routing.locales` gets the English lockup automatically — no edit here, and
 * no chance of a new locale rendering nothing.
 */
const LATIN: Artwork = {
  src: "/images/logo_english.png",
  alt: "El Molouk Fresh Produce",
  width: 533,
  height: 468,
};

const BY_LOCALE: Record<string, Artwork> = {
  ar: {
    src: "/images/logo_arabic.png",
    alt: "الملوك للمنتجات الطازجة",
    width: 501,
    height: 498,
  },
};

/** Exported so metadata, OG images or a preload hint can resolve the same asset. */
export function brandArtwork(locale: string): Artwork {
  return BY_LOCALE[locale] ?? LATIN;
}

/**
 * The brand mark, and the only thing that carries the company name. One
 * component for every surface that shows it — header, footer, RFQ page.
 *
 * Presented as a printed label rather than masked into the page, because the
 * artwork is a print mockup, not a logo file: its ground is photographed paper
 * that runs #f6f4f3 at the top-right down to #dbdad6 at the bottom-left, and it
 * is neutral grey where the page is warm cream. No blend mode or mask makes a
 * lit, vignetted ground vanish into a flat one — attempting it reads as a
 * failed key. So the rectangle stays, gets the house radius, and becomes an
 * object on the page instead of an image that didn't cut out. It also means one
 * treatment works on cream and on soil, with no dark-surface branch.
 *
 * Height is pinned and width runs free. That is the opposite of the usual
 * instinct and the right way round here: the header's rhythm is a height
 * problem, so every locale must agree on height — but the two lockups are
 * genuinely different shapes (534×531 against 619×544), and cropping a client's
 * mark to force equal widths is not a trade worth making. The ~7px the brand
 * slot gains in English is invisible; a clipped laurel would not be.
 *
 * Eager rather than `preload` (the Next 16 successor to `priority`): a 60px
 * mark is never the LCP element, it just shouldn't pop in after paint.
 */
export function BrandLogo({ className }: { className?: string }) {
  const { src, alt, width, height } = brandArtwork(useLocale());

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="eager"
      // The rendered box, so the optimiser serves ~128px instead of the 1280px
      // it would infer from the intrinsic width above.
      sizes="(min-width: 1024px) 73px, 59px"
      className={cn(
        // 3px, not the house 8px: at this size a soft corner reads as an app
        // icon, and the point is a printed edge. Just enough to kill the pixel.
        "h-13 w-auto rounded-[3px] shadow-sm lg:h-16",
        // With no wordmark beside it, the mark has to say on its own that it is
        // the way home. It lifts off the paper a hair. The global
        // reduced-motion rule flattens the timing to nothing.
        "transition-[translate,box-shadow] duration-200 ease-organic",
        "group-hover:-translate-y-px group-hover:shadow-card",
        className,
      )}
    />
  );
}
