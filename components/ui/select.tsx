import * as React from 'react';
import {ChevronDown} from 'lucide-react';
import {cn} from '@/lib/utils';
import {fieldClass} from './input';

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({className, children, ...props}, ref) => (
  <div className="relative">
    {/* Logical `pe`/`end` rather than `pr`/`right`, so the chevron sits on the
        trailing edge in Arabic instead of overlapping the option text. */}
    <select
      ref={ref}
      className={cn(fieldClass, 'appearance-none pe-9', className)}
      {...props}
    >
      {children}
    </select>
    <ChevronDown
      aria-hidden
      className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft"
    />
  </div>
));
Select.displayName = 'Select';
