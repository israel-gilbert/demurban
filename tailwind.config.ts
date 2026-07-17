import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class', // Add this line
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // This makes 'font-poppins' and 'font-glitch' available everywhere
        poppins: ["var(--font-poppins)", "sans-serif"],
      },
      // Keep your existing color/theme extensions here
    },
  },
  plugins: [],
};
export default config;