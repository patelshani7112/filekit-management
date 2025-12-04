/**
 * DottedButton Component
 * 
 * Reusable button with dotted border that fills on hover.
 * Used for "Add Files" and similar additive actions throughout WorkflowPro.
 * 
 * Design Pattern:
 * - Default: Dotted/dashed purple border, purple text, transparent background
 * - Hover: Solid purple background, white text, solid border
 * 
 * Usage:
 * <DottedButton onClick={handleAddFiles}>
 *   <Plus className="w-4 h-4" />
 *   Add Files
 * </DottedButton>
 * 
 * <DottedButton variant="primary" size="md">
 *   <Icon className="w-5 h-5" />
 *   Action
 * </DottedButton>
 */

import React from 'react';
import { cn } from './utils';

export interface DottedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const variantStyles = {
  primary: 'border-purple-600 text-purple-600 hover:bg-[#A855F7] hover:text-white hover:border-[#A855F7]',
  secondary: 'border-gray-400 text-gray-600 hover:bg-gray-600 hover:text-white hover:border-gray-600',
  success: 'border-green-500 text-green-500 hover:bg-green-500 hover:text-white hover:border-green-500',
};

const sizeStyles = {
  sm: 'px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm rounded-lg',
  md: 'px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded-lg',
  lg: 'px-4 py-2 sm:px-6 sm:py-2.5 text-base sm:text-base rounded-xl',
};

export function DottedButton({
  variant = 'primary',
  size = 'sm',
  className,
  disabled,
  children,
  ...props
}: DottedButtonProps) {
  return (
    <button
      className={cn(
        // Base styles
        'inline-flex items-center justify-center gap-2',
        'bg-transparent',
        'border-2 border-dashed', // Dotted/dashed border
        'font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent',
        
        // Hover: Change to solid border
        'hover:border-solid',
        
        // Variant styles
        variantStyles[variant],
        
        // Size styles
        sizeStyles[size],
        
        // Disabled state - prevent hover effects
        disabled && 'hover:!bg-transparent hover:!text-current hover:!border-dashed',
        
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
