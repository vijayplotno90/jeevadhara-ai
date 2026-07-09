import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "farm-green": "#1B4332",
        "farm-gold": "#C9A227",
        "farm-orange": "#D97706",
      },
      fontFamily: {
        heading: ["Merriweather", "serif"],
        serif: ["Merriweather", "serif"],
        body: ["Inter", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 8px rgba(15, 23, 42, 0.06)",
        card: "0 8px 24px rgba(15, 23, 42, 0.10)",
        glow: "0 12px 40px rgba(27, 67, 50, 0.18)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(circle, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;
