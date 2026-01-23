"use client";

import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search, Ghost } from "lucide-react";

const NotFound: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-background overflow-hidden px-4">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-brand-primary/20 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-brand-secondary/20 blur-[120px] rounded-full"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-2xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 404 Header with Ghost Icon */}
          <div className="relative inline-block mb-8">
            <motion.div
              animate={{
                y: [0, -15, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -top-12 left-1/2 -translate-x-1/2 text-brand-primary"
            >
              <Ghost
                size={80}
                strokeWidth={1.5}
                className="opacity-20 translate-y-8"
              />
            </motion.div>

            <h1 className="text-[12rem] md:text-[18rem] font-black leading-none tracking-tighter text-foreground/5 select-none animate-pulse">
              404
            </h1>

            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="bg-background/80 backdrop-blur-md border border-border p-8 rounded-3xl shadow-2xl shadow-brand-primary/10"
              >
                <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4">
                  Oops! You&apos;re Lost
                </h2>
                <p className="text-text-secondary text-lg max-w-md mx-auto mb-8 font-medium">
                  The page you&apos;re looking for doesn&apos;t exist or has
                  been moved.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-brand-primary text-white rounded-2xl font-bold hover:bg-brand-primary-hover transition-all group hover:scale-105 active:scale-95 shadow-lg shadow-brand-primary/25"
                  >
                    <Home size={20} />
                    Back to Home
                  </Link>
                  <button
                    onClick={() => window.history.back()}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-secondary text-foreground rounded-2xl font-bold hover:bg-secondary/80 transition-all group border border-border hover:scale-105 active:scale-95"
                  >
                    <ArrowLeft
                      size={20}
                      className="group-hover:-translate-x-1 transition-transform"
                    />
                    Go Back
                  </button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Search Suggestion (Visual only or functional if needed) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12"
          >
            <p className="text-text-muted text-sm font-semibold uppercase tracking-widest mb-4">
              Try searching for something else
            </p>
            <div className="max-w-md mx-auto relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search
                  size={18}
                  className="text-text-muted group-focus-within:text-brand-primary transition-colors"
                />
              </div>
              <input
                type="text"
                placeholder="What can we help you find?"
                className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-2xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all shadow-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const query = (e.target as HTMLInputElement).value;
                    if (query)
                      window.location.href = `/shop?search=${encodeURIComponent(query)}`;
                  }
                }}
              />
            </div>
          </motion.div>

          <div className="mt-16 text-text-muted text-xs font-bold uppercase tracking-[0.2em]">
            SwapConnect &copy; {new Date().getFullYear()}
          </div>
        </motion.div>
      </div>

      {/* Grid Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[1] opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(var(--border) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
};

export default NotFound;
