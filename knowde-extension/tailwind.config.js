/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/*.html"],
  theme: {
    extend: {
      colors: {
        "kn-sapphire": "#404BD9",
        "kn-aqua": "#60C2DA",
        "kn-coral": "#C63250",
        "kn-sand": "#D89A53",
        "kn-cloud": "#E5E3E6",
        "kn-ink": "#1A1D29",
        "kn-ink-light": "#48506A",
        "kn-white": "#FFFFFF",
      },
      fontFamily: {
        "space-grotesk": ["Space Grotesk", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        jetbrains: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        kn: "0 4px 12px rgba(24, 28, 44, 0.12)",
        "kn-lg": "0 8px 24px rgba(24, 28, 44, 0.24)",
      },
    },
  },
  plugins: [],
};
