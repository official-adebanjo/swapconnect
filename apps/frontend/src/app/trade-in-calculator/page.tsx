import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trade-In Calculator | SwapConnect",
  description: "Calculate the trade-in value of your device instantly.",
};

const SelectSwapCategory = () => {
  return (
    <>
      <div className="container mx-auto my-12 px-4">
        {" "}
        <h4 className="text-center text-2xl font-bold mb-8">
          Select device category to{" "}
          <span className="text-yellow-600">Swap</span>{" "}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {" "}
          <div className="text-center flex flex-col items-center">
            {" "}
            {/* Centering content with flexbox */}
            <Image
              src="https://res.cloudinary.com/ds83mhjcm/image/upload/v1720178194/SwapConnect/swap/laptop_swap_e3epz6.png"
              alt="Computer Swap"
              width={300}
              height={200}
              className="mb-4"
              priority
            />
            <h5 className="text-xl font-semibold text-gray-800">Computer: </h5>
            <p className="text-gray-600 mb-4">
              Desktops, Laptops & Peripherals
            </p>
            <Link href="/trade-in-calculator/computers" passHref>
              <button className="bg-green-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-green-700 transition duration-200 flex items-center justify-center cursor-pointer">
                Swap
                <ChevronRight className="ml-2 h-4 w-4" />
                <ChevronRight className="-ml-1 h-4 w-4" />
                <ChevronRight className="-ml-1 h-4 w-4" />
              </button>
            </Link>
          </div>
          <div className="text-center flex flex-col items-center">
            {" "}
            {/* Centering content with flexbox */}
            <Image
              src="https://res.cloudinary.com/ds83mhjcm/image/upload/v1720178193/SwapConnect/swap/mobile-phone_swap_lgpc3d.png"
              alt="Mobile Phone Swap"
              width={300}
              height={200}
              className="mb-4"
              priority
            />
            <h5 className="text-xl font-semibold text-gray-800">
              Mobile Phones:{" "}
            </h5>
            <p className="text-gray-600 mb-4">iOS, Androids & Peripherals</p>
            <Link href="/trade-in-calculator/mobile-phones" passHref>
              <button className="bg-green-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-green-700 transition duration-200 flex items-center justify-center cursor-pointer">
                Swap
                <ChevronRight className="ml-2 h-4 w-4" />
                <ChevronRight className="-ml-1 h-4 w-4" />
                <ChevronRight className="-ml-1 h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SelectSwapCategory;
