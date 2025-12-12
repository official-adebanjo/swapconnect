"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { useAuthToken } from "@/hooks/useAuthToken";
import { API_URL } from "@/lib/config";

type TransactionDetails = {
  amount?: number;
  reference?: string;
  newBalance?: number;
  // Add other fields if needed
};

const VerifyDepositPage = () => {
  const [status, setStatus] = useState<"loading" | "success" | "failed">(
    "loading"
  );
  const [message, setMessage] = useState<string>("");
  const [transactionDetails, setTransactionDetails] =
    useState<TransactionDetails | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = useAuthToken();

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get("reference");

      if (!reference) {
        setStatus("failed");
        setMessage("Payment reference not found");
        return;
      }

      if (!token) {
        setStatus("failed");
        setMessage("Authentication required");
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/transactions/verify-deposit?reference=${reference}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage(data.message || "Payment verified successfully");
          setTransactionDetails(data.transaction);
          localStorage.setItem("wallet_updated", Date.now().toString());
        } else {
          setStatus("failed");
          setMessage(data.error || "Payment verification failed");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("failed");
        setMessage("An error occurred while verifying payment");
      }
    };

    verifyPayment();
  }, [searchParams, token]);

  const handleContinue = () => {
    router.push("/dashboard/wallet");
  };

  return (
    <div className="pt-[110px] md:pl-[252px] pl-8 pr-8 pb-8 min-h-screen bg-[#F8F9FB] flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          {status === "loading" && (
            <>
              <Loader2
                size={64}
                className="text-[#037F44] mx-auto mb-4 animate-spin"
              />
              <h2 className="text-xl font-semibold text-[#353535] mb-2">
                Verifying Payment
              </h2>
              <p className="text-[#848484] mb-6">
                Please wait while we confirm your payment...
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle size={64} className="text-[#037F44] mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-[#353535] mb-2">
                Payment Successful!
              </h2>
              <p className="text-[#848484] mb-6">{message}</p>

              {transactionDetails && (
                <div className="bg-[#F8F9FB] rounded-lg p-4 mb-6 text-left">
                  <h3 className="font-medium text-[#353535] mb-2">
                    Transaction Details
                  </h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#848484]">Amount:</span>
                      <span className="font-medium">
                        ₦{transactionDetails.amount?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#848484]">Reference:</span>
                      <span className="font-medium">
                        {transactionDetails.reference}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#848484]">New Balance:</span>
                      <span className="font-medium text-[#037F44]">
                        ₦{transactionDetails.newBalance?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {status === "failed" && (
            <>
              <XCircle size={64} className="text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-[#353535] mb-2">
                Payment Failed
              </h2>
              <p className="text-[#848484] mb-6">{message}</p>
            </>
          )}

          {status !== "loading" && (
            <div className="space-y-3">
              <Button
                onClick={handleContinue}
                variant="success"
                className="w-full bg-[#037F44] hover:bg-[#025a32]"
              >
                {status === "success" ? "Continue to Wallet" : "Back to Wallet"}
              </Button>

              {status === "failed" && (
                <Button
                  onClick={() => router.push("/dashboard/wallet/fund")}
                  variant="outline-secondary"
                  className="w-full"
                >
                  Try Again
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyDepositPage;
