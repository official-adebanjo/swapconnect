import type { Metadata } from "next";
import "./globals.css";

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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://swapconnect.com",
  ),
  title: {
    default: "SwapConnect - Buy, Sell & Swap Tech Devices in Nigeria",
    template: "%s | SwapConnect",
  },
  description:
    "Nigeria's premier platform for swapping, buying, and selling quality tech devices and accessories. Upgrade your tech sustainably with secure transactions and competitive prices.",
  keywords: [
    "device swap Nigeria",
    "buy phones Nigeria",
    "sell laptops",
    "tech marketplace",
    "smartphone exchange",
    "device trade-in",
    "used electronics Nigeria",
    "tech devices",
    "SwapConnect",
    "buy tech online",
    "sell gadgets",
  ],
  authors: [{ name: "SwapConnect Team" }],
  creator: "SwapConnect",
  publisher: "SwapConnect",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "/",
    siteName: "SwapConnect",
    title: "SwapConnect - Buy, Sell & Swap Tech Devices in Nigeria",
    description:
      "Nigeria's premier platform for swapping, buying, and selling quality tech devices. Upgrade your tech sustainably.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SwapConnect - Tech Device Marketplace",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SwapConnect - Buy, Sell & Swap Tech Devices",
    description:
      "Nigeria's premier platform for tech device swapping and selling",
    images: ["/twitter-image.png"],
    creator: "@swapconnect",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: ASSETS.FAVICON,
    shortcut: ASSETS.FAVICON,
    apple: ASSETS.FAVICON,
  },
  manifest: "/manifest.json",
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
