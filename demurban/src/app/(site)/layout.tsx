import AnnouncementTicker from "@/components/AnnouncementTicker";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AnnouncementTicker />
      <Header />
      <main className="mx-auto min-h-screen max-w-7xl px-4 md:px-6 lg:px-8">
        {children}
      </main>
      <Footer />
    </>
  );
}
