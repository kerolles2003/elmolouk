import Image from 'next/image';
import {cn} from '@/lib/utils';

/**
 * Local image wrapper (fill + object-cover) for the /public/images photos.
 * These are CC-licensed stock placeholders — see public/images/CREDITS.txt —
 * to be swapped for El Molouk's own photography. Set the size via `className`
 * (aspect ratio or height).
 */
export function Photo({
  src,
  alt,
  className,
  imgClassName,
  priority = false,
  sizes = '(max-width: 768px) 100vw, 45vw',
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  sizes?: string;
}) {
  /*
    next/image answers a missing src with a console error and an <img src="">,
    which prerenders happily — so a stale key in one of the page IMG maps ships
    a blank frame and a green build. Failing here turns that into a build error
    that names the picture, which is the only way it gets noticed.
  */
  if (!src) {
    throw new Error(
      `Photo: empty src for "${alt}". A page IMG map is missing the key this picture asks for.`,
    );
  }

  return (
    <div className={cn('relative overflow-hidden bg-beige', className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn('object-cover', imgClassName)}
      />
    </div>
  );
}
