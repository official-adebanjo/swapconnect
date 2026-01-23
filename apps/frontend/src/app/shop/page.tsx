"use client";

import CategorySearch from "./CategorySearch";
import ProductsDisplay from "./ProductsDisplay";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

const ShopPage = () => (
  <div className="bg-gray-50 dark:bg-black min-h-screen pb-20 overflow-hidden">
    {/* Premium Header */}
    <div className="bg-linear-to-r from-gray-900 via-gray-800 to-green-900 text-white pt-20 pb-28 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_120%,rgba(0,255,100,0.3),transparent_50%)]" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-green-400 text-xs font-black uppercase tracking-widest mb-6 border border-white/10"
        >
          <Sparkles size={14} />
          Premium Marketplace
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black tracking-tight mb-6"
        >
          Explore the <span className="text-green-400">Future</span> of Tech
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-300 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed"
        >
          Discover curated devices, from the latest smartphones to powerful
          workstations. Verified quality, secure swaps, and unbeatable prices.
        </motion.p>
      </div>
    </div>

    {/* Search Section */}
    <CategorySearch />

    {/* Main Content */}
    <div className="container mx-auto px-4 mt-6">
      <ProductsDisplay />
    </div>
  </div>
);

export default ShopPage;
