import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CalculationBreakdown } from "@/types/trade-in";
import { formatPrice } from "@/lib/utils";

interface TradeInSidebarProps {
  deviceType: "computer" | "mobile";
  isCalculating: boolean;
  hasCalculated: boolean;
  estimatedValue: number;
  calculationBreakdown: CalculationBreakdown | null;
}

const TradeInSidebar: React.FC<TradeInSidebarProps> = ({
  deviceType,
  isCalculating,
  hasCalculated,
  estimatedValue,
  calculationBreakdown,
}) => {
  const isComputer = deviceType === "computer";
  const imageSrc = isComputer
    ? "https://res.cloudinary.com/ds83mhjcm/image/upload/v1720178194/SwapConnect/swap/laptop_swap_e3epz6.png"
    : "https://res.cloudinary.com/ds83mhjcm/image/upload/v1720178193/SwapConnect/swap/mobile-phone_swap_lgpc3d.png";

  // Link to root as per original
  const linkHref = "/trade-in-calculator";

  const getEstimateDisplayText = () => {
    if (isCalculating) return "Calculating...";
    if (hasCalculated && estimatedValue > 0) return formatPrice(estimatedValue);
    if (hasCalculated && estimatedValue === 0) return "Unable to estimate";
    return "Click 'Get Final Estimate' to calculate";
  };

  return (
    <div className="rounded-lg border border-yellow-600 shadow-md p-4 bg-white">
      <h4 className="text-xl font-semibold mb-2">Estimated Trade-In Value</h4>
      <p className="text-sm text-gray-600 mb-4">
        Note: Values are estimated and may vary after physical inspection.
      </p>
      <div className="relative w-full h-40 mb-4">
        <Image
          src={imageSrc}
          alt="Trade-in illustration"
          fill
          className="object-contain rounded-md"
        />
      </div>
      <strong className="block mt-3 text-gray-800">Estimated Value</strong>
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
              Base Value: {formatPrice(calculationBreakdown.baseValue || 0)}
            </div>
            {calculationBreakdown.conditionMultiplier && (
              <div>
                Condition Factor:{" "}
                {(calculationBreakdown.conditionMultiplier * 100).toFixed(0)}%
              </div>
            )}
            <div className="font-semibold border-t pt-1">
              Final Value:{" "}
              {formatPrice(calculationBreakdown.finalValue || estimatedValue)}
            </div>
          </div>
        </div>
      )}

      <Link
        href={linkHref}
        className="flex items-center text-yellow-600 hover:text-yellow-700 mt-4 text-sm font-medium"
      >
        see other categories <ChevronRight className="ml-1 h-3 w-3" />
        <ChevronRight className="h-3 w-3" />
        <ChevronRight className="h-3 w-3" />
      </Link>
    </div>
  );
};

export default TradeInSidebar;
