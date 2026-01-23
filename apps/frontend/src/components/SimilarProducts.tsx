"use client";

import React, { useEffect } from "react";
import Image from "next/image";
// import Link from "next/link";
import { ChevronUp, ChevronDown } from "lucide-react";
import useSimilarProductsStore from "../stores/useSimilarProductStore";
import Spinner from "./ui/Spinner";

const SimilarProducts: React.FC = () => {
  const {
    products,
    loading,
    startIndex,
    productsPerPage,
    fetchProducts,
    showPrev,
    showNext,
    showPrev: goPrev,
    showNext: goNext,
  } = useSimilarProductsStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const visibleProducts = products.slice(
    startIndex,
    startIndex + productsPerPage,
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center my-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg shadow-md p-4">
      <h4 className="font-bold text-lg mb-4 text-center">Similar Products</h4>
      <div className="flex flex-col items-center">
        <button
          className="mb-2 text-gray-500 hover:text-green-600 disabled:opacity-30"
          onClick={goPrev}
          disabled={!showPrev}
          aria-label="Scroll up"
        >
          <ChevronUp size={24} />
        </button>
        <div className="flex flex-col gap-4 ">
          {visibleProducts.map((product) => (
            <div
              key={product.id}
              className="border rounded-md p-3 flex flex-col items-center bg-white"
            >
              <Image
                src={product.image}
                alt={product.name}
                width={96}
                height={96}
                className="w-24 h-24 object-contain mb-2"
              />
              <div className="font-semibold text-center">{product.name}</div>
              <div className="text-green-700 font-bold text-sm">
                {product.price?.toLocaleString()} NGN
              </div>
            </div>
          ))}
        </div>
        <button
          className="mt-2 text-gray-500 hover:text-green-600 disabled:opacity-30"
          onClick={goNext}
          disabled={!showNext}
          aria-label="Scroll down"
        >
          <ChevronDown size={24} />
        </button>
      </div>
    </div>
  );
};

export default SimilarProducts;
