import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface AfrikherInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const AfrikherInput = forwardRef<HTMLInputElement, AfrikherInputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-sans font-medium mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-3 font-sans text-base',
            'border-2 border-afrikher-gray',
            'bg-transparent',
            'focus:outline-none focus:border-afrikher-gold',
            'transition-colors duration-300',
            'placeholder:text-afrikher-gray',
            error && 'border-red-500',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500 font-sans">{error}</p>
        )}
      </div>
    );
  }
);

AfrikherInput.displayName = 'AfrikherInput';

export default AfrikherInput;
