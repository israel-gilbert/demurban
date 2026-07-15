import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
   // tailwind.config.js
extend: {
  fontFamily: {
    sans: ["var(--font-inter)", "sans-serif"],
    oswald: ["var(--font-oswald)", "sans-serif"], // mapped if you use it for accents
    serif: ["var(--font-serif)", "serif"],        // mapped to your new Playfair configuration
  },
},
  },
  plugins: [],
} satisfies Config;