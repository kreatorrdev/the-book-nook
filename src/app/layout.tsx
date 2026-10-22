import type { Metadata } from "next";
import "./globals.css";
import "./gothic.css";
import "./book-motion.css";
import "./refined-ui.css";
import { BookJourney } from "@/components/book-journey";
import { siteDescription, siteOrigin, socialImage } from "@/lib/site";
export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: { default: "The Book Nook — A little space for your reading life", template: "%s · The Book Nook" },
  description: siteDescription,
  openGraph: { title: "The Book Nook", description: siteDescription, siteName: "The Book Nook", type: "website", images: [socialImage] },
  twitter: { card: "summary_large_image", title: "The Book Nook", description: siteDescription, images: [socialImage.url] },
  icons: { icon: "/icon.svg" },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" data-scroll-behavior="smooth"><body><BookJourney>{children}</BookJourney></body></html>;
}
