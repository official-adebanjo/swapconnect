"use client";

import {
  Search,
  ChevronDown,
  Monitor,
  Smartphone,
  Laptop,
  Watch,
  // Headphones,
  Layers,
} from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { type Product } from "@/stores/useProductStoreNew";

const categories = [
  { name: "All Categories", icon: <Layers size={18} /> },
  { name: "iPhone", icon: <Smartphone size={18} /> },
  { name: "Android", icon: <Smartphone size={18} /> },
  { name: "MacBook", icon: <Laptop size={18} /> },
  { name: "Windows PC", icon: <Monitor size={18} /> },
  { name: "Electronics", icon: <Watch size={18} /> },
];

const CategorySearch = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: apiResponse } = useQuery({
    queryKey: ["products"],
    queryFn: () => api.get<Product[]>("/products"),
  });

  const products = useMemo(() => apiResponse?.data || [], [apiResponse]);

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setShowDropdown(false);
  };

  const handleSearch = () => {
    if (!searchTerm.trim() && selectedCategory === "All Categories") {
      setShowResults(false);
      return;
    }

    let filtered = products;
    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter((p) => p.Category?.name === selectedCategory);
    }
    if (searchTerm.trim()) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    setFilteredProducts(filtered);
    setShowResults(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto -mt-10 relative z-30 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[2rem] shadow-2xl shadow-green-900/10 p-2 border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center gap-2 backdrop-blur-xl bg-white/90 dark:bg-gray-900/90"
      >
        {/* Category Dropdown */}
        <div className="relative w-full md:w-auto" ref={dropdownRef}>
          <button
            className="w-full flex items-center justify-between px-6 py-4 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-2xl md:rounded-l-2xl md:rounded-r-none focus:outline-none hover:bg-gray-100 dark:hover:bg-gray-700 transition-all font-bold text-sm gap-3 group"
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <span className="flex items-center gap-2">
              {categories.find((c) => c.name === selectedCategory)?.icon}
              {selectedCategory}
            </span>
            <ChevronDown
              size={16}
              className={`transition-transform duration-300 ${showDropdown ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {showDropdown && (
              <motion.ul
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute left-0 right-0 top-full z-50 mt-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl py-2 overflow-hidden"
              >
                {categories.map((category) => (
                  <li key={category.name}>
                    <button
                      className={`w-full text-left px-5 py-3 hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center gap-3 transition-colors text-sm font-medium ${
                        selectedCategory === category.name
                          ? "bg-green-50 dark:bg-green-900/10 text-green-600 dark:text-green-400"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                      type="button"
                      onClick={() => handleCategorySelect(category.name)}
                    >
                      {category.icon}
                      {category.name}
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <input
            type="text"
            className="w-full px-6 py-4 bg-transparent outline-none text-sm font-medium placeholder-gray-400 dark:text-white"
            placeholder="Search for devices, accessories or brands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
        </div>

        {/* Search Button */}
        <button
          className="w-full md:w-auto flex items-center justify-center px-8 py-4 bg-green-600 text-white rounded-2xl md:rounded-r-2xl md:rounded-l-none hover:bg-green-500 active:scale-95 transition-all font-bold gap-2 shadow-lg shadow-green-600/20"
          type="button"
          onClick={handleSearch}
        >
          <Search size={18} />
          <span className="md:hidden lg:inline">Search</span>
        </button>
      </motion.div>

      {/* Instant Results Dropdown */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute left-4 right-4 mt-4 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-6 border border-gray-100 dark:border-gray-800 z-40 max-h-[400px] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-50 dark:border-gray-800">
              <h4 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-widest">
                Search Results
              </h4>
              <button
                onClick={() => setShowResults(false)}
                className="text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                Clear
              </button>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-gray-500 py-8 text-center flex flex-col items-center gap-3">
                <Search
                  size={40}
                  className="text-gray-200 dark:text-gray-800"
                />
                <p className="font-medium">
                  No results found for &quot;{searchTerm}&quot;
                </p>
              </div>
            ) : (
              <ul className="space-y-2">
                {filteredProducts.map((product) => (
                  <li key={product.id}>
                    <button className="w-full group flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-left">
                      <div>
                        <p className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-green-600 transition-colors uppercase text-xs tracking-tight">
                          {product.name}
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                          {product.Category?.name || "Uncategorized"}
                        </p>
                      </div>
                      <ChevronDown
                        size={14}
                        className="-rotate-90 text-gray-300 group-hover:text-green-600 transition-colors"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategorySearch;
