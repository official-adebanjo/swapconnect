"use client";

import type React from "react";
import type { BaseTradeInFormData } from "@/types/trade-in";
import { ChevronDown } from "lucide-react";

interface AdditionalDetailsProps {
  formData: BaseTradeInFormData;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const AdditionalDetails: React.FC<AdditionalDetailsProps> = ({
  formData,
  onChange,
}) => {
  interface DetailField {
    id: keyof BaseTradeInFormData;
    label: string;
    options: { value: string; label: string }[];
  }

  const detailFields: DetailField[] = [
    {
      id: "autoOnOff",
      label: "Does your device turn off and on automatically?",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
    },
    {
      id: "bodyCondition",
      label: "What is the condition of your device's body?",
      options: [
        { value: "perfect", label: "Perfect" },
        { value: "good", label: "Good (minor wear)" },
        { value: "fair", label: "Fair (visible scratches/dents)" },
        { value: "poor", label: "Poor (significant damage)" },
      ],
    },
    {
      id: "screenCondition",
      label: "What is the condition of your device's screen?",
      options: [
        { value: "perfect", label: "Perfect" },
        { value: "good", label: "Good (minor scratches)" },
        { value: "fair", label: "Fair (visible scratches)" },
        { value: "poor", label: "Poor (cracks/dead pixels)" },
      ],
    },
    {
      id: "repairVisits",
      label: "How many times have you visited a technician for repair?",
      options: [
        { value: "0", label: "0 times" },
        { value: "1", label: "1 time" },
        { value: "2-3", label: "2 - 3 times" },
        { value: "more-than-3-times", label: "More than three times" },
      ],
    },
    {
      id: "biometricFunction",
      label: "Does fingerprint or face recognition work normally?",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
        { value: "not_applicable", label: "Not Applicable" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {detailFields.map((field) => (
        <div className="flex flex-col gap-2" key={field.id}>
          <label
            htmlFor={field.id}
            className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1"
          >
            {field.label}
          </label>
          <div className="relative group">
            <select
              id={field.id}
              name={field.id}
              value={formData[field.id] || ""}
              onChange={onChange}
              className="w-full h-12 pl-4 pr-11 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-gray-100 text-sm font-medium appearance-none transition-all duration-300 focus:ring-4 focus:ring-green-500/10 focus:border-green-500 hover:border-gray-300 dark:hover:border-gray-700 cursor-pointer shadow-sm"
            >
              <option value="" disabled>
                Select Option
              </option>
              {field.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-green-600 transition-colors">
              <ChevronDown size={18} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdditionalDetails;
