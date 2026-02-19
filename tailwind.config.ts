import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#040706",
          900: "#070c0a",
          850: "#0a120f",
          800: "#0f1a15",
        },
        sage: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
        },
        neon: {
          green: "#22c55e",
          teal: "#14b8a6",
          lime: "#84cc16",
        },
      },
      boxShadow: {
        glass: "0 20px 60px rgba(0,0,0,0.55)",
        glow: "0 30px 90px rgba(16,185,129,0.16)",
        glowStrong: "0 40px 120px rgba(16,185,129,0.26)",
      },
      keyframes: {
        floatSlow: {
          "0%, 100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(0,-10px,0)" },
        },
        floatMed: {
          "0%, 100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(8px,-12px,0)" },
        },
        drift: {
          "0%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(24px)" },
          "100%": { transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      animation: {
        floatSlow: "floatSlow 8s ease-in-out infinite",
        floatMed: "floatMed 6s ease-in-out infinite",
        drift: "drift 14s ease-in-out infinite",
        shimmer: "shimmer 10s ease-in-out infinite",
      },
      backgroundSize: {
        "200%": "200% 200%",
      },
    },
  },
  plugins: [],
} satisfies Config;
