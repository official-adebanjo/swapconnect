"use client";

import type React from "react";
import { useState, useEffect, useCallback, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaEye, FaEyeSlash, FaCheck } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import dynamic from "next/dynamic";

import CenterCard from "../CenterCard";
import { api } from "@/lib/api";
import { useUserStore } from "@/stores/AuthStore";
import type { AuthUser } from "@/stores/AuthStore";

import { ASSETS } from "@/lib/constants";

// OTP Components
const OTPInput = dynamic(
  () => import("otp-input-react").then((mod) => mod.OTPInput),
  { ssr: false },
);
const ResendOTP = dynamic(
  () => import("otp-input-react").then((mod) => mod.ResendOTP),
  { ssr: false },
);

interface UserData {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  isVerified?: boolean;
  [key: string]: string | number | boolean | null | undefined;
}

interface UserResponse {
  success: boolean;
  firstName?: string;
  uid?: string;
  email?: string;
  id?: string;
  data?: UserData;
  error?: string;
  message?: string;
}

// interface LoginUserArgs {
// uid: string;
// firstName: string;
// email: string;
// [key: string]: string | number | boolean | undefined | null;
// }

const validatePassword = (password: string) => {
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
};

const Signup: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false); // New state for checkbox
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [emailForVerification, setEmailForVerification] = useState("");
  const [otp, setOtp] = useState<number | null>(null);

  const router = useRouter();
  const { loginUser } = useUserStore();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  const passwordValidation = validatePassword(password);
  const isPasswordValid = Object.values(passwordValidation).every(Boolean);

  const handleGoogleSignIn = useCallback(() => {
    if (!isTermsAccepted) {
      toast.error("You must accept the terms and privacy policy to continue.");
      return;
    }

    toast.loading("Redirecting to Google...", { id: "google-redirect" });
    try {
      window.location.href = `${backendUrl}/auth/google/register`;
    } catch (error) {
      console.error("Error initiating Google sign-in redirect:", error);
      toast.error("Failed to start Google sign-up. Please try again.", {
        id: "google-redirect",
      });
    }
  }, [backendUrl, isTermsAccepted]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error) {
      router.replace("/signup");
      return;
    }

    if (token) {
      toast.loading("Finalizing Google sign-up...", { id: "google-auth" });
      localStorage.setItem("authToken", token);

      const fetchUserData = async () => {
        try {
          const userResponse = await api.get<UserResponse>("/auth/me", token);

          if (userResponse.success && userResponse.data) {
            const data = userResponse.data as unknown as AuthUser;
            const user: AuthUser = {
              id: Number(data.id) || 0,
              firstName: data.firstName || "",
              lastName: data.lastName || "",
              email: data.email || "",
              phone: typeof data.phone === "string" ? data.phone : null,
              role: typeof data.role === "string" ? data.role : "",
              verified: Boolean(data.verified),
              suspended: Boolean(data.suspended),
              suspensionReason:
                typeof data.suspensionReason === "string"
                  ? data.suspensionReason
                  : null,
              createdAt:
                typeof data.createdAt === "string" ? data.createdAt : "",
              updatedAt:
                typeof data.updatedAt === "string" ? data.updatedAt : "",
              address: typeof data.address === "string" ? data.address : null,
              accountNumber:
                typeof data.accountNumber === "string"
                  ? data.accountNumber
                  : null,
              bankName:
                typeof data.bankName === "string" ? data.bankName : null,
              bankCode:
                typeof data.bankCode === "string" ? data.bankCode : null,
              uid: typeof data.uid === "string" ? data.uid : null,
              walletId:
                typeof data.walletId === "string" ||
                typeof data.walletId === "number"
                  ? data.walletId
                  : "",
              referralCode:
                typeof data.referralCode === "string"
                  ? data.referralCode
                  : null,
              // Optional frontend fields
              displayName:
                typeof data.displayName === "string" ? data.displayName : null,
              photoURL:
                typeof data.photoURL === "string" ? data.photoURL : null,
              avatar: typeof data.avatar === "string" ? data.avatar : null,
            };

            loginUser(user, token);
            toast.success("Signed up with Google successfully!", {
              id: "google-auth",
            });
            router.replace("/dashboard");
          } else {
            throw new Error(userResponse.error || "Failed to fetch user data.");
          }
        } catch (err: unknown) {
          const errorMessage =
            err instanceof Error ? err.message : "An unknown error occurred.";
          console.error("Error fetching user data after Google sign-up:", err);
          toast.error(`Failed to complete Google sign-up: ${errorMessage}`, {
            id: "google-auth",
          });
          router.replace("/signup");
        }
      };

      fetchUserData();
    }
  }, [loginUser, router]);

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
        toast.success("Email verified successfully! You can now login.", {
          id: "verify",
        });
        setShowOtpPopup(false);
        setTimeout(() => router.push("/login"), 1500);
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

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      if (!isTermsAccepted) {
        toast.error(
          "You must accept the terms and privacy policy to continue.",
        );
        return;
      }

      if (!isPasswordValid) {
        toast.error("Password does not meet the required criteria.", {
          id: "signup-toast",
        });
        return;
      }

      setIsProcessing(true);
      toast.loading("Creating account...", { id: "signup-toast" });

      try {
        const res = await fetch(`${backendUrl}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firstName, lastName, email, password }),
        });
        const data = await res.json();

        if (res.status === 201 && data.user) {
          toast.success(
            "Account created successfully! Please verify your email.",
            {
              id: "signup-toast",
            },
          );
          setEmailForVerification(email);
          setShowOtpPopup(true);
        } else {
          toast.error(
            data.message?.includes("already exists")
              ? "Account with this email already exists. Please login."
              : data.message || "Account creation failed.",
            { id: "signup-toast" },
          );
        }
      } catch {
        toast.error("A network error occurred. Please try again.", {
          id: "signup-toast",
        });
      } finally {
        setIsProcessing(false);
      }
    },
    [
      firstName,
      lastName,
      email,
      password,
      backendUrl,
      isPasswordValid,
      isTermsAccepted,
    ],
  );

  const inputClass =
    "w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 focus:outline-none disabled:bg-gray-200";

  const renderResendTimer = (props?: { remainingTime?: number }) => {
    const remaining = props?.remainingTime ?? 0;

    return (
      <span className="text-sm text-gray-500">
        {remaining > 0 ? `Resend OTP in ${remaining}s` : "Didn't receive code?"}
      </span>
    );
  };

  const renderResendButton = (props?: {
    onClick?: () => void;
    disabled?: boolean;
  }) => {
    const onClick = props?.onClick ?? (() => {});
    const disabled = props?.disabled ?? false;

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className="text-blue-600 hover:underline text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Resend
      </button>
    );
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100 p-4 overflow-hidden">
      <CenterCard
        leftImageSrc={ASSETS.SIGNUP_IMG}
        leftImageAlt="Signup Illustration"
        leftLogoSrc={ASSETS.FULL_LOGO_TRANS}
      >
        <h4 className="text-2xl font-bold text-gray-800 mb-2">
          Create Account
        </h4>
        <p className="text-sm text-gray-600 mb-6">
          Setup your account on Swapconnect to get started
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={inputClass}
              required
              disabled={isProcessing}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={inputClass}
              required
              disabled={isProcessing}
            />
          </div>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            required
            disabled={isProcessing}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md pr-10 disabled:bg-gray-200"
              required
              disabled={isProcessing}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <ul className="flex flex-col md:flex-row flex-wrap gap-2 text-xs text-left">
            <li
              className={`flex items-center gap-1 ${
                passwordValidation.length ? "text-green-600" : "text-red-500"
              }`}
            >
              {passwordValidation.length && <FaCheck />} Minimum 8 characters
            </li>
            <li
              className={`flex items-center gap-1 ${
                passwordValidation.uppercase ? "text-green-600" : "text-red-500"
              }`}
            >
              {passwordValidation.uppercase && <FaCheck />} At least one
              uppercase letter
            </li>
            <li
              className={`flex items-center gap-1 ${
                passwordValidation.lowercase ? "text-green-600" : "text-red-500"
              }`}
            >
              {passwordValidation.lowercase && <FaCheck />} At least one
              lowercase letter
            </li>
            <li
              className={`flex items-center gap-1 ${
                passwordValidation.number ? "text-green-600" : "text-red-500"
              }`}
            >
              {passwordValidation.number && <FaCheck />} At least one number
            </li>
            <li
              className={`flex items-center gap-1 ${
                passwordValidation.special ? "text-green-600" : "text-red-500"
              }`}
            >
              {passwordValidation.special && <FaCheck />} At least one special
              character
            </li>
          </ul>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="terms"
              checked={isTermsAccepted}
              onChange={(e) => setIsTermsAccepted(e.target.checked)}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              I agree to the{" "}
              <Link href="/terms" className="text-green-600 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy-policy"
                className="text-green-600 hover:underline"
              >
                Privacy Policy
              </Link>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
            disabled={isProcessing || !isPasswordValid || !isTermsAccepted}
          >
            {isProcessing ? (
              <span className="flex items-center">
                <span className="animate-spin h-4 w-4 mr-2 border-b-2 border-white rounded-full"></span>
                Processing...
              </span>
            ) : (
              "Create Account"
            )}
          </button>

          <div className="relative flex justify-center items-center my-4">
            <div className="grow border-t border-gray-300"></div>
            <span className="shrink mx-4 text-gray-500 text-sm">or</span>
            <div className="grow border-t border-gray-300"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center cursor-pointer justify-center border border-gray-300 bg-white text-gray-700 py-2 px-4 rounded-md font-semibold hover:bg-gray-100 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isProcessing || !isTermsAccepted}
          >
            <Image
              src={ASSETS.GOOGLE_ICON}
              alt="Google logo"
              width={20}
              height={20}
              className="mr-2"
            />
            Connect with Google
          </button>
        </form>

        <p className="mt-4 text-xs text-gray-600 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </CenterCard>

      {/* OTP Verification Popup */}
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

      <Toaster position="top-right" />
    </div>
  );
};

export default Signup;
