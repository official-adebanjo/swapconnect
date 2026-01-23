"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useUserStore } from "@/stores/AuthStore";
import toast, { Toaster } from "react-hot-toast";
import {
  // ChevronRight,
  ArrowLeft,
  Smartphone,
  CheckCircle2,
  Info,
} from "lucide-react";
import TradeInSidebar from "@/components/trade-in-calculator/Sidebar";
import RecentlyUploadedProducts from "@/components/trade-in-calculator/RecentlyUploaded";
import TradeInForm from "@/components/trade-in-calculator/TradeInForm";
import AdditionalDetails from "@/components/trade-in-calculator/AdditionalDetails";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { Product, TradeInField, MobileFormData } from "@/types/trade-in";

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

// Mobile fields for TradeInForm
const mobileFields: TradeInField[] = [
  {
    label: "Brand",
    name: "brand",
    type: "select",
    required: true,
    options: [
      { value: "iOS", label: "iOS (iPhone)" },
      { value: "Samsung", label: "Samsung" },
      { value: "Google", label: "Google (Pixel)" },
      { value: "OnePlus", label: "OnePlus" },
      { value: "Xiaomi", label: "Xiaomi" },
      { value: "Huawei", label: "Huawei" },
      { value: "Infinix", label: "Infinix" },
      { value: "Tecno", label: "Tecno" },
      { value: "Other", label: "Other" },
    ],
    placeholder: "Select Brand",
  },
  {
    label: "Model",
    name: "model",
    type: "text",
    required: true,
    placeholder: "e.g., iPhone 13, Galaxy S21",
  },
  {
    label: "Storage",
    name: "storage",
    type: "select",
    required: true,
    options: [
      { value: "32GB", label: "32GB" },
      { value: "64GB", label: "64GB" },
      { value: "128GB", label: "128GB" },
      { value: "256GB", label: "256GB" },
      { value: "512GB", label: "512GB" },
      { value: "1TB", label: "1TB" },
    ],
    placeholder: "Select Storage",
  },
  {
    label: "RAM Size",
    name: "ram",
    type: "select",
    required: true,
    options: [
      { value: "2GB", label: "2GB" },
      { value: "3GB", label: "3GB" },
      { value: "4GB", label: "4GB" },
      { value: "6GB", label: "6GB" },
      { value: "8GB", label: "8GB" },
      { value: "12GB", label: "12GB" },
      { value: "16GB", label: "16GB" },
    ],
    placeholder: "Select RAM Size",
  },
  {
    label: "Battery Capacity",
    name: "batteryCapacity",
    type: "select",
    options: [
      { value: "3000MAH", label: "3000mAh" },
      { value: "4000MAH", label: "4000mAh" },
      { value: "5000MAH", label: "5000mAh" },
      { value: "6000MAH", label: "6000mAh" },
      { value: "Unknown", label: "Unknown" },
    ],
    placeholder: "Select Capacity",
  },
  {
    label: "Battery Life",
    name: "batteryHours",
    type: "select",
    options: [
      { value: "ABOUT 4 HRS", label: "About 4 hours" },
      { value: "6-8 HRS", label: "6-8 hours" },
      { value: "8-12 HRS", label: "8-12 hours" },
      { value: "more than 12 HRS", label: "More than 12 hours" },
    ],
    placeholder: "Battery Performance",
  },
  {
    label: "Phone Age",
    name: "phoneAge",
    type: "select",
    required: true,
    options: [
      { value: "6-12 Months", label: "6-12 Months" },
      { value: "1-2 years", label: "1-2 years" },
      { value: "2-3 years", label: "2-3 years" },
      { value: "Above 3 years", label: "Above 3 years" },
    ],
    placeholder: "How old is it?",
  },
  {
    label: "Device Image",
    name: "deviceImage",
    type: "file",
    placeholder: "Upload clear photo",
    helperText: "Supports: JPG, PNG, PDF (Max 5MB)",
  },
];

