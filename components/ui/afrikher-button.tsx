import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface AfrikherButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'outline' | 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
}

const AfrikherButton = forwardRef<HTMLButtonElement, AfrikherButtonProps>(
  ({ className, variant = 'gold', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-sans font-medium transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group';

    const variants = {
      gold: 'border-2 border-afrikher-gold text-afrikher-gold bg-transparent hover:text-afrikher-dark',
      outline: 'border-2 border-afrikher-gold text-afrikher-gold bg-transparent hover:text-afrikher-dark',
      dark: 'bg-afrikher-dark text-afrikher-cream hover:bg-afrikher-charcoal',
      light: 'bg-afrikher-cream text-afrikher-dark hover:bg-opacity-90',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-3 text-sm tracking-wide',
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {(variant === 'outline' || variant === 'gold') && (
          <span className="absolute inset-0 bg-afrikher-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left -z-10" />
        )}
        <span className="relative z-10">{children}</span>
      </button>
    );
  }
);

AfrikherButton.displayName = 'AfrikherButton';

export default AfrikherButton;
