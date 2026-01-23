// src/components/LayoutWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";

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
      <main>{children}</main>
      {shouldShowNavAndFooter ? <Footer /> : null}
    </>
  );
};

export default LayoutWrapper;
