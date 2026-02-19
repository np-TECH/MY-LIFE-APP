import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 12px 40px rgba(0,0,0,0.45)",
        bloom: "0 18px 60px rgba(0,0,0,0.55)",
      },
      backgroundImage: {
        accent: "linear-gradient(90deg, rgba(124,58,237,0.22), rgba(34,211,238,0.18))",
        "accent-strong": "linear-gradient(90deg, rgba(124,58,237,0.35), rgba(34,211,238,0.28))",
      },
    },
  },
  plugins: [],
};

export default config;
