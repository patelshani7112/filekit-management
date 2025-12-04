/**
 * OutlineButton Component
 * 
 * Reusable purple outline button used throughout WorkflowPro.
 * Matches the design system with consistent hover states.
 * 
 * Usage:
 * <OutlineButton onClick={handleClick}>
 *   <Icon className="w-4 h-4" />
 *   Button Text
 * </OutlineButton>
 * 
 * <OutlineButton variant="danger" onClick={handleDelete}>
 *   Delete
 * </OutlineButton>
 */

import React from 'react';
import { cn } from './utils';

export interface OutlineButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const variantStyles = {
  primary: 'border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white',
  danger: 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white',
  success: 'border-green-500 text-green-500 hover:bg-green-500 hover:text-white',
};

const sizeStyles = {
  sm: 'px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm rounded-lg',
  md: 'px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded-lg',
  lg: 'px-4 py-2 sm:px-6 sm:py-2.5 text-base sm:text-base rounded-xl',
};

export function OutlineButton({
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  children,
  ...props
}: OutlineButtonProps) {
  return (
    <button
      className={cn(
        // Base styles
        'inline-flex items-center justify-center gap-2',
        'border-2 bg-transparent',
        'font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent',
        
        // Variant styles
        variantStyles[variant],
        
        // Size styles
        sizeStyles[size],
        
        // Disabled state - prevent hover effects
        disabled && 'hover:!bg-transparent hover:!text-current',
        
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
