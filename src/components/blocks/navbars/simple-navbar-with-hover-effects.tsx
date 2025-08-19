"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import React, { useState } from "react";
import { Bell, DiscAlbum, Menu, Search, X } from "lucide-react";

export function SimpleNavbarWithHoverEffects() {
  return <Navbar />;
}

const Navbar = () => {
  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'News', href: '/news' },
    { name: 'Artists', href: '/artists' },
    { name: 'Events', href: '/events' },
    { name: 'Demand', href: '/demand' },
    { name: 'Newsletter', href: '/newsletter' },
  ];

  return (
    <div className="w-full bg-[#1C1C1C]">
      <DesktopNav navItems={navItems} />
      <MobileNav navItems={navItems} />
    </div>
  );
};

const DesktopNav = ({ navItems }: any) => {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <motion.div
      onMouseLeave={() => {
        setHovered(null);
      }}
      className={cn(
        "relative z-[60] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start rounded-full bg-[#1C1C1C] px-4 py-2 lg:flex",
        "sticky inset-x-0 top-4"
      )}
    >
      <Logo />
      <div className="hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium lg:flex">
        {navItems.map((navItem: any, idx: number) => (
          <Link
            onMouseEnter={() => setHovered(idx)}
            className={cn(
              "relative px-4 py-2 transition-colors duration-300",
              hovered === idx ? "text-secondary" : "text-neutral-300"
            )}
            key={`link=${idx}`}
            href={navItem.link}
          >
            {hovered === idx && (
              <motion.div
                layoutId="hovered"
                className="absolute inset-0 -z-10 h-full w-full rounded-full bg-primary"
                transition={{
                  duration: 0.3,
                  type: "spring",
                  stiffness: 120,
                  damping: 20,
                }}
              />
            )}
            <motion.span
              className="relative z-10"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.1 }}
            >
              {navItem.name}
            </motion.span>
          </Link>
        ))}
      </div>
      <div className="hidden flex-row items-center gap-4 lg:flex">
        <button
          aria-label="Search"
          className="text-neutral-300 transition-colors duration-200 hover:text-primary"
        >
          <Search className="h-5 w-5" />
        </button>
        <button
          aria-label="Notifications"
          className="text-neutral-300 transition-colors duration-200 hover:text-primary"
        >
          <Bell className="h-5 w-5" />
        </button>
        <button className="rounded-full bg-accent px-6 py-2 text-sm font-medium text-accent-foreground transition-transform duration-200 hover:scale-105">
          Submit Story
        </button>
      </div>
    </motion.div>
  );
};

const MobileNav = ({ navItems }: any) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.div
        animate={{ borderRadius: open ? "0.5rem" : "2rem" }}
        key={String(open)}
        className="relative mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between bg-[#1C1C1C] px-4 py-2 lg:hidden"
      >
        <div className="flex w-full flex-row items-center justify-between">
          <Logo />
          {open ? (
            <X className="text-background" onClick={() => setOpen(!open)} />
          ) : (
            <Menu className="text-background" onClick={() => setOpen(!open)} />
          )}
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-x-0 top-16 z-50 flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-[#1C1C1C] px-4 py-8"
            >
              {navItems.map((navItem: any, idx: number) => (
                <Link
                  key={`link=${idx}`}
                  href={navItem.link}
                  className="w-full rounded-md px-4 py-2 text-neutral-300 transition-colors duration-200 hover:bg-primary hover:text-background"
                >
                  <motion.span className="block">{navItem.name} </motion.span>
                </Link>
              ))}
              <div className="mt-4 flex w-full items-center justify-center gap-6 border-t border-neutral-800 pt-6">
                <button
                  aria-label="Search"
                  className="text-neutral-300 transition-colors hover:text-primary"
                >
                  <Search className="h-6 w-6" />
                </button>
                <button
                  aria-label="Notifications"
                  className="text-neutral-300 transition-colors hover:text-primary"
                >
                  <Bell className="h-6 w-6" />
                </button>
              </div>
              <button className="mt-4 w-full rounded-lg bg-accent px-8 py-3 font-medium text-accent-foreground transition-transform hover:scale-105">
                Submit Story
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

const Logo = () => {
  return (
    <Link
      href="/"
      className="relative z-20 flex items-center gap-2 text-lg font-bold"
    >
      <DiscAlbum className="h-7 w-7 text-secondary" />
      <span className="font-bold text-background">YaadFeed</span>
    </Link>
  );
};