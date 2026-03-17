// src/sections/Plans.tsx
import { useEffect, useRef, useState } from "react";
import { CircularTestimonials } from "../components/ui/circular-testimonials";

const VIDEO_ITEMS = [
  {
    title:
      "Clients at Sewitt Fitness don't just show up for a workout. They work closely with the same coach multiple times per week.",
    videoSrc: "/vids/20250513_225611284_iOS.MOV",
    poster: "/img/thumbnails/20250513_225611284_iOS.jpg",
  },
  {
    title:
      "A structured plan built around you, coaching that adjusts as patterns show up, accountability that doesn't rely on motivation, and a clear process with professional standards.",
    videoSrc: "/vids/20250526_182001692_iOS.MOV",
    poster: "/img/thumbnails/20250526_182001692_iOS.jpg",
  },
  {
    title:
      "You don't need more motivation. You need a system and someone who keeps you accountable to it.",
    videoSrc: "/vids/20250528_220722000_iOS.MOV",
    poster: "/img/thumbnails/20250528_220722000_iOS.jpg",
  },
  {
    title:
      "Real progress comes from consistency and the right guidance. Our coaches meet you where you are and design training that fits your life.",
    videoSrc: "/vids/20250827_171038997_iOS.MP4",
    poster: "/img/thumbnails/20250827_171038997_iOS.jpg",
  },
  {
    title:
      "From strength and conditioning to recovery and nutrition, we cover the full picture so you can perform at your best.",
    videoSrc: "/vids/20260118_235927000_iOS.MP4",
    poster: "/img/thumbnails/20260118_235927000_iOS.jpg",
  },
  {
    title:
      "Small steps, repeated with intention and support, create lasting change. That's the Sewitt approach.",
    videoSrc: "/vids/20260119_000131000_iOS.MP4",
    poster: "/img/thumbnails/20260119_000131000_iOS.jpg",
  },
  {
    title:
      "Join a community that trains with purpose. Your goals become our goals, and we don't leave progress to chance.",
    videoSrc: "/vids/20260119_000209000_iOS.MP4",
    poster: "/img/thumbnails/20260119_000209000_iOS.jpg",
  },
] as const;

const testimonials = VIDEO_ITEMS.map((p) => ({
  quote: p.title,
  name: "Coaching Experience",
  designation: "Sewitt Fitness",
  videoSrc: p.videoSrc,
  ...("poster" in p && p.poster && { poster: p.poster }),
}));

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const smoothstep = (t: number) => t * t * (3 - 2 * t);

export default function Plans() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [sectionFade, setSectionFade] = useState(0);
  const rafRef = useRef<number | null>(null);

  const getViewportH = () =>
    typeof window !== "undefined"
      ? (window.visualViewport?.height ?? window.innerHeight ?? 1)
      : 1;

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        const el = sectionRef.current!;
        const r = el.getBoundingClientRect();
        const vh = getViewportH();
        const visiblePx =
          Math.min(vh, Math.max(0, r.bottom)) - Math.max(0, r.top);
        const visibleRatio = clamp01(visiblePx / vh);
        setSectionFade(smoothstep(visibleRatio));
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    if (typeof window !== "undefined" && window.visualViewport) {
      window.visualViewport.addEventListener("resize", onScroll);
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (typeof window !== "undefined" && window.visualViewport) {
        window.visualViewport.removeEventListener("resize", onScroll);
      }
    };
  }, []);

  return (
    <section
      id="plans"
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="relative isolate w-full overflow-hidden min-h-[680px] sm:min-h-[720px] md:min-h-[640px] pt-10 pb-16 sm:pt-12 sm:pb-20 md:pt-14 md:pb-24 lg:pt-16 lg:pb-28"
      style={{ background: "#F5F5F2" }}
    >
      {/* Background + glow (fade in/out on scroll) */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-700 ease-out"
        style={{ opacity: sectionFade }}
        aria-hidden
      >
        <div className="absolute inset-0" style={{ background: "#F5F5F2" }} />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(900px 520px at 0% 22%, rgba(233, 208, 80, 0.55), transparent 62%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(740px 520px at 95% 89%, rgba(233, 208, 80, 0.55), transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(820px 560px at 95% 18%, rgba(233, 208, 80, 0.10), transparent 65%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div
          className="mx-auto text-center text-black"
          style={{ opacity: sectionFade }}
        >
          <h2 className="leading-[0.82] tracking-tight text-current">
            <span
              className="block text-2xl sm:text-3xl md:text-4xl"
              style={{ fontWeight: 800, letterSpacing: "0.15em" }}
            >
              COACHING EXPERIENCE
            </span>
          </h2>
        </div>

        {/* Circular testimonials carousel */}
        <div className="mt-4 sm:mt-6 md:mt-8 flex flex-col items-center">
          <div className="w-full flex justify-center">
            <CircularTestimonials
              testimonials={testimonials}
              autoplay={false}
              colors={{
                name: "#0B0B0C",
                designation: "#454545",
                testimony: "#171717",
                arrowBackground: "#141414",
                arrowForeground: "#f1f1f7",
                arrowHoverBackground: "#C1121F",
              }}
              fontSizes={{
                name: "clamp(1.25rem, 3vw, 1.75rem)",
                designation: "clamp(0.875rem, 2vw, 1.25rem)",
                quote: "clamp(0.9375rem, 2.2vw, 1.125rem)",
              }}
              actionsAboveArrows={
                <a
                  href="#plan"
                  className={[
                    "inline-flex items-center justify-center whitespace-nowrap",
                    "px-4 py-2 text-sm font-semibold",
                    "md:px-5 md:py-2 md:text-sm",
                    "transition-all hover:scale-[1.02]",
                    "bg-white/10 text-[#0B0B0C] border border-black/15 backdrop-blur-md",
                    "hover:bg-[#C1121F]/15 hover:border-[#C1121F]/40 hover:shadow-[0_18px_60px_rgba(193,18,31,0.45)]",
                  ].join(" ")}
                >
                  See How Coaching Works
                </a>
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}
