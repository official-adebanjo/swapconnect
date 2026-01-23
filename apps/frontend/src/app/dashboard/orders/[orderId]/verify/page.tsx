"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

interface VerifyOrderPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

const VerifyOrderPage: React.FC<VerifyOrderPageProps> = ({ params }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");
  const [resolvedParams, setResolvedParams] = useState<{
    orderId: string;
  } | null>(null);

  // Resolve the params promise
  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };

    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!resolvedParams) return;

    const verifyPayment = async () => {
      try {
        const reference = searchParams.get("reference");

        if (!reference) {
          setStatus("error");
          setMessage("Payment reference not found");
          return;
        }

        const response = await fetch(
          `${backendUrl}/api/orders/verify/${resolvedParams.orderId}?reference=${reference}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        const result = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage(
            "Payment verified successfully! Your order has been confirmed.",
          );

          // Redirect to orders page after 3 seconds
          setTimeout(() => {
            router.push("/dashboard/orders");
          }, 3000);
        } else {
          setStatus("error");
          setMessage(result.error || "Payment verification failed");
        }
      } catch {
        setStatus("error");
        setMessage("An error occurred while verifying payment");
      }
    };

    verifyPayment();
  }, [resolvedParams, searchParams, router]);

  if (!resolvedParams) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold mb-2">Loading...</h2>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-20 px-4 text-center">
      {status === "loading" && (
        <div>
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">Verifying Payment...</h2>
          <p className="text-gray-600">
            Please wait while we confirm your payment
          </p>
        </div>
      )}

      {status === "success" && (
        <div>
          <div className="text-green-600 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">
            Payment Successful!
          </h2>
          <p className="text-gray-600 mb-4">{message}</p>
          <p className="text-sm text-gray-500">Redirecting to your orders...</p>
        </div>
      )}

      {status === "error" && (
        <div>
          <div className="text-red-600 text-6xl mb-4">✗</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Payment Failed
          </h2>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="space-x-4">
            <button
              onClick={() => router.push("/cart")}
              className="bg-gray-600 text-white px-6 py-3 rounded font-semibold hover:bg-gray-700"
            >
              Back to Cart
            </button>
            <button
              onClick={() => router.push("/shop")}
              className="bg-green-600 text-white px-6 py-3 rounded font-semibold hover:bg-green-700"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyOrderPage;
