import { create } from "zustand";
import { api } from "@/lib/api";

export interface Product {
  createdAt: string | number | Date;
  id: string;
  name: string;
  price: number;
  brand?: string;
  description?: string;
  imageUrl: string;
  otherImages?: string[];
  views: number;
  isActive: boolean;
  swappable: boolean;
  installmentAvailable: boolean;
  updatedAt: string;
  Category?: {
    name: string;
  };
  Account?: {
    firstName: string;
    lastName: string;
  };
}

interface ProductStore {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
}

const useProductStore = create<ProductStore>((set) => ({
  products: [],
  loading: false,
  error: null,
  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get<Product[]>("/products");

      if (response.success && response.data) {
        set({ products: response.data, loading: false });
      } else {
        throw new Error(response.error || "Failed to fetch products");
      }
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
        loading: false,
      });
    }
  },
}));

export default useProductStore;
