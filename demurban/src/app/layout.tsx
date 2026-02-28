import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import AnnouncementTicker from "@/components/AnnouncementTicker";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
        <AnnouncementTicker
          messages={[
            { id: "1", text: "WHERE TASTE MEETS IDENTITY — Shop the DEM Lifestyle", href: "/shop" },
            { id: "2", text: "FREE SHIPPING on orders over ₦50,000", href: "/shop" },
          ]}
        />
        <Header />
        <main className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
