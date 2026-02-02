// src/sections/FAQ.tsx
import { useEffect, useRef, useState } from "react"

const PAGE_BLACK = "#0B0B0C"
const clamp01 = (n: number) => Math.min(1, Math.max(0, n))
const smoothstep = (t: number) => t * t * (3 - 2 * t)

const faqs = [
  {
    q: " What happens in the Free Intro Assessment?",
    a: "We’ll assess your goals, current training, and what’s realistically needed to reach your outcome. You’ll leave with clear next steps. If it’s a fit, we’ll outline the coaching structure and weekly cadence moving forward.",
  },
  {
    q: "Is the Free Intro Assessment a “trial session”?",
    a: " It’s an assessment and fit check. The goal is clarity, expectations, and a plan. If coaching is a fit, we move forward with structure from there.",
  },
  {
    q: "How fast will I see results?",
    a: "Progress depends on consistency. Most clients start feeling stronger within weeks. Visible change follows over time. The goal is results that last, not a quick spike.",
  },
  {
    q: "What makes this different from just following a program?",
    a: " Programs don’t adapt to you in real time. Ongoing coaching does. You’re building progress with structure, feedback, and accountability over time.",
  },
  {
    q: "Why does commitment matter?",
    a: " Because the system is designed to work over months, not weeks. The clients who stay consistent long-term see the biggest results.",
  },
]

function Item({
  q,
  a,
  open,
  onToggle,
}: {
  q: string
  a: string
  open: boolean
  onToggle: () => void
}) {
  return (
    <button type="button" onClick={onToggle} className="w-full text-left" aria-expanded={open}>
      <div className="flex items-center justify-between gap-6 py-6">
        <div className="text-base font-medium text-[#F5F5F2]">{q}</div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#F5F5F2] text-[#F5F5F2]">
          {open ? "−" : "+"}
        </div>
      </div>

      {open && <div className="pb-6 text-sm leading-6 text-[#F5F5F2]">{a}</div>}
      <div className="h-px bg-[#E9D050]" />
    </button>
  )
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const sectionRef = useRef<HTMLElement | null>(null)
  const rafRef = useRef<number | null>(null)

  // scroll-driven reveal (no background color flipping)
  const [t, setT] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return
      if (rafRef.current) cancelAnimationFrame(rafRef.current)

      rafRef.current = requestAnimationFrame(() => {
        const el = sectionRef.current!
        const rect = el.getBoundingClientRect()
        const vh = window.innerHeight || 1

        // enter 0..1 as the section comes in
        const enter = smoothstep(clamp01((vh - rect.top) / (vh * 0.7)))
        // exit 0..1 as it leaves
        const exit = smoothstep(clamp01((vh - rect.bottom) / (vh * 0.7)))

        // strong in the middle, fades at edges (fully reversible)
        const vis = clamp01(enter * (1 - exit))
        setT(vis)
      })
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  return (
    <section ref={sectionRef as any} className="relative isolate w-full" style={{ backgroundColor: PAGE_BLACK }}>
    {/* BACKGROUND + RED GLOW (FAQ) */}
    <div
      className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-700 ease-out"
      style={{ opacity: t }}   // reuse your existing visibility value
      aria-hidden="true"
    >
      <div className="absolute inset-0" style={{ background: PAGE_BLACK }} />

      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(700px 520px at 0% 22%, rgba(193, 18, 31, 0.45), transparent 62%)",
        }}
      />
    </div>

    {/* optional: keep your spotlight on top of the glow */}
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1]"
      style={{
        background:
          "radial-gradient(800px 400px at 50% 35%, rgba(255,255,255,0.10), rgba(255,255,255,0) 60%)",
        opacity: t,
      }}
    />
      
      <div className="mx-auto min-h-screen max-w-6xl px-5 py-20 sm:px-6 sm:py-24">
        <div
          className="text-center"
          style={{
            opacity: t,
            transform: `translateY(${(1 - t) * 10}px)`,
            transition: "opacity 160ms linear, transform 160ms linear",
          }}
        >
          <div className="text-xs font-medium tracking-wide text-white/60">FAQ</div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Everything you need to know
          </h2>
        </div>

        <div
          className="mx-auto mt-12 w-full max-w-4xl rounded-2xl border border-zinc-200 bg-[#0B0B0C] px-6 shadow-[0_30px_90px_-60px_rgba(0,0,0,0.65)]"
          style={{
            opacity: t,
            transform: `translateY(${(1 - t) * 14}px) scale(${0.985 + t * 0.015})`,
            transition: "opacity 180ms linear, transform 180ms linear",
          }}
        >
          {faqs.map((f, idx) => (
            <Item
              key={f.q}
              q={f.q}
              a={f.a}
              open={openIndex === idx}
              onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
