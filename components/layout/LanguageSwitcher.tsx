'use client';

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  useTransition,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import {Check, ChevronDown, Globe} from 'lucide-react';
import {useLocale, useTranslations} from 'next-intl';
import {usePathname, useRouter} from '@/i18n/navigation';
import {LOCALES} from '@/lib/locales';
import {cn} from '@/lib/utils';

const LAST = LOCALES.length - 1;

/** Gap between trigger and panel, and the minimum breathing room at a viewport edge. */
const GAP = 8;
const EDGE = 8;

/**
 * The panel is positioned before paint, so it must measure after layout. On the
 * server there is nothing to measure and `useLayoutEffect` would warn, so fall
 * back to `useEffect` there — the panel only ever mounts from a click anyway.
 */
const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Locale picker built on the listbox pattern: the trigger owns the accessible
 * name, the panel takes focus and drives selection through `aria-activedescendant`.
 * Every option is labelled in its own script, so Arabic reads right-to-left even
 * while the surrounding page is left-to-right.
 */
export function LanguageSwitcher({
  className,
  align = 'end',
}: {
  className?: string;
  /**
   * Which edge of the trigger the panel hangs from. It has to open inward from
   * whichever edge the trigger is parked against, or it runs off the viewport
   * on narrow screens. The trigger sits at the inline-end of the header, so
   * `end` is the default; a start-parked placement would pass `start`.
   */
  align?: 'start' | 'end';
}) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('nav');
  const [isPending, startTransition] = useTransition();

  const selectedIndex = Math.max(
    0,
    LOCALES.findIndex((l) => l.code === locale),
  );
  const current = LOCALES[selectedIndex];

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(selectedIndex);

  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeahead = useRef<{buffer: string; timer: ReturnType<typeof setTimeout> | null}>({
    buffer: '',
    timer: null,
  });

  const uid = useId();
  const listId = `${uid}-langs`;
  const labelId = `${uid}-langs-label`;
  const optionId = (i: number) => `${uid}-lang-${i}`;

  /** Opening always starts from the language currently in use. */
  const openMenu = useCallback(() => {
    setActiveIndex(selectedIndex);
    setOpen(true);
  }, [selectedIndex]);

  const close = useCallback((returnFocus = true) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  const select = useCallback(
    (index: number) => {
      const next = LOCALES[index];
      close();
      if (!next || next.code === locale) return;
      startTransition(() => {
        router.replace(pathname, {locale: next.code});
      });
    },
    [close, locale, pathname, router],
  );

  /**
   * Anchor the panel to the trigger in viewport coordinates. Written straight to
   * the node rather than through state: this runs on scroll and resize, and a
   * re-render per frame would be wasteful.
   */
  const positionPanel = useCallback(() => {
    const trigger = triggerRef.current;
    const panel = panelRef.current;
    if (!trigger || !panel) return;

    const rect = trigger.getBoundingClientRect();
    const {offsetWidth: width, offsetHeight: height} = panel;

    // `align` is logical, so resolve it against the document's direction to get
    // the physical edge the panel should hang from.
    const rtl = getComputedStyle(trigger).direction === 'rtl';
    const hangRight = align === 'end' ? !rtl : rtl;

    let left = hangRight ? rect.right - width : rect.left;
    left = Math.min(Math.max(EDGE, left), window.innerWidth - width - EDGE);

    // Prefer below; flip above only when below would overflow and above fits.
    let top = rect.bottom + GAP;
    if (top + height > window.innerHeight - EDGE && rect.top - GAP - height > EDGE) {
      top = rect.top - GAP - height;
    }

    panel.style.left = `${Math.round(left)}px`;
    panel.style.top = `${Math.round(top)}px`;
  }, [align]);

  /*
    Promote the panel into the top layer. It lives inside the header (which has a
    backdrop-filter) and inside the mobile menu (which scrolls and is animated by
    a transform) — each of those creates a containing block and a clipping
    context, so `position: fixed` alone would still be trapped and cut off.
    `showPopover()` escapes all of them; where the API is missing the panel stays
    a plain fixed element, which is no worse than before.
  */
  useIsomorphicLayoutEffect(() => {
    const panel = panelRef.current;
    if (!open || !panel) return;

    const supportsPopover = typeof panel.showPopover === 'function';
    if (supportsPopover) panel.showPopover();
    positionPanel();

    const reflow = () => positionPanel();
    window.addEventListener('resize', reflow);
    // Capture phase, so scrolling of any ancestor container is caught too.
    window.addEventListener('scroll', reflow, true);
    return () => {
      window.removeEventListener('resize', reflow);
      window.removeEventListener('scroll', reflow, true);
      if (supportsPopover && panel.isConnected) panel.hidePopover();
    };
  }, [open, positionPanel]);

  // Hand focus to the list once it exists, so arrow keys work immediately.
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => listRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);

  // Dismiss on a press outside the switcher.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  // Keep the highlighted option within the scroll area on long lists.
  useEffect(() => {
    if (!open) return;
    document
      .getElementById(optionId(activeIndex))
      ?.scrollIntoView({block: 'nearest'});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, activeIndex]);

  useEffect(() => {
    const pending = typeahead.current;
    return () => {
      if (pending.timer) clearTimeout(pending.timer);
    };
  }, []);

  /** Jump to the next language whose name starts with what was typed. */
  const runTypeahead = (char: string) => {
    const store = typeahead.current;
    if (store.timer) clearTimeout(store.timer);
    store.buffer += char.toLowerCase();
    store.timer = setTimeout(() => {
      store.buffer = '';
    }, 600);

    const match = LOCALES.findIndex(
      (l) =>
        l.native.toLowerCase().startsWith(store.buffer) ||
        l.english.toLowerCase().startsWith(store.buffer),
    );
    if (match >= 0) setActiveIndex(match);
  };

  const onListKeyDown = (event: ReactKeyboardEvent<HTMLUListElement>) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((i) => (i >= LAST ? 0 : i + 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((i) => (i <= 0 ? LAST : i - 1));
        break;
      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setActiveIndex(LAST);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        select(activeIndex);
        break;
      case 'Escape':
        event.preventDefault();
        close();
        break;
      case 'Tab':
        setOpen(false);
        break;
      default:
        if (event.key.length === 1 && !event.metaKey && !event.ctrlKey) {
          event.preventDefault();
          runTypeahead(event.key);
        }
    }
  };

  const onTriggerKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      openMenu();
    }
  };

  return (
    <div ref={wrapRef} className={cn('relative', className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        disabled={isPending}
        onClick={() => (open ? close(false) : openMenu())}
        onKeyDown={onTriggerKeyDown}
        className={cn(
          // Full height up to `lg`, where the switcher stops being a touch
          // target and a taller pill would push the desktop header down.
          'inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-card py-1.5 pe-2 ps-3 text-[13px] font-semibold text-ink lg:min-h-0',
          'transition-colors duration-200 hover:border-sweet hover:text-sweet-deep',
          open && 'border-sweet text-sweet-deep',
          isPending && 'opacity-60',
        )}
      >
        <Globe className="h-4 w-4 shrink-0 text-ink-soft" aria-hidden />
        <span className="sr-only">{t('language')}</span>
        <span lang={current.code} dir={current.dir}>
          {current.native}
        </span>
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 shrink-0 text-ink-soft transition-transform duration-200',
            open && 'rotate-180',
          )}
          aria-hidden
        />
      </button>

      {open && (
        <div
          ref={panelRef}
          popover="manual"
          className={cn(
            // `inset-auto` and `m-0` undo the UA popover defaults (`inset: 0`,
            // `margin: auto`), which would otherwise fight the measured offsets.
            'fixed inset-auto z-50 m-0 w-[min(17rem,calc(100vw-2rem))] border-0',
            'animate-lang-pop rounded-md bg-card p-1.5 shadow-lift',
          )}
        >
          <p
            id={labelId}
            className="px-2.5 pb-2 pt-1.5 text-[12px] font-semibold text-ink-soft"
          >
            {t('language')}
          </p>
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            tabIndex={-1}
            aria-labelledby={labelId}
            aria-activedescendant={optionId(activeIndex)}
            onKeyDown={onListKeyDown}
            className="max-h-[min(60vh,20rem)] overflow-y-auto outline-none"
          >
            {LOCALES.map((l, i) => {
              const isSelected = i === selectedIndex;
              const isActive = i === activeIndex;
              return (
                <li
                  key={l.code}
                  id={optionId(i)}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => select(i)}
                  onMouseMove={() => setActiveIndex(i)}
                  className={cn(
                    // Seven options in a scrolling panel — each row needs to be
                    // a comfortable target, not a 32px line of text.
                    'flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-sm px-2.5 py-2 text-[14px]',
                    'transition-colors duration-150',
                    isActive && 'bg-sand',
                    isSelected ? 'font-bold text-sweet-deep' : 'font-medium text-ink',
                  )}
                >
                  <span lang={l.code} dir={l.dir} className="truncate">
                    {l.native}
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    <span className="text-[12px] font-medium text-ink-soft">
                      {l.english}
                    </span>
                    {isSelected ? (
                      <Check className="h-4 w-4 text-sweet-deep" aria-hidden />
                    ) : (
                      <span className="h-4 w-4" aria-hidden />
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
