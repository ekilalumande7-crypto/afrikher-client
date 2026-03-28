import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface AfrikherBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'gold' | 'dark' | 'light';
}

const AfrikherBadge = forwardRef<HTMLSpanElement, AfrikherBadgeProps>(
  ({ className, variant = 'gold', children, ...props }, ref) => {
    const variants = {
      gold: 'bg-afrikher-gold text-afrikher-dark',
      dark: 'bg-afrikher-dark text-afrikher-cream',
      light: 'bg-afrikher-cream text-afrikher-dark',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center px-3 py-1 text-xs font-sans font-medium uppercase tracking-wide',
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

AfrikherBadge.displayName = 'AfrikherBadge';

export default AfrikherBadge;