const fetchRecentlyUploaded = async (token?: string): Promise<Product[]> => {
  try {
    const response = await api.get<ProductApiData[]>(
      "/products/top?limit=6",
      token,
    );
    if (response.success && response.data) {
      return response.data.map((product: ProductApiData) => ({
        id: product.id,
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
  const { token } = useUserStore();

  const [recentlyUploaded, setRecentlyUploaded] = useState<Product[]>([]);
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
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoadingProducts(true);
      const products = await fetchRecentlyUploaded(token);
      setRecentlyUploaded(products);
      setIsLoadingProducts(false);
    };
    loadProducts();
  }, [token]);

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
    if (
      !formData.brand ||
      !formData.model ||
      !formData.storage ||
      !formData.ram ||
      !formData.phoneAge
    ) {
      toast.error(
        "Please fill in all required fields (Brand, Model, Storage, RAM, Phone Age)",
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

      const response = await api.post<
        ApiResponse<{
          estimatedValue: number;
          breakdown: CalculationBreakdown;
        }>,
        unknown
      >("/bid/calculator", payload, token);

      if (response.success) {
        const responseData = response as unknown as {
          estimatedValue?: number;
          breakdown?: CalculationBreakdown;
          data?: { estimatedValue: number; breakdown: CalculationBreakdown };
        };
        const calculatedValue =
          responseData.data?.estimatedValue ?? responseData.estimatedValue ?? 0;
        const breakdown =
          responseData.data?.breakdown ?? responseData.breakdown ?? null;

        setEstimatedValue(calculatedValue);
        setCalculationBreakdown(breakdown);
        setHasCalculated(true);

        if (calculatedValue > 0) {
          toast.success(`Estimate generated: ${formatPrice(calculatedValue)}`, {
            duration: 4000,
          });
        } else {
          toast.error("Unable to calculate value.");
        }
      } else {
        toast.error("Failed to calculate. Try again.");
      }
    } catch {
      toast.error("An error occurred. Try again.");
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Calculating estimate...", { duration: 2000 });
    await calculateValue();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type, files } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files?.[0] || "" : value,
    }));
  };

  return (
    <div className="bg-gray-50 dark:bg-black min-h-screen pb-20">
      <Toaster position="top-right" />

      {/* Premium Header */}
      <div className="bg-linear-to-r from-gray-900 via-gray-800 to-green-900 text-white pt-16 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_120%,rgba(0,255,100,0.3),transparent_50%)]" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link
              href="/trade-in-calculator"
              className="inline-flex items-center text-green-400 font-bold mb-6 hover:text-green-300 transition-colors uppercase tracking-widest text-xs gap-2"
            >
              <ArrowLeft size={14} /> Back to Categories
            </Link>
          </motion.div>

          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-4 mb-4"
            >
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl">
                <Smartphone size={32} className="text-green-400" />
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight">
                Mobile <span className="text-green-400">Trade-In</span>
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-300 text-lg md:text-xl font-medium max-w-2xl leading-relaxed"
            >
              Turn your old device into cash or credit. Quick evaluation powered
              by real-time market insights.
            </motion.p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-12 relative z-20">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left Column */}
            <div className="w-full lg:w-3/4 space-y-8">
              {/* Specs Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none p-8 border border-gray-100 dark:border-gray-800"
              >
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-50 dark:border-gray-800">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-700 dark:text-green-400 font-bold text-sm">
                    1
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Device Specifications
                  </h3>
                </div>
                <TradeInForm
                  fields={mobileFields}
                  formData={formData}
                  onChange={handleChange}
                />
              </motion.div>

              {/* Condition Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none p-8 border border-gray-100 dark:border-gray-800"
              >
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-50 dark:border-gray-800">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-700 dark:text-green-400 font-bold text-sm">
                    2
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Physical & Functionality Condition
                  </h3>
                </div>
                <AdditionalDetails
                  formData={formData}
                  onChange={handleChange}
                />

                <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/10 rounded-3xl border border-blue-100 dark:border-blue-900/20 flex gap-4 items-start">
                  <div className="p-2 bg-blue-200 dark:bg-blue-900/30 rounded-xl text-blue-700 dark:text-blue-400 mt-1">
                    <Info size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-1">
                      Pre-Inspection Terms
                    </h4>
                    <p className="text-sm text-blue-800 dark:text-blue-300/80 leading-relaxed font-medium opacity-80">
                      Your estimate is based on the condition described. Ensure
                      Find My Phone is disabled and you are signed out of
                      iCloud/Gmail before physical inspection.
                    </p>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  {[
                    "Find My Phone has been disabled and I've signed out of accounts.",
                    "All data has been backed up and will be wiped from the device.",
                    "I understand final value is determined after physical inspection.",
                  ].map((text, i) => (
                    <label
                      key={i}
                      className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group"
                    >
                      <div className="relative flex items-center pt-1">
                        <input
                          type="checkbox"
                          required
                          className="peer appearance-none w-6 h-6 border-2 border-gray-200 dark:border-gray-700 rounded-lg checked:bg-green-600 checked:border-green-600 transition-all cursor-pointer"
                        />
                        <CheckCircle2 className="absolute pointer-events-none opacity-0 peer-checked:opacity-100 text-white w-4 h-4 ml-1 transition-opacity" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium text-sm group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                        {text}
                      </span>
                    </label>
                  ))}
                </div>

                <div className="mt-10 flex justify-end">
                  <button
                    type="submit"
                    disabled={isCalculating}
                    className="group relative bg-gray-900 dark:bg-green-600 text-white px-10 py-5 rounded-2xl font-bold hover:bg-green-600 dark:hover:bg-green-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-gray-400 dark:shadow-none active:scale-95"
                  >
                    {isCalculating ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Evaluating...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Get Final Estimate
                        <CheckCircle2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                      </span>
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Recently uploaded */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                    Recently Listed Mobiles
                  </h3>
                  <Link
                    href="/shop"
                    className="text-green-600 dark:text-green-400 font-bold text-sm hover:underline"
                  >
                    View All Shop
                  </Link>
                </div>
                <RecentlyUploadedProducts
                  products={recentlyUploaded}
                  isLoading={isLoadingProducts}
                />
              </motion.div>
            </div>

            {/* Right Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full lg:w-1/4"
            >
              <TradeInSidebar
                deviceType="mobile"
                isCalculating={isCalculating}
                hasCalculated={hasCalculated}
                estimatedValue={estimatedValue}
                calculationBreakdown={calculationBreakdown}
              />
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MobilePhonesPage;
