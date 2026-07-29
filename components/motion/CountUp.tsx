'use client';

import {useEffect, useMemo, useRef} from 'react';
import {animate, useReducedMotion} from 'framer-motion';
import {EASE_OUT} from './config';

/** Anything below this reads as a label, not a quantity — don't count it. */
const MIN_WORTH_COUNTING = 100;

/**
 * Leading text, the number, then trailing text: "30,000 t" · "Nr. 1".
 * The digit run may carry any grouping mark the dictionaries actually use:
 * comma, period, plain space, no-break space, narrow no-break space.
 */
const SHAPE = /^(\D*)(\d[\d.,   ]*\d|\d)([\s\S]*)$/;

type Parsed = {prefix: string; suffix: string; group: string; target: number};

/**
 * Read a translated stat without imposing a format on it.
 *
 * The seven dictionaries write the same figure seven ways — `30,000 t`,
 * `30.000 t`, `30 000 t`. Reformatting with `Intl.NumberFormat` would override
 * the translator and, for Arabic, swap the copy's Latin digits for Arabic-Indic
 * ones. So we lift the separator the copy already uses and count in that.
 */
function parse(value: string): Parsed | null {
  const match = SHAPE.exec(value);
  if (!match) return null;

  const [, prefix, digits, suffix] = match;
  const group = digits.replace(/\d/g, '').charAt(0) ?? '';
  const target = Number(digits.replace(/\D/g, ''));

  if (!Number.isFinite(target) || target < MIN_WORTH_COUNTING) return null;
  return {prefix, suffix, group, target};
}

function format(n: number, {prefix, suffix, group}: Parsed) {
  const digits = String(Math.round(n));
  const grouped = group ? digits.replace(/\B(?=(\d{3})+(?!\d))/g, group) : digits;
  return `${prefix}${grouped}${suffix}`;
}

/**
 * Counts a stat up to the figure it already reads.
 *
 * The server renders the final string, so the markup, the accessibility tree and
 * the first client render all agree — the count is an enhancement layered on
 * after hydration, never the source of truth. An invisible copy of the final
 * string holds the width open, so a figure growing from one digit to six cannot
 * push the line around it.
 *
 * Frames are written straight to the text node rather than through state. A
 * counter ticks about sixty times a second, and re-rendering the component on
 * every tick would put React's reconciler between the animation and the screen
 * for a value no other component reads.
 */
export function CountUp({
  value,
  className,
  delay = 0,
}: {
  value: string;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const parsed = useMemo(() => parse(value), [value]);

  useEffect(() => {
    const node = ref.current;
    if (!node || !parsed || reduce) return;

    node.textContent = format(0, parsed);
    const controls = animate(0, parsed.target, {
      duration: 0.9,
      delay,
      ease: EASE_OUT,
      onUpdate: (n) => {
        node.textContent = format(n, parsed);
      },
      // Land on the translator's exact string rather than our reconstruction.
      onComplete: () => {
        node.textContent = value;
      },
    });
    return () => {
      controls.stop();
      node.textContent = value;
    };
  }, [parsed, reduce, delay, value]);

  // Stats that carry no quantity — "United Kingdom & Europe" — simply render.
  if (!parsed) return <span className={className}>{value}</span>;

  return (
    <span className={`inline-grid tabular-nums ${className ?? ''}`}>
      <span aria-hidden className="invisible col-start-1 row-start-1">
        {value}
      </span>
      <span ref={ref} className="col-start-1 row-start-1">
        {value}
      </span>
    </span>
  );
}
