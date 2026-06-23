import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import RevealOnScroll from "@/components/RevealOnScroll";
import BlogNotificationsPopup from "@/components/BlogNotificationsPopup";

export const metadata: Metadata = {
  title: "Sewitt Fitness — Personal Training in Mississauga & Toronto",
  description:
    "A complete coaching experience, not just workouts. Structured personal training with Christopher Sewitt, GTA-based.",
  metadataBase: new URL("https://www.sewittfitness.ca"),
  openGraph: {
    title: "Sewitt Fitness",
    description:
      "A complete coaching experience, not just workouts. GTA-based personal training.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      {/* Plausible analytics placeholder — Plausible script tag goes here, managed by The Ikigai Project. */}
      <body className="min-h-full flex flex-col bg-[--color-onyx] text-[--color-smoke]">
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
        <RevealOnScroll />
        <BlogNotificationsPopup />
      </body>
    </html>
  );
}
