"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import useProductDetailStore from "../stores/useProductDetailStore";
import useCartStore from "../stores/CartStore";
import ReviewForm from "./ReviewForm";
import SimilarProducts from "./SimilarProducts";
import OtherProducts from "./OtherProducts";
import Spinner from "./ui/Spinner";
import Button from "./ui/Button";
import { ShoppingCart, CheckCircle2 } from "lucide-react";

export interface ProductSpec {
  label: string;
  details: string;
}

export interface FetchedProductDetail {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  specs: ProductSpec[];
  features?: Record<string, string>;
  // ...other properties
}

interface ProductDetailViewProps {
  productId: string;
}

const ProductDetailView: React.FC<ProductDetailViewProps> = ({ productId }) => {
  const {
    product,
    activeImage,
    selectedSpecIndex,
    showFeatures,
    selectedPlan,
    loading,
    error,
    durations,
    fetchProduct,
    setActiveImage,
    setSelectedSpecIndex,
    toggleFeatures,
    setSelectedPlan,
  } = useProductDetailStore((state) => ({
    product: state.product,
    activeImage: state.activeImage,
    selectedSpecIndex: state.selectedSpecIndex,
    showFeatures: state.showFeatures,
    selectedPlan: state.selectedPlan,
    loading: state.loading,
    error: state.error,
    durations: state.durations,
    fetchProduct: state.fetchProduct,
    setActiveImage: state.setActiveImage,
    setSelectedSpecIndex: state.setSelectedSpecIndex,
    toggleFeatures: state.toggleFeatures,
    setSelectedPlan: state.setSelectedPlan,
  }));

  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    // Only fetch if productId is available
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId, fetchProduct]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
        <p className="ml-3 text-gray-700">Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  if (!product) {
    // This case should ideally be caught by `error` or `notFound` in the page.tsx
    return (
      <div className="flex justify-center items-center h-64 text-red-600">
        <p>Product data could not be loaded.</p>
      </div>
    );
  }

  // Example product data for cart (customize as needed)
  // Ensure product.specs and product.images are available and not empty
  const productForCart = {
    id: product.id,
    name: product.name,
    image: activeImage || product.image, // Fallback image
    price: product.price,
    quantity: 1,
    spec:
      Array.isArray(product.specs) &&
      product.specs[selectedSpecIndex] &&
      typeof product.specs[selectedSpecIndex].label === "string"
        ? product.specs[selectedSpecIndex].label
        : "N/A", // Fallback spec
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left - Images */}
        <div className="w-full lg:w-1/2 flex flex-col items-center">
          <div className="mb-4 bg-gray-100 rounded-xl p-4 inline-block w-full max-w-lg">
            <Image
              src={activeImage || product.image || "/placeholder.png"} // Fallback image
              alt={product.name}
              width={500} // Set appropriate width
              height={400} // Set appropriate height
              priority // For LCP
              className="w-full h-[400px] object-contain"
            />
          </div>
          <div className="flex justify-center gap-3 flex-wrap">
            <div
              className={`w-20 h-16 p-1 border rounded-md cursor-pointer overflow-hidden ${
                activeImage === product.image
                  ? "border-green-500 shadow-md"
                  : "border-gray-300"
              }`}
              onClick={() => setActiveImage(product.image)}
            >
              <Image
                src={product.image}
                alt={product.name}
                width={80}
                height={60}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Right - Details */}
        <div className="w-full lg:w-1/2">
          <h3 className="font-bold text-3xl mb-3">{product.name}</h3>
          <p className="text-gray-600 mb-4">{product.description}</p>

          <div className="grid gap-3">
            {product.specs?.map((spec: ProductSpec, index: number) => (
              <div
                key={index}
                className={`p-4 border rounded-md cursor-pointer min-w-0 max-w-full w-full ${
                  selectedSpecIndex === index
                    ? "border-green-500 shadow-sm"
                    : "border-gray-200 text-gray-500 hover:border-gray-400"
                }`}
                onClick={() => setSelectedSpecIndex(index)}
              >
                <div className="font-bold text-base">{spec.label}</div>
                <div className="whitespace-pre-line text-sm leading-tight">
                  {spec.details}
                </div>
              </div>
            ))}
          </div>

          <h5 className="text-xl font-semibold mb-2 mt-4">
            Price:{" "}
            <span className="font-bold">
              {product.price.toLocaleString("en-NG", {
                style: "currency",
                currency: "NGN",
              })}
            </span>
          </h5>

          <p className="text-gray-600 flex items-center mb-4">
            🚚 Delivery{" "}
            <span className="text-green-600 ml-2">5 working days</span>
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {durations.map((num) => (
              <Button
                key={num}
                variant={selectedPlan === num ? "success" : "outline-secondary"}
                onClick={() => setSelectedPlan(num)}
              >
                {num} months
              </Button>
            ))}
          </div>

          <div className="mb-4">
            <Button
              variant="outline-success"
              className="w-full sm:w-1/2 lg:w-auto"
              onClick={() => addToCart(productForCart)}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </div>

          <div className="flex items-center gap-2 mb-4 text-green-600">
            <CheckCircle2 className="h-5 w-5" />
            <span>Swap Enabled Device</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mb-6">
            <Link href="/swap" passHref>
              <Button variant="success" className="w-full sm:w-auto">
                Swap
              </Button>
            </Link>
            <Link href="/installments" passHref>
              <Button variant="outline-success" className="w-full sm:w-auto">
                Pay installments
              </Button>
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h4 className="font-bold text-xl text-center mb-4">Features</h4>
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                showFeatures ? "max-h-screen" : "max-h-0"
              }`}
            >
              <table className="min-w-full text-sm text-gray-700">
                <tbody>
                  {product.features &&
                    Object.entries(product.features).map(([key, value]) => (
                      <tr
                        key={key}
                        className="border-b border-gray-100 last:border-b-0"
                      >
                        <td className="py-2 px-4 font-semibold">{key}</td>
                        <td className="py-2 px-4">{String(value)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="text-center mt-4">
              <button
                type="button"
                className="text-blue-600 hover:underline focus:outline-none"
                onClick={toggleFeatures}
              >
                {showFeatures ? "Show less ▲" : "Show more ▼"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <ReviewForm productTitle={product.name} />
      </div>

      {/* Similar Products & Other Products might need their own data fetching or props */}
      <div className="mt-12">
        <SimilarProducts />
      </div>

      <div className="mt-12">
        <OtherProducts />
      </div>
    </div>
  );
};

export default ProductDetailView;
