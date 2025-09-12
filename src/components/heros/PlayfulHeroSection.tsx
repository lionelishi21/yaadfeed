"use client";
import { cn } from "@/lib/utils";
import { Music, ArrowRight, Sparkles } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { motion } from "motion";
import Link from "next/link";

export function PlayfulHeroSection() {
  const ref = useRef(null);

  return (
    <section className="relative bg-gradient-to-br from-logo-primary to-logo-dark text-white py-20 lg:py-32 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-logo-secondary rounded-full"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-logo-accent rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-logo-secondary rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Latest from Jamaica
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Latest from the{' '}
              <span className="text-logo-secondary">Dancehall</span>{' '}
              Scene
            </h1>
            
            <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Your source for authentic Jamaican music news, artist features, and cultural stories from the heart of the Caribbean.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/news">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center px-8 py-4 bg-logo-secondary text-gray-900 font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                >
                  Explore Stories
                  <ArrowRight className="ml-2 w-5 h-5" />
                </motion.button>
              </Link>
              
              <Link href="/artists">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center px-8 py-4 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-200"
                >
                  Artist Spotlight
                </motion.button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex justify-center lg:justify-start mt-12 space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold">10K+</div>
                <div className="text-white/70 text-sm">Active Readers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">500+</div>
                <div className="text-white/70 text-sm">Articles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">50+</div>
                <div className="text-white/70 text-sm">Artists</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Main Hero Image */}
              <div className="relative w-80 h-80 lg:w-96 lg:h-96 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-logo-secondary/20 to-transparent rounded-2xl"></div>
                <div className="relative z-10">
                  <Music className="w-24 h-24 text-logo-secondary" />
                </div>
              </div>
              
              {/* Floating Elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 w-16 h-16 bg-logo-secondary/20 backdrop-blur-sm rounded-full border border-white/20 flex items-center justify-center"
              >
                <Sparkles className="w-6 h-6 text-logo-secondary" />
              </motion.div>
              
              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -left-4 w-12 h-12 bg-logo-accent/20 backdrop-blur-sm rounded-full border border-white/20 flex items-center justify-center"
              >
                <Music className="w-4 h-4 text-logo-accent" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export const MusicImagery = () => {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="relative h-[300px] w-[300px]">
        <div className="flex h-full w-full items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
          <Music className="h-16 w-16 text-logo-secondary" />
        </div>
      </div>
    </div>
  );
};