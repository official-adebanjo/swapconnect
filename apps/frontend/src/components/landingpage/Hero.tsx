"use client";

import { create } from "zustand";
import Image from "next/image";
import Link from "next/link";
import CustomNavbar from "./CustomNavbar";
import { useEffect } from "react";

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

  // Auto-play functionality (as discussed in previous review)
  useEffect(() => {
    const interval = setInterval(() => {
      next();
    }, 5000);

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [next]);

  return (
    <section className="relative w-full min-h-[500px] flex flex-col items-center justify-center py-8">
      {/* Custom Navbar */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <CustomNavbar />
      </div>

      {/* Carousel Container */}
      <div className="relative w-full max-w-6xl mx-auto bg-black rounded-3xl shadow-lg overflow-hidden flex flex-col md:flex-row items-center">
        {/* Text Column */}
        <div className="flex-1 flex flex-col justify-center items-start p-8 md:p-16">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">
            {slides[index].title}
          </h1>
          <p className="mb-8 text-lg text-white">{slides[index].desc}</p>
          <Link href="/swap">
            <button className="bg-green-700 text-white cursor-pointer rounded-full px-8 py-3 font-semibold text-lg hover:bg-green-800 transition">
              Get started
            </button>
          </Link>
        </div>
        {/* Image Column */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full h-[300px] md:h-[400px] flex items-center justify-center">
            <Image
              src={slides[index].img}
              alt={slides[index].title}
              width={500}
              height={400}
              className="object-contain h-full max-h-[400px] w-auto"
              priority
            />
          </div>
        </div>

        {/* Carousel Controls (Dots) - Moved inside the main carousel container */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`w-3 h-3 rounded-full cursor-pointer border-2 border-green-700 transition ${
                i === index ? "bg-green-700" : "bg-white"
              }`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
