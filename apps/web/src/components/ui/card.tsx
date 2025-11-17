import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';

import { cn } from '@/lib/utils';

const cardVariants = cva(
  'relative flex flex-col gap-6 py-6 text-card-foreground transition-all',
  {
    variants: {
      variant: {
        default:
          'rounded-lg border border-[rgba(92,177,152,0.2)] bg-[var(--bg200)] shadow-2 noise-texture hover:-translate-y-1 hover:border-[rgba(92,177,152,0.32)]',
        glass:
          'rounded-lg [background-image:radial-gradient(circle_at_66.66%_50%,rgba(26,26,37,0.5)_0%,rgba(15,15,21,0.5)_80%)] shadow-3',
        outline:
          'rounded-lg border border-[var(--grid500)] bg-background shadow-1',
        flat:
          'rounded-lg bg-card',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Card({
  className,
  variant,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof cardVariants>) {
  return (
    <div
      className={cn(cardVariants({ variant, className }))}
      data-slot="card"
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-[clamp(24px,10.5px+3vw,48px)] has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className
      )}
      data-slot="card-header"
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('heading-4 text-[var(--fgLoud)]', className)}
      data-slot="card-title"
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('text-muted-foreground text-sm', className)}
      data-slot="card-description"
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className
      )}
      data-slot="card-action"
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('px-[clamp(24px,10.5px+3vw,48px)]', className)}
      data-slot="card-content"
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex items-center px-[clamp(24px,10.5px+3vw,48px)] [.border-t]:pt-6', className)}
      data-slot="card-footer"
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
