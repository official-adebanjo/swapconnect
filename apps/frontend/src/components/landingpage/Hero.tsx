"use client";

import { create } from "zustand";
import Image from "next/image";
import Link from "next/link";
import CustomNavbar from "./CustomNavbar";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import { ASSETS } from "@/lib/constants";

const slides = [
  {
    title: "Upgrade, Exchange, Elevate",
    desc: "Unlock the power of tech swapping solutions.",
    img: ASSETS.HERO.GAMEPAD,
  },
  {
    title: "Swap Smarter, Live Better.",
    desc: "Unlock the power of tech swapping.",
    img: ASSETS.HERO.PHONE,
  },
  {
    title: "The Future of Device Evolution",
    desc: "Connecting tech enthusiasts, One solution at a time.",
    img: ASSETS.HERO.ANDROID,
  },
];

// Zustand store for carousel index
interface HeroCarouselStore {
  index: number;
  setIndex: (index: number) => void;
  next: () => void;
  prev: () => void;
}

const useHeroCarouselStore = create<HeroCarouselStore>((set) => ({
  index: 0,
  setIndex: (index) => set({ index }),
  next: () =>
    set((state) => ({
      index: state.index === slides.length - 1 ? 0 : state.index + 1,
    })),
  prev: () =>
    set((state) => ({
      index: state.index === 0 ? slides.length - 1 : state.index - 1,
    })),
}));

const Hero: React.FC = () => {
  const { index, setIndex, next } = useHeroCarouselStore();
  const [isImageLoading, setIsImageLoading] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      next();
    }, 5000);

    return () => clearInterval(interval);
  }, [next]);

  // Reset loading state when index changes
  useEffect(() => {
    setIsImageLoading(true);
  }, [index]);

  return (
    <section className="relative w-full min-h-[500px] flex flex-col items-center justify-center py-8">
      {/* Custom Navbar */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <CustomNavbar />
      </div>

      {/* Carousel Container */}
      <div className="relative w-full max-w-6xl mx-auto bg-black rounded-3xl shadow-lg overflow-hidden flex flex-col md:flex-row items-center border border-border">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full flex flex-col md:flex-row items-center"
          >
            {/* Text Column */}
            <div className="flex-1 flex flex-col justify-center items-start p-8 md:p-16">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">
                {slides[index].title}
              </h1>
              <p className="mb-8 text-lg text-white/90">{slides[index].desc}</p>
              <Link href="/swap">
                <button className="bg-brand-primary text-white cursor-pointer rounded-full px-8 py-3 font-semibold text-lg hover:bg-brand-primary-hover transition-all transform hover:scale-105">
                  Get started
                </button>
              </Link>
            </div>
            {/* Image Column */}
            <div className="flex-1 flex items-center justify-center p-8 relative">
              <div className="w-full h-[300px] md:h-[400px] flex items-center justify-center relative">
                {isImageLoading && (
                  <Skeleton className="absolute inset-0 bg-white/10 rounded-2xl" />
                )}
                <Image
                  src={slides[index].img}
                  alt={slides[index].title}
                  width={500}
                  height={400}
                  className={cn(
                    "object-contain h-full max-h-[400px] w-auto transition-opacity duration-500",
                    isImageLoading ? "opacity-0" : "opacity-100",
                  )}
                  onLoadingComplete={() => setIsImageLoading(false)}
                  priority
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Controls (Dots) */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300 border-2",
                i === index
                  ? "bg-brand-primary border-brand-primary w-6"
                  : "bg-white/50 border-transparent hover:bg-white",
              )}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
