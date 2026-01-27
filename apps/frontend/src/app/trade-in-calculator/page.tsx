"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Laptop, Smartphone } from "lucide-react";
import { motion } from "framer-motion";

const SelectSwapCategory = () => {
  const categories = [
    {
      title: "Computer",
      description: "Desktops, Laptops & Peripherals",
      icon: Laptop,
      image:
        "https://res.cloudinary.com/ds83mhjcm/image/upload/v1720178194/SwapConnect/swap/laptop_swap_e3epz6.png",
      href: "/trade-in-calculator/computers",
      color: "from-blue-500/10 to-blue-600/10",
      accent: "bg-blue-600",
    },
    {
      title: "Mobile Phones",
      description: "iOS, Androids & Peripherals",
      icon: Smartphone,
      image:
        "https://res.cloudinary.com/ds83mhjcm/image/upload/v1720178193/SwapConnect/swap/mobile-phone_swap_lgpc3d.png",
      href: "/trade-in-calculator/mobile-phones",
      color: "from-green-500/10 to-green-600/10",
      accent: "bg-green-600",
    },
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8 md:py-12 px-4 bg-linear-to-b from-gray-50 to-white dark:from-gray-950 dark:to-black transition-colors duration-500">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-16"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
            Trade-In <span className="text-green-600">Calculator</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium px-2">
            Select your device category to get an instant estimate for your
            trade-in. Professional evaluation for the best value.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -10 }}
              className="group relative"
            >
              <Link href={category.href} className="block h-full">
                <div
                  className={`h-full bg-white dark:bg-gray-900 rounded-[2rem] sm:rounded-[3rem] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col items-center p-6 sm:p-8 text-center`}
                >
                  <div
                    className={`absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-linear-to-br ${category.color} rounded-bl-full -mr-12 -mt-12 sm:-mr-16 sm:-mt-16 group-hover:scale-150 transition-transform duration-500 opacity-50`}
                  />

                  <div className="relative mb-6 sm:mb-8 w-full aspect-[3/2] flex items-center justify-center">
                    <Image
                      src={category.image}
                      alt={category.title}
                      width={400}
                      height={260}
                      className="object-contain transform group-hover:scale-110 transition-transform duration-500 drop-shadow-2xl max-h-[160px] sm:max-h-none"
                      priority
                    />
                  </div>

                  <div className="mt-auto relative z-10 w-full">
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <div
                        className={`p-2 rounded-xl sm:p-2.5 sm:rounded-2xl ${category.accent} text-white shadow-lg`}
                      >
                        <category.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                        {category.title}
                      </h2>
                    </div>
                    <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-6 sm:mb-8 px-2 sm:px-4 leading-relaxed font-medium italic">
                      {category.description}
                    </p>

                    <div
                      className={`inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 ${category.accent} text-white rounded-xl sm:rounded-2xl font-extrabold shadow-lg transition-all duration-300 transform group-hover:scale-105 active:scale-95 text-sm sm:text-base w-full sm:w-auto justify-center`}
                    >
                      Start Trade-In
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-center mt-8 md:mt-12 text-gray-400 dark:text-gray-600 text-[10px] sm:text-xs font-bold uppercase tracking-widest"
        >
          Trust. Transparency. Technology.
        </motion.p>
      </div>
    </div>
  );
};

export default SelectSwapCategory;
