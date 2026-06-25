import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";
import { getPostSlugs } from "@/lib/posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/coaching-insights`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // Include each published Coaching Insights post. getPostSlugs() returns []
  // when Sanity isn't configured; guard against fetch errors so a CMS hiccup
  // never breaks the build/sitemap.
  let postRoutes: MetadataRoute.Sitemap = [];
  try {
    const slugs = await getPostSlugs();
    postRoutes = slugs.map((slug) => ({
      url: `${SITE_URL}/coaching-insights/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));
  } catch {
    // Sanity unavailable — fall back to the static routes only.
  }

  return [...staticRoutes, ...postRoutes];
}
