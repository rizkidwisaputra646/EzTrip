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
        brand: {
          navy: "#0F172A",
          azure: "#0284C7",
          "azure-light": "#E0F2FE",
          orange: "#EA580C",
          "orange-light": "#FFEDD5",
          green: "#16A34A",
          "green-dark": "#0D652D",
          "green-light": "#DCFCE7",
        },
        surface: {
          canvas: "#F8FAFC",
          card: "#FFFFFF",
          elevated: "#F1F5F9",
        },
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "system-ui", "-apple-system", "sans-serif"],
        editorial: ["var(--font-fraunces)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
