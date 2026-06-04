import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          pink: "#D93060",
          "pink-glow": "#f0477a",
          "pink-dark": "#a82248",
          amber: "#c9a84c",
        },
        dark: {
          DEFAULT: "#0a0a0a",
          secondary: "#111111",
          elevated: "#1A1A1A",
          border: "#2a2a2a",
        },
        muted: "#a89f94",
      },
      fontFamily: {
        display: ["var(--font-bebas)", "Impact", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        playfair: ["var(--font-playfair)", "Georgia", "serif"],
        imfell: ["var(--font-imfell)", "Georgia", "serif"],
        metal: ["var(--font-metal)", "Impact", "sans-serif"],
      },
      animation: {
        flicker: "flicker 3s linear infinite",
        "flicker-slow": "flicker 5s linear infinite",
        "slide-up": "slideUp 0.5s ease-out",
        "fade-in": "fadeIn 0.4s ease-out",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
      },
      keyframes: {
        flicker: {
          "0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%": { opacity: "1" },
          "20%, 24%, 55%": { opacity: "0.4" },
        },
        slideUp: {
          from: { transform: "translateY(20px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 10px #E8189A, 0 0 30px #E8189A44" },
          "50%": { boxShadow: "0 0 20px #E8189A, 0 0 60px #E8189A66" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-neon":
          "linear-gradient(135deg, #E8189A22 0%, transparent 60%)",
      },
      screens: {
        xs: "375px",
      },
    },
  },
  plugins: [],
};

export default config;
