"use client";

import React, { useState, useEffect, useRef } from "react"; // Import useRef
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// No need to import toast here if parent handles it

import OtpInputs from "@/components/OtpInputs"; // Adjust this path if OtpInputs is elsewhere

// 2. Define Validation Schema for OTP Form
const otpSchema = yup.object().shape({
  otp: yup
    .string()
    .required("OTP is required")
    .min(6, "OTP must be 6 digits")
    .max(6, "OTP must be 6 digits"),
});

type OtpFormInputs = yup.InferType<typeof otpSchema>;

interface OtpVerificationModalProps {
  onVerify: (otp: string) => Promise<void>;
  onCancel: () => void;
  onResend: () => Promise<void>;
}

const OtpVerificationModal: React.FC<OtpVerificationModalProps> = ({
  onVerify,
  onCancel,
  onResend,
}) => {
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null); // Use useRef to manage the timer ID

  const {
    control,
    handleSubmit,
    reset, // Use reset to clear OTP when modal opens or closes
    formState: { errors },
  } = useForm<OtpFormInputs>({
    resolver: yupResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  // Function to start or restart the timer
  const startResendTimer = () => {
    setRemainingTime(60);
    setCanResend(false); // Cannot resend while timer is running

    // Clear any existing timer to prevent multiple timers running
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current!); // Use ! as we know it's not null here
          setCanResend(true); // Allow resend after timer expires
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    // Reset OTP input and start timer when modal opens/mounts
    reset({ otp: "" });
    startResendTimer();

    return () => {
      // Cleanup timer on unmount (modal closes)
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [reset]); // Depend on reset to re-run when modal state implies reset

  const onSubmit: SubmitHandler<OtpFormInputs> = async (data) => {
    setIsVerifying(true);
    try {
      await onVerify(data.otp);
      // If onVerify succeeds, the parent component will handle closing the modal
    } finally {
      setIsVerifying(false); // Ensure state is reset even if parent doesn't close immediately
    }
  };

  const handleResendClick = async () => {
    if (canResend) {
      // Optimistically disable resend and start timer
      setCanResend(false);
      startResendTimer(); // Restart the timer
      try {
        await onResend();
      } catch (error) {
        // If onResend fails, re-enable resend and stop the current timer if desired
        // Or let the timer run out if the parent toast handles feedback
        console.error("OTP resend failed in modal:", error);
        // Optionally, if you want to immediately allow resend on error:
        // setCanResend(true);
        // if (timerRef.current) clearInterval(timerRef.current);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-xl shadow-lg p-6 relative w-11/12 max-w-sm animate-fadeInScale">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
          onClick={onCancel}
          disabled={isVerifying}
          aria-label="Close"
        >
          &times;
        </button>
        <div className="text-center mb-4">
          <div className="w-12 h-12 mx-auto mb-2 bg-green-600 rounded-full flex items-center justify-center">
            {/* Assuming you have Bootstrap Icons or similar, otherwise replace with an actual icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-shield-check text-white"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              <path d="m9 12 2 2 4-4" />
            </svg>{" "}
            {/* Example: Replaced <i> with a simple SVG icon for better compatibility */}
          </div>
          <h5 className="font-bold text-lg text-gray-800 mb-1">
            Verify your phone
          </h5>
          <small className="text-gray-500">
            Enter the 6-digit code sent to your phone
          </small>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <OtpInputs
            name="otp"
            control={control}
            length={6}
            containerClassName="flex justify-center mb-4"
          />
          {errors.otp && (
            <p className="text-red-500 text-xs mt-1 text-center">
              {errors.otp.message}
            </p>
          )}

          <div className="text-center mb-4">
            <span className="text-sm text-gray-500">
              {remainingTime > 0
                ? `Resend OTP in ${remainingTime}s`
                : "Didn't receive code?"}
            </span>
            <button
              onClick={handleResendClick}
              disabled={!canResend || isVerifying} // Disable if not canResend or currently verifying
              className={`ml-2 text-blue-600 hover:underline text-sm font-medium ${
                !canResend || isVerifying ? "opacity-50 cursor-not-allowed" : ""
              }`}
              type="button"
            >
              Resend
            </button>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-grow bg-green-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-green-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={isVerifying}
            >
              {isVerifying ? (
                <span className="flex items-center">
                  <span className="animate-spin h-4 w-4 mr-2 border-b-2 border-white rounded-full"></span>
                  Verifying...
                </span>
              ) : (
                "Verify OTP"
              )}
            </button>
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md font-semibold hover:bg-gray-300 transition duration-200"
              onClick={onCancel}
              type="button"
              disabled={isVerifying}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OtpVerificationModal;
