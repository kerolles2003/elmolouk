import {cn} from '@/lib/utils';

/**
 * A value that is still waiting on the client.
 *
 * Every launch-blocking detail on the site is written as `[[confirm …]]` (see
 * lib/site.ts and docs/03-launch-dependencies.md). Printed as plain body copy
 * on a finished-looking page those read as bugs, so anything still bracketed is
 * drawn as a dashed chip: unmistakably a slot, deliberately left open, and easy
 * to spot when the real details arrive.
 */
export function ConfirmValue({
  value,
  onDark = false,
  className,
}: {
  value: string;
  onDark?: boolean;
  className?: string;
}) {
  if (!value.includes('[[')) {
    return <span className={className}>{value}</span>;
  }

  return (
    <span
      className={cn(
        /* `w-fit` matters: these chips often sit in a flex column, where an
           inline-block would stretch to the full card width. */
        'inline-block w-fit rounded-md border border-dashed px-2 py-0.5',
        onDark ? 'border-amber/45 text-amber/90' : 'border-gold bg-gold/8 text-ink-soft',
        className,
      )}
    >
      {value}
    </span>
  );
}
