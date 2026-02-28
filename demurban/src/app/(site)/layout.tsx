import AnnouncementTicker from "@/components/AnnouncementTicker";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const announcementMessages = [
  { id: "1", text: "Free shipping on orders over ₦50,000", href: "/shop" },
];

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AnnouncementTicker messages={announcementMessages} />
      <Header />
      <main className="mx-auto min-h-screen max-w-7xl px-4 md:px-6 lg:px-8">
        {children}
      </main>
      <Footer />
    </>
  );
}
