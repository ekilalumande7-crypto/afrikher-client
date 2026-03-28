import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface AfrikherCardProps extends HTMLAttributes<HTMLDivElement> {
  theme?: 'light' | 'dark';
}

const AfrikherCard = forwardRef<HTMLDivElement, AfrikherCardProps>(
  ({ className, theme = 'light', children, ...props }, ref) => {
    const themeStyles = {
      light: 'bg-white text-afrikher-dark',
      dark: 'bg-afrikher-charcoal text-afrikher-cream',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'overflow-hidden transition-all duration-300',
          themeStyles[theme],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

AfrikherCard.displayName = 'AfrikherCard';

export default AfrikherCard;
