// Plans.tsx
import { useEffect, useMemo, useRef, useState } from "react"
import { cn } from "../lib/cn"

const plans = [
  {
    tag: "",
    title: "The Program",
    bullets: [
      "Clients at Sewitt Fitness don’t just show up for a workout. They work closely with the same coach multiple times per week, building a coaching relationship that allows for real adjustments, real accountability, and long-term progress.",
    ],
    img: "/img/boxing.jpeg",
  },
  {
    tag: "",
    title: "What you get",
    bullets: [
      "A structured plan built around you (not trends)",
      "Coaching that adjusts in real time as patterns show up",
      "Accountability that doesn’t rely on motivation",
      "Clear expectations, professional standards, and a documented process",
      "Consistency built into your week so progress compounds",
    ],
    img: "/img/Fitness.jpg",
  },
  {
    tag: "",
    title: "You don’t need more motivation. You need a system and someone who keeps you accountable to it.",
    bullets: [],
    img: "/img/mealprep.jpg",
  },
]

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))
const smoothstep = (t: number) => t * t * (3 - 2 * t)

function PlanCard({ plan }: { plan: (typeof plans)[number] }) {
  return (
    <div className="grid gap-8 p-7 sm:p-10 md:grid-cols-[420px_1fr] md:items-center">
      <div className="overflow-hidden rounded-3xl bg-white/5">
        <img src={plan.img} alt="" className="h-72 w-full object-cover sm:h-80 md:h-[360px]" />
      </div>

      <div className="grid gap-4 text-white">
        {plan.tag ? <div className="text-sm text-white/60">{plan.tag}</div> : <div />}

        <div className="text-2xl font-semibold tracking-tight sm:text-3xl">{plan.title}</div>

        {plan.bullets.length > 0 && (
          <ul className="mt-1 grid gap-3 text-base text-white/75">
            {plan.bullets.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <span className="mt-2 inline-block h-2 w-2 rounded-full bg-white/70" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default function Plans() {
  const n = plans.length
  const sectionRef = useRef<HTMLElement | null>(null)
  const viewportRef = useRef<HTMLDivElement | null>(null)

  const [targetIdx, setTargetIdx] = useState(0)
  const [displayIdx, setDisplayIdx] = useState(0)

  const [incomingIdx, setIncomingIdx] = useState<number | null>(null)
  const [incomingOn, setIncomingOn] = useState(false)

  const [dir, setDir] = useState<1 | -1>(1)
  const [sectionFade, setSectionFade] = useState(0)

  const draggingRef = useRef(false)
  const startYRef = useRef(0)
  const [dragY, setDragY] = useState(0)

  const rafRef = useRef<number | null>(null)
  const DURATION = 520

  const startTransition = (nextRaw: number, direction: 1 | -1) => {
    const next = Math.min(n - 1, Math.max(0, nextRaw))
    if (incomingIdx !== null) return
    if (next === displayIdx) return

    setDir(direction)
    setIncomingIdx(next)

    setIncomingOn(false)
    requestAnimationFrame(() => setIncomingOn(true))
  }

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const vh = window.innerHeight || 1

        const totalScrollable = Math.max(1, el.offsetHeight - vh)
        const scrolled = Math.min(Math.max(-rect.top, 0), totalScrollable)
        const p = scrolled / totalScrollable

        const next = Math.min(n - 1, Math.floor(p * n))
        setTargetIdx(next)

        const visiblePx = Math.min(vh, Math.max(0, rect.bottom)) - Math.max(0, rect.top)
        const visibleRatio = clamp01(visiblePx / vh)
        setSectionFade(smoothstep(visibleRatio))
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
  }, [n])

  useEffect(() => {
    if (draggingRef.current) return
    if (incomingIdx !== null) return
    if (targetIdx !== displayIdx) startTransition(targetIdx, targetIdx > displayIdx ? 1 : -1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetIdx, displayIdx, incomingIdx])

  const swipeThreshold = () => {
    const h = viewportRef.current?.getBoundingClientRect().height ?? 1
    return Math.max(70, h * 0.16)
  }

  const onPointerDown = (e: React.PointerEvent) => {
    if (incomingIdx !== null) return
    if (e.pointerType === "mouse" && e.button !== 0) return
    draggingRef.current = true
    startYRef.current = e.clientY
    setDragY(0)
    ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return
    setDragY(e.clientY - startYRef.current)
  }

  const endDrag = () => {
    if (!draggingRef.current) return
    draggingRef.current = false

    const dy = dragY
    const th = swipeThreshold()

    if (dy <= -th) startTransition(displayIdx + 1, 1)
    else if (dy >= th) startTransition(displayIdx - 1, -1)

    setDragY(0)
  }

  const onPointerUp = () => endDrag()
  const onPointerCancel = () => endDrag()
  const onPointerLeave = () => {
    if (draggingRef.current) endDrag()
  }

  const displayPlan = useMemo(() => plans[displayIdx], [displayIdx])
  const incomingPlan = useMemo(() => (incomingIdx == null ? null : plans[incomingIdx]), [incomingIdx])

  const outOpacity = incomingIdx == null ? 1 : incomingOn ? 0 : 1
  const inOpacity = incomingIdx == null ? 0 : incomingOn ? 1 : 0

  const outY = incomingIdx == null ? 0 : incomingOn ? (dir === 1 ? -10 : 10) : 0
  const inY = incomingIdx == null ? 0 : incomingOn ? 0 : dir === 1 ? 10 : -10

  const onIncomingTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName !== "opacity") return
    if (incomingIdx == null) return
    if (!incomingOn) return

    setDisplayIdx(incomingIdx)
    setIncomingIdx(null)
    setIncomingOn(false)
  }

  return (
    <section
      id="plans"
      ref={sectionRef as any}
      className="relative isolate"
      style={{ height: n * 100 + "vh", background: "#F5F5F2" }}
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

      {/* FOREGROUND */}
      <div className="sticky top-0 z-10 flex min-h-screen flex-col justify-center px-5 py-14 sm:px-6 sm:py-16">
        {/* TITLE (replaced) */}
        <div className="mx-auto text-center text-black" style={{ opacity: sectionFade }}>
          <h1 className="leading-[0.82] tracking-tight text-current">
            <span
              className="block text-3xl sm:text-4xl md:text-5xl"
              style={{
                fontWeight: 800,
                letterSpacing: "0.15em",
              }}
            >
              COACHING EXPERIENCE
            </span>
          </h1>
        </div>

        <div className="mx-auto mt-10 w-full max-w-6xl">
          {/* CARD */}
          <div
            ref={viewportRef}
            className={cn("relative overflow-hidden rounded-[32px] border border-black/10 bg-black shadow-sm select-none")}
            style={{
              opacity: Math.min(1, sectionFade * 1.05),
              transform: `translateY(${sectionFade > 0.15 ? 0 : 10}px)`,
              transition: "opacity 700ms ease-out, transform 700ms ease-out",
              touchAction: "pan-y",
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
            onPointerLeave={onPointerLeave}
          >
            {/* STACKED LAYERS (flash-proof) */}
            <div className="relative">
              {/* OUTGOING LAYER */}
              <div
                className="absolute inset-0"
                style={{
                  opacity: outOpacity,
                  transform: `translate3d(0, ${draggingRef.current ? dragY : outY}px, 0)`,
                  transition: `opacity ${DURATION}ms ease-out, transform ${DURATION}ms ease-out`,
                  willChange: "opacity, transform",
                  backfaceVisibility: "hidden",
                  pointerEvents: incomingIdx == null ? "auto" : "none",
                }}
              >
                <PlanCard plan={displayPlan} />
              </div>

              {/* INCOMING LAYER */}
              {incomingPlan && (
                <div
                  className="absolute inset-0"
                  onTransitionEnd={onIncomingTransitionEnd}
                  style={{
                    visibility: incomingOn ? "visible" : "hidden",
                    opacity: inOpacity,
                    transform: `translate3d(0, ${inY}px, 0)`,
                    transition: `opacity ${DURATION}ms ease-out, transform ${DURATION}ms ease-out`,
                    willChange: "opacity, transform",
                    backfaceVisibility: "hidden",
                    pointerEvents: incomingOn ? "auto" : "none",
                  }}
                >
                  <PlanCard plan={incomingPlan} />
                </div>
              )}

              {/* SIZER */}
              <div className="invisible">
                <PlanCard plan={displayPlan} />
              </div>
            </div>
          </div>

          {/* CTA BELOW THE CARD (mobile-safe) */}
          <div className="mt-7 flex justify-center">
            <a
              href="#contact"
              className={[
                "inline-flex items-center justify-center",
                "px-8 sm:px-10 py-3 text-base sm:text-lg font-semibold",
                "transition-all hover:scale-[1.02]",
                "bg-white/10 text-[#0B0B0C] border border-black/15 backdrop-blur-md",
                "hover:bg-[#C1121F]/15 hover:border-[#C1121F]/40 hover:shadow-[0_18px_60px_rgba(193,18,31,0.45)]",
              ].join(" ")}
            >
              See How Coaching Works
            </a>
          </div>

          <div className="mt-3 text-center text-xs text-black/45">
            Tip: scroll to progress, or drag up/down on the card to switch
          </div>
        </div>
      </div>
    </section>
  )
}
