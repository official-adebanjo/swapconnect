"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface IconTextItem {
  icon: string;
  title: string;
  subtitle: string;
}

interface IconTextSectionProps {
  icon: string;
  title: string;
  subtitle: string;
}

const IconTextSection: React.FC<IconTextSectionProps> = ({
  icon,
  title,
  subtitle,
}) => (
  <motion.div
    whileHover={{ y: -5 }}
    className={cn(
      "flex items-center p-4 rounded-2xl bg-white border border-border/50 shadow-sm hover:shadow-md transition-all duration-300",
    )}
  >
    <div className="bg-brand-primary/10 p-3 rounded-xl mr-4 shrink-0">
      <Image
        src={icon}
        alt={title}
        width={32}
        height={32}
        className="w-8 h-8 object-contain"
        unoptimized
      />
    </div>
    <div className="overflow-hidden">
      <h6 className="uppercase text-[10px] font-black tracking-widest text-brand-primary mb-1 truncate">
        {title}
      </h6>
      <p className="text-sm font-semibold text-text-secondary truncate">
        {subtitle}
      </p>
    </div>
  </motion.div>
);

interface IconTextCarouselProps {
  iconTextData: IconTextItem[];
}

const IconTextCarousel: React.FC<IconTextCarouselProps> = ({
  iconTextData,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  if (isMobile) {
    return (
      <div className="flex overflow-x-auto gap-4 py-4 no-scrollbar">
        {iconTextData.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center min-w-[160px] shrink-0 p-4 bg-white rounded-2xl border border-border/50 shadow-sm"
          >
            <div className="bg-brand-primary/10 p-4 rounded-2xl mb-3">
              <Image
                src={item.icon}
                alt={item.title}
                width={40}
                height={40}
                className="w-10 h-10 object-contain"
                unoptimized
              />
            </div>
            <div className="text-center">
              <h6 className="uppercase text-[10px] font-black tracking-widest text-brand-primary mb-1">
                {item.title}
              </h6>
              <p className="text-xs font-semibold text-text-secondary">
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="grid grid-cols-1 md:grid-cols-4 gap-6"
    >
      {iconTextData.map((itemValue, idx) => (
        <motion.div key={idx} variants={item}>
          <IconTextSection
            icon={itemValue.icon}
            title={itemValue.title}
            subtitle={itemValue.subtitle}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default IconTextCarousel;
