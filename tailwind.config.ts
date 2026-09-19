import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1B1410",
        paper: "#F1E6D0",
        paperlight: "#F8F2E4",
        maroon: {
          DEFAULT: "#7A1F2B",
          dark: "#5A1520",
          light: "#93313E",
        },
        marigold: {
          DEFAULT: "#E2A63B",
          light: "#EFC271",
        },
        rosedust: "#C98A8F",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-manrope)", "sans-serif"],
      },
      maxWidth: {
        prose: "68ch",
      },
    },
  },
  plugins: [],
};

export default config;
