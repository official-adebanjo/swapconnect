"use client";

import { useEffect } from "react";
import Bugsnag from "@bugsnag/js";
import BugsnagPerformance from "@bugsnag/browser-performance";

export default function BugsnagInitializer() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_BUGSNAG_API_KEY) {
      if (typeof window !== "undefined" && !(window as any).__bugsnag_started) {
        try {
          Bugsnag.start({ apiKey: process.env.NEXT_PUBLIC_BUGSNAG_API_KEY });
          (window as any).__bugsnag_started = true;
        } catch (e) {
          console.error("Bugsnag failed to start", e);
        }
      }
      // BugsnagPerformance doesn't have an _client equivalent, but we can set a flag on window
      if (typeof window !== "undefined" && !(window as any).__bugsnag_perf_started) {
        try {
          BugsnagPerformance.start({ apiKey: process.env.NEXT_PUBLIC_BUGSNAG_API_KEY });
          (window as any).__bugsnag_perf_started = true;
        } catch (e) {
          console.error("Bugsnag Performance failed to start", e);
        }
      }
    }
  }, []);

  return null;
}
