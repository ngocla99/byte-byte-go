import type * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'flex w-full min-w-0 rounded-[1px] border border-dashed border-[var(--accent-muted)] bg-[var(--bg200)] px-5 py-[14px] text-[calc(14rem/16)] text-[var(--fgLoud)] outline-none transition-all selection:bg-[var(--fgA700)] file:inline-flex file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-[var(--accent-muted)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fgA900)] focus-visible:border-[var(--accent-rose)]',
        'aria-invalid:border-destructive aria-invalid:outline-destructive/40',
        className
      )}
      data-slot="input"
      type={type}
      {...props}
    />
  );
}

export { Input };
