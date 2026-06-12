import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-syne)", "sans-serif"],
        mono: ["var(--font-dm-mono)", "monospace"],
      },
      colors: {
        bg: {
          primary:   "#0a0a0f",
          secondary: "#111118",
          card:      "#16161f",
          border:    "rgba(255,255,255,0.08)",
        },
        brand: {
          DEFAULT: "#7b5cf0",
          light:   "#a78bfa",
          dark:    "#5b3fd4",
          glow:    "rgba(123,92,240,0.15)",
        },
        text: {
          primary:   "#f0eeff",
          secondary: "#a09ec0",
          muted:     "rgba(232,230,240,0.35)",
        },
      },
      borderRadius: {
        card: "14px",
      },
      animation: {
        "bar-rise": "barRise 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards",
        "fade-in":  "fadeIn 0.4s ease forwards",
      },
      keyframes: {
        barRise: {
          from: { transform: "scaleY(0)", opacity: "0" },
          to:   { transform: "scaleY(1)", opacity: "1" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(6px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
