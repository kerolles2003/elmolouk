import * as React from 'react';
import {cva, type VariantProps} from 'class-variance-authority';
import {cn} from '@/lib/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold leading-none transition-all duration-200 disabled:pointer-events-none disabled:opacity-45',
  {
    variants: {
      variant: {
        primary:
          'bg-sweet-deep text-white shadow-sm hover:bg-sweet hover:shadow-card active:bg-sweet-press',
        outline:
          'border-2 border-ink/15 text-ink hover:border-sweet hover:text-sweet-deep',
        soft: 'bg-beige text-ink hover:bg-sand',
        wa: 'bg-wa text-wa-ink hover:brightness-95',
      },
      /*
        Every size carries its own minimum height. Padding alone left the
        default button at 42px and `sm` at 38px on a phone, both under the 44px
        comfortable-target floor. `sm` keeps its smaller height on `lg` screens,
        where it is a pointer target in the desktop header and a taller pill
        would push the whole bar down.
      */
      size: {
        default: 'min-h-11 px-6 py-3 text-[15px]',
        lg: 'min-h-12 px-7 py-3.5 text-base',
        sm: 'min-h-11 px-4 py-2.5 text-[13.5px] lg:min-h-0',
      },
      block: {true: 'w-full', false: ''},
    },
    defaultVariants: {variant: 'primary', size: 'default', block: false},
  },
);

/** Inline text link with an animated arrow (flips in RTL). */
export const textLinkClass =
  'group inline-flex items-center gap-1.5 font-semibold text-sweet-deep transition-colors hover:text-sweet';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({className, variant, size, block, ...props}, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({variant, size, block}), className)}
      {...props}
    />
  ),
);
Button.displayName = 'Button';
