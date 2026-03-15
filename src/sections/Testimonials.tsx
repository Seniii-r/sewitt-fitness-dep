// src/sections/Testimonials.tsx
import { useEffect, useRef, useState } from "react"
import { cn } from "../lib/cn"

const PREVIEW_LENGTH = 160

type Testimonial = {
  id: number
  name: string
  quote: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Rose Daniels",
    quote:
      "I've never felt more supported by a trainer. Chris creates a space where women feel comfortable, respected, and actually listened to, while still being pushed to grow. I started barely lifting at all and now my working deadlift is 195 lbs. His care for his clients goes far beyond the gym.",
  },
  {
    id: 2,
    name: "Irene Elatrash",
    quote:
      "I would recommend Chris to anyone in a heartbeat. His approach is truly a holistic one, not just focusing on physical strength but on the mind-body connection as well. Every session is intentional and tailored to my goals, he works with you not only to support you but teach you, and let's the results speak for themselves. My body is stronger, but more importantly, I feel mentally stronger, healthier, and more confident. He genuinely cares about longterm well-being and making life style changes, not just quick results.",
  },
  {
    id: 3,
    name: "Felipe Carmo",
    quote:
      "I have had Chris as my gym personal trainer for the past 3 years and I am positive he is one of the most amazing professionals I've ever had the opportunity of being trained by. Not only is he a caring, patient, good-humored honest and hardworking person, he is very knowledgeable and experienced at applying techniques that show true results of body and health improvement. I was able to improve my resistance and endurance, lose weight and gain muscle fat in an attainable approach and realistic schedule. I am 57 years old and he has been able to focus on my needs and expectations. Besides, his training is achievable and science based. I fully recommend him as your personal trainer.",
  },
  {
    id: 4,
    name: "Robert Meschino",
    quote:
      "I would like to thank Chris my first trainer Victor my second trainer for keeping me motivated and building my self confidence. Before working with these guys I was 273 lbs. weighed in at 233lbs this morning. Hard work commitment and dedication on my part it's paying off.",
  },
]

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))
const smoothstep = (t: number) => t * t * (3 - 2 * t)

function getPreview(quote: string) {
  if (quote.length <= PREVIEW_LENGTH) return quote
  return quote.slice(0, PREVIEW_LENGTH).trim() + "…"
}

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [openId, setOpenId] = useState<number | null>(null)

  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false
    return window.matchMedia("(hover: none) and (pointer: coarse)").matches
  })

  const [fade, setFade] = useState(() => (isMobile ? 1 : 0))
  const [sectionFade, setSectionFade] = useState(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return
    const mq = window.matchMedia("(hover: none) and (pointer: coarse)")
    const onChange = () => setIsMobile(mq.matches)
    mq.addEventListener?.("change", onChange)
    return () => mq.removeEventListener?.("change", onChange)
  }, [])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    let obs: IntersectionObserver | null = null
    if (isMobile) {
      setFade(1)
    } else {
      const thresholds = Array.from({ length: 31 }, (_, i) => i / 30)
      obs = new IntersectionObserver(
        ([entry]) => setFade(smoothstep(clamp01(entry.intersectionRatio))),
        { threshold: thresholds }
      )
      obs.observe(el)
    }
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const vh = window.innerHeight || 1
        const visiblePx = Math.min(vh, Math.max(0, rect.bottom)) - Math.max(0, rect.top)
        setSectionFade(smoothstep(clamp01(visiblePx / vh)))
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

  const openTestimonial = testimonials.find((t) => t.id === openId)

  return (
    <section
      id="testimonials"
      ref={sectionRef as any}
      className={cn("relative isolate overflow-hidden", !isMobile && "transition-opacity duration-500 ease-out")}
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

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
          {testimonials.map((t) => {
            const isLong = t.quote.length > PREVIEW_LENGTH
            const preview = getPreview(t.quote)
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => isLong && setOpenId(t.id)}
                className={cn(
                  "relative overflow-hidden rounded-3xl text-left",
                  "border border-black/5 bg-white/70 backdrop-blur-md",
                  "shadow-[0_18px_50px_-30px_rgba(0,0,0,0.30)]",
                  "transition-transform duration-300 hover:-translate-y-1",
                  isLong && "cursor-pointer"
                )}
              >
                <div className="px-6 py-7">
                  <p className="text-sm leading-7 text-zinc-900/90">"{preview}"</p>
                  {isLong && (
                    <span className="mt-2 inline-block text-xs font-medium text-amber-600">
                      Read full testimonial →
                    </span>
                  )}
                  <div className="mt-6 border-t border-black/10 pt-5">
                    <p className="font-medium text-zinc-900">{t.name}</p>
                    <div className="mt-3 flex gap-1 text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/50" />
              </button>
            )
          })}
        </div>
      </div>

      {/* Full testimonial popup */}
      {openTestimonial && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          aria-modal="true"
          role="dialog"
          aria-labelledby="testimonial-modal-title"
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpenId(null)}
            aria-hidden="true"
          />
          <div
            className="relative max-h-[85vh] w-full max-w-lg overflow-auto rounded-3xl border border-black/10 bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p id="testimonial-modal-title" className="text-sm leading-7 text-zinc-900/90">
              "{openTestimonial.quote}"
            </p>
            <div className="mt-6 border-t border-black/10 pt-5">
              <p className="font-medium text-zinc-900">{openTestimonial.name}</p>
              <div className="mt-3 flex gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpenId(null)}
              className="mt-6 w-full rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
