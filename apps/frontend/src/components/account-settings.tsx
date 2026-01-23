"use client";

import { useState, useEffect } from "react";
import {
  Shield,
  ShieldCheck,
  Mail,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuthToken } from "@/hooks/useAuthToken";

interface User2FASettings {
  twoFactorEnabled: boolean;
}

export default function AccountSettings() {
  const token = useAuthToken();
  const [user2FA, setUser2FA] = useState<User2FASettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [sendingOTP, setSendingOTP] = useState(false);

  // Fetch user 2FA settings
  useEffect(() => {
    const fetchUser2FASettings = async () => {
      if (!token) return;

      try {
        setError(null);
        const response = await api.get<{ twoFactorEnabled?: boolean }>(
          "/users/",
          token,
        );

        if (
          response.success &&
          response.data &&
          typeof response.data.twoFactorEnabled === "boolean"
        ) {
          setUser2FA({
            twoFactorEnabled: response.data.twoFactorEnabled,
          });
        } else {
          setError("Failed to fetch account settings");
        }
      } catch (err) {
        setError("Error fetching account settings");
        console.error("Error fetching user settings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser2FASettings();
  }, [token]);

  const handleToggle2FA = async () => {
    if (!token || !user2FA) return;

    setToggling(true);
    try {
      const response = await api.post("/users/2fa/toggle", {}, token);

      if (response.success) {
        // If enabling 2FA, show OTP input
        if (!user2FA.twoFactorEnabled) {
          setShowOTPInput(true);
          setSendingOTP(true);
          // Initiate 2FA to send OTP
          await api.post("/users/2fa/initiate", {}, token);
          setSendingOTP(false);
        } else {
          // If disabling, update state immediately
          setUser2FA((prev) =>
            prev ? { ...prev, twoFactorEnabled: false } : null,
          );
        }
      } else {
        setError(response.error || "Failed to toggle 2FA");
      }
    } catch (err) {
      setError("Error toggling 2FA");
      console.error("Error toggling 2FA:", err);
    } finally {
      setToggling(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!token || !otpCode.trim()) return;

    setVerifying(true);
    try {
      const response = await api.post(
        "/users/2fa/verify",
        {
          verificationCode: otpCode.trim(),
        },
        token,
      );

      if (response.success) {
        setUser2FA((prev) =>
          prev ? { ...prev, twoFactorEnabled: true } : null,
        );
        setShowOTPInput(false);
        setOtpCode("");
      } else {
        setError(response.error || "Invalid OTP code");
      }
    } catch (err) {
      setError("Error verifying OTP");
      console.error("Error verifying OTP:", err);
    } finally {
      setVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    if (!token) return;

    setSendingOTP(true);
    try {
      const response = await api.post("/users/2fa/initiate", {}, token);
      if (response.success) {
        setError(null);
      } else {
        setError("Failed to resend OTP");
      }
    } catch (err) {
      setError("Error resending OTP");
      console.error("Error resending OTP:", err);
    } finally {
      setSendingOTP(false);
    }
  };

  if (loading || !user2FA) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="animate-spin text-[#037F44]" size={24} />
          <span className="ml-2 text-gray-600">
            Loading account settings...
          </span>
        </div>
      </div>
    );
  }

  if (error && !showOTPInput) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-red-500">
          Error loading account settings: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="text-[#037F44]" size={24} />
        <h2 className="text-xl font-semibold text-gray-800">
          Account Security
        </h2>
      </div>

      <div className="space-y-6">
        {/* 2FA Settings */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {user2FA.twoFactorEnabled ? (
                <ShieldCheck className="text-green-600" size={24} />
              ) : (
                <Shield className="text-gray-400" size={24} />
              )}
              <div>
                <h3 className="font-medium text-gray-800">
                  Two-Factor Authentication (2FA)
                </h3>
                <p className="text-sm text-gray-600">
                  Add an extra layer of security to your account
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={user2FA.twoFactorEnabled}
                onChange={handleToggle2FA}
                disabled={toggling || showOTPInput}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#037F44] disabled:opacity-50"></div>
            </label>
          </div>

          {/* Status indicator */}
          <div
            className={`flex items-center gap-2 p-3 rounded-md ${
              user2FA.twoFactorEnabled
                ? "bg-green-50 text-green-700"
                : "bg-gray-50 text-gray-600"
            }`}
          >
            {user2FA.twoFactorEnabled ? (
              <>
                <ShieldCheck size={16} />
                <span className="text-sm font-medium">2FA is enabled</span>
              </>
            ) : (
              <>
                <AlertTriangle size={16} />
                <span className="text-sm">
                  2FA is disabled - your account is less secure
                </span>
              </>
            )}
          </div>

          {/* Loading state */}
          {toggling && (
            <div className="flex items-center gap-2 mt-4 text-[#037F44]">
              <Loader2 className="animate-spin" size={16} />
              <span className="text-sm">Updating 2FA settings...</span>
            </div>
          )}
        </div>

        {/* OTP Verification Modal */}
        {showOTPInput && (
          <div className="border border-gray-200 rounded-lg p-6 bg-blue-50">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="text-blue-600" size={20} />
              <h3 className="font-medium text-gray-800">Verify Your Email</h3>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              We&apos;ve sent a 6-digit verification code to your email. Enter
              it below to enable 2FA.
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otpCode}
                  onChange={(e) =>
                    setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#037F44] focus:border-transparent"
                  maxLength={6}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleVerifyOTP}
                  disabled={verifying || otpCode.length !== 6}
                  className="flex items-center gap-2 bg-[#037F44] text-white px-4 py-2 rounded-md hover:bg-[#025c32] transition disabled:opacity-50"
                >
                  {verifying ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    "Verify & Enable 2FA"
                  )}
                </button>

                <button
                  onClick={handleResendOTP}
                  disabled={sendingOTP}
                  className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition disabled:opacity-50"
                >
                  {sendingOTP ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    "Resend Code"
                  )}
                </button>

                <button
                  onClick={() => {
                    setShowOTPInput(false);
                    setOtpCode("");
                    setError(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2FA Information */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-800 mb-3">How 2FA Works:</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0"></span>
              <span>
                When enabled, you&apos;ll need to enter a code sent to your
                email during login
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 shrink-0"></span>
              <span>Codes expire after 10 minutes for security</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 shrink-0"></span>
              <span>
                This prevents unauthorized access even if your password is
                compromised
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
