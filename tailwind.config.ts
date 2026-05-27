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
        // El Mesón brand palette
        brand: {
          pink: "#E8189A",
          "pink-glow": "#FF40B8",
          "pink-dark": "#A01068",
          amber: "#FF8C00",
        },
        dark: {
          DEFAULT: "#0A0A0A",
          secondary: "#111111",
          elevated: "#1A1A1A",
          border: "#2A2A2A",
        },
        muted: "#6B6B6B",
      },
      fontFamily: {
        display: ["var(--font-bebas)", "Impact", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
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
