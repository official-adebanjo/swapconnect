import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@/types/trade-in";
import { motion, AnimatePresence } from "framer-motion";

interface RecentlyUploadedProductsProps {
  products: Product[];
  isLoading?: boolean;
}

const RecentlyUploadedProducts: React.FC<RecentlyUploadedProductsProps> = ({
  products,
  isLoading = false,
}) => {
  const itemsPerPage = 3;
  const [startIndex, setStartIndex] = React.useState(0);

  const visibleProducts = products
    ? products.slice(startIndex, startIndex + itemsPerPage)
    : [];

  const handleNext = () => {
    if (products && startIndex + itemsPerPage < products.length) {
      setStartIndex((prev) => prev + itemsPerPage);
    } else {
      setStartIndex(0);
    }
  };

  const handlePrev = () => {
    if (startIndex - itemsPerPage >= 0) {
      setStartIndex((prev) => prev - itemsPerPage);
    } else if (products) {
      setStartIndex(
        Math.floor((products.length - 1) / itemsPerPage) * itemsPerPage,
      );
    }
  };

  const canGoNext = products && products.length > itemsPerPage;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl shadow-sm p-4 border border-gray-100 dark:border-gray-800 flex flex-row items-center bg-white dark:bg-gray-900 w-full gap-4"
          >
            <div className="relative w-20 h-20 shrink-0">
              <Skeleton className="h-full w-full rounded-xl bg-gray-100 dark:bg-gray-800" />
            </div>
            <div className="grow space-y-2">
              <Skeleton className="h-4 w-3/4 bg-gray-100 dark:bg-gray-800" />
              <Skeleton className="h-3 w-1/2 bg-gray-100 dark:bg-gray-800" />
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-4 w-1/4 bg-gray-100 dark:bg-gray-800" />
                <Skeleton className="h-8 w-1/4 bg-gray-100 dark:bg-gray-800" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12 px-6 rounded-3xl border-2 border-dashed border-gray-100">
        <p className="text-gray-400 font-medium">
          No recently listed items found.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-4">
        <AnimatePresence mode="popLayout">
          {visibleProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group rounded-2xl p-4 border border-gray-100 flex flex-row items-center bg-white w-full gap-5 transition-all duration-300 hover:shadow-xl hover:border-green-100 active:scale-[0.98]"
            >
              <div className="relative w-20 h-20 shrink-0 bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden flex items-center justify-center p-2 group-hover:bg-green-50 dark:group-hover:bg-green-900/20 transition-colors">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  style={{ objectFit: "contain" }}
                  className="p-1 transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div className="grow flex flex-col justify-between min-w-0">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-green-600 transition-colors">
                      {product.name}
                    </h4>
                    <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                      {product.tag || "New"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                    {product.description}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[10px] font-bold text-gray-400">
                        ₦
                      </span>
                      <p className="text-sm font-black text-gray-900 dark:text-white">
                        {product.price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/product/${product.id}`}
                      className="bg-gray-900 dark:bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-green-600 dark:hover:bg-green-500 transition-all duration-300 flex items-center gap-1.5 shadow-lg shadow-gray-200 dark:shadow-none"
                    >
                      <Eye size={14} />
                      View
                    </Link>
                    {product.availability !== "out of stock" && (
                      <button
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-300"
                        title="Add to Cart"
                        aria-label="Add to Cart"
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {canGoNext && (
        <div className="flex items-center justify-between px-2 pt-2">
          <div className="flex gap-1.5">
            {Array.from({
              length: Math.ceil(products.length / itemsPerPage),
            }).map((_, idx) => (
              <motion.div
                key={idx}
                animate={{
                  scale:
                    Math.floor(startIndex / itemsPerPage) === idx ? 1.2 : 1,
                  width: Math.floor(startIndex / itemsPerPage) === idx ? 16 : 6,
                }}
                className={`h-1.5 rounded-full transition-colors duration-300 ${
                  Math.floor(startIndex / itemsPerPage) === idx
                    ? "bg-green-600"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              className="p-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-green-100 hover:text-green-600 transition-all text-gray-400 active:scale-95"
              aria-label="Previous items"
              type="button"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-green-100 hover:text-green-600 transition-all text-gray-400 active:scale-95"
              aria-label="Next items"
              type="button"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentlyUploadedProducts;
