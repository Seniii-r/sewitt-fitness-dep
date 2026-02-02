import { useEffect, useMemo, useRef, useState } from "react"

const stats = [
  { value: "15+", label: "Years of experience" },
  { value: "200+", label: "Athletes coached" },
  { value: "500+", label: "Race strategies" },
  { value: "10,000+", label: "Training hours" },
]

function parseStat(v: string) {
  const plus = v.trim().endsWith("+")
  const numeric = Number(v.replace(/[^\d]/g, "")) || 0
  return { numeric, plus }
}

function formatNumber(n: number) {
  return n.toLocaleString()
}

export default function Stats() {
  const parsed = useMemo(() => stats.map((s) => ({ ...s, ...parseStat(s.value) })), [])
  const [display, setDisplay] = useState<number[]>(() => parsed.map(() => 0))

  // Scroll fade (based on intersection ratio)
  const [fade, setFade] = useState(0)
  const [inView, setInView] = useState(false)

  const ranRef = useRef(false)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const el = document.getElementById("stats")
    if (!el) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)

        // ratio-based fade for smoother section-to-section feel
        const r = entry.intersectionRatio
        const mapped = Math.min(1, Math.max(0, (r - 0.05) / 0.95))
        setFade(mapped)
      },
      { threshold: Array.from({ length: 21 }, (_, i) => i / 20) }
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Count-up when entering view, reset when leaving view
  useEffect(() => {
    if (!inView) {
      // reset so it replays next time (up OR down)
      ranRef.current = false
      setDisplay(parsed.map(() => 0))
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      return
    }

    if (ranRef.current) return
    ranRef.current = true

    const duration = 1200
    const start = performance.now()
    const targets = parsed.map((p) => p.numeric)

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3)

      setDisplay(targets.map((target) => Math.round(target * eased)))

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        rafRef.current = null
      }
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [inView, parsed])

  return (
    <section
      id="stats"
      className="mx-auto max-w-6xl px-5 pb-12 sm:px-6 transition-opacity duration-500 ease-out"
      style={{ opacity: fade }}
    >
      <div className="grid gap-10 sm:grid-cols-4">
        {parsed.map((s, i) => (
          <div key={s.value}>
            <div className="h-px w-24 bg-zinc-200" />
            <div className="mt-10 text-5xl font-medium tracking-tight sm:text-6xl tabular-nums">
              {formatNumber(display[i])}
              {s.plus ? "+" : ""}
            </div>
            <div className="mt-2 text-sm text-zinc-700">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
