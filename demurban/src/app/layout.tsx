import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
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
  description: "Home of the DEM Lifestyle. Premium urban streetwear for Men, Women, and Kids.",
  keywords: ["streetwear", "urban fashion", "DEM lifestyle", "premium clothing"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable}`}>
      <body className="min-h-dvh bg-background text-foreground antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
