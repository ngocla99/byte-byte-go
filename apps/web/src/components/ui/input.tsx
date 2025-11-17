import type * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'flex h-auto w-full min-w-0 rounded-[1px] border border-dashed border-[#99797d] bg-[#0f0f15] px-5 py-3.5 text-[calc(14rem/16)] text-white outline-none transition-[border-color] selection:bg-[var(--fgA700)] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-[#99797d] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'focus:outline-[var(--app-focus-outline)] focus:outline-offset-[var(--app-focus-outline-offset)] focus:border-[#e3b2b3]',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
        className
      )}
      data-slot="input"
      type={type}
      {...props}
    />
  );
}

export { Input };
