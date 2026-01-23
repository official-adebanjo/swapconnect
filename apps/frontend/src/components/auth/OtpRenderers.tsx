"use client";

import React from "react";
import { cn } from "@/lib/utils";

/**
 * Shared renderer for the OTP resend timer.
 * Designed with premium aesthetics and theme variables.
 */
export const renderResendTimer = (props: { remainingTime: number }) => {
  const { remainingTime } = props;

  return (
    <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.15em]">
      {remainingTime > 0 ? (
        <span className="flex items-center gap-1.5">
          Resend in
          <span className="text-brand-primary tabular-nums animate-pulse">
            {remainingTime}s
          </span>
        </span>
      ) : (
        "Didn't receive code?"
      )}
    </span>
  );
};

/**
 * Shared renderer for the OTP resend button.
 * Designed with premium aesthetics and theme variables.
 */
export const renderResendButton = (props: {
  onClick: () => void;
  disabled: boolean;
}) => {
  const { onClick, disabled } = props;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "ml-1 text-[10px] font-black text-brand-primary uppercase tracking-[0.15em]",
        "hover:text-brand-primary-hover transition-colors duration-200",
        "underline decoration-brand-primary/30 underline-offset-4 decoration-2",
        "hover:decoration-brand-primary disabled:opacity-30 disabled:no-underline disabled:cursor-not-allowed",
      )}
    >
      Resend Now
    </button>
  );
};
