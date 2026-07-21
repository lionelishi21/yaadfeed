'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Show preloader on route changes
    setIsLoading(true);
    
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] bg-[#0B0B0B] flex items-center justify-center pointer-events-none"
        >
          <div className="relative w-32 h-32 md:w-48 md:h-48">
            <Image
              src="/logo.gif"
              alt="Loading..."
              fill
              className="object-contain"
              priority
              unoptimized // Use unoptimized for animated GIFs to ensure they animate properly
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
