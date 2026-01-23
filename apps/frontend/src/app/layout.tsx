import type { Metadata } from "next";
import "./globals.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import GlobalLayoutContent from "@/components/GlobalLayoutContent";

import Bugsnag from "@bugsnag/js";
import BugsnagPerformance from "@bugsnag/browser-performance";

import { Inter } from "next/font/google";
import { ASSETS } from "@/lib/constants";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Bugsnag initialization remains here as it's typically client-side setup
if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_BUGSNAG_API_KEY) {
  // Ensure Bugsnag runs only in the browser environment
  Bugsnag.start({ apiKey: process.env.NEXT_PUBLIC_BUGSNAG_API_KEY });
  BugsnagPerformance.start({ apiKey: process.env.NEXT_PUBLIC_BUGSNAG_API_KEY });
}

export const metadata: Metadata = {
  title: "SwapConnect App",
  description:
    "swapping, buying, and selling quality tech devices and accessories",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href={ASSETS.FAVICON} type="image/png" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        {/* Render the Client Component here */}
        <GlobalLayoutContent>{children}</GlobalLayoutContent>
      </body>
    </html>
  );
}
