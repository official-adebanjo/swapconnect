import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Info, ShieldCheck, TrendingUp } from "lucide-react";
import { CalculationBreakdown } from "@/types/trade-in";
import { formatPrice } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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

  const linkHref = "/trade-in-calculator";

  return (
    <div className="rounded-2xl md:rounded-3xl border border-gray-100 dark:border-gray-800 shadow-2xl p-5 md:p-6 bg-white dark:bg-gray-900 sticky top-24 overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-green-50 dark:bg-green-900/10 rounded-bl-full -mr-12 -mt-12 md:-mr-16 md:-mt-16 z-0" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 md:p-2 bg-green-100 dark:bg-green-900/20 rounded-lg text-green-700 dark:text-green-400">
            <TrendingUp size={16} className="md:w-[18px] md:h-[18px]" />
          </div>
          <h4 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white tracking-tight">
            Your Estimate
          </h4>
        </div>

        <div className="relative w-full h-32 md:h-44 mb-4 md:mb-6 group">
          <Image
            src={imageSrc}
            alt="Trade-in illustration"
            fill
            className="object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5 md:space-y-2">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              Estimated Trade-In Value
            </span>
            <div className="relative h-20 md:h-24 rounded-xl md:rounded-2xl bg-linear-to-br from-gray-900 to-gray-800 p-1 shadow-inner overflow-hidden flex items-center justify-center">
              <AnimatePresence mode="wait">
                {isCalculating ? (
                  <motion.div
                    key="calculating"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
                          transition={{
                            repeat: Infinity,
                            duration: 1,
                            delay: i * 0.2,
                          }}
                          className="w-2 h-2 bg-green-400 rounded-full"
                        />
                      ))}
                    </div>
                    <span className="text-green-400 text-xs font-medium tracking-widest uppercase">
                      Calculating
                    </span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="value"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    {hasCalculated && estimatedValue > 0 ? (
                      <span className="text-2xl md:text-3xl font-black text-white tracking-tight">
                        {formatPrice(estimatedValue)}
                      </span>
                    ) : (
                      <span className="text-xs md:text-sm font-medium text-gray-400 px-4 leading-normal">
                        Fill properties to see your device value
                      </span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Decorative scan line */}
              <motion.div
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 w-full h-[2px] bg-green-500/10 z-10"
              />
            </div>
          </div>

          <AnimatePresence>
            {calculationBreakdown && hasCalculated && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-2"
              >
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-medium">
                      Base Market Value
                    </span>
                    <span className="text-gray-900 dark:text-gray-100 font-bold">
                      {formatPrice(calculationBreakdown.baseValue || 0)}
                    </span>
                  </div>
                  {calculationBreakdown.conditionMultiplier && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 font-medium">
                        Condition Adjustment
                      </span>
                      <span
                        className={`font-bold ${calculationBreakdown.conditionMultiplier >= 1 ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400"}`}
                      >
                        {(
                          calculationBreakdown.conditionMultiplier * 100
                        ).toFixed(0)}
                        %
                      </span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-sm">
                    <span className="text-gray-900 dark:text-white font-bold">
                      Total Estimate
                    </span>
                    <span className="text-green-600 dark:text-green-400 font-extrabold">
                      {formatPrice(
                        calculationBreakdown.finalValue || estimatedValue,
                      )}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pt-2 space-y-3">
            <div className="flex gap-3 text-xs text-gray-500 leading-relaxed bg-blue-50/50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-100/50 dark:border-blue-900/30">
              <Info size={16} className="text-blue-500 shrink-0" />
              <p>
                Final value is confirmed after physical inspection by our
                experts.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 font-semibold bg-green-50/50 dark:bg-green-900/20 p-3 rounded-xl border border-green-100/50 dark:border-green-900/30">
              <ShieldCheck size={16} className="shrink-0" />
              <span>Certified Expert Evaluation</span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
            <Link
              href={linkHref}
              className="flex items-center justify-between w-full group/link p-2 -mx-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover/link:text-green-600 transition-colors">
                Other Categories
              </span>
              <div className="flex items-center text-gray-300 dark:text-gray-600 group-hover/link:text-green-600 transition-colors">
                <ChevronRight
                  size={18}
                  className="translate-x-0 group-hover/link:translate-x-1 transition-transform"
                />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeInSidebar;
