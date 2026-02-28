import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnnouncementTicker from "@/components/AnnouncementTicker";

const announcements = [
  { id: "1", text: "Free shipping on orders over ₦50,000", href: "/shop" },
];

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AnnouncementTicker messages={announcements} />
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}
