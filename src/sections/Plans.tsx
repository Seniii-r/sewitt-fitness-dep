// src/sections/Plans.tsx
import { useEffect, useRef, useState } from "react"
import { cn } from "../lib/cn"

const plans = [
  {
    tag: "",
    title:
      "Clients at Sewitt Fitness don’t just show up for a workout. They work closely with the same coach multiple times per week.",
    body: "",
    img: "/img/boxing.jpeg",
  },
  {
    tag: "",
    title:
      "A structured plan built around you, coaching that adjusts as patterns show up, accountability that doesn’t rely on motivation, and a clear process with professional standards.",
    body: "",
    img: "/img/Fitness.jpg",
  },
  {
    tag: "",
    title: "You don’t need more motivation. You need a system and someone who keeps you accountable to it.",
    body: "",
    img: "/img/mealprep.jpg",
  },
] as const

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))
const smoothstep = (t: number) => t * t * (3 - 2 * t)

function PlanCard({
  plan,
  hint,
}: {
  plan: (typeof plans)[number]
  hint?: string | null
}) {
  return (
    // content-start prevents grid rows from stretching and creating the "image got cut / black gap" look on mobile
    <div className="grid h-full content-start gap-4 p-5 sm:p-8 md:grid-cols-[1fr_1fr] md:items-center md:content-center md:gap-8">
      <div className="relative overflow-hidden rounded-3xl bg-white/5">
        <img
          src={plan.img}
          alt=""
          className="h-56 w-full object-cover object-bottom sm:h-64 sm:object-center md:h-[420px] md:w-full"
          draggable={false}
        />

{/* Swipe hint overlay (mobile only, blended, not a button) */}
{hint ? (
  <div className="pointer-events-none absolute left-1/2 bottom-5 z-10 -translate-x-1/2 md:hidden">
    <div className="swipeHintFloat flex flex-col items-center">
      <div className="text-[11px] font-semibold tracking-[0.22em] text-white/85 drop-shadow-[0_2px_10px_rgba(0,0,0,0.75)]">
        SWIPE UP
      </div>
      <div className="mt-1 text-lg leading-none text-white/85 drop-shadow-[0_2px_10px_rgba(0,0,0,0.75)]">
        ↓
      </div>
    </div>
  </div>
) : null}


      </div>

      <div className="grid gap-3 text-white">
        {plan.tag ? <div className="text-xs text-white/60 sm:text-sm">{plan.tag}</div> : null}

        <div className="text-lg font-semibold leading-snug tracking-tight sm:text-2xl md:text-3xl">
          {plan.title}
        </div>

        {plan.body ? (
          <p className="text-sm leading-6 text-white/75 sm:text-base sm:leading-7">{plan.body}</p>
        ) : null}
      </div>
    </div>
  )
}

