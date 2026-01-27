"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useUserStore } from "@/stores/AuthStore";
import toast, { Toaster } from "react-hot-toast";
import TradeInForm from "@/components/trade-in-calculator/TradeInForm";
import RecentlyUploadedProducts from "@/components/trade-in-calculator/RecentlyUploaded";
import TradeInSidebar from "@/components/trade-in-calculator/Sidebar";
import AdditionalDetails from "@/components/trade-in-calculator/AdditionalDetails";
import type { ComputerFormData, TradeInField, Product } from "@/types/trade-in";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Laptop, Info } from "lucide-react";
import Link from "next/link";

interface CalculationBreakdown {
  baseValue?: number;
  conditionMultiplier?: number;
  finalValue?: number;
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

const fetchRecentlyUploaded = async (token?: string): Promise<Product[]> => {
  try {
    const response = await api.get<{ data: ProductApiData[] }>(
      "/products/top?limit=6",
      token,
    );
    if (response.success && response.data?.data) {
      return response.data.data.map((product: ProductApiData) => ({
        id: product.id,
        name: product.name,
        image: product.imageUrl || "/placeholder.svg?height=200&width=200",
        price: product.price,
        description: product.description || "",
        availability: product.stock > 0 ? "in stock" : "out of stock",
        stock: product.stock,
        isTopSale: true,
        tag: product.Category?.name || "Computers",
      }));
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch recently uploaded products:", error);
    return [];
  }
};

const currentYear = new Date().getFullYear();
const startYear = 2018;

const computerFields: TradeInField[] = [
  {
    label: "Brand",
    name: "brand",
    type: "select",
    required: true,
    options: [
      { value: "Apple", label: "Apple" },
      { value: "Dell", label: "Dell" },
      { value: "HP", label: "HP" },
      { value: "Lenovo", label: "Lenovo" },
      { value: "Acer", label: "Acer" },
      { value: "Asus", label: "Asus" },
      { value: "Microsoft", label: "Microsoft" },
      { value: "Other", label: "Other" },
    ],
    placeholder: "Select Brand",
  },
  {
    label: "Model",
    name: "model",
    type: "text",
    required: true,
    placeholder: "e.g., MacBook Pro 13, ThinkPad X1",
  },
  {
    label: "Processor",
    name: "processor",
    type: "text",
    required: true,
    placeholder: "e.g. Intel i5, M1, AMD Ryzen 5",
  },
  {
    label: "RAM Size",
    name: "ram",
    type: "select",
    required: true,
    options: [
      { value: "4GB", label: "4GB" },
      { value: "8GB", label: "8GB" },
      { value: "16GB", label: "16GB" },
      { value: "32GB", label: "32GB" },
      { value: "64GB", label: "64GB" },
      { value: "Other", label: "Other" },
    ],
    placeholder: "Select RAM Size",
  },
  {
    label: "Storage Type",
    name: "storageType",
    type: "select",
    required: true,
    options: [
      { value: "HDD", label: "HDD" },
      { value: "SSD", label: "SSD" },
      { value: "Hybrid", label: "Hybrid" },
      { value: "eMMC", label: "eMMC" },
      { value: "Other", label: "Other" },
    ],
    placeholder: "Select Storage Type",
  },
  {
    label: "Storage Size",
    name: "storageSize",
    type: "text",
    required: true,
    placeholder: "e.g. 256GB, 512GB, 1TB",
  },
  {
    label: "Screen Size",
    name: "screenSize",
    type: "text",
    required: true,
    placeholder: "e.g. 13 inch, 15.6 inch",
  },
  {
    label: "Operating System",
    name: "operatingSystem",
    type: "select",
    required: true,
    options: [
      { value: "Windows 11", label: "Windows 11" },
      { value: "Windows 10", label: "Windows 10" },
      { value: "macOS", label: "macOS" },
      { value: "Linux", label: "Linux" },
      { value: "Chrome OS", label: "Chrome OS" },
      { value: "Other", label: "Other" },
    ],
    placeholder: "Select Operating System",
  },
  {
    label: "Purchase Year",
    name: "purchaseYear",
    type: "select",
    required: true,
    options: [
      ...Array.from({ length: currentYear - startYear + 1 }, (_, i) => {
        const year = currentYear - i;
        return { value: String(year), label: String(year) };
      }),
      { value: "Before " + startYear, label: "Before " + startYear },
    ],
    placeholder: "When did you buy it?",
  },
];

const ComputersPage: React.FC = () => {
  const { token } = useUserStore();

  const [recentlyUploaded, setRecentlyUploaded] = useState<Product[]>([]);
  const [estimatedValue, setEstimatedValue] = useState<number>(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationBreakdown, setCalculationBreakdown] =
    useState<CalculationBreakdown | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [formData, setFormData] = useState<ComputerFormData>({
    brand: "",
    model: "",
    processor: "",
    ram: "",
    storageType: "",
    storageSize: "",
    screenSize: "",
    operatingSystem: "",
    purchaseYear: "",
    autoOnOff: "",
    bodyCondition: "",
    screenCondition: "",
    repairVisits: "",
    biometricFunction: "",
  });
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    setIsLoadingProducts(true);
    fetchRecentlyUploaded(token)
      .then(setRecentlyUploaded)
      .finally(() => setIsLoadingProducts(false));
  }, [token]);

