// src/sections/Testimonials.tsx
import { useEffect, useRef, useState } from "react"
import PixelTransition from "../components/PixelTransition"

type Testimonial = {
  id: number
  name: string
  role?: string
  rating: number
  quote: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Paul Stuart",
    role: "Strength Training",
    rating: 5,
    quote: "Sewitt not only helped me level up my weightlifting game, I added serious weight to my lifts.",
  },
  {
    id: 2,
    name: "Robert Meschino",
    role: "Body Recomposition",
    rating: 5,
    quote:
      "I would like to thank Chris my first trainer. Before working with him I was 273lbs. weighed in at 233lbs this morning. Hark work commitment and dedication on my part it's paying off.",
  },
  {
    id: 3,
    name: "Nadia Rahman",
    role: "Endurance & Conditioning",
    rating: 5,
    quote: "Simple, consistent, and effective. Progress felt inevitable once the plan was in place.",
  },
]

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))
const smoothstep = (t: number) => t * t * (3 - 2 * t)

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement | null>(null)

  // ✅ detect mobile (coarse pointer)
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false
    return window.matchMedia("(hover: none) and (pointer: coarse)").matches
  })

  // ✅ mobile should never fade, desktop keeps existing fade behavior
  const [fade, setFade] = useState(() => (isMobile ? 1 : 0))
  const [sectionFade, setSectionFade] = useState(0)

  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return

    const mq = window.matchMedia("(hover: none) and (pointer: coarse)")
    const onChange = () => setIsMobile(mq.matches)

    // modern
    mq.addEventListener?.("change", onChange)
    // older safari
    // @ts-ignore
    mq.addListener?.(onChange)

    return () => {
      mq.removeEventListener?.("change", onChange)
      // @ts-ignore
      mq.removeListener?.(onChange)
    }
  }, [])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    let obs: IntersectionObserver | null = null

    // ✅ MOBILE: lock opacity at 1 and do NOT run the fade observer
    if (isMobile) {
      setFade(1)
    } else {
      const thresholds = Array.from({ length: 31 }, (_, i) => i / 30)
      obs = new IntersectionObserver(
        ([entry]) => {
          const r = clamp01(entry.intersectionRatio)
          setFade(smoothstep(r))
        },
        { threshold: thresholds }
      )
      obs.observe(el)
    }

    // background glow fade stays as-is
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const vh = window.innerHeight || 1
        const visiblePx = Math.min(vh, Math.max(0, rect.bottom)) - Math.max(0, rect.top)
        const visibleRatio = clamp01(visiblePx / vh)
        setSectionFade(smoothstep(visibleRatio))
      })
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)

    return () => {
      obs?.disconnect()
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [isMobile])

  return (
    <section
      id="testimonials"
      ref={sectionRef as any}
      className={[
        "relative isolate overflow-hidden",
        isMobile ? "" : "transition-opacity duration-500 ease-out",
      ].join(" ")}
      style={{ opacity: isMobile ? 1 : fade, minHeight: "100vh", background: "#F5F5F2" }}
    >
      {/* BACKGROUND + GLOW */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-700 ease-out"
        style={{ opacity: sectionFade }}
        aria-hidden="true"
      >
        <div className="absolute inset-0" style={{ background: "#F5F5F2" }} />
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(900px 520px at 0% 22%, rgba(233, 208, 80, 0.55), transparent 62%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(740px 520px at 95% 89%, rgba(233, 208, 80, 0.55), transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(820px 560px at 95% 18%, rgba(233, 208, 80, 0.10), transparent 65%)",
          }}
        />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-5 py-14 sm:px-6">
        <div className="mx-auto max-w-2xl text-center text-zinc-900">
          <div className="flex justify-center gap-1 text-amber-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i}>★</span>
            ))}
          </div>

          <div className="mt-6">
            <h1 className="leading-[0.82] tracking-tight text-current">
              <span
                className="block text-3xl sm:text-4xl md:text-5xl"
                style={{ fontWeight: 800, letterSpacing: "0.15em" }}
              >
                REAL RESULTS
              </span>
            </h1>
          </div>

          <p className="mt-3 text-sm leading-6 text-zinc-600 sm:text-base">
            Proof beats promises. Here’s what clients say after putting in the work.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => {
            if (t.id === 2) {
              return (
                <PixelTransition
                  key={t.id}
                  className={[
                    "relative overflow-hidden rounded-3xl",
                    "border border-black/5 bg-white/70 backdrop-blur-md",
                    "shadow-[0_18px_50px_-30px_rgba(0,0,0,0.30)]",
                    "transition-transform duration-300 hover:-translate-y-1",
                  ].join(" ")}
                  aspectRatio="120%"
                  gridSize={8}
                  pixelColor="#ffffff"
                  animationStepDuration={0.45}
                  once={false}
                  firstContent={
                    <div className="h-full w-full px-6 py-7">
                      <p className="text-sm leading-7 text-zinc-900/90">“{t.quote}”</p>

                      <div className="mt-6 border-t border-black/10 pt-5">
                        <p className="font-medium text-zinc-900">{t.name}</p>
                        {t.role && <p className="mt-1 text-xs text-zinc-600">{t.role}</p>}

                        <div className="mt-3 flex gap-1 text-amber-500">
                          {Array.from({ length: t.rating }).map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </div>
                      </div>

                      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/50" />
                    </div>
                  }
                  secondContent={
                    <img
                      src="/img/testamonial.jpg"
                      alt="Testimonial"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      draggable={false}
                    />
                  }
                />
              )
            }

            return (
              <div
                key={t.id}
                className={[
                  "relative overflow-hidden rounded-3xl",
                  "border border-black/5 bg-white/70 backdrop-blur-md",
                  "shadow-[0_18px_50px_-30px_rgba(0,0,0,0.30)]",
                  "transition-transform duration-300 hover:-translate-y-1",
                ].join(" ")}
              >
                <div className="px-6 py-7">
                  <p className="text-sm leading-7 text-zinc-900/90">“{t.quote}”</p>

                  <div className="mt-6 border-t border-black/10 pt-5">
                    <p className="font-medium text-zinc-900">{t.name}</p>
                    {t.role && <p className="mt-1 text-xs text-zinc-600">{t.role}</p>}

                    <div className="mt-3 flex gap-1 text-amber-500">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/50" />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
