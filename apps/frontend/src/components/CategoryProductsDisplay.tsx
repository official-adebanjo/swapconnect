"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuthToken } from "@/hooks/useAuthToken";

interface Product {
  id: number;
  name: string;
  brand?: string;
  description?: string;
  price: number;
  imageUrl: string;
  views: number;
  isActive: boolean;
  swappable: boolean;
  installmentAvailable: boolean;
  stock: number;
  createdAt: string;
  Category?: {
    name: string;
  };
  Account?: {
    firstName: string;
    lastName: string;
    badge?: string;
    verified?: boolean;
  };
}

interface CategoryProductsDisplayProps {
  categoryName: string;
}

export default function CategoryProductsDisplay({
  categoryName,
}: CategoryProductsDisplayProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const token = useAuthToken();
  const limit = 12;

  useEffect(() => {
    fetchProducts();
  }, [categoryName, currentPage, searchTerm, sortBy, minPrice, maxPrice]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(minPrice && { minPrice }),
        ...(maxPrice && { maxPrice }),
      });

      const response = await api.get<{
        data: Product[];
        pagination: {
          total: number;
          pages: number;
          page: number;
        };
      }>(`/products/category/${categoryName}?${queryParams}`, token);

      if (response.success && response.data) {
        setProducts(response.data || []);
        setTotalPages(response.pagination?.pages || 1);
        setTotalProducts(response.pagination?.total || 0);
      } else {
        throw new Error(response.error || "Failed to fetch products");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err instanceof Error ? err.message : "Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  const handleFilterReset = () => {
    setSearchTerm("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("newest");
    setCurrentPage(1);
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-700"></div>
        <span className="ml-3 text-lg text-gray-600">Loading products...</span>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative inline-block mb-4">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
        <button
          onClick={fetchProducts}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Price
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Price
                </label>
                <input
                  type="number"
                  placeholder="1000000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleFilterReset}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          Showing {products.length} of {totalProducts} products
        </p>
        {loading && (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-green-600"></div>
            <span className="ml-2 text-sm text-gray-600">Loading...</span>
          </div>
        )}
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="group"
            >
              <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                {/* Product Image */}
                <div className="relative w-full h-48 bg-gray-100">
                  <Image
                    src={
                      product.imageUrl ||
                      "/placeholder.svg?height=192&width=256&query=product"
                    }
                    alt={product.name}
                    fill
                    style={{ objectFit: "contain" }}
                    className="p-4 group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg?height=192&width=256";
                    }}
                  />

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.swappable && (
                      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        Swappable
                      </span>
                    )}
                    {product.installmentAvailable && (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                        Installment
                      </span>
                    )}
                  </div>

                  {/* Stock Status */}
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  {/* Category */}
                  {product.Category && (
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      {product.Category.name}
                    </p>
                  )}

                  {/* Product Name */}
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-green-600 transition-colors">
                    {product.name}
                  </h3>

                  {/* Brand */}
                  {product.brand && (
                    <p className="text-sm text-gray-600 mb-2">
                      {product.brand}
                    </p>
                  )}

                  {/* Price */}
                  <p className="text-lg font-bold text-green-600 mb-2">
                    {formatPrice(product.price)}
                  </p>

                  {/* Seller Info */}
                  {product.Account && (
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>
                        {product.Account.firstName} {product.Account.lastName}
                      </span>
                      <div className="flex items-center gap-1">
                        {product.Account.verified && (
                          <span
                            className="text-blue-500"
                            title="Verified Seller"
                          >
                            ✓
                          </span>
                        )}
                        {product.Account.badge && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-1 rounded">
                            {product.Account.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Views */}
                  <p className="text-xs text-gray-400 mt-1">
                    {product.views} views
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-4m-12 0H4m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your search criteria or filters.
          </p>
          <button
            onClick={handleFilterReset}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum =
              Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-2 border rounded-lg transition-colors ${
                  currentPage === pageNum
                    ? "bg-green-600 text-white border-green-600"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
