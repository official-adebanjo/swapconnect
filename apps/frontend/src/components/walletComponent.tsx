"use client";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Plus, Filter } from "lucide-react";
import { Input } from "./ui/input";
import { useAuthToken } from "@/hooks/useAuthToken";
import { API_URL } from "@/lib/config";
import { useRouter } from "next/navigation";

interface WalletData {
  balance: number;
  availableBalance: number;
}

interface Stat {
  totalEarnings: string;
  totalSpent: string;
  pendingEarnings: string;
  totalSold: string;
}

interface Transaction {
  id: string;
  reference: string;
  amount: number | string;
  type: string;
  method: string;
  purpose: string;
  status: string;
  description: string;
  name?: string;
  createdAt: string;
  sender?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  receiver?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

const statDisplayMap = {
  totalEarnings: { label: "Total Earnings", color: "#353535" },
  totalSpent: { label: "Total Spent", color: "#353535" },
  pendingEarnings: { label: "Pending Earnings", color: "#353535" },
  totalSold: { label: "Total Sold", color: "#353535" },
};

export default function Wallet() {
  const [balance, setBalance] = useState<WalletData | null>(null);
  const [stats, setStats] = useState<Stat | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = useAuthToken();
  const router = useRouter();

  const fetchWalletData = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/wallet/transactions?_t=${Date.now()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("[v0] Wallet API Response:", data); // Debug log

      if (data?.data) {
        setBalance(data.data.wallet);
        setStats(data.data.stats);
        if (Array.isArray(data.data.transactions?.items)) {
          const mappedTransactions = data.data.transactions.items.map(
            (tx: {
              id?: string;
              reference: string;
              sender?: { firstName: string; lastName: string };
              description?: string;
              purpose?: string;
              amount: number | string;
              createdAt: string;
              status: string;
              type: string;
            }) => ({
              id: tx.id || tx.reference,
              name: tx.sender
                ? `${tx.sender.firstName} ${tx.sender.lastName}`
                : "System",
              description: tx.description || tx.purpose || "Transaction",
              amount: tx.amount.toString(),
              date: tx.createdAt,
              status: tx.status,
              type: tx.type,
              reference: tx.reference,
            }),
          );
          setTransactions(mappedTransactions);
        } else {
          console.warn(
            "API did not return transactions.items as an array:",
            data.data.transactions,
          );
          setTransactions([]);
        }
      } else {
        console.error("Unexpected API response format:", data);
        setError("Failed to load data: Unexpected API response format.");
      }
    } catch (err) {
      console.error("Error fetching wallet data:", err);
      if (err instanceof Error) {
        setError(`Error fetching data: ${err.message}`);
      } else if (typeof err === "string") {
        setError(`Error fetching data: ${err}`);
      } else {
        setError("Error fetching data: An unknown error occurred.");
      }
      setBalance(null);
      setStats(null);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchWalletData();
  }, [fetchWalletData]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "wallet_updated") {
        console.log("[v0] Wallet update detected, refreshing data"); // Debug log
        fetchWalletData();
        localStorage.removeItem("wallet_updated");
      }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get("status");
    const reference = urlParams.get("reference");

