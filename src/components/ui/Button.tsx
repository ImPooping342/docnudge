import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm',
      secondary: 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 shadow-sm',
      outline: 'bg-transparent text-slate-700 border border-slate-300 hover:bg-slate-50',
      ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900',
      danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm font-medium',
      lg: 'px-6 py-3 text-base font-semibold',
      icon: 'p-2',
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={cn(
          'inline-flex items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
