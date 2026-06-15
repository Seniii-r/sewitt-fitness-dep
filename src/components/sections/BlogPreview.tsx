import Link from "next/link";
import { getAllPosts, CATEGORY_COLOR } from "@/lib/posts";

export default async function BlogPreview() {
  const posts = (await getAllPosts()).slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <section className="bg-onyx-2 section">
      <div className="container-x">

        <div className="flex items-end justify-between mb-12 md:mb-16">
          <div className="reveal">
            <span className="label-mono text-gold">COACHING INSIGHTS</span>
            <h2 className="h-display text-[32px] md:text-[40px] text-smoke mt-4 leading-tight">
              FROM THE COACH
            </h2>
          </div>
          <Link
            href="/coaching-insights"
            className="hidden md:inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.1em] text-smoke/50 hover:text-brick transition-colors reveal"
            data-delay="80"
          >
            All Posts →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <Link
              key={post.slug}
              href={`/coaching-insights/${post.slug}`}
              className="group bg-onyx-3 rounded-md overflow-hidden border border-white/5 hover:border-brick/40 transition-all duration-200 reveal"
              data-delay={String(80 * i)}
            >
              <div className="aspect-[16/9] overflow-hidden bg-onyx">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.thumbnail}
                  alt={post.thumbnailAlt ?? post.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div
                  className="label-mono-sm mb-3"
                  style={{ color: CATEGORY_COLOR[post.category] }}
                >
                  {post.category}
                </div>
                <h3 className="text-[17px] font-bold text-smoke leading-snug mb-3 group-hover:text-brick transition-colors">
                  {post.title}
                </h3>
                <p className="text-[14px] text-smoke/60 leading-relaxed line-clamp-2">
                  {post.thumbnailCaption}
                </p>
                <div className="mt-4 text-[12px] text-smoke/40">
                  {post.readTime}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center md:hidden reveal">
          <Link href="/coaching-insights" className="btn btn-ghost">
            All Posts
          </Link>
        </div>

      </div>
    </section>
  );
}
