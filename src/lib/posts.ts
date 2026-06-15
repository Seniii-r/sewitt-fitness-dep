// Coaching Insights data — backed by Sanity CMS.
// The `Post` shape is kept stable so the UI components don't need to change;
// only the data source moved from a hardcoded array to Sanity.
import type { PortableTextBlock } from "sanity";

import { client } from "@/sanity/lib/client";
import { isSanityConfigured } from "@/sanity/env";

export type Category = "Training" | "Nutrition" | "Mindset";

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  body: PortableTextBlock[]; // rich text (Portable Text)
  category: Category;
  date: string; // ISO (YYYY-MM-DD)
  readTime: string; // "5 min read"
  image: string; // cover image — resolved CDN URL (post page hero)
  imageAlt?: string;
  thumbnail: string; // card/listing image — falls back to the cover image
  thumbnailAlt?: string;
  thumbnailCaption: string; // card caption — falls back to the excerpt
  featured?: boolean;
};

export const CATEGORIES = ["All", "Training", "Nutrition", "Mindset"] as const;

export const CATEGORY_COLOR: Record<Category, string> = {
  Training: "var(--color-gold)",
  Nutrition: "var(--color-brick)",
  Mindset: "var(--color-smoke)",
};

// Shared projection — keeps the returned shape aligned with `Post`.
const POST_FIELDS = /* groq */ `
  "slug": slug.current,
  title,
  excerpt,
  body,
  category,
  date,
  readTime,
  "image": coalesce(mainImage.asset->url, ""),
  "imageAlt": mainImage.alt,
  "thumbnail": coalesce(thumbnail.asset->url, mainImage.asset->url, ""),
  "thumbnailAlt": coalesce(thumbnail.alt, mainImage.alt),
  "thumbnailCaption": coalesce(thumbnailCaption, excerpt),
  featured
`;

const REVALIDATE = 60; // seconds

export async function getAllPosts(): Promise<Post[]> {
  if (!isSanityConfigured) return [];
  return client.fetch<Post[]>(
    `*[_type == "post" && defined(slug.current)] | order(date desc) { ${POST_FIELDS} }`,
    {},
    { next: { revalidate: REVALIDATE } }
  );
}

export async function getPostSlugs(): Promise<string[]> {
  if (!isSanityConfigured) return [];
  return client.fetch<string[]>(
    `*[_type == "post" && defined(slug.current)].slug.current`,
    {},
    { next: { revalidate: REVALIDATE } }
  );
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  if (!isSanityConfigured) return undefined;
  const post = await client.fetch<Post | null>(
    `*[_type == "post" && slug.current == $slug][0] { ${POST_FIELDS} }`,
    { slug },
    { next: { revalidate: REVALIDATE } }
  );
  return post ?? undefined;
}

export async function getFeaturedPost(): Promise<Post | undefined> {
  const posts = await getAllPosts();
  return posts.find((p) => p.featured) ?? posts[0];
}

export async function getRelatedPosts(
  slug: string,
  limit = 3
): Promise<Post[]> {
  const all = await getAllPosts();
  const current = all.find((p) => p.slug === slug);
  const others = all.filter((p) => p.slug !== slug);
  if (!current) return others.slice(0, limit);
  // Prefer same-category posts, then most recent.
  return others
    .sort((a, b) => {
      const aMatch = a.category === current.category ? 0 : 1;
      const bMatch = b.category === current.category ? 0 : 1;
      return aMatch - bMatch;
    })
    .slice(0, limit);
}

export function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
