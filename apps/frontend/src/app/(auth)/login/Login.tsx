"use client";

import type React from "react";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useUserStore } from "@/stores/AuthStore";
import CenterCard from "../CenterCard";
import { api } from "@/lib/api";
import { ASSETS } from "@/lib/constants";

// OTP Components
import {
  renderResendTimer,
  renderResendButton,
} from "@/components/auth/OtpRenderers";

const OTPInput = dynamic(
  () => import("otp-input-react").then((mod) => mod.OTPInput),
  { ssr: false },
);
const ResendOTP = dynamic(
  () => import("otp-input-react").then((mod) => mod.ResendOTP),
  { ssr: false },
);

// Form Schema
const loginSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

type LoginFormInputs = {
  email: string;
  password: string;
};

type AuthUser = {
  id: number;
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  verified: boolean;
  suspended: boolean;
  suspensionReason: string;
  createdAt: string;
  updatedAt: string;
  address: string;
  accountNumber: string;
  bankName: string;
  bankCode: string;
  walletId: number;
  referralCode: string;
};

type AuthResponse = {
  message: string;
  token: string;
  user: AuthUser;
};

const Login: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [otp, setOtp] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [emailForVerification, setEmailForVerification] = useState("");
  const [callbackError, setCallbackError] = useState<string | null>(null);
  const [callbackSuccess, setCallbackSuccess] = useState<string | null>(null);
  const [show2FAPopup, setShow2FAPopup] = useState(false);
  const [twoFactorOtp, setTwoFactorOtp] = useState<number | null>(null);
  const [emailFor2FA, setEmailFor2FA] = useState("");

  const router = useRouter();
  const { loginUser } = useUserStore();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = useUserStore.getState().user;

    if (token && user) {
      toast("You're already logged in!", { icon: "🔒" });
      router.push("/dashboard");
    }
  }, [router]);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(loginSchema),
  });

  // Handle callback messages (success or error) from backend
  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      setCallbackError(searchParams.get("error"));
      setCallbackSuccess(searchParams.get("success"));

      // Remove query parameters from the URL
      const url = new URL(window.location.href);
      url.searchParams.delete("error");
      url.searchParams.delete("success");
      window.history.replaceState({}, document.title, url.toString());
    }
  }, []);

  useEffect(() => {
    if (callbackError) {
      toast.error(callbackError);
    }
    if (callbackSuccess) {
      toast.success(callbackSuccess);
    }
  }, [callbackError, callbackSuccess]);

  const sendOtpToEmail = useCallback(
    async (email: string) => {
      setIsProcessing(true);
      toast.loading("Sending OTP...", { id: "otp-send" });

      try {
        const res = await fetch(`${backendUrl}/auth/send-verification-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const result: { message: string } = await res.json();

        if (res.ok) {
          setEmailForVerification(email);
          setShowOtpPopup(true);
          toast.success(result.message || "OTP sent successfully.", {
            id: "otp-send",
          });
        } else {
          toast.error(result.message || "Failed to send OTP.", {
            id: "otp-send",
          });
        }
      } catch {
        toast.error("Network error while sending OTP.", { id: "otp-send" });
      } finally {
        setIsProcessing(false);
      }
    },
    [backendUrl],
  );

  const send2FACode = useCallback(async (email: string) => {
    setIsProcessing(true);
    toast.loading("Sending 2FA code...", { id: "2fa-send" });

    try {
      const res = await api.post(
        "/users/2fa/initiate",
        {},
        localStorage.getItem("tempToken") || "",
      );

      if (res.success) {
        setEmailFor2FA(email);
        setShow2FAPopup(true);
        toast.success("2FA code sent to your email.", {
          id: "2fa-send",
        });
      } else {
        toast.error(res.message || "Failed to send 2FA code.", {
          id: "2fa-send",
        });
      }
    } catch {
      toast.error("Network error while sending 2FA code.", { id: "2fa-send" });
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const onSubmit: SubmitHandler<LoginFormInputs> = async (formData) => {
    setIsProcessing(true);
    toast.loading("Signing in...", { id: "login" });
    // console.log("Calling login API:", backendUrl + "/auth/login");

    try {
      const res = await api.post<AuthResponse, LoginFormInputs>(
        "/auth/login",
        formData,
      );

      toast.dismiss("login");

      if (res.status === 401) {
        const isUnverified = res.message
          ?.toLowerCase()
          .includes("not verified");

        const is2FARequired = res.message
          ?.toLowerCase()
          .includes("two-factor authentication required");

        if (isUnverified) {
          toast.error("Account not verified. Sending OTP...");
          await sendOtpToEmail(formData.email);
        } else if (is2FARequired) {
          toast.error("2FA verification required. Sending code...");
          // Store temporary token for 2FA API calls
          localStorage.setItem("tempToken", "temp");
          await send2FACode(formData.email);
        } else {
          toast.error(
            res.data?.message ||
              "Unauthorized access. Please check your credentials.",
          );
        }
        setIsProcessing(false);
        return;
      }
      if (res.success) {
        if (!res.data?.token) return;
        if (!res.data?.user) return;
      }
      if (res.success && res.data?.token && res.data?.user?.verified) {
        const { user, token } = res.data!;
        loginUser({ ...user }, token); // Store all user fields and token
        localStorage.setItem("authToken", token);
        localStorage.setItem("userId", user.id.toString());
        localStorage.removeItem("tempToken");

        toast.success("Login successful!");

        // Determine redirect URL based on environment
        const hostname = window.location.hostname;
        console.log(hostname);
        // const redirectAfterLogin =
        //   hostname === 'localhost' || hostname === '127.0.0.1'
        //     ? 'http://localhost:3000'
        //     : '/dashboard';

        localStorage.removeItem("redirectAfterLogin");
        router.push("/dashboard?token=" + token);
      } else {
        toast.error(res.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("An unexpected error occurred during login.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGoogleSignIn = () => {
    toast.loading("Redirecting to Google...", { id: "google-redirect" });
    try {
      // Determine redirect URL based on environment
      const hostname = window.location.hostname;
      const redirectUrl =
        hostname === "localhost" || hostname === "127.0.0.1"
          ? "http://localhost:3000"
          : "/dashboard"; // Default live URL redirect

      window.location.href = `${backendUrl}/auth/google/login?redirect=${encodeURIComponent(
        redirectUrl,
      )}`;
    } catch (error) {
      console.error("Error initiating Google sign-in redirect:", error);
      toast.error("Failed to start Google sign-in. Please try again.", {
        id: "google-redirect",
      });
    }
  };

  const handleVerifyOtp = async () => {
    if (!emailForVerification || otp === null || otp.toString().length !== 6) {
      toast.error("Enter a valid 6-digit OTP.");
      return;
    }

    setIsProcessing(true);
    toast.loading("Verifying OTP...", { id: "verify" });

    try {
      const res = await api.post<
        { message: string },
        { email: string; code: string }
      >("/auth/verify-email", {
        email: emailForVerification.trim(),
        code: otp.toString(),
      });

      if (
        res.status === 200 &&
        res.message === "Account verified successfully"
      ) {
        toast.success("Email verified successfully!", { id: "verify" });
        setShowOtpPopup(false);
        router.push("/login");
      } else {
        toast.error(res.message || "Unexpected response from server.", {
          id: "verify",
        });
      }
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const errorResponse = err as {
          response?: { status: number };
        };

        const status = errorResponse.response?.status;

        if (status === 400) {
          toast.error("Invalid OTP.", { id: "verify" });
        } else if (status === 404) {
          toast.error("Account with this email not found.", { id: "verify" });
        } else if (status === 500) {
          toast.error("Server error. Please try again later.", {
            id: "verify",
          });
        } else {
          toast.error("An unexpected error occurred.", { id: "verify" });
        }
      } else {
        toast.error("An unknown error occurred.", { id: "verify" });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerify2FA = async () => {
    if (
      !emailFor2FA ||
      twoFactorOtp === null ||
      twoFactorOtp.toString().length !== 6
    ) {
      toast.error("Enter a valid 6-digit 2FA code.");
      return;
    }

    setIsProcessing(true);
    toast.loading("Verifying 2FA code...", { id: "verify-2fa" });

    try {
      const res = await api.post<AuthResponse, { verificationCode: string }>(
        "/users/2fa/verify",
        {
          verificationCode: twoFactorOtp.toString(),
        },
        localStorage.getItem("tempToken") || "",
      );

      if (res.success && res.data?.token && res.data?.user) {
        const { user, token } = res.data;
        loginUser({ ...user }, token);
        localStorage.setItem("authToken", token);
        localStorage.setItem("userId", user.id.toString());
        localStorage.removeItem("tempToken");

        toast.success("2FA verification successful!", { id: "verify-2fa" });
        setShow2FAPopup(false);
        router.push("/dashboard?token=" + token);
      } else {
        toast.error(res.message || "Invalid 2FA code.", {
          id: "verify-2fa",
        });
      }
    } catch (err) {
      console.error("2FA verification error:", err);
      toast.error("Error verifying 2FA code.", { id: "verify-2fa" });
    } finally {
      setIsProcessing(false);
    }
  };

  const inputClass =
    "w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 focus:outline-none";

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100 p-4 overflow-hidden">
      <CenterCard
        leftLogoSrc={ASSETS.LOGO_WHITE}
        leftImageAlt="Login Illustration"
        leftImageSrc={ASSETS.LOGIN_IMG}
      >
        <h4 className="text-2xl font-bold text-gray-800 mb-2">Welcome back!</h4>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className={inputClass}
            disabled={isProcessing}
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password")}
              className={`${inputClass} pr-10`}
              disabled={isProcessing}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600"
              tabIndex={-1}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password.message}</p>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 cursor-pointer px-4 rounded-md font-semibold hover:bg-green-700 disabled:opacity-50 flex justify-center"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <span className="animate-spin h-4 w-4 mr-2 border-b-2 border-white rounded-full"></span>
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        <div className="mt-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <div className="h-px bg-gray-300 flex-1" />
            or
            <div className="h-px bg-gray-300 flex-1" />
          </div>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 text-sm font-semibold hover:bg-gray-100 bg-white text-gray-700"
            disabled={isProcessing}
          >
            <Image
              src={ASSETS.GOOGLE_ICON}
              alt="Google"
              width={18}
              height={18}
              className="inline"
            />
            Sign in with Google
          </button>
        </div>

        <p className="mt-4 text-xs text-center text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </CenterCard>

      {/* Email Verification OTP Popup */}
      {showOtpPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-11/12 max-w-sm">
            <h5 className="font-bold text-lg text-gray-800 mb-2 text-center">
              Verify your email
            </h5>
            <p className="text-sm text-gray-600 mb-4 text-center">
              Enter the 6-digit OTP sent to{" "}
              <strong>{emailForVerification}</strong>
            </p>
            <OTPInput
              value={otp !== null ? otp.toString() : ""}
              onChange={(value) =>
                setOtp(value ? Number.parseInt(value, 10) : null)
              }
              OTPLength={6}
              otpType="number"
              autoFocus
              disabled={isProcessing}
              inputClassName="!w-10 !h-10 !text-lg !mx-1 !rounded-lg !border !border-gray-300 bg-gray-50"
              containerClassName="flex justify-center mb-4"
            />
            <div className="text-center mb-4">
              <ResendOTP
                onResend={() => sendOtpToEmail(emailForVerification)}
                renderTime={renderResendTimer}
                renderButton={renderResendButton}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleVerifyOtp}
                className="flex-1 bg-blue-600 text-white py-2 cursor-pointer px-4 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50"
                disabled={isProcessing || otp?.toString().length !== 6}
              >
                {isProcessing ? "Verifying..." : "Verify OTP"}
              </button>
              <button
                onClick={() => setShowOtpPopup(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md font-semibold hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {show2FAPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-11/12 max-w-sm">
            <h5 className="font-bold text-lg text-gray-800 mb-2 text-center">
              Two-Factor Authentication
            </h5>
            <p className="text-sm text-gray-600 mb-4 text-center">
              Enter the 6-digit 2FA code sent to <strong>{emailFor2FA}</strong>
            </p>
            <OTPInput
              value={twoFactorOtp !== null ? twoFactorOtp.toString() : ""}
              onChange={(value) =>
                setTwoFactorOtp(value ? Number.parseInt(value, 10) : null)
              }
              OTPLength={6}
              otpType="number"
              autoFocus
              disabled={isProcessing}
              inputClassName="!w-10 !h-10 !text-lg !mx-1 !rounded-lg !border !border-gray-300 bg-gray-50"
              containerClassName="flex justify-center mb-4"
            />
            <div className="text-center mb-4">
              <ResendOTP
                onResend={() => send2FACode(emailFor2FA)}
                renderTime={renderResendTimer}
                renderButton={renderResendButton}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleVerify2FA}
                className="flex-1 bg-green-600 text-white py-2 cursor-pointer px-4 rounded-md font-semibold hover:bg-green-700 disabled:opacity-50"
                disabled={isProcessing || twoFactorOtp?.toString().length !== 6}
              >
                {isProcessing ? "Verifying..." : "Verify 2FA"}
              </button>
              <button
                onClick={() => {
                  setShow2FAPopup(false);
                  localStorage.removeItem("tempToken");
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md font-semibold hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Toaster position="top-right" />
    </div>
  );
};

export default Login;
