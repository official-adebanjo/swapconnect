import React from "react";
import {
  TradeInField,
  ComputerFormData,
  MobileFormData,
} from "@/types/trade-in";
import { ChevronDown } from "lucide-react";

interface TradeInFormProps {
  fields: TradeInField[];
  formData: ComputerFormData | MobileFormData;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
}

const TradeInForm: React.FC<TradeInFormProps> = ({
  fields,
  formData,
  onChange,
}) => {
  // Helper to safely get value from formData without using 'any'
  const getFieldValue = (name: string): string => {
    const value = (formData as unknown as Record<string, unknown>)[name];
    if (typeof value === "string") return value;
    if (typeof value === "number") return String(value);
    return "";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      {fields.map((field) => (
        <div className="flex flex-col gap-2" key={field.name}>
          <label
            htmlFor={field.name}
            className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1 flex items-center gap-1.5"
          >
            {field.label}
            {field.required && <span className="text-red-500 text-xs">*</span>}
          </label>

          <div className="relative group">
            {field.type === "select" ? (
              <div className="relative">
                <select
                  id={field.name}
                  name={field.name}
                  required={field.required}
                  value={getFieldValue(field.name)}
                  onChange={onChange}
                  className="w-full h-12 pl-4 pr-11 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-gray-100 text-sm font-medium appearance-none transition-all duration-300 focus:ring-4 focus:ring-green-500/10 focus:border-green-500 hover:border-gray-300 dark:hover:border-gray-700 cursor-pointer shadow-sm"
                >
                  <option value="" disabled className="text-gray-400">
                    {field.placeholder || `Select ${field.label}`}
                  </option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-green-600 transition-colors">
                  <ChevronDown size={18} />
                </div>
              </div>
            ) : (
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                required={field.required}
                value={
                  field.type === "file" ? undefined : getFieldValue(field.name)
                }
                onChange={onChange}
                className="w-full h-12 px-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-gray-100 text-sm font-medium transition-all duration-300 focus:ring-4 focus:ring-green-500/10 focus:border-green-500 hover:border-gray-300 dark:hover:border-gray-700 shadow-sm"
                placeholder={field.placeholder}
                accept={field.accept}
              />
            )}
          </div>

          {field.helperText && (
            <span className="text-[11px] text-gray-400 dark:text-gray-500 ml-1 font-medium italic">
              {field.helperText}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default TradeInForm;
