import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { api } from "@/lib/api";

// Match your backend's expected user structure
export interface AuthUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  role: string;
  verified: boolean;
  suspended: boolean;
  suspensionReason: string | null;
  createdAt: string;
  updatedAt: string;
  address: string | null;
  accountNumber: string | null;
  bankName: string | null;
  bankCode: string | null;
  uid: string | null;
  walletId: string | number; // Backend may use string IDs now
  referralCode: string | null;

  // Frontend-only optional fields
  displayName?: string | null;
  photoURL?: string | null;
  avatar?: string | null;
  [key: string]: unknown;
}

interface UserStore {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  loginUser: (userData: AuthUser, token: string) => void;
  logoutUser: () => void;
  checkAuth: () => Promise<void>;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isHydrated: false,

      loginUser: (userData: AuthUser, token: string) => {
        localStorage.setItem("authToken", token);
        set({
          user: userData,
          token,
          isAuthenticated: true,
          isHydrated: true,
        });
      },

      logoutUser: () => {
        localStorage.removeItem("authToken");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isHydrated: true,
        });
      },

      checkAuth: async () => {
        if (typeof window === "undefined") {
          set({ isHydrated: true });
          return;
        }

        const token = localStorage.getItem("authToken");
        if (!token) {
          set({ isHydrated: true });
          return;
        }

        try {
          const response = await api.get<{ user: AuthUser }>("/auth/me", token);

          if (response.success && response.data?.user) {
            set({
              user: response.data.user,
              token,
              isAuthenticated: true,
              isHydrated: true,
            });
          } else {
            localStorage.removeItem("authToken");
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isHydrated: true,
            });
          }
        } catch (error) {
          console.error(
            "AuthStore: Failed to check auth state with backend:",
            error,
          );
          localStorage.removeItem("authToken");
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isHydrated: true,
          });
        }
      },
    }),
    {
      name: "swapconnect-user",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: (state) => {
        return (hydratedState, error) => {
          if (error) {
            console.error("AuthStore: Error during hydration:", error);
          } else if (hydratedState) {
            hydratedState.isHydrated = true;
            hydratedState.checkAuth();
          }
        };
      },
    },
  ),
);
