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
        body: ["var(--font-montserrat)", "Montserrat", "sans-serif"],
      },
      colors: {
        brand: {
          gold: "#C9A84C",
          dark: "#0A0A0A",
          cream: "#F5F0E8",
          warmcream: "#F5E6C8",
        },
      },
    },
  },
  plugins: [],
};

export default config;
