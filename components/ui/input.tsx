import * as React from 'react';
import {cn} from '@/lib/utils';

/*
  The 16px base size is load-bearing, not a style choice: Safari on iOS zooms
  the whole viewport when a focused field is under 16px, and the page never
  zooms back out. Fields step down to the designed 14.5px from `sm` up, where
  no touch keyboard is in play. `min-h-11` keeps every field a comfortable
  target once the smaller type shrinks the padding box.

  The focus ring is sweet-deep (#a8481c) at 16% — the same accent the buttons
  use, so a focused field and a pressed button read as one system.
*/
const fieldClass =
  'w-full min-h-11 rounded-md border border-line bg-white px-3 py-[11px] text-[16px] text-ink placeholder:text-ink-soft/55 transition-colors focus:border-sweet-deep focus:outline-none focus:shadow-[0_0_0_3px_rgba(168,72,28,0.16)] aria-[invalid=true]:border-danger aria-[invalid=true]:shadow-[0_0_0_3px_rgba(178,58,46,0.14)] sm:text-[14.5px]';

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({className, ...props}, ref) => (
  <input ref={ref} className={cn(fieldClass, className)} {...props} />
));
Input.displayName = 'Input';

export {fieldClass};