    if (status && reference) {
      console.log("[v0] Payment completion detected:", { status, reference }); // Debug log
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      // Refresh wallet data
      setTimeout(() => fetchWalletData(), 1000); // Small delay to ensure backend processing is complete
    }

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [fetchWalletData]);

  if (loading) {
    return (
      <div className="pt-[110px] md:pl-[252px] pl-8 pr-8 pb-8 min-h-screen bg-[#F8F9FB] flex justify-center items-center">
        Loading wallet data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-[110px] md:pl-[252px] pl-8 pr-8 pb-8 min-h-screen bg-[#F8F9FB] flex flex-col justify-center items-center text-red-600">
        <p>{error}</p>
        <p className="text-sm text-gray-500 mt-2">
          Please try refreshing the page or check your network connection.
        </p>
      </div>
    );
  }

  const getTransactionColor = (transaction: Transaction) => {
    if (transaction.type === "credit") {
      return "text-[#037F44]"; // Green for credits
    } else if (transaction.type === "debit") {
      return "text-[#DC2626]"; // Red for debits
    }
    return "text-[#6B7280]"; // Gray for neutral
  };

  const getTransactionSign = (transaction: Transaction) => {
    if (transaction.type === "credit") {
      return "+";
    } else if (transaction.type === "debit") {
      return "-";
    }
    return "";
  };

  const formatTransactionAmount = (transaction: Transaction) => {
    const amount =
      typeof transaction.amount === "string"
        ? Number.parseFloat(transaction.amount.replace(/[^0-9.]+/g, ""))
        : Number.parseFloat(transaction.amount.toString());

    const cleanAmount = Math.abs(amount);
    const sign = getTransactionSign(transaction);
    return `${sign}₦${cleanAmount.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "success":
        return "bg-[#DCFCE7] text-[#037F44]";
      case "pending":
        return "bg-[#FEF3C7] text-[#D97706]";
      case "failed":
      case "error":
        return "bg-[#FEE2E2] text-[#DC2626]";
      default:
        return "bg-[#F3F4F6] text-[#6B7280]";
    }
  };

  return (
    <div className="pt-[110px] md:pl-[252px] pl-8 pr-8 pb-8 min-h-screen bg-[#F8F9FB]">
      <div className="flex flex-col lg:flex-row gap-6 mb-10">
        <div className="flex flex-col md:flex-row md:w-[497px] md:h-[223px] h-[168px] w-[343px] bg-white rounded-xl shadow p-6 flex justify-between">
          <div className="flex md:flex-col justify-between">
            <div className="flex flex-col">
              <div className="text-[#848484] text-[15px] mb-2 font-medium">
                Wallet Balance
              </div>
              <div className="md:text-[32px] font-bold text-[#037F44] mb-6">
                ₦{balance?.balance?.toLocaleString() || "0.00"}
              </div>
            </div>

            <Image
              src="/Sketch.png"
              alt="Wallet illustration"
              width={60}
              height={60}
              className="w-[60px] h-[60px] md:w-[120px] md:h-[120px]"
            />
          </div>
          <div className="flex md:flex-col justify-between">
            <button
              className="border bg-[#037F44] w-[137px] md:h-[48px] h-[40px] rounded-md text-white text-[16px]"
              onClick={() => router.push("/dashboard/wallet/withdraw")}
            >
              Withdraw
            </button>
            <button
              className="flex items-center justify-center gap-2 border bg-white border-[#037F44] text-[#037F44] w-[174px] md:h-[48px] h-[40px] rounded-md text-[16px]"
              onClick={() => router.push("/dashboard/wallet/fund")}
            >
              <Plus width={16} height={16} />
              Fund Wallet
            </button>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 md:grid-cols-2 gap-4">
          {stats &&
            Object.entries(stats).map(([key, value]) => {
              const displayInfo =
                statDisplayMap[key as keyof typeof statDisplayMap];
              if (!displayInfo) return null;

              const formattedValue =
                key === "totalSold"
                  ? value
                  : `₦${Number.parseFloat(value as string).toLocaleString()}`;

              return (
                <div
                  key={key}
                  className="rounded-xl shadow bg-white flex flex-col md:w-[228px] w-[168px] h-[97px] items-center justify-center p-6"
                >
                  <div className="text-[14px] text-[#BEBEBE] font-medium mb-2">
                    {displayInfo.label}
                  </div>
                  <div
                    className="text-[24px] font-bold"
                    style={{ color: displayInfo.color }}
                  >
                    {formattedValue}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <div className="mb-4 mt-2">
        <div className="flex flex-col gap-4 mb-4">
          <h3 className="hidden md:flex text-xl font-bold text-[#353535]">
            Transaction History
          </h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 mb-8">
              <Input
                placeholder="Search product's name, category...."
                className="bg-white border w-[300px] md:w-[900px] "
              />
              <button className="hidden md:flex items-center gap-2 bg-[#F8F9FB] border border-[#E5E7EB] px-4 py-2 rounded-md text-[#353535] hover:bg-[#e6f9f0] transition">
                <Filter size={18} />
                <span className="font-medium text-[15px]">Filter</span>
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white hidden md:block ">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#CCDCD4]">
                <th className="text-left px-4 py-3 text-[#505050] text-[14px]">
                  TRANSACTION ID
                </th>
                <th className="text-left px-4 py-3 text-[#505050] text-[14px]">
                  NAME
                </th>
                <th className="text-left px-4 py-3 text-[#505050] text-[14px]">
                  DESCRIPTION
                </th>
                <th className="text-left px-4 py-3 text-[#505050] text-[14px]">
                  AMOUNT
                </th>
                <th className="text-left px-4 py-3 text-[#505050] text-[14px]">
                  DATE
                </th>
                <th className="text-left px-4 py-3 text-[#505050] text-[14px]">
                  STATUS
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-[#848484]">
                    No transactions found for this user.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-white">
                    <td className="px-4 py-3 text-[#434343] text-[14px]">
                      {tx.id}
                    </td>
                    <td className="px-4 py-3 text-[#434343] text-[14px]">
                      {tx.name}
                    </td>
                    <td className="px-4 py-3 text-[#434343] text-[14px]">
                      {tx.description}
                    </td>
                    <td
                      className={`px-4 py-3 text-[14px] font-semibold ${getTransactionColor(
                        tx,
                      )}`}
                    >
                      {formatTransactionAmount(tx)}
                    </td>
                    <td className="px-4 py-3 text-[#434343] text-[14px]">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-[#434343] text-[14px]">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          tx.status,
                        )}`}
                      >
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-4 md:hidden">
          {transactions.length === 0 ? (
            <div className="text-center py-4 text-[#848484] bg-white rounded-lg shadow">
              No transactions found for this user.
            </div>
          ) : (
            transactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-white rounded-lg shadow px-4 py-3 flex flex-col gap-2"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-[#353535]">
                      {tx.name}
                    </div>
                    <div className="text-xs text-[#848484]">
                      {tx.description}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div
                      className={`font-semibold text-[15px] ${getTransactionColor(
                        tx,
                      )}`}
                    >
                      {formatTransactionAmount(tx)}
                    </div>
                    <div
                      className={`mt-1 text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(
                        tx.status,
                      )}`}
                    >
                      {tx.status}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
