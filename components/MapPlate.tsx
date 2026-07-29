import {MapPin} from 'lucide-react';
import {cn} from '@/lib/utils';

/**
 * Standing in for the embedded map.
 *
 * No coastline, no road network, no invented geography — a survey grid, one
 * marker and a note saying what belongs here. It reads as a reserved slot
 * rather than a map that happens to be wrong, and swapping in the real embed
 * later is a single replacement.
 */
export function MapPlate({
  label,
  pin,
  className,
}: {
  label: string;
  pin: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        'relative overflow-hidden rounded-[28px] border border-cream/12 bg-soil-2',
        className,
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(251,245,234,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(251,245,234,0.07) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      {/* Warm light behind the marker, so the pin sits in something. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber/12 blur-3xl"
      />

      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2.5">
        <span className="relative grid h-11 w-11 place-items-center rounded-full bg-amber text-soil shadow-lift">
          <MapPin className="h-5 w-5" aria-hidden />
          <span aria-hidden className="absolute -inset-2 rounded-full ring-1 ring-amber/35" />
        </span>
        <span className="whitespace-nowrap rounded-full bg-soil/85 px-3 py-1 text-[12.5px] font-bold text-cream">
          {pin}
        </span>
      </div>

      <span className="absolute bottom-4 start-4 max-w-[85%] rounded-full border border-cream/15 bg-soil/70 px-3 py-1.5 text-[11.5px] leading-snug text-cream/70">
        {label}
      </span>
    </div>
  );
}
