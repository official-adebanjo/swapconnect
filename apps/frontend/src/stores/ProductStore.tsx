import { create } from "zustand";
import axios from "axios";

export interface Product {
  createdAt: string | number | Date;
  id: string;
  name: string;
  price: number;
  // Add other product fields as needed
}

interface ProductStore {
  products: Product[];
  loading: boolean;
  error: unknown;
  fetchProducts: () => Promise<void>;
}

const useProductStore = create<ProductStore>((set) => ({
  products: [],
  loading: false,
  error: null,
  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get<Product[]>("/products");
      set({ products: response.data, loading: false });
    } catch (error) {
      set({ error, loading: false });
    }
  },
}));

export default useProductStore;