export default function Plans() {
  const n = plans.length
  const sectionRef = useRef<HTMLElement | null>(null)

  // Background glow fade
  const [sectionFade, setSectionFade] = useState(0)
  const rafRef = useRef<number | null>(null)

  // Slide index
  const [idx, setIdx] = useState(0)
  const idxRef = useRef(0)
  useEffect(() => {
    idxRef.current = idx
  }, [idx])

  // Disable transition briefly when we "snap" to startIdx on entry
  const [skipAnim, setSkipAnim] = useState(false)

  // Prevent spam switching while animating
  const animLockRef = useRef(false)
  const DURATION = 520

  // Lock state
  const [locked, setLocked] = useState(false)
  const lockedRef = useRef(false)
  useEffect(() => {
    lockedRef.current = locked
  }, [locked])

  // When we unlock intentionally to exit, don't instantly re-lock until section is not fully visible again
  const armedRef = useRef(true)

  // Track last scroll direction before locking
  const lastScrollYRef = useRef<number>(typeof window !== "undefined" ? window.scrollY : 0)
  const lastDirRef = useRef<1 | -1>(1)

  // Full visibility tracking
  const fullyVisibleRef = useRef(false)

  // "Settle" timer so we lock AFTER momentum ends (prevents iOS flash)
  const settleTimerRef = useRef<number | null>(null)
  const SETTLE_MS = 140

  // Mode: hard lock for desktop, soft lock for mobile (coarse pointer)
  const isCoarsePointerRef = useRef(false)
  useEffect(() => {
    isCoarsePointerRef.current =
      typeof window !== "undefined" &&
      !!window.matchMedia &&
      window.matchMedia("(hover: none) and (pointer: coarse)").matches
  }, [])

  // Swipe hint (mobile only)
  const [showSwipeHint, setShowSwipeHint] = useState(false)
  const hintShownRef = useRef(false)
  const hintTimerRef = useRef<number | null>(null)

  const showHintOnce = () => {
    if (!isCoarsePointerRef.current) return
    if (hintShownRef.current) return
    hintShownRef.current = true

    setShowSwipeHint(true)
    if (hintTimerRef.current) window.clearTimeout(hintTimerRef.current)
    hintTimerRef.current = window.setTimeout(() => {
      setShowSwipeHint(false)
      hintTimerRef.current = null
    }, 2200)
  }

  const hideHint = () => {
    setShowSwipeHint(false)
    if (hintTimerRef.current) {
      window.clearTimeout(hintTimerRef.current)
      hintTimerRef.current = null
    }
  }

  // Hard-lock style backups (desktop)
  const savedScrollYRef = useRef(0)
  const savedPaddingRightRef = useRef("")
  const savedScrollBehaviorRef = useRef("")
  const usingHardLockRef = useRef(false)

  const getViewportH = () => window.visualViewport?.height ?? window.innerHeight ?? 1
  const tol = 28

  const isFullyVisibleNow = () => {
    if (!sectionRef.current) return false
    const r = sectionRef.current.getBoundingClientRect()
    const vh = getViewportH()
    return r.top >= -tol && r.bottom <= vh + tol
  }

  const cancelSettle = () => {
    if (settleTimerRef.current) {
      window.clearTimeout(settleTimerRef.current)
      settleTimerRef.current = null
    }
  }

  const setStartIdxNoAnim = (startIdx: number) => {
    setSkipAnim(true)
    setIdx(startIdx)
    idxRef.current = startIdx
    requestAnimationFrame(() => setSkipAnim(false))
  }

  const lockPage = () => {
    if (lockedRef.current) return
    cancelSettle()

    savedScrollBehaviorRef.current = document.documentElement.style.scrollBehavior
    document.documentElement.style.scrollBehavior = "auto"

    document.documentElement.style.overscrollBehavior = "none"
    document.body.style.overscrollBehavior = "none"

    const coarse = isCoarsePointerRef.current
    usingHardLockRef.current = !coarse

    // MOBILE (soft lock): don’t mess with body position (that’s where iOS flashes come from)
    if (coarse) {
      setLocked(true)
      showHintOnce()
      return
    }

    // DESKTOP (hard lock)
    const y = window.scrollY || 0
    savedScrollYRef.current = y

    const scrollBarW = window.innerWidth - document.documentElement.clientWidth
    const body = document.body
    savedPaddingRightRef.current = body.style.paddingRight
    if (scrollBarW > 0) body.style.paddingRight = `${scrollBarW}px`

    body.style.position = "fixed"
    body.style.top = `-${y}px`
    body.style.left = "0"
    body.style.right = "0"
    body.style.width = "100%"

    setLocked(true)
  }

  const unlockPage = () => {
    if (!lockedRef.current) return
    cancelSettle()
    hideHint()

    document.documentElement.style.overscrollBehavior = ""
    document.body.style.overscrollBehavior = ""

    const restoreScrollBehavior = () => {
      document.documentElement.style.scrollBehavior = savedScrollBehaviorRef.current || ""
    }

    if (!usingHardLockRef.current) {
      setLocked(false)
      restoreScrollBehavior()
      return
    }

    const body = document.body
    const y = savedScrollYRef.current

    body.style.position = ""
    body.style.top = ""
    body.style.left = ""
    body.style.right = ""
    body.style.width = ""
    body.style.paddingRight = savedPaddingRightRef.current

    window.scrollTo(0, y)

    setLocked(false)
    restoreScrollBehavior()
  }

  const unlockForExit = () => {
    armedRef.current = false
    unlockPage()
  }

  useEffect(() => {
    return () => unlockPage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const step = (dir: 1 | -1) => {
    if (animLockRef.current) return
    const cur = idxRef.current
    const next = Math.min(n - 1, Math.max(0, cur + dir))
    if (next === cur) return

    hideHint() // hide hint as soon as they successfully navigate

    setIdx(next)
    idxRef.current = next

    animLockRef.current = true
    window.setTimeout(() => {
      animLockRef.current = false
    }, DURATION + 40)
  }

  // Main scroll watcher: direction, fade, fully-visible, settle-lock scheduling
  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return
      if (rafRef.current) cancelAnimationFrame(rafRef.current)

      rafRef.current = requestAnimationFrame(() => {
        const el = sectionRef.current!
        const r = el.getBoundingClientRect()
        const vh = getViewportH()

        if (!lockedRef.current) {
          const y = window.scrollY
          const dy = y - lastScrollYRef.current
          if (Math.abs(dy) > 1) lastDirRef.current = dy > 0 ? 1 : -1
          lastScrollYRef.current = y
        }

        const visiblePx = Math.min(vh, Math.max(0, r.bottom)) - Math.max(0, r.top)
        const visibleRatio = clamp01(visiblePx / vh)
        setSectionFade(smoothstep(visibleRatio))

        const fullyVisible = r.top >= -tol && r.bottom <= vh + tol
        fullyVisibleRef.current = fullyVisible

        if (!fullyVisible) {
          armedRef.current = true
          cancelSettle()
          return
        }

        if (fullyVisible && armedRef.current && !lockedRef.current) {
          cancelSettle()
          settleTimerRef.current = window.setTimeout(() => {
            if (!armedRef.current) return
            if (lockedRef.current) return
            if (!isFullyVisibleNow()) return

            const startIdx = lastDirRef.current === 1 ? 0 : n - 1
            setStartIdxNoAnim(startIdx)
            lockPage()
          }, SETTLE_MS)
        }
      })
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    window.visualViewport?.addEventListener("resize", onScroll)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      cancelSettle()
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      window.visualViewport?.removeEventListener("resize", onScroll)
    }
  }, [n])

  // Wheel (desktop)
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 10) return
      const dir: 1 | -1 = e.deltaY > 0 ? 1 : -1

      if (!lockedRef.current && fullyVisibleRef.current && armedRef.current) {
        const startIdx = dir === 1 ? 0 : n - 1
        if ((startIdx === 0 && dir === -1) || (startIdx === n - 1 && dir === 1)) return

        setStartIdxNoAnim(startIdx)
        lockPage()

        if (e.cancelable) e.preventDefault()
        step(dir)
        return
      }

      if (!lockedRef.current) return

      const cur = idxRef.current
      const atFirst = cur === 0
      const atLast = cur === n - 1

      if ((atLast && dir === 1) || (atFirst && dir === -1)) {
        unlockForExit()
        return
      }

      if (e.cancelable) e.preventDefault()
      step(dir)
    }

    window.addEventListener("wheel", onWheel, { passive: false })
    return () => window.removeEventListener("wheel", onWheel as any)
  }, [n])

  // Touch (mobile)
  useEffect(() => {
    let startY = 0
    let lastY = 0
    let active = false

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return
      if (!lockedRef.current && !(fullyVisibleRef.current && armedRef.current)) return
      active = true
      startY = e.touches[0]!.clientY
      lastY = startY
    }

    const onTouchMove = (e: TouchEvent) => {
      if (!active) return
      if (e.touches.length !== 1) return

      lastY = e.touches[0]!.clientY
      const dy = lastY - startY
      if (Math.abs(dy) < 2) return

      const dir: 1 | -1 = dy < 0 ? 1 : -1

      if (!lockedRef.current && fullyVisibleRef.current && armedRef.current) {
        const startIdx = dir === 1 ? 0 : n - 1
        if ((startIdx === 0 && dir === -1) || (startIdx === n - 1 && dir === 1)) {
          active = false
          return
        }
        setStartIdxNoAnim(startIdx)
        lockPage()
      }

      if (!lockedRef.current) return

      const cur = idxRef.current
      const atFirst = cur === 0
      const atLast = cur === n - 1

      if ((atLast && dir === 1) || (atFirst && dir === -1)) {
        unlockForExit()
        active = false
        return
      }

      if (e.cancelable) e.preventDefault()
    }

    const onTouchEnd = () => {
      if (!active) return
      active = false
      if (!lockedRef.current) return
      if (animLockRef.current) return

      const dy = lastY - startY
      if (Math.abs(dy) < 55) return

      const dir: 1 | -1 = dy < 0 ? 1 : -1
      step(dir)
    }

    window.addEventListener("touchstart", onTouchStart, { passive: true })
    window.addEventListener("touchmove", onTouchMove, { passive: false })
    window.addEventListener("touchend", onTouchEnd, { passive: true })
    window.addEventListener("touchcancel", onTouchEnd, { passive: true })

    return () => {
      window.removeEventListener("touchstart", onTouchStart as any)
      window.removeEventListener("touchmove", onTouchMove as any)
      window.removeEventListener("touchend", onTouchEnd as any)
      window.removeEventListener("touchcancel", onTouchEnd as any)
    }
  }, [n])

  // keyboard support (desktop)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!lockedRef.current) return
      if (animLockRef.current) return

      const cur = idxRef.current
      const atFirst = cur === 0
      const atLast = cur === n - 1

      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        if (atLast) {
          unlockForExit()
          return
        }
        e.preventDefault()
        step(1)
      }

      if (e.key === "ArrowUp" || e.key === "PageUp") {
        if (atFirst) {
          unlockForExit()
          return
        }
        e.preventDefault()
        step(-1)
      }
    }

    window.addEventListener("keydown", onKeyDown, { passive: false })
    return () => window.removeEventListener("keydown", onKeyDown as any)
  }, [n])

  const translatePct = (idx * 100) / n

  // show hint only on mobile, only while locked, only on first card
  const hintText = locked && showSwipeHint && idx === 0 ? "Swipe up" : null

  return (
    <section
      id="plans"
      ref={sectionRef as any}
      className="relative isolate h-[100svh] w-full overflow-hidden"
      style={{ background: "#F5F5F2" }}
    >
      <style>{`
  @keyframes swipeHintFloat {
    0%   { opacity: 0;   transform: translate3d(0, 10px, 0) scale(0.98); }
    22%  { opacity: .85; transform: translate3d(0, 2px, 0)  scale(1); }
    55%  { opacity: .85; transform: translate3d(0, -8px, 0) scale(1.02); }
    100% { opacity: 0;   transform: translate3d(0, -18px, 0) scale(1.02); }
  }

  .swipeHintFloat {
    animation: swipeHintFloat 1.55s ease-in-out infinite;
    will-change: transform, opacity;
  }
`}</style>

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
      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-center px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto text-center text-black" style={{ opacity: sectionFade }}>
          <h1 className="leading-[0.82] tracking-tight text-current">
            <span className="block text-3xl sm:text-4xl md:text-5xl" style={{ fontWeight: 800, letterSpacing: "0.15em" }}>
              COACHING EXPERIENCE
            </span>
          </h1>
        </div>

        <div className="mx-auto mt-6 w-full">
          {/* BLACK WINDOW */}
          <div className={cn("relative mx-auto w-full overflow-hidden rounded-[32px] border border-black/10 bg-black shadow-sm")}>
            <div
              className="w-full"
              style={{
                height: "min(70vh, 560px)",
                minHeight: "420px",
              }}
            >
              {/* STACK */}
              <div
                className="grid w-full"
                style={{
                  height: `${n * 100}%`,
                  gridTemplateRows: `repeat(${n}, minmax(0, 1fr))`,
                  transform: `translate3d(0, -${translatePct}%, 0)`,
                  transition: skipAnim ? "none" : `transform ${DURATION}ms ease-out`,
                  willChange: "transform",
                }}
              >
                {plans.map((p, i) => (
                  <div key={i} className="h-full">
                    <PlanCard plan={p} hint={i === idx ? hintText : null} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-6 flex justify-center">
            <a
              href="#plan"
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
        </div>
      </div>
    </section>
  )
}
