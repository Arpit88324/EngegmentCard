import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#FFFDF7",
        marble: "#F7F2E7",
        gold: {
          DEFAULT: "#D4AF37",
          light: "#E8CE7B",
          dark: "#A9832A",
        },
        umber: "#8B5E3C",
        saffron: "#C76B3B",
        burgundy: "#5E1F2A",
        ink: "#2B2B2B",
        beige: "#EFE6D3",
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "serif"],
        eyebrow: ["var(--font-cinzel)", "serif"],
        body: ["var(--font-poppins)", "sans-serif"],
      },
      keyframes: {
        "petal-fall": {
          "0%": { transform: "translateY(-10vh) translateX(0) rotate(0deg)", opacity: "0" },
          "10%": { opacity: "1" },
          "100%": { transform: "translateY(110vh) translateX(40px) rotate(220deg)", opacity: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.55", transform: "scale(1)" },
          "50%": { opacity: "0.9", transform: "scale(1.05)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
      },
      animation: {
        petal: "petal-fall linear forwards",
        shimmer: "shimmer 3.5s linear infinite",
        "glow-pulse": "glow-pulse 4s ease-in-out infinite",
        float: "float-slow 6s ease-in-out infinite",
      },
      backgroundImage: {
        "gold-shimmer":
          "linear-gradient(110deg, transparent 30%, rgba(212,175,55,0.55) 45%, rgba(232,206,123,0.85) 50%, rgba(212,175,55,0.55) 55%, transparent 70%)",
        "radial-glow":
          "radial-gradient(circle at center, rgba(212,175,55,0.25) 0%, rgba(212,175,55,0) 70%)",
      },
    },
  },
  plugins: [],
};

export default config;
