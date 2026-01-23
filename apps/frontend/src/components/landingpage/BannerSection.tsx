"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const BannerSection: React.FC = () => {
  return (
    <section
      className={cn(
        "relative w-full h-[300px] md:h-[400px] overflow-hidden my-16",
      )}
    >
      <Image
        src="https://res.cloudinary.com/ds83mhjcm/image/upload/v1719573354/SwapConnect/home/home-banner_h9gjlp.png"
        alt="SwapConnect Home Banner"
        fill
        className="object-cover"
        quality={100}
        priority
      />

      {/* Premium Overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent flex items-center">
        <div className="container max-w-6xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <h2 className="text-white text-3xl md:text-5xl font-black mb-4 leading-tight">
              Premium Tech <br />
              <span className="text-brand-primary">Swapping</span> Experience
            </h2>
            <p className="text-white/80 text-lg md:text-xl font-medium mb-8">
              Connecting tech enthusiasts across the globe. Buy, Sell, and Swap
              with confidence.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-brand-primary/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-20 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
    </section>
  );
};

export default BannerSection;
