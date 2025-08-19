'use client';

import React from 'react';
import { cn } from '@/utils';
import { CardProps } from '@/types';

interface ExtendedCardProps extends CardProps {
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'news' | 'artist' | 'event';
  style?: React.CSSProperties;
}

const Card: React.FC<ExtendedCardProps> = ({
  children,
  className,
  onClick,
  hover = true,
  padding = 'md',
  variant = 'default',
  style,
}) => {
  const baseClasses = 'bg-white rounded-xl border border-gray-100 transition-all duration-200';
  
  const variantClasses = {
    default: 'shadow-md',
    news: 'shadow-md overflow-hidden',
    artist: 'shadow-lg bg-gradient-to-br from-white to-gray-50',
    event: 'shadow-md border-l-4 border-l-jamaica-gold-500',
  };

  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const hoverClasses = hover ? 'hover:shadow-xl hover:-translate-y-1' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        paddingClasses[padding],
        hoverClasses,
        clickableClasses,
        className
      )}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
};

export default Card;
