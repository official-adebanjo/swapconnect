// components/OtpVerificationModal.tsx
"use client";

import React from "react";
import { OTPInput, ResendOTP } from "otp-input-react";
import {
  renderResendTimer,
  renderResendButton,
} from "@/components/auth/OtpRenderers";
import Button from "@/components/ui/Button";
import { X, Lock, ShieldCheck, RefreshCw } from "lucide-react";

interface OtpVerificationModalProps {
  email: string;
  otp: string;
  isProcessing: boolean;
  onClose: () => void;
  onChange: (val: string) => void;
  onVerify: () => void;
  onResend: () => void;
}

const OtpVerificationModal: React.FC<OtpVerificationModalProps> = ({
  email,
  otp,
  isProcessing,
  onClose,
  onChange,
  onVerify,
  onResend,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 relative w-11/12 max-w-sm animate-fadeInScale">
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-2 right-2 text-2xl text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          &times;
        </button>
        <div className="text-center mb-4">
          <div className="w-12 h-12 mx-auto bg-blue-600 rounded-full flex items-center justify-center mb-2">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h5 className="font-bold text-lg text-gray-800 mb-1">
            Verify your email
          </h5>
          <p className="text-gray-500 text-sm">
            Enter the 6-digit code sent to {email}
          </p>
        </div>

        <OTPInput
          value={otp}
          onChange={onChange}
          autoFocus
          OTPLength={6}
          otpType="number"
          disabled={isProcessing}
          inputClassName="!w-10 !h-10 sm:!w-12 sm:!h-12 !text-lg !mx-1 sm:!mx-2 !rounded-lg !border !border-gray-300 !bg-gray-50 focus:!border-blue-500 focus:!ring-blue-500 focus:!outline-none"
          containerClassName="flex justify-center mb-4"
        />

        <div className="text-center mb-4">
          <ResendOTP
            onResend={onResend}
            renderTime={renderResendTimer}
            renderButton={(props) =>
              renderResendButton({
                ...props,
                disabled: props.disabled || isProcessing,
              })
            }
          />
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onVerify}
            disabled={isProcessing || otp.length < 6}
            variant="primary"
            className="flex-1 h-12 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Verifying
              </>
            ) : (
              <>
                <ShieldCheck className="h-5 w-5" />
                Verify OTP
              </>
            )}
          </Button>
          <Button
            onClick={onClose}
            disabled={isProcessing}
            variant="outline-secondary"
            className="px-6 h-12 rounded-xl font-bold"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerificationModal;
