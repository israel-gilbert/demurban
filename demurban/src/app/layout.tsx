import type { Metadata } from "next";
import "./globals.css";
import AnnouncementTicker from "@/components/AnnouncementTicker";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "DemUrban",
  description: "Minimal fashion storefront with Paystack checkout",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-white text-zinc-950 antialiased">
        <AnnouncementTicker
          messages={[
            { id: "1", text: "DemUrban — clean pieces, strong identity", href: "/shop" },
            { id: "2", text: "New arrivals — shop now", href: "/shop?collection=new" },
          ]}
        />
        <Header />
        <main className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
