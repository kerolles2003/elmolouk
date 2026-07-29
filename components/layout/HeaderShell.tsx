'use client';

import {useEffect, useState, type ReactNode} from 'react';
import {cn} from '@/lib/utils';

/**
 * Gives the sticky header something to react to.
 *
 * At the top of the page the header sits flush on the cream background with no
 * seam. Once the page moves under it, the hairline and a shallow shadow fade in
 * so the bar reads as a layer above the content rather than part of it.
 *
 * The scroll listener only flips a boolean — the transition itself is CSS, so
 * nothing runs per frame. `passive: true` keeps it off the scroll critical path.
 */
export function HeaderShell({children}: {children: ReactNode}) {
  const [lifted, setLifted] = useState(false);

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 8);
    onScroll(); // A reload can restore a scroll position mid-page.
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b backdrop-blur',
        'transition-[background-color,border-color,box-shadow] duration-300 ease-organic',
        lifted
          ? 'border-line/70 bg-cream/85 shadow-sm'
          : 'border-transparent bg-cream/95 shadow-none',
      )}
    >
      {children}
    </header>
  );
}
