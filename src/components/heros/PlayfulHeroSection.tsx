  "use client";
  import { cn } from "@/lib/utils";
  import { Music, Sparkles } from "lucide-react";
  import React, { useEffect, useRef } from "react";
  import { RoughNotation, RoughNotationGroup } from "react-rough-notation";
  import { animate, stagger, useInView } from "motion/react";

  export function PlayfulHeroSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    return (
      <section className="w-full bg-gradient-to-br from-primary via-primary to-accent" >
        <div className="mx-auto grid max-h-[50rem] max-w-7xl grid-cols-1 items-center gap-10 overflow-hidden pt-10 sm:grid-cols-2 md:max-h-[40rem] md:pt-20 lg:grid-cols-3">
          <div className="relative px-4 py-10 md:px-8 md:py-10 lg:col-span-2">
            <Sparkles className="absolute -top-4 -left-4 h-10 w-10 text-secondary opacity-70" />
            <Music className="absolute -bottom-8 right-10 h-10 w-10 text-secondary/70 transform -rotate-12" />
            <RoughNotationGroup show={isInView}>
              <h2
                className={cn(
                  "text-center text-2xl font-extrabold tracking-tight text-primary-foreground sm:text-left sm:text-4xl lg:text-7xl",
                )}
              >
                Latest from the{" "}
                <RoughNotation
                  type="highlight"
                  animationDuration={2000}
                  iterations={3}
                  color="#FFD700"
                  multiline
                >
                  <span className="text-currentColor">Dancehall, Reggae and Afro Beats Scene</span>
                </RoughNotation>
              </h2>
              <p className="mt-4 max-w-2xl text-center text-sm text-primary-foreground/90 sm:text-left md:mt-10 md:text-lg">
                Your source for authentic Jamaican music news, artist features,
                and cultural stories.
              </p>
            </RoughNotationGroup>

            <div className="mt-10 flex flex-col items-center gap-4 [perspective:800px] sm:flex-row">
              <button className="w-full origin-left rounded-lg bg-secondary px-4 py-2 text-base font-extrabold text-secondary-foreground transition duration-200 hover:shadow-lg hover:[transform:rotateX(10deg)] sm:w-auto">
                Explore Stories
              </button>
              <button className="rounded-lg border border-accent px-4 py-2 text-base text-primary-foreground transition duration-200 hover:bg-accent/20">
                Artist Spotlight
              </button>
              
            </div>
          </div>
          <div className="relative flex h-full w-full flex-shrink-0 items-center justify-center overflow-hidden">
            <MusicImagery />
          </div>
        </div>
      </section>
    );
  }

  export const MusicImagery = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    useEffect(() => {
      const sequence = [
        [
          ".vinyl-record",
          { opacity: [0, 1], scale: [0.5, 1] },
          { duration: 1, ease: "easeOut" },
        ],
        [
          ".vinyl-record",
          { rotate: 360 },
          { duration: 40, repeat: 19, ease: "linear" },
        ],
        [
          ".music-note",
          { opacity: [0, 1], y: [20, 0], scale: [0.5, 1] },
          { duration: 1, ease: "easeOut", delay: stagger(0.3) },
        ],
        [
          ".sparkle",
          {
            opacity: [0, 1],
            scale: [0, 1],
          },
          {
            duration: 0.8,
            ease: "easeOut",
            delay: stagger(0.2, { from: "last" }),
          },
        ],
      ];

      if (isInView) {
        // @ts-ignore
        animate(sequence);
      }
    }, [isInView]);

    return (
      <div
        ref={ref}
        className="relative flex h-full w-full items-center justify-center"
      >
        <div className="relative h-[300px] w-[300px] red">
          {/* The Vinyl Record */}
          <div className="vinyl-record flex h-full w-full items-center justify-center rounded-full bg-neutral-900/80 shadow-2xl opacity-0 backdrop-blur-sm">
            {/* Grooves */}
            <div className="absolute inset-4 rounded-full border-2 border-neutral-500/10" />
            <div className="absolute inset-8 rounded-full border border-neutral-500/10" />
            <div className="absolute inset-12 rounded-full border-2 border-neutral-500/10" />

            {/* Center Label */}
            <div className="relative flex h-32 w-32 flex-col items-center justify-center rounded-full bg-secondary text-secondary-foreground">
              <Music className="h-10 w-10" />
              <p className="mt-1 text-xs font-bold">JAMAICA</p>
            </div>
            {/* Spindle Hole */}
            <div className="absolute h-4 w-4 rounded-full bg-background" />
          </div>

          {/* Floating music notes and sparkles */}
          <Music className="music-note absolute left-0 top-0 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-primary-foreground opacity-0" />
          <Music className="music-note absolute bottom-1/4 right-0 h-12 w-12 translate-x-1/4 text-secondary opacity-0" />
          <Sparkles className="sparkle absolute -right-4 top-1/4 h-6 w-6 text-secondary opacity-0" />
          <Sparkles className="sparkle absolute -bottom-8 left-1/3 h-8 w-8 text-primary-foreground/70 opacity-0" />
        </div>
      </div>
    );
  };