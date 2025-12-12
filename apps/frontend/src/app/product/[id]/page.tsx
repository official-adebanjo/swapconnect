"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { api } from "@/lib/api";
import { useAuthToken } from "@/hooks/useAuthToken";
import useCartStore from "@/stores/CartStore";
import SwapOfferDialog from "@/components/SwapOfferDialog";

interface Product {
  id: number;
  name: string;
  brand?: string;
  description?: string;
  price: number;
  imageUrl: string;
  otherImages?: string[];
  views: number;
  isActive: boolean;
  swappable: boolean;
  installmentAvailable: boolean;
  installmentPlans?: {
    plans: Array<{
      name: string;
      numberOfPayments: number;
      paymentInterval: string;
      intervalCount: number;
      interestRate?: number;
      downPayment?: number;
      totalAmount: number;
    }>;
  };
  stock: number;
  createdAt: string;
  updatedAt: string;
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

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const token = useAuthToken();

  const { addToCart, carts } = useCartStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [showSwapDialog, setShowSwapDialog] = useState(false);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId, token]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!token) {
        return;
      }
      const response = await api.get<Product>(`/products/${productId}`, token);

      if (response.success && response.data) {
        setProduct(response.data);
        setSelectedImage(response.data.imageUrl);
      } else {
        throw new Error(response.error || "Product not found");
      }
    } catch (err) {
      console.error("Error fetching product:", err);
      setError(err instanceof Error ? err.message : "Failed to load product");
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
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-700"></div>
        <span className="ml-3 text-lg text-gray-600">Loading product...</span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative inline-block mb-4">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">
              {error || "Product not found"}
            </span>
          </div>
          <button
            onClick={fetchProduct}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const allImages = [product.imageUrl, ...(product.otherImages || [])].filter(
    Boolean
  );

  const handleAddToCart = () => {
    if (!product) return;

    const productForCart = {
      id: product.id.toString(),
      name: product.name,
      price: product.price,
    };

    addToCart(productForCart);
  };

  const isInCart = product
    ? carts.some((item) => item.id === product.id.toString())
    : false;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={
                    selectedImage ||
                    "/placeholder.svg?height=384&width=512&query=product" ||
                    "/placeholder.svg" ||
                    "/placeholder.svg" ||
                    "/placeholder.svg"
                  }
                  alt={product.name}
                  fill
                  style={{ objectFit: "contain" }}
                  className="p-4"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg?height=384&width=512";
                  }}
                />
              </div>

              {/* Thumbnail Images */}
              {allImages.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {allImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(image)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === image
                          ? "border-green-500"
                          : "border-gray-200"
                      }`}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${product.name} ${index + 1}`}
                        width={80}
                        height={80}
                        style={{ objectFit: "contain" }}
                        className="w-full h-full p-1"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Category */}
              {product.Category && (
                <p className="text-sm text-gray-500 uppercase tracking-wide">
                  {product.Category.name}
                </p>
              )}

              {/* Product Name */}
              <h1 className="text-3xl font-bold text-gray-900">
                {product.name}
              </h1>

              {/* Brand */}
              {product.brand && (
                <p className="text-lg text-gray-600">
                  Brand: <span className="font-semibold">{product.brand}</span>
                </p>
              )}

              {/* Price */}
              <div className="text-3xl font-bold text-green-600">
                {formatPrice(product.price)}
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {product.swappable && (
                  <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                    Swappable
                  </span>
                )}
                {product.installmentAvailable && (
                  <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                    Installment Available
                  </span>
                )}
                {product.stock > 0 ? (
                  <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                    In Stock ({product.stock})
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Installment Plans */}
              {product.installmentAvailable && product.installmentPlans && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Installment Plans
                  </h3>
                  <div className="space-y-2">
                    {product.installmentPlans &&
                      product.installmentPlans.plans.map((plan, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <h4 className="font-medium">{plan.name}</h4>
                          <p className="text-sm text-gray-600">
                            {plan.numberOfPayments} payments of{" "}
                            {formatPrice(
                              plan.totalAmount / plan.numberOfPayments
                            )}
                            {" every "}
                            {plan.intervalCount} {plan.paymentInterval}(s)
                          </p>
                          {plan.downPayment && (
                            <p className="text-sm text-gray-600">
                              Down payment: {plan.downPayment}%
                            </p>
                          )}
                          {plan.interestRate && (
                            <p className="text-sm text-gray-600">
                              Interest rate: {plan.interestRate}%
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Seller Info */}
              {product.Account && (
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-2">Seller</h3>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-700">
                      {product.Account.firstName} {product.Account.lastName}
                    </p>
                    {product.Account.verified && (
                      <span className="text-blue-500" title="Verified Seller">
                        ✓
                      </span>
                    )}
                    {product.Account.badge && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                        {product.Account.badge}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="border-t pt-4 text-sm text-gray-500">
                <p>{product.views} views</p>
                <p>
                  Listed on {new Date(product.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  disabled={product.stock === 0}
                  onClick={handleAddToCart}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                    isInCart
                      ? "bg-green-100 text-green-800 border border-green-300"
                      : "bg-green-600 text-white hover:bg-green-700"
                  } disabled:bg-gray-400 disabled:cursor-not-allowed`}
                >
                  {product.stock === 0
                    ? "Out of Stock"
                    : isInCart
                    ? "Added to Cart ✓"
                    : "Add to Cart"}
                </button>

                {product.swappable && (
                  <button
                    onClick={() => setShowSwapDialog(true)}
                    className="w-full border border-green-600 text-green-600 py-3 px-6 rounded-lg font-semibold hover:bg-green-50 transition-colors"
                  >
                    Make Swap Offer
                  </button>
                )}

                <button className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                  Contact Seller
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Swap Offer Dialog */}
      {product && (
        <SwapOfferDialog
          isOpen={showSwapDialog}
          onClose={() => setShowSwapDialog(false)}
          targetProductId={product.id.toString()}
          targetProductName={product.name}
        />
      )}
    </div>
  );
}
