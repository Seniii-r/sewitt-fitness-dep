"use client";

import { useMemo, useState } from "react";
import PostCard from "@/components/blog/PostCard";
import { CATEGORIES, type Post } from "@/lib/posts";

export default function PostGrid({ posts }: { posts: Post[] }) {
  const [active, setActive] = useState<(typeof CATEGORIES)[number]>("All");

  const filtered = useMemo(() => {
    if (active === "All") return posts;
    return posts.filter((p) => p.category === active);
  }, [active, posts]);

  return (
    <>
      <div className="container-x pt-12 md:pt-16">
        <div className="flex flex-wrap gap-3 mb-10 justify-center md:justify-start">
          {CATEGORIES.map((cat) => {
            const isActive = cat === active;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActive(cat)}
                className={[
                  "label-mono-sm px-4 py-2 rounded-sm transition-all border",
                  isActive
                    ? "bg-brick text-smoke border-brick"
                    : "bg-transparent text-smoke/60 border-white/20 hover:text-smoke hover:border-white/40",
                ].join(" ")}
                aria-pressed={isActive}
              >
                {cat.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      <div className="container-x pb-20 md:pb-28">
        {filtered.length === 0 ? (
          <p className="text-smoke/60 text-center py-20">
            No posts in this category yet.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
