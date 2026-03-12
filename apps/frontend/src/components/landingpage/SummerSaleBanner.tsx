import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const SummerSaleBanner: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={cn(
        "bg-brand-primary rounded-[2.5rem] p-8 md:p-16 mx-4 sm:mx-auto max-w-7xl overflow-hidden relative",
      )}
    >
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full -ml-32 -mb-32 blur-3xl pointer-events-none"></div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
        {/* Text Column */}
        <div className="text-center md:text-left md:w-3/5">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white text-5xl md:text-6xl lg:text-6xl font-black mb-6 leading-tight tracking-tighter"
          >
            Summer <br className="hidden md:block" />
            <span className="text-white/80">Sale</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white text-lg md:text-xl mb-8 opacity-90 leading-relaxed font-medium max-w-lg"
          >
            Enjoy unbeatable deals on top tech this summer! Save big on laptops,
            accessories, and more. Limited time only.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button className="bg-white text-brand-primary hover:bg-white/90 font-bold py-4 cursor-pointer px-10 rounded-full shadow-2xl transition-all transform hover:scale-105">
              Shop the Collection
            </Button>
          </motion.div>
        </div>

        {/* Image Column */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="md:w-2/5 flex justify-center items-center"
        >
          <div className="relative w-full max-w-md aspect-square">
            <Image
              src="https://res.cloudinary.com/ds83mhjcm/image/upload/v1719573354/SwapConnect/home/summersale_ekbelu.png"
              alt="Summer Sale"
              fill
              className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
              priority
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SummerSaleBanner;
