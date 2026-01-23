"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import useProductStore from "../stores/useProductStore";
import useCartStore from "../stores/CartStore";
import ReviewForm from "./ReviewForm";
import SimilarProducts from "./SimilarProducts";
import OtherProducts from "./OtherProducts";
import Spinner from "./ui/Spinner";
import Button from "./ui/Button";
import Image from "next/image";
import { ShoppingCart, CheckCircle2 } from "lucide-react";

interface ProductShowcaseProps {
  categoryName: string;
  productId?: string;
}

const ProductShowcase: React.FC<ProductShowcaseProps> = ({
  categoryName,
  productId,
}) => {
  const product = useProductStore((state) => state.product);
  const activeImage = useProductStore((state) => state.activeImage);
  const selectedSpecIndex = useProductStore((state) => state.selectedSpecIndex);
  const showFeatures = useProductStore((state) => state.showFeatures);
  const selectedPlan = useProductStore((state) => state.selectedPlan);
  const loading = useProductStore((state) => state.loading);
  const durations = useProductStore((state) => state.durations);

  const fetchProductData = useProductStore((state) => state.fetchProductData);
  const setActiveImage = useProductStore((state) => state.setActiveImage);
  const setSelectedSpecIndex = useProductStore(
    (state) => state.setSelectedSpecIndex,
  );
  const toggleFeatures = useProductStore((state) => state.toggleFeatures);
  const setSelectedPlan = useProductStore((state) => state.setSelectedPlan);

  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    fetchProductData(categoryName, productId);
  }, [categoryName, productId, fetchProductData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
        <p className="ml-3 text-gray-700">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-64 text-red-600">
        <p>Product not found or an error occurred.</p>
      </div>
    );
  }

  const productForCart = {
    id: product.id,
    name: product.name,
    image: activeImage,
    price: product.price,
    quantity: 1,
    spec: product.specs[selectedSpecIndex]?.label,
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* LEFT: Product Details */}
        <div className="w-full lg:w-2/3 flex flex-col items-center">
          <div className="mb-4 bg-gray-100 rounded-xl p-4 inline-block w-full max-w-lg">
            <Image
              src={activeImage}
              alt={product.name}
              width={600}
              height={400}
              className="w-full h-[400px] object-contain"
              priority
            />
          </div>

          <div className="flex justify-center gap-3 flex-wrap">
            {product.images.map((img, idx) => (
              <div
                key={idx}
                className={`w-20 h-16 p-1 border rounded-md cursor-pointer overflow-hidden
                  ${
                    activeImage === img.src
                      ? "border-green-500 shadow-md"
                      : "border-gray-300"
                  }`}
                onClick={() => setActiveImage(img.src)}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={80}
                  height={60}
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
          </div>

          <div className="w-full mt-8">
            <h5 className="text-xl font-semibold mb-2">
              Price:{" "}
              <span className="font-bold">
                {product.price.toLocaleString()} NGN
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
                  variant={
                    selectedPlan === num ? "success" : "outline-secondary"
                  }
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
                className={`overflow-hidden transition-max-height duration-500 ease-in-out ${
                  showFeatures ? "max-h-96" : "max-h-0"
                }`}
                style={{ maxHeight: showFeatures ? "500px" : "0" }}
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
                          <td className="py-2 px-4">{value}</td>
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

        {/* RIGHT: Similar Products */}
        <div className="w-full lg:w-1/3">
          <h3 className="font-bold text-3xl mb-3">{product.name}</h3>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {product.specs.map((spec, index) => (
              <div
                key={index}
                className={`p-4 border rounded-md cursor-pointer
        ${
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
          <SimilarProducts />
        </div>
      </div>

      <div className="mt-12">
        <ReviewForm productTitle={product.name} />
      </div>

      <div className="mt-12">
        <OtherProducts />
      </div>
    </div>
  );
};

export default ProductShowcase;
