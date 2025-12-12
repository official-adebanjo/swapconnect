"use client";
import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Wallet, CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import Button from "@/components/ui/Button";
import { useAuthToken } from "@/hooks/useAuthToken";
import { API_URL } from "@/lib/config";

const FundWalletPage = () => {
  const [amount, setAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const token = useAuthToken();

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimal point
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      setError(null);
    }
  };

  const validateAmount = (): boolean => {
    const numAmount = Number.parseFloat(amount);
    if (!amount || isNaN(numAmount)) {
      setError("Please enter a valid amount");
      return false;
    }
    if (numAmount < 100) {
      setError("Minimum funding amount is ₦100");
      return false;
    }
    if (numAmount > 1000000) {
      setError("Maximum funding amount is ₦1,000,000");
      return false;
    }
    return true;
  };

  const handleFundWallet = async () => {
    if (!validateAmount()) return;
    if (!token) {
      setError("Authentication required. Please log in again.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const userId = JSON.parse(atob(token.split(".")[1])).id;

      const response = await fetch(`${API_URL}/transactions/deposit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          amount: Number.parseFloat(amount),
          method: "paystack",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to initiate payment");
      }

      if (data.paymentUrl) {
        localStorage.setItem(
          "funding_attempt",
          JSON.stringify({
            amount: Number.parseFloat(amount),
            timestamp: Date.now(),
            userId,
          })
        );
        window.location.href = data.paymentUrl;
      } else {
        throw new Error("Payment URL not received");
      }
    } catch (err) {
      console.error("Fund wallet error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while processing your request"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const quickAmounts = [500, 1000, 2000, 5000, 10000];

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString());
    setError(null);
  };

  return (
    <div className="pt-[110px] md:pl-[252px] pl-8 pr-8 pb-8 min-h-screen bg-[#F8F9FB]">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow"
          disabled={isLoading}
        >
          <ArrowLeft size={20} className="text-[#353535]" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#353535]">Fund Wallet</h1>
          <p className="text-[#848484] text-sm">
            Add money to your wallet using Paystack
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#037F44] bg-opacity-10 rounded-full flex items-center justify-center">
              <Wallet size={24} className="text-[#037F44]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#353535]">
                Add Funds
              </h2>
              <p className="text-sm text-[#848484]">
                Enter amount to fund your wallet
              </p>
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-[#353535] mb-2"
            >
              Amount (₦)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#848484] text-lg">
                ₦
              </span>
              <Input
                id="amount"
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.00"
                className="pl-8 text-lg h-12 border-[#E5E7EB] focus:border-[#037F44] focus:ring-[#037F44]"
                disabled={isLoading}
              />
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          <div className="mb-6">
            <p className="text-sm font-medium text-[#353535] mb-3">
              Quick Select
            </p>
            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map((quickAmount) => (
                <button
                  key={quickAmount}
                  onClick={() => handleQuickAmount(quickAmount)}
                  className="py-2 px-3 text-sm border border-[#E5E7EB] rounded-md hover:border-[#037F44] hover:text-[#037F44] transition-colors"
                  disabled={isLoading}
                >
                  ₦{quickAmount.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#F8F9FB] rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <CreditCard size={20} className="text-[#037F44]" />
              <div>
                <p className="text-sm font-medium text-[#353535]">
                  Payment Method
                </p>
                <p className="text-xs text-[#848484]">
                  Secure payment via Paystack
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleFundWallet}
            disabled={isLoading || !amount}
            variant="success"
            className="w-full h-12 text-lg font-semibold bg-[#037F44] hover:bg-[#025a32] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </div>
            ) : (
              `Fund Wallet with ₦${
                amount ? Number.parseFloat(amount).toLocaleString() : "0"
              }`
            )}
          </Button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">i</span>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-800 mb-1">
                Secure Payment
              </p>
              <p className="text-xs text-blue-600">
                Your payment is processed securely through Paystack. You&apos;ll
                be redirected to complete the payment and then returned to your
                Your payment is processed securely through Paystack. You&apos;ll
                be redirected to complete the payment and then returned to your
                wallet.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => router.push("/dashboard/wallet/fund/test")}
            className="text-xs text-[#848484] hover:text-[#037F44] underline"
          >
            Test Fund Flow
          </button>
        </div>
      </div>
    </div>
  );
};

export default FundWalletPage;
