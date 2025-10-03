import { type ComponentProps } from 'react';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Case, Default, Switch } from '@/components/utilities/switch-case';
import { cn } from '@/libraries/tailwind-utilities';

interface LoadingButtonProps extends ComponentProps<typeof Button> {
  isLoading?: boolean;
  spinnerClassName?: string;
}

export function LoadingButton({
  children,
  className,
  disabled,
  isLoading,
  spinnerClassName,
  variant,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      className={cn('relative', className)}
      data-is-loading={!!isLoading}
      disabled={isLoading || disabled}
      variant={variant}
      {...props}
    >
      <Switch value={!!isLoading}>
        <Case value>
          <Spinner
            className={cn(
              'absolute top-1/2 left-1/2 -translate-1/2',
              {
                'bg-foreground':
                  variant === 'outline' ||
                  variant === 'ghost' ||
                  variant == 'link',
                'bg-primary-foreground':
                  !variant ||
                  variant === 'default' ||
                  variant === 'destructive',
                'bg-secondary-foreground': variant === 'secondary',
              },
              spinnerClassName,
            )}
            size="sm"
          />
          <span className="opacity-0">{children}</span>
        </Case>
        <Default>{children}</Default>
      </Switch>
    </Button>
  );
}
