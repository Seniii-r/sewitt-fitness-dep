import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import RevealOnScroll from "@/components/RevealOnScroll";
import BlogNotificationsPopup from "@/components/BlogNotificationsPopup";
import MetaPixel from "@/components/MetaPixel";
import {
  SITE_URL,
  SITE_NAME,
  CALENDLY_URL,
  INSTAGRAM_URL,
  TWITTER_URL,
  TIKTOK_URL,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Sewitt Fitness — Personal Training in Mississauga & Toronto",
  description:
    "A complete coaching experience, not just workouts. Structured personal training with Christopher Sewitt, GTA-based.",
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  openGraph: {
    title: "Sewitt Fitness",
    description:
      "A complete coaching experience, not just workouts. GTA-based personal training.",
    url: SITE_URL,
    siteName: "Sewitt Fitness",
    type: "website",
  },
};

// Structured data. The SiteNavigationElement nodes describe the main nav so
// Google has an explicit signal for the links shown in search. (Sitelinks are
// generated algorithmically and can't be forced — this is a best-effort hint
// alongside the sitemap and the crawlable <a> links in the header/footer.)
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Sewitt Fitness",
      url: SITE_URL,
      logo: `${SITE_URL}/images/Sewitt_logo.png`,
      sameAs: [INSTAGRAM_URL, TIKTOK_URL, TWITTER_URL],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    ...[
      { name: "Home", url: `${SITE_URL}/#home` },
      { name: "Coaching Experience", url: `${SITE_URL}/#coaching-experience` },
      { name: "How It Works", url: `${SITE_URL}/#how-it-works` },
      { name: "Testimonials", url: `${SITE_URL}/#testimonials` },
      { name: "FAQ", url: `${SITE_URL}/#faq` },
      { name: "Book Free Intro Session", url: CALENDLY_URL },
    ].map((item, i) => ({
      "@type": "SiteNavigationElement",
      position: i + 1,
      name: item.name,
      url: item.url,
    })),
  ],
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
        <MetaPixel />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
        <RevealOnScroll />
        <BlogNotificationsPopup />
      </body>
    </html>
  );
}
