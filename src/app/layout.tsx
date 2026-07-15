import type { Metadata } from "next";
import { Inter, Oswald, Playfair_Display } from "next/font/google"; // 1. Imported Playfair Display
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
});

// 2. Configured the editorial font family with deep weights for high-fashion display text
const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["700", "800", "900"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "DEMURBAN | Where Taste Meets Identity",
  description: "Home of the DEM Lifestyle. Premium urban streetwear for everyone.",
  keywords: ["streetwear", "urban fashion", "DEM lifestyle", "premium clothing"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    /* 3. Injected the playfair variable class here */
    <html lang="en" className={`${inter.variable} ${oswald.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
              try {
                const saved = localStorage.getItem('theme');
                const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                const theme = saved === 'light' || saved === 'dark' ? saved : (prefersDark ? 'dark' : 'light');
                if (theme === 'dark') document.documentElement.classList.add('dark');
                else document.documentElement.classList.remove('dark');
              } catch (_) {}
            })();`,
          }}
        />
      </head>
      <body className="min-h-dvh bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50 antialiased font-sans">
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}