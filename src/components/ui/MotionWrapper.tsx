'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';

interface MotionWrapperProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
}

// Safe motion components for SSR with React 19 compatibility
export const SafeMotionDiv = ({ children, className = '', ...props }: MotionWrapperProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} {...props}>
      {children}
    </motion.div>
  );
};

export const SafeMotionSection = ({ children, className = '', ...props }: MotionWrapperProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <section className={className}>{children}</section>;
  }

  return (
    <motion.section className={className} {...props}>
      {children}
    </motion.section>
  );
};

export const SafeMotionArticle = ({ children, className = '', ...props }: MotionWrapperProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <article className={className}>{children}</article>;
  }

  return (
    <motion.article className={className} {...props}>
      {children}
    </motion.article>
  );
};
