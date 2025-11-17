import { cva, type VariantProps } from 'class-variance-authority';
import { Slot as SlotPrimitive } from 'radix-ui';
import type * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "relative inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-4 whitespace-nowrap font-normal outline-none transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          'before:-z-[1] rounded-[1px] border border-transparent bg-gradient-to-r from-[#14141c] to-[#14141c] bg-clip-padding text-[#e3b2b3] text-shadow-sm shadow-[0_4px_8px_-1px_rgba(0,0,0,0.64)] before:absolute before:inset-0 before:rounded-[inherit] before:bg-gradient-to-br before:from-[#f5c0c0] before:to-[#ad8eb6] after:pointer-events-none after:absolute after:inset-0 after:z-[1] after:rounded-[inherit] after:border after:border-transparent after:bg-gradient-to-br after:from-[rgba(245,192,192,0.85)] after:to-[rgba(173,142,182,0.5)] after:opacity-20 after:transition-opacity after:duration-250 hover:after:opacity-30 active:after:opacity-60',
        destructive:
          'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20',
        outline:
          'rounded-[1px] border border-[#99797d] border-dashed bg-[#0f0f15] text-[#e3b2b3] shadow-[0_4px_8px_-1px_rgba(0,0,0,0.64),0_1px_4px_0_rgba(245,192,192,0.056)] transition-[filter] duration-300 after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:bg-[length:200px_200px] after:bg-[url("/images/bkg-noise.webp")] after:opacity-[0.0625] hover:brightness-[1.13]',
        secondary:
          'rounded-[1px] border border-[#99797d] border-dashed bg-[#0f0f15] text-[#e3b2b3] shadow-[0_4px_8px_-1px_rgba(0,0,0,0.64),0_1px_4px_0_rgba(245,192,192,0.056)] transition-[filter] duration-300 after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:bg-[length:200px_200px] after:bg-[url("/images/bkg-noise.webp")] after:opacity-[0.0625] hover:brightness-[1.13]',
        ghost: 'hover:bg-[var(--fgA500)] hover:text-[var(--fgLoud)]',
        link: 'text-[var(--fg1200)] underline-offset-4 hover:underline',
      },
      size: {
        default:
          'px-[clamp(18px,15.75px+0.5vw,22px)] py-[clamp(8px,4.625px+0.75vw,14px)] text-[clamp(1rem,0.7797rem+0.4405vw,1.25rem)]',
        sm: 'gap-2 rounded-[1px] px-4 py-2 text-sm',
        lg: 'rounded-[1px] px-6 py-3 text-lg',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? SlotPrimitive.Slot : 'button';

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      data-slot="button"
      {...props}
    />
  );
}

export { Button, buttonVariants };
