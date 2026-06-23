import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import {
  CATEGORY_COLOR,
  formatDate,
  getPostBySlug,
  getPostSlugs,
  getRelatedPosts,
} from "@/lib/posts";
import { CALENDLY_URL } from "@/lib/site";
import PostCard from "@/components/blog/PostCard";
import BlogSubscribe from "@/components/BlogSubscribe";

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found — Sewitt Fitness" };
  return {
    title: `${post.title} — Coaching Insights — Sewitt Fitness`,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(slug, 3);

  return (
    <>
      <article>
        {/* Header */}
        <header className="bg-onyx pt-32 md:pt-36 pb-12">
          <div className="container-x max-w-[820px]">
            <Link
              href="/coaching-insights"
              className="inline-block text-brick text-[13px] font-bold mb-8 hover:opacity-80"
            >
              ← Coaching Insights
            </Link>
            <div
              className="label-mono-sm mb-5"
              style={{ color: CATEGORY_COLOR[post.category] }}
            >
              {post.category.toUpperCase()}
            </div>
            <h1 className="h-display text-[40px] md:text-[48px] text-smoke leading-[1.05] mb-6">
              {post.title}
            </h1>
            <div className="text-[14px] text-smoke/55">
              By Chris Sewitt · {formatDate(post.date)} · {post.readTime}
            </div>
          </div>
        </header>

        {/* Hero image */}
        <div className="bg-onyx-2">
          <div className="container-x">
            <div
              className="relative w-full overflow-hidden bg-onyx"
              style={{ maxHeight: 480 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.image}
                alt={post.imageAlt ?? ""}
                className="w-full h-full object-cover"
                style={{ maxHeight: 480 }}
                loading="eager"
              />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="bg-onyx">
          <div className="container-x py-16 md:py-24">
            <div className="prose-post max-w-[680px] mx-auto space-y-6 text-smoke/90 text-[17px] md:text-[18px] leading-[1.7]">
              <PortableText value={post.body} />
            </div>
          </div>
        </div>
      </article>

      {/* Join my newsletter */}
      <section className="bg-onyx">
        <div className="container-x max-w-[820px] pb-16 md:pb-20">
          <BlogSubscribe source="blog_post" />
        </div>
      </section>

      {/* End-of-post CTA */}
      <section className="bg-brick">
        <div className="container-x py-16 md:py-20 text-center">
          <h2 className="h-display text-[32px] md:text-[40px] text-smoke mb-4">
            Want this applied to your training?
          </h2>
          <p className="text-[16px] text-smoke/85 max-w-[560px] mx-auto mb-8">
            Book a Free Intro Assessment. We&rsquo;ll talk through your goals and
            outline whether ongoing coaching is the right fit.
          </p>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            Book Free Intro Session
          </a>
        </div>
      </section>

      {/* More posts */}
      {related.length > 0 && (
        <section className="bg-onyx-2 section">
          <div className="container-x">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="label-mono text-gold">MORE POSTS</span>
                <h2 className="h-display text-[28px] md:text-[32px] text-smoke mt-4">
                  Keep reading
                </h2>
              </div>
              <Link
                href="/coaching-insights"
                className="hidden md:inline text-[13px] uppercase tracking-[0.12em] text-smoke/70 hover:text-brick"
              >
                All posts →
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
