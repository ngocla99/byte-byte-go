import { cva, type VariantProps } from 'class-variance-authority';
import { Slot as SlotPrimitive } from 'radix-ui';
import type * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center gap-4 whitespace-nowrap font-normal outline-none transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fgA900)] disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          'rounded-[1px] border border-transparent bg-[linear-gradient(to_right,var(--bg100),var(--bg100)),linear-gradient(45deg,#f5c0c0,#ad8eb6)] bg-clip-[padding-box,border-box] bg-origin-[padding-box,border-box] text-[var(--accent-rose)] text-shadow hover:opacity-90 [box-shadow:0_4px_8px_-1px_rgba(0,0,0,0.64)]',
        destructive:
          'rounded-[1px] bg-destructive text-white hover:opacity-90 [box-shadow:0_4px_8px_-1px_rgba(0,0,0,0.64)]',
        outline:
          'rounded-[1px] border border-dashed border-[var(--accent-muted)] bg-background text-[var(--fg1200)] hover:brightness-[1.13] relative noise-texture',
        secondary:
          'rounded-[1px] border border-dashed border-[var(--accent-muted)] bg-[var(--bg200)] text-[var(--fg1200)] hover:brightness-[1.13] relative noise-texture',
        ghost:
          'rounded-[1px] hover:bg-[var(--fgA500)] text-[var(--fg1200)]',
        link: 'text-[var(--fg1200)] border-b border-[var(--fg1200)] rounded-none hover:bg-[var(--fgA500)] active:bg-[var(--fgA700)] transition-[background-color] duration-100',
      },
      size: {
        default: 'px-[clamp(18px,15.75px+0.5vw,22px)] py-[clamp(8px,4.625px+0.75vw,14px)] text-[clamp(1rem,0.7797rem+0.4405vw,1.25rem)] has-[>svg]:px-4',
        sm: 'px-4 py-2 text-sm has-[>svg]:px-3',
        lg: 'px-[clamp(22px,18px+0.75vw,28px)] py-[clamp(10px,6px+1vw,16px)] text-[clamp(1.125rem,0.9rem+0.5vw,1.375rem)] has-[>svg]:px-5',
        icon: 'size-9 p-0',
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
