"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useUserStore } from "@/stores/AuthStore";
// import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import TradeInForm from "@/components/trade-in-calculator/TradeInForm";
import RecentlyUploadedProducts from "@/components/trade-in-calculator/RecentlyUploaded";
import AdditionalDetails from "@/components/trade-in-calculator/AdditionalDetails";
import type { ComputerFormData, TradeInField, Product } from "@/types/trade-in";
import { FaChevronRight } from "react-icons/fa";
import { api } from "@/lib/api";

const fetchRecentlyUploaded = async (token?: string): Promise<Product[]> => {
  try {
    const response = await api.get<{ data: any[] }>(
      "/api/products/top?limit=6",
      token
    );
    if (response.success && response.data?.data) {
      return response.data.data.map((product: any) => ({
        id: product.id.toString(),
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

// Fields for computer trade-in form
const computerFields: TradeInField[] = [
  {
    label: 'Brand',
    name: 'brand',
    type: 'select',
    required: true,
    options: [
      { value: 'Apple', label: 'Apple' },
      { value: 'Dell', label: 'Dell' },
      { value: 'HP', label: 'HP' },
      { value: 'Lenovo', label: 'Lenovo' },
      { value: 'Acer', label: 'Acer' },
      { value: 'Asus', label: 'Asus' },
      { value: 'Microsoft', label: 'Microsoft' },
      { value: 'Other', label: 'Other' },
    ],
    placeholder: 'Select Brand',
  },
  {
    label: 'Model',
    name: 'model',
    type: 'text',
    required: true,
    placeholder: 'Enter Model (e.g., MacBook Pro 13, ThinkPad X1)',
  },
  {
    label: 'Processor',
    name: 'processor',
    type: 'text',
    required: true,
    placeholder: 'e.g. Intel i5, M1, AMD Ryzen 5',
  },
  {
    label: 'RAM Size',
    name: 'ram',
    type: 'select',
    required: true,
    options: [
      { value: '4GB', label: '4GB' },
      { value: '8GB', label: '8GB' },
      { value: '16GB', label: '16GB' },
      { value: '32GB', label: '32GB' },
      { value: '64GB', label: '64GB' },
      { value: 'Other', label: 'Other' },
    ],
    placeholder: 'Select RAM Size',
  },
  {
    label: 'Storage Type',
    name: 'storageType',
    type: 'select',
    required: true,
    options: [
      { value: 'HDD', label: 'HDD' },
      { value: 'SSD', label: 'SSD' },
      { value: 'Hybrid', label: 'Hybrid (HDD + SSD)' },
      { value: 'eMMC', label: 'eMMC' },
      { value: 'Other', label: 'Other' },
    ],
    placeholder: 'Select Storage Type',
  },
  {
    label: 'Storage Size',
    name: 'storageSize',
    type: 'text',
    required: true,
    placeholder: 'e.g. 256GB, 512GB, 1TB',
  },
  {
    label: 'Screen Size',
    name: 'screenSize',
    type: 'text',
    required: true,
    placeholder: 'e.g. 13 inch, 15.6 inch',
  },
  {
    label: 'Operating System',
    name: 'operatingSystem',
    type: 'select',
    required: true,
    options: [
      { value: 'Windows 11', label: 'Windows 11' },
      { value: 'Windows 10', label: 'Windows 10' },
      { value: 'macOS', label: 'macOS' },
      { value: 'Linux', label: 'Linux' },
      { value: 'Chrome OS', label: 'Chrome OS' },
      { value: 'Other', label: 'Other' },
    ],
    placeholder: 'Select Operating System',
  },
  {
    label: 'Purchase Year',
    name: 'purchaseYear',
    type: 'select',
    required: true,
    options: [
      ...Array.from({ length: currentYear - startYear + 1 }, (_, i) => {
        const year = currentYear - i;
        return { value: String(year), label: String(year) };
      }),
      { value: 'Before ' + startYear, label: 'Before ' + startYear },
    ],
    placeholder: 'Select Purchase Year',
  },
];

const ComputersPage: React.FC = () => {
  // const router = useRouter();
  const { token } = useUserStore();

  const [recentlyUploaded, setRecentlyUploaded] = useState<Product[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const [estimatedValue, setEstimatedValue] = useState<number>(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationBreakdown, setCalculationBreakdown] = useState<any>(null);
  const [hasCalculated, setHascCalculated] = useState(false);
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

  // Load recently uploaded products
  useEffect(() => {
    if (!token) return;
    fetchRecentlyUploaded(token).then(setRecentlyUploaded);
  }, [token]);

  // Restore saved form data if redirected from login
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

  // Calculate estimated value when form data changes
  useEffect(() => {
    if (hasCalculated){
      setHascCalculated(false);
      setEstimatedValue(0);
      setCalculationBreakdown(null);
    }
  }, [
    formData.brand,
    formData.model,
    formData.ram,
    formData.storageSize,
    formData.storageType,
  ]);

    const calculateValue = async () => {
      // Only calculate if we have minimum required fields
      if (!formData.brand || !formData.model || !formData.ram || !formData.storageSize  || !formData.storageType) {
        toast.error(         "Please fill in all required fields (Brand, Model, Storage, RAM, Phone Age");
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

        // if (!token) {
        //   return;
        // }
        const response: any = await api.post(
          "/api/bid/calculator",
          payload,
          token
        );

        if (response.success) {
          console.log(response);
          const calculatedValue = response.data?.estimatedValue || response.estimatedValue || 0;
          const breakdown = response.data?.breakdown || response.breakdown;
          setEstimatedValue(calculatedValue);
          setCalculationBreakdown(breakdown);
          setHascCalculated(true);

          if (calculatedValue > 0) {
            toast.success( Your computer is estimated to be worth ${formatPrice(calculatedValue)}!, { duration: 5000,});
          } else {
            toast.error(            "Unable to calculate value. Please check your device details."
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

    // Debounce the calculation
  //   const timeoutId = setTimeout(calculateValue, 500);
  //   return () => clearTimeout(timeoutId);
  // }, [formData, token]);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      // if (!token) {
      //   toast.error("Please log in to get final estimate.", { duration: 3000,});
      //   return;
      // }
      toast.success("estimating value, please wait...", {duration: 2000,});
      // console.log("Form submitted with data:", formData);
      await calculateValue();
    };

  const itemsPerPage = 3;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = recentlyUploaded.slice(startIndex, endIndex);
  const isPrevDisabled = startIndex === 0;
  const isNextDisabled = endIndex >= recentlyUploaded.length;

  const handlePrev = () =>
    setStartIndex((prev) => Math.max(prev - itemsPerPage, 0));
  const handleNext = () =>
    setStartIndex((prev) =>
      Math.min(prev + itemsPerPage, recentlyUploaded.length - itemsPerPage)
    );

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
        Computers Trade-In Calculator
      </h2>
      <form onSubmit={handleSubmit} >
                <div className="flex flex-col md:flex-row gap-8">

        {/* Trade-in form */}
        <div className="w-full md:w-8/12 lg:w-3/4">
          <TradeInForm
            fields={computerFields}
            formData={formData}
            onChange={handleChange}
          />
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-4/12 lg:w-1/4">
          <div className="rounded-lg border border-yellow-600 shadow-md p-4 bg-white">
            <h4 className="text-xl font-semibold mb-2">
              Estimated Trade-In Value
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Note: Values are estimated and may vary after physical inspection.
            </p>
            <div className="relative w-full h-40 mb-4">
              <Image
                src="https://res.cloudinary.com/ds83mhjcm/image/upload/v1720178194/SwapConnect/swap/laptop_swap_e3epz6.png"
                alt="Trade-in illustration"
                fill
                className="object-contain rounded-md"
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
                      {(calculationBreakdown.conditionMultiplier * 100).toFixed(
                        0
                      )}
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

        {/* Bottom section */}
        <div className="mt-12 flex flex-col md:flex-row gap-8">
          {/* Additional details */}
          <div className="w-full md:w-6/12 lg:w-1/2">
            <h3 className="mb-6 text-xl font-bold text-gray-800">
              Additional Details
            </h3>
            <AdditionalDetails formData={formData} onChange={handleChange} />

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
                  id="dataWiped"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="dataWiped"
                  className="ml-2 block text-sm text-gray-900"
                >
                  I confirm all personal data has been backed up and will be
                  wiped from the device
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="devicePackaged"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="devicePackaged"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Device will be safely packaged to avoid transit damage
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

          {/* Recently uploaded */}
          <div className="w-full md:w-6/12 lg:w-1/2">
            <h3 className="mb-6 text-xl font-bold text-gray-800">
              Recently Listed Computers
            </h3>
            <RecentlyUploadedProducts products={currentItems} />
            <div className="flex justify-between mt-4">
              <button
                disabled={isPrevDisabled}
                onClick={handlePrev}
                className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm text-gray-600">
                {Math.floor(startIndex / itemsPerPage) + 1} of{" "}
                {Math.ceil(recentlyUploaded.length / itemsPerPage)}
              </span>
              <button
                disabled={isNextDisabled}
                onClick={handleNext}
                className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ComputersPage;