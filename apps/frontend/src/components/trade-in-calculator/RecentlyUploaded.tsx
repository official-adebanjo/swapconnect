import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@/types/trade-in";

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
            className="rounded-lg shadow-md p-3 border border-gray-200 flex flex-row items-center bg-white w-full gap-4"
          >
            <div className="relative w-24 h-24 shrink-0">
              <Skeleton className="h-full w-full rounded-md bg-gray-200" />
            </div>
            <div className="grow space-y-2">
              <Skeleton className="h-4 w-3/4 bg-gray-200" />
              <Skeleton className="h-3 w-1/2 bg-gray-200" />
              <Skeleton className="h-3 w-1/3 bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No recently listed items found.</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {visibleProducts.map((product) => (
        <div
          key={product.id}
          className="rounded-lg shadow-md p-3 border border-gray-200 flex flex-row items-center bg-white w-full gap-4 transition-shadow hover:shadow-lg"
        >
          <div className="relative w-24 h-24 shrink-0">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              style={{ objectFit: "contain" }}
              className="rounded-md"
            />
          </div>
          <div className="grow flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-semibold text-gray-800 line-clamp-1">
                {product.name}
              </h4>
              <p className="text-xs text-gray-600 line-clamp-1">
                {product.description}
              </p>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-900">
                  ₦
                  {product.price.toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </p>
                <p
                  className={`text-xs font-medium ${
                    product.availability === "in stock"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {product.availability}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/product/${product.id}`}
                  className="bg-green-600 text-white text-xs px-3 py-1.5 rounded-md hover:bg-green-700 transition duration-200"
                >
                  View
                </Link>
                {product.availability === "out of stock" ? (
                  <ShoppingCart className="text-gray-400 opacity-50 h-4 w-4" />
                ) : (
                  <button
                    className="text-green-600 border border-green-600 p-1.5 rounded-md hover:text-green-700 hover:border-green-700 transition duration-200 flex items-center justify-center"
                    title="Add to Cart"
                    aria-label="Add to Cart"
                  >
                    <ShoppingCart className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {canGoNext && (
        <div className="flex justify-center items-center gap-4 pt-2">
          <button
            onClick={handlePrev}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors border border-gray-300 text-gray-600"
            aria-label="Previous items"
            type="button"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex gap-1.5">
            {Array.from({
              length: Math.ceil(products.length / itemsPerPage),
            }).map((_, idx) => (
              <div
                key={idx}
                className={`h-2 w-2 rounded-full transition-colors ${
                  Math.floor(startIndex / itemsPerPage) === idx
                    ? "bg-green-600"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors border border-gray-300 text-gray-600"
            aria-label="Next items"
            type="button"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentlyUploadedProducts;
