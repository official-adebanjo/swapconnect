"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useUserStore } from "@/stores/AuthStore";
// import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import { FaChevronRight } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faArrowRight,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { api } from "@/lib/api";

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

interface CalculationBreakdown {
  baseValue?: number;
  conditionMultiplier?: number;
  finalValue?: number;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  estimatedValue?: number;
  breakdown?: CalculationBreakdown;
}

interface ProductApiData {
  id: number;
  name: string;
  imageUrl?: string;
  price: number;
  description?: string;
  stock: number;
  Category?: {
    name: string;
  };
}

interface MobileFormData {
  brand: string;
  model: string;
  storage: string;
  ram: string;
  batteryCapacity: string;
  batteryHours: string;
  phoneAge: string;
  deviceImage?: File | string;
  autoOnOff: string;
  bodyCondition: string;
  screenCondition: string;
  repairVisits: string;
  biometricFunction: string;
}

// Function to fetch recently uploaded products from the backend
const fetchRecentlyUploaded = async (token?: string): Promise<Product[]> => {
  try {
    const response = await api.get<ApiResponse<ProductApiData[]>>(
      "/products/top?limit=6",
      token
    );
    if (response.success && response.data) {
      return response.data.map((product: ProductApiData) => ({
        id: product.id.toString(),
        name: product.name,
        image: product.imageUrl || "/placeholder.svg?height=200&width=200",
        price: product.price,
        description: product.description || "",
        availability: product.stock > 0 ? "in stock" : "out of stock",
        stock: product.stock,
        isTopSale: true,
        tag: product.Category?.name || "Mobile Phones",
      }));
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch recently uploaded products:", error);
    return [];
  }
};

const MobilePhonesPage: React.FC = () => {
  // const router = useRouter();
  const { token } = useUserStore();

  const [recentlyUploaded, setRecentlyUploaded] = useState<Product[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const [estimatedValue, setEstimatedValue] = useState<number>(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationBreakdown, setCalculationBreakdown] =
    useState<CalculationBreakdown | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [formData, setFormData] = useState<MobileFormData>({
    brand: "",
    model: "",
    storage: "",
    ram: "",
    batteryCapacity: "",
    batteryHours: "",
    phoneAge: "",
    deviceImage: "",
    autoOnOff: "",
    bodyCondition: "",
    screenCondition: "",
    repairVisits: "",
    biometricFunction: "",
  });

  useEffect(() => {
    if (!token) {
      return;
    }
    const loadProducts = async () => {
      const products = await fetchRecentlyUploaded(token);
      setRecentlyUploaded(products);
    };
    loadProducts();
  }, [token]);

  // Restore saved form data if redirected from login
  useEffect(() => {
    const saved = sessionStorage.getItem("mobileTradeInFormData");
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
        sessionStorage.removeItem("mobileTradeInFormData");
      } catch (error) {
        console.error("Failed to parse saved form data:", error);
      }
    }
  }, []);

  // Reset calculation when form data changes significantly
  useEffect(() => {
    if (hasCalculated) {
      setHasCalculated(false);
      setEstimatedValue(0);
      setCalculationBreakdown(null);
    }
  }, [
    formData.brand,
    formData.model,
    formData.storage,
    formData.ram,
    formData.phoneAge,
  ]);

  const calculateValue = async () => {
    // Validate required fields
    if (
      !formData.brand ||
      !formData.model ||
      !formData.storage ||
      !formData.ram ||
      !formData.phoneAge
    ) {
      toast.error(
        "Please fill in all required fields (Brand, Model, Storage, RAM, Phone Age)"
      );
      return;
    }

    setIsCalculating(true);

    try {
      const payload = {
        deviceType: "mobile",
        deviceDetails: {
          brand: formData.brand,
          model: formData.model,
          storage: formData.storage,
          ram: formData.ram,
          batteryCapacity: formData.batteryCapacity,
          batteryHours: formData.batteryHours,
          phoneAge: formData.phoneAge,
        },
        conditionDetails: {
          autoOnOff: formData.autoOnOff,
          bodyCondition: formData.bodyCondition,
          screenCondition: formData.screenCondition,
          repairVisits: formData.repairVisits,
          biometricFunction: formData.biometricFunction,
        },
      };

      // if (!token) {
      //   return;
      // }

      const response = await api.post<
        ApiResponse<{ estimatedValue: number; breakdown: CalculationBreakdown }>
      >("/bid/calculator", payload, token);

      if (response.success) {
        console.log(response);
        const calculatedValue: number =
          response.data?.estimatedValue ?? response.estimatedValue ?? 0;
        const breakdown =
          response.data?.breakdown ?? response.breakdown ?? null;

        setEstimatedValue(calculatedValue);
        setCalculationBreakdown(breakdown);
        setHasCalculated(true);

        if (calculatedValue > 0) {
          toast.success(
            `Your phone is estimated to be worth ${formatPrice(
              calculatedValue
            )}!`,
            {
              duration: 5000,
            }
          );
        } else {
          toast.error(
            "Unable to calculate value. Please check your device details."
          );
        }
      } else {
        console.error("Calculation failed:", response.error);
        toast.error("Failed to calculate trade-in value. Please try again.");
      }
    } catch (error) {
      console.error("Error calculating value:", error);
      toast.error(
        "An error occurred while calculating the value. Please try again."
      );
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("estimating value, please wait...", { duration: 2000 });
    await calculateValue();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, files } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files?.[0] || "" : value,
    }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const itemsPerPage = 3;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = recentlyUploaded.slice(startIndex, endIndex);

  const handlePrev = () => {
    setStartIndex((prevIndex) => Math.max(prevIndex - itemsPerPage, 0));
  };

  const handleNext = () => {
    setStartIndex((prevIndex) =>
      Math.min(prevIndex + itemsPerPage, recentlyUploaded.length - itemsPerPage)
    );
  };

  const isPrevDisabled = startIndex === 0;
  const isNextDisabled = endIndex >= recentlyUploaded.length;

  const getEstimateDisplayText = () => {
    if (isCalculating) return "Calculating...";
    if (hasCalculated && estimatedValue > 0) return formatPrice(estimatedValue);
    if (hasCalculated && estimatedValue === 0) return "Unable to estimate";
    return "Click 'Get Final Estimate' to calculate";
  };

  return (
    <div className="container mx-auto my-8 px-4">
      <Toaster />
      <h2 className="mb-8 p-3 text-center text-2xl font-bold text-white bg-green-700 rounded-md">
        Mobile Phones Trade-In Calculator
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column: Form */}
          <div className="w-full md:w-8/12 lg:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Brand */}
              <div className="relative  mb-3">
                <label
                  htmlFor="brand"
                  className="block text-gray-700 text-sm font-medium mb-1"
                >
                  Brand *
                </label>
                <select
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="form-select block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm appearance-none pr-10"
                  required
                >
                  <option value="">Select Brand</option>
                  <option value="iOS">iOS (iPhone)</option>
                  <option value="Samsung">Samsung</option>
                  <option value="Google">Google (Pixel)</option>
                  <option value="OnePlus">OnePlus</option>
                  <option value="Xiaomi">Xiaomi</option>
                  <option value="Huawei">Huawei</option>
                  <option value="Infinix">Infinix</option>
                  <option value="Tecno">Tecno</option>
                  <option value="Other">Other</option>
                </select>
                <FaChevronRight className="absolute right-3 top-2/3 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
              </div>

              {/* Model */}
              <div className="relative mb-3">
                <label
                  htmlFor="model"
                  className="block text-gray-700 text-sm font-medium mb-1"
                >
                  Model *
                </label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className="form-input block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="e.g., iPhone 13, Galaxy S21, Pixel 6"
                  required
                />
              </div>

              {/* Storage */}
              <div className="relative mb-3">
                <label
                  htmlFor="storage"
                  className="block text-gray-700 text-sm font-medium mb-1"
                >
                  Storage *
                </label>
                <select
                  id="storage"
                  name="storage"
                  value={formData.storage}
                  onChange={handleChange}
                  className="form-select block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm appearance-none pr-10"
                  required
                >
                  <option value="">Select Storage</option>
                  <option value="32GB">32GB</option>
                  <option value="64GB">64GB</option>
                  <option value="128GB">128GB</option>
                  <option value="256GB">256GB</option>
                  <option value="512GB">512GB</option>
                  <option value="1TB">1TB</option>
                </select>
                <FaChevronRight className="absolute right-3 top-2/3 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
              </div>

              {/* RAM Size */}
              <div className="relative mb-3">
                <label
                  htmlFor="ram"
                  className="block text-gray-700 text-sm font-medium mb-1"
                >
                  RAM Size *
                </label>
                <select
                  id="ram"
                  name="ram"
                  value={formData.ram}
                  onChange={handleChange}
                  className="form-select block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm appearance-none pr-10"
                  required
                >
                  <option value="">Select RAM Size</option>
                  <option value="2GB">2GB</option>
                  <option value="3GB">3GB</option>
                  <option value="4GB">4GB</option>
                  <option value="6GB">6GB</option>
                  <option value="8GB">8GB</option>
                  <option value="12GB">12GB</option>
                  <option value="16GB">16GB</option>
                </select>
                <FaChevronRight className="absolute right-3 top-2/3 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
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
                  name="batteryCapacity"
                  value={formData.batteryCapacity}
                  onChange={handleChange}
                  className="form-select block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm appearance-none pr-10"
                >
                  <option value="">Select Battery Capacity</option>
                  <option value="3000MAH">3000mAh</option>
                  <option value="4000MAH">4000mAh</option>
                  <option value="5000MAH">5000mAh</option>
                  <option value="6000MAH">6000mAh</option>
                  <option value="Unknown">Unknown</option>
                </select>
                <FaChevronRight className="absolute right-3 top-2/3 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
              </div>

              {/* Battery Lasting Hours */}
              <div className="relative mb-3">
                <label
                  htmlFor="batteryHours"
                  className="block text-gray-700 text-sm font-medium mb-1"
                >
                  Battery Life
                </label>
                <select
                  id="batteryHours"
                  name="batteryHours"
                  value={formData.batteryHours}
                  onChange={handleChange}
                  className="form-select block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm appearance-none pr-10"
                >
                  <option value="">Select Battery Life</option>
                  <option value="ABOUT 4 HRS">About 4 hours</option>
                  <option value="6-8 HRS">6-8 hours</option>
                  <option value="8-12 HRS">8-12 hours</option>
                  <option value="more than 12 HRS">More than 12 hours</option>
                </select>
                <FaChevronRight className="absolute right-3 top-2/3 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
              </div>

              {/* Phone Age */}
              <div className="relative mb-3">
                <label
                  htmlFor="phoneAge"
                  className="block text-gray-700 text-sm font-medium mb-1"
                >
                  Phone Age *
                </label>
                <select
                  id="phoneAge"
                  name="phoneAge"
                  value={formData.phoneAge}
                  onChange={handleChange}
                  className="form-select block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm appearance-none pr-10"
                  required
                >
                  <option value="">Select Phone Age</option>
                  <option value="6-12 Months">6-12 Months</option>
                  <option value="1-2 years">1-2 years</option>
                  <option value="2-3 years">2-3 years</option>
                  <option value="Above 3 years">Above 3 years</option>
                </select>
                <FaChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
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
                  name="deviceImage"
                  onChange={handleChange}
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-green-50 file:text-green-700
                  hover:file:bg-green-100"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Supports: JPG, PNG, PDF (Max 5MB)
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Estimated Value */}
          <div className="w-full md:w-4/12 lg:w-1/4">
            <div className="rounded-lg border border-yellow-600 shadow-md p-4 bg-white">
              <h4 className="text-xl font-semibold mb-2">
                Estimated Trade-In Value
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Note: Values are estimated and may vary after physical
                inspection.
              </p>
              <div className="relative w-full h-40 mb-4">
                <Image
                  src="https://res.cloudinary.com/ds83mhjcm/image/upload/v1720182137/SwapConnect/swap/trade-in-calculator_value_kjsuxr.png"
                  alt="Trade-in value illustration"
                  fill
                  style={{ objectFit: "contain" }}
                  className="rounded-md"
                />
              </div>
              <strong className="block mt-3 text-gray-800">
                Estimated Value
              </strong>
              <div className="bg-gray-200 p-3 rounded-md mt-2 text-gray-700 min-h-[60px] flex items-center justify-center">
                {isCalculating ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                    <span className="text-sm">Calculating...</span>
                  </div>
                ) : (
                  <span
                    className={`text-lg font-bold ${
                      hasCalculated && estimatedValue > 0
                        ? "text-green-600"
                        : "text-gray-600"
                    }`}
                  >
                    {getEstimateDisplayText()}
                  </span>
                )}
              </div>

              {calculationBreakdown && hasCalculated && (
                <div className="mt-4 p-3 bg-blue-50 rounded-md">
                  <h5 className="text-sm font-semibold text-blue-800 mb-2">
                    Calculation Breakdown
                  </h5>
                  <div className="text-xs text-blue-700 space-y-1">
                    <div>
                      Base Value:{" "}
                      {formatPrice(calculationBreakdown.baseValue || 0)}
                    </div>
                    {calculationBreakdown.conditionMultiplier && (
                      <div>
                        Condition Factor:{" "}
                        {(
                          calculationBreakdown.conditionMultiplier * 100
                        ).toFixed(0)}
                        %
                      </div>
                    )}
                    <div className="font-semibold border-t pt-1">
                      Final Value:{" "}
                      {formatPrice(
                        calculationBreakdown.finalValue || estimatedValue
                      )}
                    </div>
                  </div>
                </div>
              )}

              <Link
                href="/trade-in-calculator"
                className="flex items-center text-yellow-600 hover:text-yellow-700 mt-4 text-sm font-medium"
              >
                see other categories <FaChevronRight className="ml-1 text-xs" />
                <FaChevronRight className="text-xs" />
                <FaChevronRight className="text-xs" />
              </Link>
            </div>
          </div>
        </div>

        {/* Second section */}
        <div className="mt-12 flex flex-col md:flex-row gap-8">
          {/* Left Column: Additional details */}
          <div className="w-full md:w-6/12 lg:w-1/2">
            <h3 className="mb-6 text-xl font-bold text-gray-800">
              Additional Details
            </h3>
            <div className="grid grid-cols-1 gap-y-4">
              {/* Product turns off and on automatically? */}
              <div className="relative mb-3">
                <label
                  htmlFor="autoOnOff"
                  className="block text-gray-700 text-sm font-medium mb-1"
                >
                  Does your phone turn off and on automatically?
                </label>
                <select
                  id="autoOnOff"
                  name="autoOnOff"
                  value={formData.autoOnOff}
                  onChange={handleChange}
                  className="form-select block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm appearance-none pr-10"
                >
                  <option value="">Select Option</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
                <FaChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
              </div>

              {/* Condition of product's body */}
              <div className="relative mb-3">
                <label
                  htmlFor="bodyCondition"
                  className="block text-gray-700 text-sm font-medium mb-1"
                >
                  What is the condition of your phone&apos;s body?
                </label>
                <select
                  id="bodyCondition"
                  name="bodyCondition"
                  value={formData.bodyCondition}
                  onChange={handleChange}
                  className="form-select block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm appearance-none pr-10"
                >
                  <option value="">Select Option</option>
                  <option value="perfect">Perfect</option>
                  <option value="minor_scratches">Minor Scratches</option>
                  <option value="dents">Dents</option>
                  <option value="cracked">Cracked</option>
                </select>
                <FaChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
              </div>

              {/* Condition of product's screen */}
              <div className="relative mb-3">
                <label
                  htmlFor="screenCondition"
                  className="block text-gray-700 text-sm font-medium mb-1"
                >
                  What is the condition of your phone&apos;s screen?
                </label>
                <select
                  id="screenCondition"
                  name="screenCondition"
                  value={formData.screenCondition}
                  onChange={handleChange}
                  className="form-select block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm appearance-none pr-10"
                >
                  <option value="">Select Option</option>
                  <option value="perfect">Perfect</option>
                  <option value="minor_scratches">Minor Scratches</option>
                  <option value="cracked">Cracked</option>
                  <option value="shattered">Shattered</option>
                </select>
                <FaChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
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
                  name="repairVisits"
                  value={formData.repairVisits}
                  onChange={handleChange}
                  className="form-select block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm appearance-none pr-10"
                >
                  <option value="">Select Option</option>
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2-3">2 - 3</option>
                  <option value="more-than-3-times">
                    More than three times
                  </option>
                </select>
                <FaChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
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
                  name="biometricFunction"
                  value={formData.biometricFunction}
                  onChange={handleChange}
                  className="form-select block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm appearance-none pr-10"
                >
                  <option value="">Select Option</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="not_applicable">Not Applicable</option>
                </select>
                <FaChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong className="font-bold text-yellow-800">
                  Important Notice:
                </strong>{" "}
                This trade-in estimate is preliminary and subject to change
                after physical evaluation by our technicians. Final value
                depends on actual device condition, functionality, and market
                demand. We do not accept stolen or counterfeit devices.
              </p>
            </div>

            <div className="space-y-3 mt-6">
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
                  Has your &ldquo;find my phone&rdquo; been disabled and you
                  have signed out of iCloud/Gmail?
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
                  Has all your data been backed up and will be wiped from the
                  device?
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
                  I understand final trade-in value will be determined after
                  physical inspection
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isCalculating}
              className="bg-green-600 text-white px-6 py-3 my-3 rounded-md font-semibold hover:bg-green-700 transition duration-200 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCalculating ? "Calculating..." : "Get Final Estimate"}
            </button>
          </div>

          {/* Right Column: Recently uploaded products */}
          <div className="w-full md:w-6/12 lg:w-1/2">
            <h3 className="mb-6 text-xl font-bold text-gray-800">
              Recently Listed Mobile Phones
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
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
              <span className="text-sm text-gray-600">
                {Math.floor(startIndex / itemsPerPage) + 1} of{" "}
                {Math.ceil(recentlyUploaded.length / itemsPerPage)}
              </span>
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
                <FontAwesomeIcon icon={faArrowRight} />
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
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      style={{ objectFit: "contain" }}
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
                        {formatPrice(product.price)}
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
                      <Link
                        href={`/product/${product.id}`}
                        className="bg-green-600 text-white text-xs px-3 py-1 rounded-md hover:bg-green-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        View More
                      </Link>
                      {product.availability === "out of stock" ? (
                        <FontAwesomeIcon
                          icon={faShoppingCart}
                          className="text-gray-400 opacity-50 text-base"
                        />
                      ) : (
                        <button className="text-green-600 border border-green-600 p-1 rounded-md text-base hover:text-green-700 hover:border-green-700 transition duration-200">
                          <FontAwesomeIcon icon={faShoppingCart} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MobilePhonesPage;
