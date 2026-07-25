'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import logoImg from '@/assets/logo.png';

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
    }, 900);

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
          className="fixed inset-0 z-[9999] bg-[#0B0B0B] flex flex-col items-center justify-center pointer-events-none"
        >
          <div className="relative flex flex-col items-center justify-center p-8">
            {/* Animated glowing ring background */}
            <motion.div
              animate={{ 
                rotate: 360
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="absolute w-44 h-44 md:w-56 md:h-56 rounded-full border-2 border-t-[#E8B84B] border-r-transparent border-b-[#009B3A] border-l-transparent blur-[1px]"
            />

            {/* Pulsing Glow behind Logo */}
            <motion.div
              animate={{ scale: [0.95, 1.1, 0.95], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-36 h-36 md:w-48 md:h-48 rounded-full bg-gradient-to-r from-[#E8B84B]/30 to-[#009B3A]/20 blur-xl"
            />

            {/* Main Logo Container */}
            <motion.div
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative w-48 md:w-64 h-20 md:h-24 flex items-center justify-center z-10"
            >
              <Image
                src={logoImg}
                alt="YaadFeed"
                priority
                className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(232,184,75,0.4)]"
              />
            </motion.div>

            {/* Subtle animated bar indicator below logo */}
            <div className="w-32 h-[3px] bg-white/10 rounded-full overflow-hidden mt-6 relative z-10">
              <motion.div
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-full h-full bg-gradient-to-r from-transparent via-[#E8B84B] to-transparent"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

