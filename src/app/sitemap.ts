import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // The bounded editorial entry points link to every available public book.
  // Reader destinations and filter combinations are intentionally omitted.
  return [{ url: siteOrigin, priority: 1 }, { url: `${siteOrigin}/discover`, priority: 0.8 }];
}
