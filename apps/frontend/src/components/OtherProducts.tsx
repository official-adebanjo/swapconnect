// components/OtherProducts.tsx
"use client";

import { useEffect } from "react";
import { ShoppingCart, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import useOtherProductsStore from "../stores/useOtherProductsStore"; // Corrected import path
import Spinner from "./ui/Spinner"; // Assuming you have a custom Spinner

const getStockColor = (availability?: string) =>
  availability && availability.toLowerCase().includes("in stock")
    ? "text-green-600"
    : "text-red-600";

const OtherProducts = () => {
  const {
    products,
    startIdx,
    productsPerPage,
    loading,
    fetchProducts,
    handlePrev,
    handleNext,
    addToCart,
  } = useOtherProductsStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const visibleProducts = products.slice(startIdx, startIdx + productsPerPage);

  // Wrap around if not enough products at the end
  const productsToShow =
    visibleProducts.length < productsPerPage && products.length > 0
      ? [
          ...visibleProducts,
          ...products.slice(0, productsPerPage - visibleProducts.length),
        ]
      : visibleProducts;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center my-8">
        <Spinner />
        <p className="mt-4 text-gray-700">Loading other products...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center my-8 text-gray-500">
        <p>No other products found.</p>
      </div>
    );
  }

  return (
    <div className="my-10 relative max-w-6xl mx-auto px-4">
      <h4 className="text-center mb-6 font-bold text-2xl">Other products</h4>

      {/* Carousel Controls */}
      <button
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-green-600 text-white rounded-full p-2 shadow hover:bg-green-700 transition disabled:opacity-50"
        style={{ transform: "translate(-50%, -50%)" }} // Still use translate for fine-tuning
        onClick={handlePrev}
        aria-label="Previous products"
        disabled={products.length <= productsPerPage} // Disable if not enough products to scroll
      >
        <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
          <path
            d="M13 15l-5-5 5-5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <button
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-green-600 text-white rounded-full p-2 shadow hover:bg-green-700 transition disabled:opacity-50"
        style={{ transform: "translate(50%, -50%)" }} // Still use translate for fine-tuning
        onClick={handleNext}
        aria-label="Next products"
        disabled={products.length <= productsPerPage} // Disable if not enough products to scroll
      >
        <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
          <path
            d="M7 5l5 5-5 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Products Row */}
      <div className="flex gap-4 overflow-hidden min-h-[320px] justify-center">
        {productsToShow.map(
          (
            product, // Removed `index` from key, use `product.id`
          ) => (
            <div
              key={product.id} // Use product.id for unique key
              className="flex-shrink-0 w-[200px] bg-white rounded-2xl shadow-md flex flex-col justify-between relative"
            >
              {/* Top badge */}
              {product.tag && (
                <span
                  className={`absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    product.tag === "Top sale"
                      ? "bg-red-600 text-white"
                      : "bg-yellow-400 text-black"
                  }`}
                >
                  {product.tag}
                </span>
              )}
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition"
                aria-label="Add to favorites"
              >
                <Heart size={18} />
              </button>
              <div className="flex justify-center items-center h-28 mt-6">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={100} // Explicit width
                  height={90} // Explicit height
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col px-4 py-2 flex-1">
                <div className="font-semibold text-sm mb-1 truncate">
                  {product.name}
                </div>
                <div className="mb-1 text-base font-bold text-green-700">
                  {product.price.toLocaleString("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  })}
                </div>
                <div
                  className={`mb-1 text-xs ${getStockColor(
                    product.availability,
                  )}`}
                >
                  {product.availability}
                </div>
                <div className="flex justify-between items-center mt-2">
                  <Link
                    href={`/product-category/${product.category || "general"}/${
                      product.id
                    }`} // Adjusted dynamic link structure
                    passHref
                  >
                    <button
                      className="px-3 py-1 border border-green-700 text-green-700 rounded-full text-xs font-semibold hover:bg-green-50 transition-colors duration-200"
                      type="button"
                    >
                      View more
                    </button>
                  </Link>
                  <button
                    className={`border border-green-600 text-green-600 rounded-full p-2 hover:bg-green-600 hover:text-white transition disabled:opacity-50`}
                    disabled={
                      !product.availability ||
                      !product.availability.toLowerCase().includes("in stock")
                    }
                    onClick={() =>
                      addToCart({
                        ...product,
                        // @ts-expect-error: quantity is used for cart items only
                        quantity: 1,
                      })
                    }
                    aria-label="Add to cart"
                  >
                    <ShoppingCart size={18} />
                  </button>
                </div>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
};

export default OtherProducts;
