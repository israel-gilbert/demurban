import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import { ThemeProvider } from "@/providers/ThemeProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
});

export const metadata: Metadata = {
  title: "DEMURBAN | Where Taste Meets Identity",
  description: "Home of the DEM Lifestyle. Premium urban streetwear for everyone.",
  keywords: ["streetwear", "urban fashion", "DEM lifestyle", "premium clothing"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable}`} suppressHydrationWarning>
      <body className="min-h-dvh bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50 antialiased font-sans">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
<head>
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
