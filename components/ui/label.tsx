import * as React from 'react';
import {cn} from '@/lib/utils';

export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement> & {required?: boolean}
>(({className, children, required, ...props}, ref) => (
  <label
    ref={ref}
    className={cn('text-[12.5px] font-semibold text-ink', className)}
    {...props}
  >
    {children}
    {required && <span className="text-sweet-deep"> *</span>}
  </label>
));
Label.displayName = 'Label';
