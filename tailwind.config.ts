import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-cormorant)", "Cormorant Garamond", "serif"],
        body: ["var(--font-dm-sans)", "DM Sans", "sans-serif"],
      },
      colors: {
        brand: {
          gold: "#C9A84C",
          "gold-light": "#E8C97A",
          dark: "#0A0A0A",
          cream: "#F5F0E8",
          warmcream: "#F5E6C8",
          charcoal: "#2A2A2A",
          gray: "#9A9A8A",
        },
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "gold-shimmer": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s ease-out forwards",
        "fade-up-delay-1": "fade-up 0.8s ease-out 0.2s forwards",
        "fade-up-delay-2": "fade-up 0.8s ease-out 0.4s forwards",
        "fade-up-delay-3": "fade-up 0.8s ease-out 0.6s forwards",
        "fade-in": "fade-in 1s ease-out forwards",
        "gold-shimmer": "gold-shimmer 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
