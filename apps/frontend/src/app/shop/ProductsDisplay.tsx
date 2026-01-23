"use client";

import { useEffect, useMemo, type ChangeEvent } from "react";
import ProductCard from "./ProductCard";
import { create } from "zustand";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  SlidersHorizontal,
  LayoutGrid,
  ArrowUpDown,
  SearchX,
} from "lucide-react";
import useCartStore from "@/stores/CartStore";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ProductSkeleton } from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

// Use the Product type from the product store to ensure compatibility
import type { Product } from "@/stores/useProductStoreNew";

interface ProductsDisplayUIState {
  currentPage: number;
  selectedSort: string;
  minPrice: number;
  maxPrice: number;
  showSortDropdown: boolean;
  setCurrentPage: (page: number) => void;
  setSelectedSort: (sort: string) => void;
  setMinPrice: (price: number) => void;
  setMaxPrice: (price: number) => void;
  setShowSortDropdown: (show: boolean) => void;
}

const useProductsDisplayUIStore = create<ProductsDisplayUIState>((set) => ({
  currentPage: 1,
  selectedSort: "Default Sorting",
  minPrice: 0,
  maxPrice: 1000000,
  showSortDropdown: false,
  setCurrentPage: (page) => set({ currentPage: page }),
  setSelectedSort: (sort) => set({ selectedSort: sort }),
  setMinPrice: (price) => set({ minPrice: price }),
  setMaxPrice: (price) => set({ maxPrice: price }),
  setShowSortDropdown: (show) => set({ showSortDropdown: show }),
}));

const sortOptions = [
  "Default Sorting",
  "Price: Low to High",
  "Price: High to Low",
  "Newest Arrivals",
];

