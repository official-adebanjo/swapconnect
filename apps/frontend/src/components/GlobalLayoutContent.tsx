"use client";

import { usePathname } from "next/navigation";
import LayoutWrapper from "@/components/LayoutWrapper";
import { ThemeProvider } from "@/components/ThemeProvider";
import React from "react";

import { QueryProvider } from "@/components/QueryProvider";

interface GlobalLayoutContentProps {
  children: React.ReactNode;
}

export default function GlobalLayoutContent({
  children,
}: GlobalLayoutContentProps) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  // Only wrap with LayoutWrapper (navbar/footer) if not a dashboard route
  return (
    <ThemeProvider>
      <QueryProvider>
        {isDashboard ? (
          <>{children}</>
        ) : (
          <LayoutWrapper>{children}</LayoutWrapper>
        )}
      </QueryProvider>
    </ThemeProvider>
  );
}
