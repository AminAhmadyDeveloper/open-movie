import { type VariantProps, cva } from 'class-variance-authority';

import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';

import { cn } from '@/libraries/tailwind-utilities';

const spinnerVariants = cva('relative block opacity-[0.65]', {
  defaultVariants: {
    size: 'sm',
  },
  variants: {
    size: {
      lg: 'h-8 w-8',
      md: 'h-6 w-6',
      sm: 'h-4 w-4',
    },
  },
});

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof spinnerVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  (
    { asChild = false, className, loading = true, size, ...props },
    reference,
  ) => {
    const Comp = asChild ? Slot : 'span';

    const [bgColorClass, filteredClassName] = React.useMemo(() => {
      const bgClass = className?.match(/(?:dark:bg-|bg-)[a-zA-Z0-9-]+/g) || [];
      const filteredClasses = className
        ?.replaceAll(/(?:dark:bg-|bg-)[a-zA-Z0-9-]+/g, '')
        .trim();
      return [bgClass, filteredClasses];
    }, [className]);

    if (!loading) return null;

    return (
      <Comp
        className={cn(spinnerVariants({ className: filteredClassName, size }))}
        ref={reference}
        {...props}
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <span
            className="absolute top-0 left-1/2 h-full w-[12.5%] animate-spinner-leaf-fade"
            key={index}
            style={{
              animationDelay: `${-(7 - index) * 100}ms`,
              transform: `rotate(${index * 45}deg)`,
            }}
          >
            <span
              className={cn('block h-[30%] w-full rounded-full', bgColorClass)}
            ></span>
          </span>
        ))}
      </Comp>
    );
  },
);

Spinner.displayName = 'Spinner';

export { Spinner, spinnerVariants };
