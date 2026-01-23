import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthToken } from "@/hooks/useAuthToken";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

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

const ProductSkeleton = () => (
  <div className="bg-card rounded-2xl border border-border overflow-hidden p-4 space-y-4">
    <Skeleton className="h-48 w-full rounded-xl" />
    <div className="space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-5 w-1/2" />
      <div className="pt-4 border-t border-border flex justify-between items-center">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-10" />
      </div>
    </div>
  </div>
);

export default function CategoryProductsDisplay({
  categoryName,
}: CategoryProductsDisplayProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearchTerm, setAppliedSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const token = useAuthToken();
  const limit = 12;

  const { data, isLoading, error, isRefetching, refetch } = useQuery<{
    products: Product[];
    pagination: { total: number; pages: number; page: number };
  }>({
    queryKey: [
      "category-products",
      categoryName,
      currentPage,
      appliedSearchTerm,
      minPrice,
      maxPrice,
    ],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        ...(appliedSearchTerm && { search: appliedSearchTerm }),
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

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch products");
      }

      return {
        products: response.data.data || [],
        pagination: response.data.pagination || {
          total: 0,
          pages: 1,
          page: 1,
        },
      };
    },
    staleTime: 2 * 60 * 1000,
  });

  const products = data?.products || [];
  const pagination = data?.pagination || { total: 0, pages: 1, page: 1 };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  const handleFilterReset = () => {
    setSearchTerm("");
    setAppliedSearchTerm("");
    setMinPrice("");
    setMaxPrice("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <div className="bg-card rounded-3xl border border-border shadow-sm p-6 md:p-8">
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted h-5 w-5" />
              <input
                type="text"
                placeholder="Search premium products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-page-bg border-none rounded-2xl focus:ring-2 focus:ring-brand-primary placeholder:text-text-muted text-foreground transition-all"
              />
            </div>
            <div className="flex gap-3">
              <Button
                type="submit"
                className="px-8 rounded-2xl bg-brand-primary hover:bg-brand-primary/90 text-white font-bold h-14"
              >
                Search
              </Button>
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "px-6 rounded-2xl border-border h-14 font-semibold group",
                  showFilters &&
                    "bg-brand-primary/5 border-brand-primary text-brand-primary",
                )}
              >
                <Filter
                  className={cn(
                    "mr-2 h-5 w-5 transition-transform",
                    showFilters && "rotate-180",
                  )}
                />
                Filters
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-border/50 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-secondary">
                  Min Price (₦)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-4 py-3 bg-page-bg border-none rounded-xl focus:ring-2 focus:ring-brand-primary text-foreground"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-secondary">
                  Max Price (₦)
                </label>
                <input
                  type="number"
                  placeholder="No Limit"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-4 py-3 bg-page-bg border-none rounded-xl focus:ring-2 focus:ring-brand-primary text-foreground"
                />
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleFilterReset}
                  className="w-full h-12 text-text-muted hover:text-destructive hover:bg-destructive/5 rounded-xl transition-colors"
                >
                  <RefreshCw className="mr-2 h-4 w-4" /> Reset Filters
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Results Summary */}
      <div className="flex justify-between items-center px-2">
        <div>
          <h2 className="text-2xl font-black text-foreground capitalize">
            {categoryName}
          </h2>
          <p className="text-text-secondary text-sm font-medium mt-1">
            Found {pagination.total} premium products
          </p>
        </div>
        {(isRefetching || isLoading) && (
          <div className="flex items-center gap-3 bg-brand-primary/10 text-brand-primary px-4 py-2 rounded-full border border-brand-primary/20">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Syncing...
            </span>
          </div>
        )}
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(limit)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-20 bg-destructive/5 rounded-3xl border border-dashed border-destructive/20">
          <div className="bg-destructive/10 text-destructive p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            Failed to load products
          </h3>
          <p className="text-text-secondary mb-8 max-w-sm mx-auto">
            {(error as Error).message}
          </p>
          <Button
            onClick={() => refetch()}
            className="rounded-full px-10 bg-brand-primary hover:bg-brand-primary/90 text-white font-bold"
          >
            Try Again
          </Button>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="group h-full"
            >
              <div className="bg-card rounded-2xl border border-border shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full relative">
                {/* Product Image */}
                <div className="relative w-full h-52 bg-white flex items-center justify-center p-4 overflow-hidden">
                  <Image
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    style={{ objectFit: "contain" }}
                    className="p-6 group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Badges */}
                  <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5 pointer-events-none">
                    {product.swappable && (
                      <Badge
                        variant="success"
                        className="bg-brand-primary/90 backdrop-blur-sm text-[10px] px-2 py-0"
                      >
                        Swappable
                      </Badge>
                    )}
                    {product.installmentAvailable && (
                      <Badge
                        variant="secondary"
                        className="bg-secondary/90 backdrop-blur-sm text-[10px] px-2 py-0"
                      >
                        Installment
                      </Badge>
                    )}
                  </div>

                  {/* Stock Status */}
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] flex items-center justify-center">
                      <Badge
                        variant="destructive"
                        className="px-4 py-1 text-sm font-bold"
                      >
                        Out of Stock
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-5 flex flex-col flex-1 gap-2">
                  <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-text-muted">
                    <span>{product.Category?.name || categoryName}</span>
                    <span>{product.brand}</span>
                  </div>

                  <h3 className="font-bold text-foreground text-sm line-clamp-2 leading-snug group-hover:text-brand-primary transition-colors">
                    {product.name}
                  </h3>

                  <div className="mt-auto pt-3">
                    <p className="text-xl font-black text-brand-primary">
                      {formatPrice(product.price)}
                    </p>

                    {product.Account && (
                      <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-text-secondary truncate max-w-[100px]">
                            {product.Account.firstName}
                          </span>
                          {product.Account.verified && (
                            <div
                              className="bg-blue-500/10 text-blue-500 rounded-full p-0.5"
                              title="Verified Seller"
                            >
                              <svg
                                className="w-2.5 h-2.5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-text-muted font-medium">
                          <RefreshCw className="h-3 w-3" />
                          {product.views}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-card rounded-3xl border border-dashed border-border">
          <div className="p-6 bg-muted w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center">
            <ShoppingBag className="text-text-muted h-10 w-10" />
          </div>
          <h3 className="text-2xl font-black text-foreground mb-2">
            No products found
          </h3>
          <p className="text-text-secondary max-w-xs mx-auto mb-8">
            We couldn't find any products matching your current filters. Try
            broadening your search!
          </p>
          <Button
            onClick={handleFilterReset}
            variant="outline-secondary"
            className="rounded-full px-8 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
          >
            Clear All Filters
          </Button>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-12 pb-8">
          <Button
            variant="primary"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="rounded-xl h-12 w-12 p-0 border border-border bg-card shadow-sm hover:bg-page-bg disabled:opacity-30"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <div className="flex gap-2">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1)
              .filter(
                (pageNum) =>
                  pageNum === 1 ||
                  pageNum === pagination.pages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1),
              )
              .map((pageNum, idx, array) => (
                <React.Fragment key={pageNum}>
                  {idx > 0 && array[idx - 1] !== pageNum - 1 && (
                    <span className="flex items-center text-text-muted px-2">
                      ...
                    </span>
                  )}
                  <Button
                    onClick={() => setCurrentPage(pageNum)}
                    className={cn(
                      "rounded-xl h-12 w-12 p-0 font-bold transition-all",
                      currentPage === pageNum
                        ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20 scale-110"
                        : "bg-card text-foreground border border-border hover:bg-page-bg",
                    )}
                  >
                    {pageNum}
                  </Button>
                </React.Fragment>
              ))}
          </div>

          <Button
            variant="primary"
            onClick={() =>
              setCurrentPage(Math.min(pagination.pages, currentPage + 1))
            }
            disabled={currentPage === pagination.pages}
            className="rounded-xl h-12 w-12 p-0 border border-border bg-card shadow-sm hover:bg-page-bg disabled:opacity-30"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      )}
    </div>
  );
}