const ProductsDisplay = () => {
  const { addToCart, carts } = useCartStore();

  const {
    currentPage,
    selectedSort,
    minPrice,
    maxPrice,
    showSortDropdown,
    setCurrentPage,
    setSelectedSort,
    setMinPrice,
    setMaxPrice,
    setShowSortDropdown,
  } = useProductsDisplayUIStore();

  const {
    data: apiResponse,
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["products"],
    queryFn: () => api.get<Product[]>("/products"),
  });

  const products = useMemo(() => apiResponse?.data || [], [apiResponse]);
  const error =
    queryError instanceof Error
      ? queryError.message
      : apiResponse?.error || null;

  useEffect(() => {
    setCurrentPage(1);
  }, [minPrice, maxPrice, selectedSort, setCurrentPage]);

  const processedProducts = useMemo(() => {
    const filtered = products.filter((product: Product) => {
      const numericPrice = Number(String(product.price).replace(/[^\d.]/g, ""));
      return numericPrice >= minPrice && numericPrice <= maxPrice;
    });

    if (selectedSort === "Price: Low to High") {
      filtered.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (selectedSort === "Price: High to Low") {
      filtered.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (selectedSort === "Newest Arrivals") {
      filtered.sort((a, b) => {
        return (
          new Date(String(b.createdAt)).getTime() -
          new Date(String(a.createdAt)).getTime()
        );
      });
    }

    return filtered;
  }, [products, minPrice, maxPrice, selectedSort]);

  const productsPerPage = 16;
  const totalFilteredProducts = processedProducts.length;
  const totalFilteredPages = Math.ceil(totalFilteredProducts / productsPerPage);

  const displayedProducts = processedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage,
  );

  const handleSortSelect = (option: string) => {
    setSelectedSort(option);
    setShowSortDropdown(false);
  };

  const handlePriceChange = (
    e: ChangeEvent<HTMLInputElement>,
    type: "min" | "max",
  ) => {
    const value = Number(e.target.value);
    if (type === "min") setMinPrice(value);
    else setMaxPrice(value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <Skeleton className="h-14 w-[200px] rounded-2xl" />
        </div>
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="w-full lg:w-80 hidden lg:block">
            <Skeleton className="h-[400px] w-full rounded-[3rem]" />
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-[3rem] shadow-xl border border-gray-100 dark:border-gray-800">
        <div className="inline-flex p-6 bg-red-50 dark:bg-red-900/10 rounded-full text-red-600 mb-6 font-bold uppercase tracking-widest text-xs gap-2 items-center">
          <SearchX size={20} />
          Error Loading Products
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto font-medium">
          {error}
        </p>
        <button
          onClick={() => refetch()}
          className="px-10 py-4 bg-gray-900 dark:bg-green-600 text-white rounded-2xl font-bold hover:bg-green-600 transition-all shadow-xl active:scale-95"
        >
          Try Refreshing
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Search Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 text-green-600">
            <LayoutGrid size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Devices
            </h2>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
              {totalFilteredProducts} models available
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-3 px-6 py-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-lg text-sm font-bold text-gray-700 dark:text-gray-200 hover:border-green-500 transition-all min-w-[200px] justify-between"
            >
              <div className="flex items-center gap-2">
                <ArrowUpDown size={16} className="text-green-600" />
                {selectedSort}
              </div>
              <ChevronLeft
                className={`transition-transform duration-300 -rotate-90 ${showSortDropdown ? "rotate-90" : ""}`}
                size={16}
              />
            </button>
            <AnimatePresence>
              {showSortDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-64 bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl z-50 border border-gray-100 dark:border-gray-800 py-3 overflow-hidden shadow-green-900/10"
                >
                  {sortOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleSortSelect(option)}
                      className={`block w-full text-left px-6 py-3 text-sm font-bold transition-colors ${
                        option === selectedSort
                          ? "text-green-600 bg-green-50 dark:bg-green-900/10"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar: Filters */}
        <div className="w-full lg:w-80 space-y-8">
          <div className="bg-white dark:bg-gray-900 rounded-[3rem] shadow-xl shadow-gray-200/50 dark:shadow-none p-8 border border-gray-100 dark:border-gray-800 sticky top-24">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-50 dark:border-gray-800">
              <SlidersHorizontal size={20} className="text-green-600" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Refine View
              </h3>
            </div>

            <div className="space-y-10">
              {/* Price Range */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <label className="text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                    Price Limit
                  </label>
                  <span className="text-xs font-black text-green-600 dark:text-green-500 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full border border-green-100 dark:border-green-900/30">
                    ₦{maxPrice.toLocaleString()}
                  </span>
                </div>

                <div className="px-1">
                  <input
                    type="range"
                    min={0}
                    max={1000000}
                    step={10000}
                    value={maxPrice}
                    onChange={(e) => handlePriceChange(e, "max")}
                    className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full appearance-none cursor-pointer accent-green-600"
                  />
                  <div className="flex justify-between mt-3 text-[10px] font-black text-gray-300 dark:text-gray-700 uppercase tracking-widest">
                    <span>₦0</span>
                    <span>₦1M+</span>
                  </div>
                </div>
              </div>

              {/* Tips Section */}
              <div className="p-6 bg-green-50 dark:bg-green-900/10 rounded-3xl border border-green-100 dark:border-green-900/20">
                <div className="flex items-center gap-2 mb-2 text-green-700 dark:text-green-400">
                  <Filter size={14} strokeWidth={3} />
                  <span className="text-xs font-black uppercase tracking-widest">
                    Shopping Tip
                  </span>
                </div>
                <p className="text-[11px] text-green-800 dark:text-green-300/80 leading-relaxed font-bold italic opacity-80">
                  Use &quot;Newest Arrivals&quot; to see fresh listings from
                  verified sellers first.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {totalFilteredProducts === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white dark:bg-gray-900 p-20 rounded-[3rem] text-center border border-gray-100 dark:border-gray-800 shadow-xl"
            >
              <div className="inline-flex p-6 bg-gray-50 dark:bg-gray-800 rounded-full text-gray-400 mb-6">
                <SearchX size={48} />
              </div>
              <h4 className="text-2xl font-black text-gray-900 dark:text-white transition-colors uppercase tracking-tight italic mb-2">
                No matches found
              </h4>
              <p className="text-gray-500 font-medium mb-8">
                Try adjusting your price filters or search terms.
              </p>
              <button
                onClick={() => {
                  setMinPrice(0);
                  setMaxPrice(1000000);
                }}
                className="text-green-600 font-black uppercase tracking-widest text-xs hover:underline decoration-2 underline-offset-8"
              >
                Reset all filters
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    ...product,
                    createdAt: String(product.createdAt),
                  }}
                  onAddToCart={addToCart}
                  isInCart={carts.some((item) => item.id === product.id)}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalFilteredPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-20">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-lg text-gray-600 dark:text-gray-400 hover:text-green-600 disabled:opacity-30 transition-all active:scale-90"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex gap-2">
                {Array.from({ length: totalFilteredPages }, (_, i) => i + 1)
                  .filter((page) => {
                    if (totalFilteredPages <= 7) return true;
                    return (
                      page === 1 ||
                      page === totalFilteredPages ||
                      Math.abs(page - currentPage) <= 1
                    );
                  })
                  .map((page, index, array) => (
                    <div key={page} className="flex gap-2">
                      {index > 0 && page - array[index - 1] > 1 && (
                        <span className="flex items-center text-gray-300">
                          ...
                        </span>
                      )}
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`w-12 h-12 rounded-2xl font-black transition-all active:scale-95 shadow-lg ${
                          page === currentPage
                            ? "bg-gray-900 dark:bg-green-600 text-white shadow-green-900/20"
                            : "bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-green-500"
                        }`}
                      >
                        {page}
                      </button>
                    </div>
                  ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalFilteredPages}
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-lg text-gray-600 dark:text-gray-400 hover:text-green-600 disabled:opacity-30 transition-all active:scale-90"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsDisplay;
