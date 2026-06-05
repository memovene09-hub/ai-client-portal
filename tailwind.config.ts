import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#142051",
        "navy-deep": "#0F1A43",
        card: "#1C1C1C",
        "claryon-border": "#1E2D5A",
        "text-secondary": "#CBD5E1",
        purple: {
          DEFAULT: "#8B35A8",
          hover: "#9B41B9",
          deep: "#5B2E8A",
          light: "#C77AE0",
        },
        lavender: "#C99BE0",
        "lavender-soft": "#B8A8D4",
        "agent-bubble": "#1E2D5A",
        ready: "#34D399",
        ink: "#18181B",
      },
      fontFamily: {
        sans: ["var(--font-sora)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
      },
      keyframes: {
        blink: {
          "0%, 80%, 100%": { opacity: "0.25", transform: "translateY(0)" },
          "40%": { opacity: "1", transform: "translateY(-3px)" },
        },
        pop: {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        blink: "blink 1.3s infinite ease-in-out both",
        pop: "pop 0.22s ease",
      },
      boxShadow: {
        "agent-card": "0 22px 50px -28px rgba(0,0,0,0.65)",
        cta: "0 8px 20px -8px rgba(139, 53, 168, 0.7)",
        "cta-hover": "0 12px 26px -8px rgba(139, 53, 168, 0.8)",
        "login-card":
          "inset 0 1px 0 rgba(255,255,255,0.04), 0 24px 60px -22px rgba(0,0,0,0.7)",
      },
    },
  },
  plugins: [],
};
export default config;
