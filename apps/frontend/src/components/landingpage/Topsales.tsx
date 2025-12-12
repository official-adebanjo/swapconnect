"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuthToken } from "@/hooks/useAuthToken";

interface Product {
  id: number;
  name: string;
  brand?: string;
  price: number;
  imageUrl: string;
  views: number;
  swappable: boolean;
  installmentAvailable: boolean;
  stock: number;
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

export default function Topsales() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = useAuthToken();

  useEffect(() => {
    fetchTopProducts();
  }, [token]);

  const fetchTopProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get<Product[]>("/products/top?limit=8", token);

      if (response.success && response.data) {
        setProducts(response.data);
      } else {
        throw new Error(response.error || "Failed to fetch top products");
      }
    } catch (err) {
      console.error("Error fetching top products:", err);
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

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Top Sales
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Discover our most popular products
            </p>
          </div>

          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-700"></div>
            <span className="ml-3 text-lg text-gray-600">
              Loading top products...
            </span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Top Sales
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Discover our most popular products
            </p>
          </div>

          <div className="text-center py-12">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative inline-block mb-4">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline ml-2">{error}</span>
            </div>
            <button
              onClick={fetchTopProducts}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Top Sales
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Discover our most popular products
          </p>
        </div>

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
              No products available
            </h3>
            <p className="text-gray-500">Check back later for new products.</p>
          </div>
        )}

        {/* View All Products Link */}
        {products.length > 0 && (
          <div className="text-center mt-12">
            <Link
              href="/shop"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
            >
              View All Products
              <svg
                className="ml-2 -mr-1 w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
