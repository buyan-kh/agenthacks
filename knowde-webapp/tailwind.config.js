/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        "kn-primary": "#6B73FF",
        "kn-secondary": "#A8B3FF",
        "kn-accent": "#FF6B9D",
        "kn-surface": "#F8F9FF",
        "kn-background": "#FFFFFF",
        "kn-text": "#1A1D29",
        "kn-text-secondary": "#6B7280",
        "kn-border": "#E5E7EB",
        "kn-success": "#10B981",
        "kn-warning": "#F59E0B",
        "kn-error": "#EF4444",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "kn-sm": "0 1px 2px 0 rgba(107, 115, 255, 0.05)",
        kn: "0 4px 6px -1px rgba(107, 115, 255, 0.1)",
        "kn-lg": "0 10px 15px -3px rgba(107, 115, 255, 0.1)",
        "kn-xl": "0 20px 25px -5px rgba(107, 115, 255, 0.1)",
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-in-out",
        slideInUp: "slideInUp 0.3s ease-out",
        "pulse-soft": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideInUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
