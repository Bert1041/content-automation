import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#141413",
          light: "#faf9f5",
          orange: "#d97757",
          grey: "#b0aea5",
          "light-grey": "#e8e6dc",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        heading: ["Poppins", "Arial", "sans-serif"],
        body: ["Lora", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
