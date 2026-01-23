"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRightLeft,
  ShoppingCart,
  Heart,
  Star,
  ShieldCheck,
  CircleDollarSign,
  TrendingUp,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: string;
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
  createdAt: string;
  updatedAt: string;
  Category?: {
    name: string;
  };
  Account?: {
    firstName: string;
    lastName: string;
  };
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: unknown) => void;
  isInCart?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  isInCart,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const renderStars = (rating = 4) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={10}
        fill={i < rating ? "currentColor" : "none"}
        className={`${
          i < rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-700"
        }`}
      />
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none overflow-hidden border border-gray-100 dark:border-gray-800 transition-all duration-500 hover:shadow-2xl hover:shadow-green-900/10 flex flex-col h-full"
    >
      <Link
        href={`/product/${product.id}`}
        className="block relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-950 p-6 flex items-center justify-center"
      >
        {/* Badges */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          {product.swappable && (
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-1.5 bg-green-600/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full shadow-lg border border-white/20"
            >
              <ArrowRightLeft size={10} strokeWidth={3} />
              <span className="text-[10px] font-black uppercase tracking-wider">
                Swappable
              </span>
            </motion.div>
          )}
          {product.installmentAvailable && (
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-1.5 bg-blue-600/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full shadow-lg border border-white/20"
            >
              <CircleDollarSign size={10} strokeWidth={3} />
              <span className="text-[10px] font-black uppercase tracking-wider">
                Installments
              </span>
            </motion.div>
          )}
        </div>

        {/* View Count Badge */}
        <div className="absolute bottom-4 right-4 z-20">
          <div className="flex items-center gap-1.5 bg-white/80 dark:bg-black/40 backdrop-blur-md text-gray-600 dark:text-gray-400 px-3 py-1.5 rounded-full text-[10px] font-bold border border-gray-100 dark:border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Eye size={12} />
            {product.views || 0}
          </div>
        </div>

        {/* Image */}
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            width={300}
            height={300}
            src={
              product.imageUrl ||
              "/placeholder.svg?height=300&width=300&query=product"
            }
            alt={product.name}
            className={`object-contain transition-all duration-700 ease-out p-4 ${
              isHovered ? "scale-110 rotate-1" : "scale-100"
            }`}
          />
        </div>

        {/* Glassmorphism Quick Actions Overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/5 dark:bg-black/20 backdrop-blur-[2px] z-10 flex items-center justify-center gap-4"
            >
              <div className="flex gap-3">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onAddToCart?.(product);
                  }}
                  className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all active:scale-90 shadow-xl ${
                    isInCart
                      ? "bg-green-600 text-white"
                      : "bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-green-600 hover:text-white"
                  }`}
                  title="Quick Add"
                >
                  <ShoppingCart size={20} />
                </button>
                <button
                  onClick={(e) => e.preventDefault()}
                  className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-red-500 hover:text-white transition-all active:scale-90 shadow-xl"
                  title="Wishlist"
                >
                  <Heart size={20} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Link>

      <div className="p-6 flex flex-col flex-1">
        {/* Category & Rating */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={12} className="text-green-500" />
            <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              {product.Category?.name || "Premium Device"}
            </span>
          </div>
          <div className="flex gap-0.5">{renderStars(4)}</div>
        </div>

        {/* Title */}
        <Link href={`/product/${product.id}`} className="block mb-2 flex-1">
          <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight group-hover:text-green-600 transition-colors uppercase text-sm tracking-tight italic">
            {product.name}
          </h3>
          {product.brand && (
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {product.brand}
            </span>
          )}
        </Link>

        {/* Divider */}
        <div className="h-px w-full bg-gray-50 dark:bg-gray-800 mb-4" />

        {/* Footer: Price & Seller */}
        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">
              Price Offer
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                {formatPrice(product.price)}
              </span>
              <TrendingUp size={14} className="text-green-500" />
            </div>
          </div>

          {product.Account && (
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">
                Seller
              </span>
              <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">
                {product.Account.firstName}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

import { Skeleton } from "@/components/ui/skeleton";

export const ProductSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col h-[480px]">
      <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-950 p-6 flex items-center justify-center">
        <Skeleton className="h-4/5 w-4/5 rounded-2xl" />
      </div>
      <div className="p-6 flex flex-col flex-1 gap-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24 rounded-full" />
          <Skeleton className="h-4 w-12 rounded-full" />
        </div>
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-full rounded-lg" />
          <Skeleton className="h-4 w-2/3 rounded-lg" />
        </div>
        <div className="h-px w-full bg-gray-50 dark:bg-gray-800" />
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-8 w-28" />
          </div>
          <div className="flex flex-col items-end gap-2">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
