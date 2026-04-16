import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        trobuso: {
          900: "#163E5C",
          800: "#1f5a85",
          700: "#2874a6",
        },
      },
    },
  },
  plugins: [],
};

export default config;
