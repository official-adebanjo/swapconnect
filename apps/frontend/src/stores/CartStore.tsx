import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  orderId?: string;
  image?: string;
  // Add other product fields as needed
}

interface CartStore {
  carts: CartItem[];
  addToCart: (product: Omit<CartItem, "quantity">) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  updateQuantity: (productId: string, quantity: number) => void;
}

const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      carts: [],
      addToCart: (product) =>
        set((state) => {
          const existingProduct = state.carts.find(
            (item) => item.id === product.id,
          );

          if (existingProduct) {
            return {
              carts: state.carts.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              ),
            };
          }

          return {
            carts: [...state.carts, { ...product, quantity: 1 }],
          };
        }),

      removeFromCart: (productId) =>
        set((state) => ({
          carts: state.carts.filter((item) => item.id !== productId),
        })),

      clearCart: () =>
        set(() => ({
          carts: [],
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          carts: state.carts.map((item) =>
            item.id === productId ? { ...item, quantity: quantity } : item,
          ),
        })),
    }),
    {
      name: "cart-storage",
      storage: {
        getItem: (name) => {
          const item = localStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    },
  ),
);

export default useCartStore;
