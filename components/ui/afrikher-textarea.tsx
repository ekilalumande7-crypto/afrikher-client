import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface AfrikherTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const AfrikherTextarea = forwardRef<HTMLTextAreaElement, AfrikherTextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-sans font-medium mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full px-4 py-3 font-sans text-base',
            'border-2 border-afrikher-gray',
            'bg-transparent',
            'focus:outline-none focus:border-afrikher-gold',
            'transition-colors duration-300',
            'placeholder:text-afrikher-gray',
            'min-h-[120px]',
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

AfrikherTextarea.displayName = 'AfrikherTextarea';

export default AfrikherTextarea;
