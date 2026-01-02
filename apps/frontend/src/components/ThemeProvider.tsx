"use client";

import { createContext, useContext, useEffect } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Force light mode on mount
    const root = document.documentElement;
    root.classList.remove("dark");
    root.classList.add("light");

    // Clear any saved theme preference
    localStorage.removeItem("theme");
  }, []);

  const setTheme = () => {
    // No-op
  };

  return (
    <ThemeContext.Provider
      value={{ theme: "light", setTheme, resolvedTheme: "light" }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
