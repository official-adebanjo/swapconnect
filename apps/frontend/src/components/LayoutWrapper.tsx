"use client";

import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  const pathname = usePathname();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const noNavFooterPaths = [
    "/login",
    "/signup",
    "/reset-password",
    "/forget-password",
  ];

  const shouldShowNavAndFooter =
    hasMounted && !noNavFooterPaths.some((path) => pathname.startsWith(path));

  return (
    <>
      {shouldShowNavAndFooter ? <Navbar /> : null}
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex-grow"
        >
          {children}
        </motion.main>
      </AnimatePresence>
      {shouldShowNavAndFooter ? <Footer /> : null}
    </>
  );
};

export default LayoutWrapper;
