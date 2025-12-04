/**
 * GradientButton Component
 * 
 * Primary action button with purple-to-pink gradient background
 * Used for main CTAs like "Merge PDF", "Continue to Merge", etc.
 */

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from './utils';

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary';
}

export const GradientButton = forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, children, size = 'md', variant = 'primary', disabled, ...props }, ref) => {
    // Responsive size classes - smaller on mobile, larger on desktop
    const sizeClasses = {
      sm: 'px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm',
      md: 'px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base',
      lg: 'px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg',
    };

    const variantClasses = {
      primary: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700',
      secondary: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
    };

    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center',
          'text-white font-medium',
          'rounded-lg',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2',
          
          // Gradient variant
          variantClasses[variant],
          
          // Size (responsive)
          sizeClasses[size],
          
          // Disabled state
          disabled && 'opacity-50 cursor-not-allowed',
          
          // Custom className
          className
        )}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

GradientButton.displayName = 'GradientButton';
