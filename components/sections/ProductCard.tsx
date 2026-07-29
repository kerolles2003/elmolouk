import {ArrowRight} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {PlaceholderImage, type PlaceholderTone} from '@/components/PlaceholderImage';
import {textLinkClass} from '@/components/ui/button';
import {cn} from '@/lib/utils';

export function ProductCard({
  name,
  desc,
  tone,
  href,
  ctaLabel,
  imageLabel,
}: {
  name: string;
  desc: string;
  tone: PlaceholderTone;
  href: string;
  ctaLabel: string;
  imageLabel: string;
}) {
  return (
    <article className="overflow-hidden rounded-lg border border-line bg-white">
      <PlaceholderImage
        tone={tone}
        label={imageLabel}
        rounded="rounded-none"
        className="min-h-[158px]"
      />
      <div className="p-[18px]">
        <h3 className="font-display text-[1.3rem] font-semibold">{name}</h3>
        <p className="mt-1 text-[13.5px] text-ink-soft">{desc}</p>
        <Link href={href} className={cn(textLinkClass, 'mt-3')}>
          {ctaLabel}
          <ArrowRight aria-hidden className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}
