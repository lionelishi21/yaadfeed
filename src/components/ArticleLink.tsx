'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PageLoader } from '@/components/ui/Loading';

interface ArticleLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const ArticleLink: React.FC<ArticleLinkProps> = ({ 
  href, 
  children, 
  className = '',
  onClick 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Call custom onClick if provided
    if (onClick) {
      onClick();
    }

    // Show loading state
    setIsLoading(true);

    try {
      // Navigate to the article
      router.push(href);
    } catch (error) {
      // Hide loading on error
      setIsLoading(false);
      console.error('Navigation error:', error);
    }
  };

  return (
    <>
      <Link 
        href={href}
        className={className}
        onClick={handleClick}
      >
        {children}
      </Link>
      
      {isLoading && (
        <PageLoader text="Loading article..." />
      )}
    </>
  );
};

export default ArticleLink; 