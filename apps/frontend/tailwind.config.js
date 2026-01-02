/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./stores/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "Nunito", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "page-bg": "var(--page-bg)",
        "card-bg": "var(--card-bg)",
        "border-color": "var(--border)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
        "brand-primary": "var(--brand-primary)",
        "brand-primary-hover": "var(--brand-primary-hover)",
        "brand-light": "var(--brand-light)",
        "brand-lighter": "var(--brand-lighter)",
      },
    },
  },
  plugins: [],
};
