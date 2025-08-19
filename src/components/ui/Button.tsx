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
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-jamaica-green-600 hover:bg-jamaica-green-700 text-white focus:ring-jamaica-green-500',
    secondary: 'bg-jamaica-gold-500 hover:bg-jamaica-gold-600 text-white focus:ring-jamaica-gold-500',
    outline: 'border-2 border-jamaica-green-600 text-jamaica-green-600 hover:bg-jamaica-green-600 hover:text-white focus:ring-jamaica-green-500',
    ghost: 'text-jamaica-green-600 hover:bg-jamaica-green-50 focus:ring-jamaica-green-500',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
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
