import React from "react";
import type { Metadata } from "next";
// import Link from "next/link";

// You can define metadata for this segment and its children
export const metadata: Metadata = {
  title: "Trade-In Calculator",
  description: "Calculate the trade-in value for your devices.",
};

export default function TradeInCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10">
          Device Trade-In Calculator
        </h1>
        <nav className="flex justify-center space-x-4 mb-8">
          <Link
            href="/trade-in-calculator/computers"
            className="px-4 py-2 rounded-md text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200"
          >
            Computers
          </Link>
          <Link
            href="/trade-in-calculator/mobile-phones"
            className="px-4 py-2 rounded-md text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200"
          >
            Mobile Phones
          </Link>
        </nav> */}

        {/* This is where the actual page content (MobilePhones.tsx or Computers.tsx) will be rendered */}
        <main className="bg-white p-8 rounded-lg shadow-xl">{children}</main>
      </div>
    </div>
  );
}
