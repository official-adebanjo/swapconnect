"use client";

export const dynamic = "force-dynamic";

import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [infoMsg, setInfoMsg] = useState("");

  useEffect(() => {
    if (localStorage.getItem("resetEmailSent") === "true") {
      setInfoMsg("Check your email for the password reset link.");
      localStorage.removeItem("resetEmailSent");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const res = await fetch(`${backendUrl}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setIsProcessing(false);
      if (res.ok) {
        toast.success("Password reset link sent to your email.");
        setEmail(""); // Clear the form
        localStorage.setItem("resetEmailSent", "true");
        window.location.reload();
      } else {
        toast.error(data.message || "Failed to send reset link.");
      }
    } catch {
      setIsProcessing(false);
      toast.error("Network error. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Toaster position="top-right" />
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
        {infoMsg && (
          <div className="mb-4 text-green-700 bg-green-100 p-2 rounded text-center">
            {infoMsg}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 cursor-pointer text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 transition"
            disabled={isProcessing}
          >
            {isProcessing ? "Please wait..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
