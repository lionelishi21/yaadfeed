'use client';

import React from 'react';
import { cn } from '@/utils';
import { ButtonProps } from '@/types';
import { Loader2 } from 'lucide-react';

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  onClick,
  disabled = false,
  loading = false,
  type = 'button',
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-logo-primary text-white hover:bg-logo-dark shadow-sm hover:shadow-md focus:ring-logo-primary/30',
    secondary: 'bg-logo-secondary text-gray-900 hover:bg-logo-secondary/90 shadow-sm hover:shadow-md focus:ring-logo-secondary/30',
    accent: 'bg-logo-accent text-white hover:bg-logo-accent/90 shadow-sm hover:shadow-md focus:ring-logo-accent/30',
    outline: 'border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:ring-gray-300 bg-white',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-300',
    soft: 'bg-white/95 backdrop-blur-sm border border-white/50 text-gray-700 hover:bg-white shadow-soft hover:shadow-soft-lg focus:ring-gray-300',
    glamour: 'bg-gradient-to-r from-logo-primary to-logo-dark text-white shadow-sm hover:shadow-md focus:ring-logo-primary/30',
    flat: 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:ring-gray-300',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  };

  return (
    <button
      type={type}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
      {children}
    </button>
  );
};

export default Button;
