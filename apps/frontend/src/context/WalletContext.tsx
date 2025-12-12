// src/context/WalletContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuthToken } from "@/hooks/useAuthToken";
import { API_URL } from "@/lib/config";

interface WalletContextType {
  balance: number | null;
  refreshBalance: () => void;
}

const WalletContext = createContext<WalletContextType>({
  balance: null,
  refreshBalance: () => {},
});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [balance, setBalance] = useState<number | null>(null);
  const token = useAuthToken();

  const fetchBalance = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_URL}/wallet/transactions`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setBalance(data?.data?.wallet?.balance ?? 0);
    } catch {
      setBalance(0);
    }
  };

  useEffect(() => {
    fetchBalance();
    // eslint-disable-next-line
  }, [token]);

  return (
    <WalletContext.Provider value={{ balance, refreshBalance: fetchBalance }}>
      {children}
    </WalletContext.Provider>
  );
};
