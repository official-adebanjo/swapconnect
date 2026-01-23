"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useCartStore from "@/stores/CartStore";
import Image from "next/image";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

interface ShippingOption {
  label: string;
  value: number;
}

const shippingOptions: ShippingOption[] = [
  { label: "Standard (₦1,000)", value: 1000 },
  { label: "Express (₦2,500)", value: 2500 },
  { label: "Pickup (₦0)", value: 0 },
];

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const { carts, clearCart } = useCartStore();

  const [form, setForm] = useState({
    address: "",
    paymentMethod: "paystack", // paystack or wallet
    paymentMode: "full", // full or installment
    installmentPlanName: "",
    shipping: shippingOptions[0].value,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Calculate totals
  const subtotal = carts.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0,
  );
  const total = subtotal + form.shipping;

  useEffect(() => {
    // Get user info from localStorage
    const userData = localStorage.getItem("userId");

    if (userData) {
      setUserId(userData);
    }

    // Redirect if cart is empty
    if (carts.length === 0) {
      router.push("/cart");
    }
  }, [carts.length, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (!form.address.trim()) {
      setError("Shipping address is required.");
      setLoading(false);
      return;
    }

    if (!userId) {
      setError("Please log in to complete your order.");
      setLoading(false);
      return;
    }

    try {
      // Calculate installment amount if applicable
      let installmentAmount = 0;
      if (form.paymentMode === "installment") {
        const numberOfPayments =
          form.installmentPlanName === "3-months"
            ? 3
            : form.installmentPlanName === "6-months"
              ? 6
              : 12;
        installmentAmount = total / numberOfPayments;
      }

      // Single API call to create order and process payment
      const orderData = {
        userId: userId,
        products: carts.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        address: form.address,
        shippingCost: form.shipping,
        totalAmount: total,
        paymentMethod: form.paymentMethod,
        paymentMode: form.paymentMode,
        installmentPlanName:
          form.paymentMode === "installment"
            ? form.installmentPlanName
            : undefined,
        installmentAmount:
          form.paymentMode === "installment" ? installmentAmount : undefined,
      };

      const response = await fetch(`${backendUrl}/api/orders/create-and-pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to process order and payment");
      }

      // Handle payment result
      if (form.paymentMethod === "paystack" && result.paymentUrl) {
        // Redirect to Paystack payment page
        clearCart();
        window.location.href = result.paymentUrl;
      } else if (form.paymentMethod === "wallet") {
        // Wallet payment completed
        setMessage(
          form.paymentMode === "full"
            ? "Order placed and paid successfully!"
            : "First installment paid successfully! Order placed.",
        );
        clearCart();
        setTimeout(() => {
          router.push(`/dashboard/orders`);
        }, 2000);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "An error occurred during checkout");
      } else {
        setError("An error occurred during checkout");
      }
    } finally {
      setLoading(false);
    }
  };

  // Calculate first installment amount for display
  const getFirstInstallmentAmount = () => {
    if (form.paymentMode !== "installment" || !form.installmentPlanName)
      return 0;

    const numberOfPayments =
      form.installmentPlanName === "3-months"
        ? 3
        : form.installmentPlanName === "6-months"
          ? 6
          : 12;
    return total / numberOfPayments;
  };

  if (carts.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button
          onClick={() => router.push("/shop")}
          className="bg-green-600 text-white px-6 py-3 rounded font-semibold hover:bg-green-700"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-8 text-center">Checkout</h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Order Summary</h3>

          <div className="space-y-4 mb-6">
            {carts.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="relative h-16 w-16">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-contain rounded"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    ₦{(Number(item.price) * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₦{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>₦{form.shipping.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total:</span>
              <span className="text-green-700">₦{total.toLocaleString()}</span>
            </div>
            {form.paymentMode === "installment" && form.installmentPlanName && (
              <div className="text-sm text-gray-600 mt-2">
                <p>Installment Plan: {form.installmentPlanName}</p>
                <p>
                  First Payment: ₦{getFirstInstallmentAmount().toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Checkout Form */}
        <div className="bg-white p-6 rounded-lg shadow">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Shipping Address */}
            <div>
              <label className="block mb-2 font-medium">
                Shipping Address *
              </label>
              <textarea
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full border px-3 py-2 rounded resize-none"
                rows={3}
                placeholder="Enter your complete shipping address"
              />
            </div>

            {/* Shipping Options */}
            <div>
              <label className="block mb-2 font-medium">Shipping Method</label>
              <select
                value={form.shipping}
                onChange={(e) =>
                  setForm({ ...form, shipping: Number(e.target.value) })
                }
                className="w-full border px-3 py-2 rounded"
              >
                {shippingOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block mb-2 font-medium">Payment Method</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paystack"
                    checked={form.paymentMethod === "paystack"}
                    onChange={(e) =>
                      setForm({ ...form, paymentMethod: e.target.value })
                    }
                    className="mr-2"
                  />
                  Card Payment (Paystack)
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="wallet"
                    checked={form.paymentMethod === "wallet"}
                    onChange={(e) =>
                      setForm({ ...form, paymentMethod: e.target.value })
                    }
                    className="mr-2"
                  />
                  Wallet Balance
                </label>
              </div>
            </div>

            {/* Payment Mode */}
            <div>
              <label className="block mb-2 font-medium">Payment Mode</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMode"
                    value="full"
                    checked={form.paymentMode === "full"}
                    onChange={(e) =>
                      setForm({ ...form, paymentMode: e.target.value })
                    }
                    className="mr-2"
                  />
                  Full Payment
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMode"
                    value="installment"
                    checked={form.paymentMode === "installment"}
                    onChange={(e) =>
                      setForm({ ...form, paymentMode: e.target.value })
                    }
                    className="mr-2"
                  />
                  Installment Payment
                </label>
              </div>
            </div>

            {/* Installment Plan (if installment selected) */}
            {form.paymentMode === "installment" && (
              <div>
                <label className="block mb-2 font-medium">
                  Installment Plan *
                </label>
                <select
                  value={form.installmentPlanName}
                  onChange={(e) =>
                    setForm({ ...form, installmentPlanName: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded"
                  required={form.paymentMode === "installment"}
                >
                  <option value="">Select a plan</option>
                  <option value="3-months">3 Months (3 payments)</option>
                  <option value="6-months">6 Months (6 payments)</option>
                  <option value="12-months">12 Months (12 payments)</option>
                </select>
                <p className="text-sm text-gray-600 mt-1">
                  First payment will be processed now
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={
                loading ||
                (form.paymentMode === "installment" &&
                  !form.installmentPlanName)
              }
              className="w-full bg-green-600 text-white py-3 rounded font-semibold hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading
                ? "Processing..."
                : form.paymentMode === "full"
                  ? `Pay Now - ₦${total.toLocaleString()}`
                  : form.installmentPlanName
                    ? `Pay First Installment - ₦${getFirstInstallmentAmount().toLocaleString()}`
                    : "Select Installment Plan"}
            </button>

            {message && (
              <div className="p-3 bg-green-100 text-green-700 rounded">
                {message}
              </div>
            )}
            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
