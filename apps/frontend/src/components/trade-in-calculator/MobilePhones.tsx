"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  ShoppingCart,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

// Updated Product interface to match the JSON structure,
// particularly 'price' as a number and including 'id'.
interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  description: string;
  availability: "in stock" | "out of stock";
  stock: number;
  isTopSale: boolean;
  tag: string;
}

// Function to fetch recently uploaded products from the JSON file
const fetchRecentlyUploaded = async (): Promise<Product[]> => {
  try {
    const response = await fetch("/json/RecentlyUploaded.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Product[] = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch recently uploaded products:", error);
    return [];
  }
};

const TradeInCalculator: React.FC = () => {
  const [recentlyUploaded, setRecentlyUploaded] = useState<Product[]>([]);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    const loadProducts = async () => {
      const products = await fetchRecentlyUploaded();
      setRecentlyUploaded(products);
    };
    loadProducts();
  }, []);

  const itemsPerPage = 3;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = recentlyUploaded.slice(startIndex, endIndex);

  const handlePrev = () => {
    setStartIndex((prevIndex) => Math.max(prevIndex - itemsPerPage, 0));
  };

  const handleNext = () => {
    setStartIndex((prevIndex) =>
      Math.min(
        prevIndex + itemsPerPage,
        recentlyUploaded.length - itemsPerPage,
      ),
    );
  };

  const isPrevDisabled = startIndex === 0;
  const isNextDisabled = endIndex >= recentlyUploaded.length;

  return (
    <div className="container mx-auto my-8 px-4">
      <h2 className="mb-8 p-3 text-center text-2xl font-bold text-white bg-green-700 rounded-md">
        Mobile Phones
      </h2>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column: Form */}
        <div className="w-full md:w-8/12 lg:w-3/4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Brand */}
            <div className="relative mb-3">
              <label
                htmlFor="brand"
                className="block text-gray-700 text-sm font-medium mb-1"
              >
                Brand
              </label>
              <select
                id="brand"
                className="form-select block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm appearance-none pr-10"
                required
                defaultValue=""
              >
                <option value="" disabled>
                  Select Brand
                </option>
                <option value="iOS">iOS</option>
                <option value="Androids">Androids</option>
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
            </div>

            {/* Model */}
            <div className="relative mb-3">
              <label
                htmlFor="model"
                className="block text-gray-700 text-sm font-medium mb-1"
              >
                Model
              </label>
              <select
                id="model"
                className="form-select block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm appearance-none pr-10"
                required
                defaultValue=""
              >
                <option value="" disabled>
                  Select Model
                </option>
                <option value="iPhone XR">iPhone XR</option>
                <option value="iPhone 11">iPhone 11</option>
                <option value="iPhone 12 pro">iPhone 12 pro</option>
                <option value="iPhone 13">iPhone 13</option>
                <option value="iPhone 15">iPhone 15</option>
                <option value="Samsung">Samsung</option>
                <option value="Infinix">Infinix</option>
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
            </div>

            {/* Storage */}
            <div className="relative mb-3">
              <label
                htmlFor="storage"
                className="block text-gray-700 text-sm font-medium mb-1"
              >
                Storage
              </label>
              <select
                id="storage"
                className="form-select block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm appearance-none pr-10"
                required
                defaultValue=""
              >
                <option value="" disabled>
                  Select Storage
                </option>
                <option value="32GB">32GB</option>
                <option value="64GB">64GB</option>
                <option value="128GB">128GB</option>
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
            </div>

            {/* RAM Size */}
            <div className="relative mb-3">
              <label
                htmlFor="ram"
                className="block text-gray-700 text-sm font-medium mb-1"
              >
                RAM Size
              </label>
              <select
                id="ram"
                className="form-select block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm appearance-none pr-10"
                required
                defaultValue=""
              >
                <option value="" disabled>
                  Select RAM Size
                </option>
                <option value="4GB">4GB</option>
                <option value="8GB">8GB</option>
                <option value="16GB">16GB</option>
                <option value="64GB">64GB</option>
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
            </div>

            {/* Battery Capacity */}
            <div className="relative mb-3">
              <label
                htmlFor="batteryCapacity"
                className="block text-gray-700 text-sm font-medium mb-1"
              >
                Battery Capacity
              </label>
              <select
                id="batteryCapacity"
                className="form-select block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm appearance-none pr-10"
                required
                defaultValue=""
              >
                <option value="" disabled>
                  Select Battery Capacity
                </option>
                <option value="4000MAH">4000MAH</option>
                <option value="5000MAH">5000MAH</option>
                <option value="6000MAH">6000MAH</option>
                <option value="8000MAH">8000MAH</option>
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
            </div>

            {/* Battery Lasting Hours */}
            <div className="relative mb-3">
              <label
                htmlFor="batteryHours"
                className="block text-gray-700 text-sm font-medium mb-1"
              >
                Battery Lasting Hours
              </label>
              <select
                id="batteryHours"
                className="form-select block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm appearance-none pr-10"
                required
                defaultValue=""
              >
                <option value="" disabled>
                  Select Battery Lasting Hours
                </option>
                <option value="ABOUT 4 HRS">ABOUT 4 HRS</option>
                <option value="8 HRS">8 HRS</option>
                <option value="more than 8 HRS">more than 8 HRS</option>
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
            </div>

            {/* Phone Age */}
            <div className="relative mb-3">
              <label
                htmlFor="phoneAge"
                className="block text-gray-700 text-sm font-medium mb-1"
              >
                Phone Age
              </label>
              <select
                id="phoneAge"
                className="form-select block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm appearance-none pr-10"
                required
                defaultValue=""
              >
                <option value="" disabled>
                  Select Phone Age
                </option>
                <option value="6-12 Months">6-12 Months</option>
                <option value="1-2 years">1-2 years</option>
                <option value="2-3 years">2-3 years</option>
                <option value="Above 3 years">Above 3 years</option>
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
            </div>

            {/* Upload Device Image */}
            <div className="mb-3">
              <label
                htmlFor="deviceImage"
                className="block text-gray-700 text-sm font-medium mb-1"
              >
                Upload Device Image
              </label>
              <input
                type="file"
                id="deviceImage"
                accept=".jpg,.png,.pdf"
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-green-50 file:text-green-700
                  hover:file:bg-green-100"
              />
              <p className="mt-1 text-sm text-gray-500">
                Supports: JPG, PNG, PDF
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Possible Value for New */}
        <div className="w-full md:w-4/12 lg:w-1/4">
          <div className="rounded-lg border border-yellow-600 shadow-md p-4 bg-white">
            <h4 className="text-xl font-semibold mb-2">
              Possible Value for New
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Note: Values are auto generated and might not be absolutely
              correct.
            </p>
            <div className="relative w-full h-40 mb-4">
              <Image
                src="https://res.cloudinary.com/ds83mhjcm/image/upload/v1720182137/SwapConnect/swap/trade-in-calculator_value_kjsuxr.png"
                alt="Trade-in value illustration"
                layout="fill"
                objectFit="contain"
                className="rounded-md"
              />
            </div>
            <strong className="block mt-3 text-gray-800">Average price</strong>
            <div className="bg-gray-200 p-3 rounded-md mt-2 text-gray-700 min-h-[40px]">
              {/* Display field content here */}
            </div>
            <Link
              href="#"
              passHref
              className="flex items-center text-yellow-600 hover:text-yellow-700 mt-4 text-sm font-medium"
            >
              see full details <ChevronRight className="ml-1 text-xs" />
              <ChevronRight className="text-xs" />
              <ChevronRight className="text-xs" />
            </Link>
          </div>
        </div>
      </div>

      {/* Second section */}
      <div className="mt-12 flex flex-col md:flex-row gap-8">
        {/* Left Column: Additional details */}
        <div className="w-full md:w-6/12 lg:w-1/2">
          <h3 className="mb-6 text-xl font-bold text-gray-800">
            Additional details
          </h3>
          <div className="grid grid-cols-1 gap-y-4">
            {/* Product turns off and on automatically? */}
            <div className="relative mb-3">
              <label
                htmlFor="autoOnOff"
                className="block text-gray-700 text-sm font-medium mb-1"
              >
                Does your product turn off and on automatically?
              </label>
              <select
                id="autoOnOff"
                className="form-select block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm appearance-none pr-10"
                defaultValue=""
              >
                <option value="" disabled>
                  Select Option
                </option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
            </div>

            {/* Condition of product's body */}
            <div className="relative mb-3">
              <label
                htmlFor="bodyCondition"
                className="block text-gray-700 text-sm font-medium mb-1"
              >
                What is the condition of your product&apos;s body?
              </label>
              <select
                id="bodyCondition"
                className="form-select block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm appearance-none pr-10"
                defaultValue=""
              >
                <option value="" disabled>
                  Select Option
                </option>
                <option value="perfect">Perfect</option>
                <option value="minor_scratches">Minor Scratches</option>
                <option value="dents">Dents</option>
                <option value="cracked">Cracked</option>
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
            </div>

            {/* Condition of product's screen */}
            <div className="relative mb-3">
              <label
                htmlFor="screenCondition"
                className="block text-gray-700 text-sm font-medium mb-1"
              >
                What is the condition of your product&apos;s screen?
              </label>
              <select
                id="screenCondition"
                className="form-select block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm appearance-none pr-10"
                defaultValue=""
              >
                <option value="" disabled>
                  Select Option
                </option>
                <option value="perfect">Perfect</option>
                <option value="minor_scratches">Minor Scratches</option>
                <option value="cracked">Cracked</option>
                <option value="shattered">Shattered</option>
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
            </div>

            {/* Times visited technician for repair */}
            <div className="relative mb-3">
              <label
                htmlFor="repairVisits"
                className="block text-gray-700 text-sm font-medium mb-1"
              >
                How many times have you visited a technician for repair?
              </label>
              <select
                id="repairVisits"
                className="form-select block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm appearance-none pr-10"
                defaultValue=""
              >
                <option value="" disabled>
                  Select Option
                </option>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2-3">2 - 3</option>
                <option value="more-than-3-times">More than three times</option>
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
            </div>

            {/* Touch ID / Face ID function normally? */}
            <div className="relative mb-3">
              <label
                htmlFor="biometricFunction"
                className="block text-gray-700 text-sm font-medium mb-1"
              >
                Where applicable, does Touch ID or Face ID function normally?
              </label>
              <select
                id="biometricFunction"
                className="form-select block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm appearance-none pr-10"
                defaultValue=""
              >
                <option value="" disabled>
                  Select Option
                </option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <p className="mt-6 mb-4 text-sm text-gray-700">
            <strong className="font-bold">
              Important: this trade-in estimate is not final and is subject to
              change after a full evaluation by Swapconnect trade-in technician.
              If the information provided is inaccurate here, your trade-in
              value will also be impacted. Note that we do not accept stolen or
              counterfeit devices.
            </strong>{" "}
          </p>

          <div className="space-y-3 mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="findMyPhone"
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label
                htmlFor="findMyPhone"
                className="ml-2 block text-sm text-gray-900"
              >
                Has your &ldquo;find my phone&rdquo; been disabled and you have
                signed out of iCloud/gmail?
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="dataRemoved"
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label
                htmlFor="dataRemoved"
                className="ml-2 block text-sm text-gray-900"
              >
                Has all your data been removed and have the devices been safely
                packaged to avoid transit damage?
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="finalInspection"
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label
                htmlFor="finalInspection"
                className="ml-2 block text-sm text-gray-900"
              >
                Final trade-in value will be determined after physical
                inspection and diagnostics?
              </label>
            </div>
          </div>

          <button className="bg-green-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-green-700 transition duration-200">
            Submit
          </button>
        </div>

        {/* Right Column: Recently uploaded products */}
        <div className="w-full md:w-6/12 lg:w-1/2">
          <h3 className="mb-6 text-xl font-bold text-gray-800">
            Recently uploaded
          </h3>
          <div className="flex items-center justify-center mb-6 gap-4">
            <button
              onClick={handlePrev}
              disabled={isPrevDisabled}
              className={`flex items-center justify-center w-10 h-10 rounded-lg text-lg transition-colors duration-200
                ${
                  isPrevDisabled
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-yellow-600 text-white hover:bg-yellow-700"
                }`}
              aria-label="Previous products"
            >
              <ArrowLeft />
            </button>
            <button
              onClick={handleNext}
              disabled={isNextDisabled}
              className={`flex items-center justify-center w-10 h-10 rounded-lg text-lg transition-colors duration-200
                ${
                  isNextDisabled
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-yellow-600 text-white hover:bg-yellow-700"
                }`}
              aria-label="Next products"
            >
              <ArrowRight />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentItems.map((product) => (
              <div
                key={product.id}
                className="relative rounded-lg shadow-md overflow-hidden flex flex-col items-center p-3 border border-gray-200"
              >
                <div className="relative w-full h-32 mb-2">
                  <Image
                    src={product.image}
                    alt={product.name}
                    layout="fill"
                    objectFit="contain"
                    className="rounded-t-lg"
                  />
                </div>
                <div className="p-2 w-full text-center">
                  <h4 className="text-sm font-semibold mb-1 text-gray-800 truncate">
                    {product.name}
                  </h4>
                  <p className="text-xs text-gray-600 mb-1 truncate">
                    {product.description}
                  </p>
                  <p className="text-xs text-gray-700 mb-2">
                    Price:{" "}
                    <strong className="font-bold">
                      ₦
                      {product.price.toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </strong>
                  </p>
                  <p
                    className={`text-xs font-medium ${
                      product.availability === "in stock"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {product.availability}
                  </p>
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <button
                      className="bg-green-600 text-white text-xs px-3 py-1 rounded-md hover:bg-green-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={product.availability === "out of stock"}
                    >
                      View More
                    </button>
                    {product.availability === "out of stock" ? (
                      <ShoppingCart className="text-gray-400 opacity-50 text-base" />
                    ) : (
                      <ShoppingCart className="text-green-600 border border-green-600 p-1 rounded-md text-base hover:text-green-700 hover:border-green-700 transition duration-200" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeInCalculator;