  useEffect(() => {
    const saved = sessionStorage.getItem("computerTradeInFormData");
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
        sessionStorage.removeItem("computerTradeInFormData");
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
    formData.ram,
    formData.storageSize,
    formData.storageType,
    hasCalculated,
  ]);

  const calculateValue = async () => {
    if (
      !formData.brand ||
      !formData.model ||
      !formData.ram ||
      !formData.storageSize ||
      !formData.storageType
    ) {
      toast.error(
        "Please fill in all required fields (Brand, Model, Storage, RAM, Purchase Year)",
      );
      return;
    }

    setIsCalculating(true);

    try {
      const payload = {
        deviceType: "computer",
        deviceDetails: {
          brand: formData.brand,
          model: formData.model,
          processor: formData.processor,
          ram: formData.ram,
          storageType: formData.storageType,
          storageSize: formData.storageSize,
          screenSize: formData.screenSize,
          operatingSystem: formData.operatingSystem,
          purchaseYear: formData.purchaseYear,
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
        { estimatedValue: number; breakdown: CalculationBreakdown },
        typeof payload
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
        toast.error("Failed to calculate value. Try again.");
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
      <div className="bg-linear-to-r from-gray-900 via-gray-800 to-green-900 text-white pt-10 pb-20 md:pt-16 md:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_120%,rgba(0,255,100,0.3),transparent_50%)]" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link
              href="/trade-in-calculator"
              className="inline-flex items-center text-green-400 font-bold mb-4 md:mb-6 hover:text-green-300 transition-colors uppercase tracking-widest text-[10px] md:text-xs gap-2"
            >
              <ArrowLeft size={14} /> Back to Categories
            </Link>
          </motion.div>

          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4"
            >
              <div className="p-2.5 md:p-3 bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl">
                <Laptop size={24} className="text-green-400 md:w-8 md:h-8" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight">
                Computer <span className="text-green-400">Trade-In</span>
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-300 text-base md:text-xl font-medium max-w-2xl leading-relaxed"
            >
              Get a professional valuation for your laptop or desktop in
              minutes. Our AI evaluates the latest market data to give you the
              best price.
            </motion.p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 md:-mt-12 relative z-20">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
            {/* Left Main Pillar */}
            <div className="w-full lg:w-3/4 space-y-6 md:space-y-8">
              {/* Form Section 1: Specs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-900 rounded-2xl md:rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none p-5 md:p-8 border border-gray-100 dark:border-gray-800"
              >
                <div className="flex items-center gap-3 mb-6 md:mb-8 pb-4 border-b border-gray-50 dark:border-gray-800">
                  <div className="w-7 h-7 md:w-8 md:h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-700 dark:text-green-400 font-bold text-xs md:text-sm">
                    1
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                    Device Specifications
                  </h3>
                </div>
                <TradeInForm
                  fields={computerFields}
                  formData={formData}
                  onChange={handleChange}
                />
              </motion.div>

              {/* Form Section 2: Condition */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-gray-900 rounded-2xl md:rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none p-5 md:p-8 border border-gray-100 dark:border-gray-800"
              >
                <div className="flex items-center gap-3 mb-6 md:mb-8 pb-4 border-b border-gray-50 dark:border-gray-800">
                  <div className="w-7 h-7 md:w-8 md:h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-700 dark:text-green-400 font-bold text-xs md:text-sm">
                    2
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                    Physical & Functionality Condition
                  </h3>
                </div>
                <AdditionalDetails
                  formData={formData}
                  onChange={handleChange}
                />

                <div className="mt-8 md:mt-12 p-4 md:p-6 bg-orange-50 dark:bg-orange-900/10 rounded-2xl md:rounded-3xl border border-orange-100 dark:border-orange-900/20 flex gap-3 md:gap-4 items-start">
                  <div className="p-2 bg-orange-200 dark:bg-orange-900/30 rounded-lg md:rounded-xl text-orange-700 dark:text-orange-400 mt-1 shrink-0">
                    <Info size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-orange-900 dark:text-orange-100 mb-1 text-sm md:text-base">
                      Professional Inspection Required
                    </h4>
                    <p className="text-xs md:text-sm text-orange-800 dark:text-orange-300/80 leading-relaxed font-medium opacity-80">
                      This estimate is based on the details you provided. A
                      final binding offer will be made after our technicians
                      complete a 50-point physical evaluation of your device.
                    </p>
                  </div>
                </div>

                <div className="mt-6 md:mt-8 space-y-3 md:space-y-4">
                  {[
                    "I confirm all personal data has been backed up and will be wiped.",
                    "Device will be safely packaged to avoid transit damage.",
                    "I understand final value is determined after physical inspection.",
                  ].map((text, i) => (
                    <label
                      key={i}
                      className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group"
                    >
                      <div className="relative flex items-center pt-1 shrink-0">
                        <input
                          type="checkbox"
                          required
                          className="peer appearance-none w-5 h-5 md:w-6 md:h-6 border-2 border-gray-200 dark:border-gray-700 rounded-lg checked:bg-green-600 checked:border-green-600 transition-all cursor-pointer"
                        />
                        <CheckCircle2 className="absolute pointer-events-none opacity-0 peer-checked:opacity-100 text-white w-3.5 h-3.5 md:w-4 md:h-4 ml-0.5 md:ml-1 transition-opacity" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium text-xs md:text-sm group-hover:text-gray-900 dark:group-hover:text-white transition-colors leading-snug">
                        {text}
                      </span>
                    </label>
                  ))}
                </div>

                <div className="mt-8 md:mt-10 flex justify-end">
                  <button
                    type="submit"
                    disabled={isCalculating}
                    className="w-full sm:w-auto group relative bg-gray-900 dark:bg-green-600 text-white px-6 py-4 md:px-10 md:py-5 rounded-xl md:rounded-2xl font-bold hover:bg-green-600 dark:hover:bg-green-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-gray-400 dark:shadow-none active:scale-95 text-sm md:text-base"
                  >
                    {isCalculating ? (
                      <span className="flex items-center justify-center gap-2">
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
                      <span className="flex items-center justify-center gap-2">
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
                <div className="flex items-center justify-between mb-6 md:mb-8">
                  <h3 className="text-lg md:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                    Recently Listed Computers
                  </h3>
                  <Link
                    href="/shop"
                    className="text-green-600 dark:text-green-400 font-bold text-xs md:text-sm hover:underline shrink-0"
                  >
                    View All
                  </Link>
                </div>
                <RecentlyUploadedProducts
                  products={recentlyUploaded}
                  isLoading={isLoadingProducts}
                />
              </motion.div>
            </div>

            {/* Right Sidebar Pillar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full lg:w-1/4"
            >
              <TradeInSidebar
                deviceType="computer"
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

export default ComputersPage;
