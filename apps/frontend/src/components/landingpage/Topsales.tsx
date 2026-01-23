import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { useAuthToken } from "@/hooks/useAuthToken";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  Eye,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  ShoppingBag,
} from "lucide-react";

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

const ProductSkeleton = () => (
  <div className="bg-card rounded-xl border border-border overflow-hidden p-3 space-y-3">
    <Skeleton className="h-48 w-full rounded-lg" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-5 w-1/3" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  </div>
);

export default function Topsales() {
  const token = useAuthToken();

  const {
    data: products = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["top-products", token],
    queryFn: async () => {
      const response = await api.get<Product[]>("/products/top?limit=8", token);
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch top products");
      }
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const sectionHeader = (
    <div className="text-center mb-12 relative">
      <motion.h2
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="text-3xl font-extrabold text-foreground sm:text-4xl tracking-tight"
      >
        Top Sales
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="mt-4 text-xl text-text-secondary"
      >
        Discover our most popular products
      </motion.p>

      {isRefetching && (
        <div className="absolute -top-4 right-0">
          <RefreshCw className="w-5 h-5 text-brand-primary animate-spin" />
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <section className="py-16 bg-page-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {sectionHeader}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-page-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {sectionHeader}
          <div className="text-center py-12 flex flex-col items-center">
            <div className="bg-destructive/10 border border-destructive/20 text-destructive p-8 rounded-2xl max-w-md">
              <AlertCircle className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">Something went wrong</h3>
              <p className="mb-6 opacity-90">{(error as Error).message}</p>
              <Button
                variant="destructive"
                onClick={() => refetch()}
                className="rounded-full px-8"
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Try Again
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={cn("py-16 bg-page-bg border-t border-border")}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {sectionHeader}

        {products.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {products.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <Link
                  href={`/product/${product.id}`}
                  className="group block h-full"
                >
                  <div className="bg-card rounded-2xl border border-border shadow-sm group-hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full relative">
                    {/* Product Image */}
                    <div className="relative w-full h-52 bg-white flex items-center justify-center p-4 overflow-hidden">
                      <Image
                        src={product.imageUrl || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        style={{ objectFit: "contain" }}
                        className="p-6 transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Quick Badges - Bottom Left */}
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

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-white/90 backdrop-blur-sm text-foreground p-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform">
                          <Eye size={20} />
                        </div>
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
                      {/* Category & Brand */}
                      <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-text-muted">
                        <span>{product.Category?.name || "Tech"}</span>
                        <span>{product.brand}</span>
                      </div>

                      {/* Product Name */}
                      <h3 className="font-bold text-foreground text-sm line-clamp-2 leading-snug group-hover:text-brand-primary transition-colors">
                        {product.name}
                      </h3>

                      <div className="mt-auto pt-3">
                        {/* Price */}
                        <p className="text-xl font-black text-brand-primary">
                          {formatPrice(product.price)}
                        </p>

                        {/* Seller Info */}
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
                            <div className="flex items-center gap-1.5 text-xs text-text-muted">
                              <Eye size={12} />
                              {product.views}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border">
            <div className="p-4 bg-muted w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <ShoppingBag className="text-text-muted h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              {" "}
              No products available{" "}
            </h3>
            <p className="text-text-secondary max-w-xs mx-auto">
              Check back later for our new collection of premium devices.
            </p>
          </div>
        )}

        {/* View All Products Link */}
        {products.length > 0 && (
          <div className="text-center mt-12">
            <Link href="/shop">
              <Button
                variant="outline-secondary"
                className="rounded-full border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white px-10 group"
              >
                View All Products
                <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
