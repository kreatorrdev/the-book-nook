export const siteOrigin = "https://the-book-nook-wine.vercel.app";
export const siteDescription = "Enter a Gothic sanctuary for the written word. Discover enduring stories, keep a personal library, and find a quiet place for your thoughts.";
export const socialImage = { url: "/social-preview.jpg", width: 1200, height: 630, alt: "The Book Nook — a Gothic library lit by daylight and warm reading lamps" };

export function publicMetadata(title: string, description: string, pathname: string) {
  return {
    title,
    description,
    alternates: { canonical: pathname },
    openGraph: { title, description, url: pathname, siteName: "The Book Nook", type: "website" as const, images: [socialImage] },
    twitter: { card: "summary_large_image" as const, title, description, images: [socialImage.url] },
  };
}
