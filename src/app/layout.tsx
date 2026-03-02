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
  description: "Home of the DEM Lifestyle. Premium urban streetwear for everyone (unisex).",
  keywords: ["streetwear", "urban fashion", "DEM lifestyle", "premium clothing"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable}`} suppressHydrationWarning>
      <head>
        {/*
          Prevent theme flash (FOUC): set html.light before React hydrates.
          Dark theme is default (no class). Light theme uses html.light.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
  try {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved === 'light' || saved === 'dark' ? saved : (prefersDark ? 'dark' : 'light');
    if (theme === 'light') document.documentElement.classList.add('light');
    else document.documentElement.classList.remove('light');
  } catch (_) {}
})();`,
          }}
        />
      </head>
      <body className="min-h-dvh bg-background text-foreground antialiased font-sans">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
