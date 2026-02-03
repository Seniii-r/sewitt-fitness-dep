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

function PlanCard({ plan }: { plan: (typeof plans)[number] }) {
  return (
    <div className="grid h-full gap-4 p-5 sm:p-8 md:grid-cols-[1fr_1fr] md:items-center md:gap-8">
      <div className="overflow-hidden rounded-3xl bg-white/5">
        <img
          src={plan.img}
          alt=""
          className="h-48 w-full object-cover sm:h-64 md:h-[420px] md:w-full"
          draggable={false}
        />
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

  // animation lock (prevents skipping multiple slides per fling)
  const animLockRef = useRef(false)
  const DURATION = 520

  // page lock state
  const [locked, setLocked] = useState(false)
  const lockedRef = useRef(false)
  useEffect(() => {
    lockedRef.current = locked
  }, [locked])

  // direction tracking for entry
  const lastScrollYRef = useRef<number>(typeof window !== "undefined" ? window.scrollY : 0)
  const lastDirRef = useRef<1 | -1>(1) // 1=down, -1=up

  // prevents instant re-lock after we intentionally unlock to exit
  const armedRef = useRef(true)

  // smoother lock scheduling
  const pendingLockRef = useRef(false)

  // store scroll position while locked (iOS-safe locking)
  const savedScrollYRef = useRef(0)

  // avoid layout jump when scrollbar disappears (desktop)
  const savedPaddingRightRef = useRef("")
  const savedScrollBehaviorRef = useRef("")

  const getViewportH = () => window.visualViewport?.height ?? window.innerHeight ?? 1
  const tol = 28

  const isFullyVisibleNow = () => {
    if (!sectionRef.current) return false
    const r = sectionRef.current.getBoundingClientRect()
    const vh = getViewportH()
    return r.top >= -tol && r.bottom <= vh + tol
  }

  const lockPage = () => {
    if (lockedRef.current) return

    // kill smooth scrolling during lock/unlock so it doesn't "animate" and flicker
    savedScrollBehaviorRef.current = document.documentElement.style.scrollBehavior
    document.documentElement.style.scrollBehavior = "auto"

    const y = window.scrollY || 0
    savedScrollYRef.current = y

    // compensate scrollbar (prevents horizontal jump)
    const scrollBarW = window.innerWidth - document.documentElement.clientWidth
    const body = document.body
    savedPaddingRightRef.current = body.style.paddingRight
    if (scrollBarW > 0) body.style.paddingRight = `${scrollBarW}px`

    // iOS-safe "freeze"
    body.style.position = "fixed"
    body.style.top = `-${y}px`
    body.style.left = "0"
    body.style.right = "0"
    body.style.width = "100%"
    body.style.transform = "translateZ(0)" // compositor hint, reduces paint weirdness

    // stop chaining/rubber-banding where supported
    document.documentElement.style.overscrollBehavior = "none"
    body.style.overscrollBehavior = "none"

    setLocked(true)
  }

  const unlockPage = () => {
    if (!lockedRef.current) return

    const body = document.body
    const y = savedScrollYRef.current

    body.style.position = ""
    body.style.top = ""
    body.style.left = ""
    body.style.right = ""
    body.style.width = ""
    body.style.transform = ""

    // restore scrollbar compensation
    body.style.paddingRight = savedPaddingRightRef.current

    document.documentElement.style.overscrollBehavior = ""
    body.style.overscrollBehavior = ""

    // restore scroll behavior AFTER we jump back
    window.scrollTo(0, y)
    document.documentElement.style.scrollBehavior = savedScrollBehaviorRef.current || ""

    setLocked(false)
  }

  // safety cleanup
  useEffect(() => {
    return () => unlockPage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const step = (dir: 1 | -1) => {
    if (animLockRef.current) return
    const cur = idxRef.current
    const next = Math.min(n - 1, Math.max(0, cur + dir))
    if (next === cur) return

    setIdx(next)
    idxRef.current = next

    animLockRef.current = true
    window.setTimeout(() => {
      animLockRef.current = false
    }, DURATION + 40)
  }

  const unlockForExit = () => {
    armedRef.current = false
    pendingLockRef.current = false
    unlockPage()
  }

  // detect "fully in view" + background fade + entry logic (with smoother lock)
  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return
      if (rafRef.current) cancelAnimationFrame(rafRef.current)

      rafRef.current = requestAnimationFrame(() => {
        const el = sectionRef.current!
        const r = el.getBoundingClientRect()
        const vh = getViewportH()

        // track direction (only meaningful when not locked)
        if (!lockedRef.current) {
          const y = window.scrollY
          const dy = y - lastScrollYRef.current
          if (Math.abs(dy) > 1) lastDirRef.current = dy > 0 ? 1 : -1
          lastScrollYRef.current = y
        }

        // background fade
        const visiblePx = Math.min(vh, Math.max(0, r.bottom)) - Math.max(0, r.top)
        const visibleRatio = clamp01(visiblePx / vh)
        setSectionFade(smoothstep(visibleRatio))

        const fullyVisible = r.top >= -tol && r.bottom <= vh + tol

        // re-arm once we’re no longer fully visible
        if (!fullyVisible) {
          armedRef.current = true
          pendingLockRef.current = false
        }

        // schedule a smooth lock only when fully visible + armed + not already locked
        if (fullyVisible && armedRef.current && !lockedRef.current && !pendingLockRef.current) {
          pendingLockRef.current = true

          // start card based on entry direction
          const enteringDir = lastDirRef.current
          const startIdx = enteringDir === 1 ? 0 : n - 1
          setIdx(startIdx)
          idxRef.current = startIdx

          // delay lock until paint settles (reduces flicker)
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              if (!pendingLockRef.current) return
              if (lockedRef.current) return
              if (!armedRef.current) return
              if (!isFullyVisibleNow()) {
                pendingLockRef.current = false
                return
              }
              lockPage()
            })
          })
        }
      })
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    window.visualViewport?.addEventListener("resize", onScroll)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      window.visualViewport?.removeEventListener("resize", onScroll)
    }
  }, [n])

  // Wheel anywhere (desktop)
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (!lockedRef.current) return
      if (Math.abs(e.deltaY) < 10) return

      const dir: 1 | -1 = e.deltaY > 0 ? 1 : -1
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

  // Touch anywhere (mobile)
  useEffect(() => {
    let startY = 0
    let lastY = 0
    let active = false

    const onTouchStart = (e: TouchEvent) => {
      if (!lockedRef.current) return
      if (e.touches.length !== 1) return
      active = true
      startY = e.touches[0]!.clientY
      lastY = startY
    }

    const onTouchMove = (e: TouchEvent) => {
      if (!lockedRef.current || !active) return
      if (e.touches.length !== 1) return
      lastY = e.touches[0]!.clientY

      const dy = lastY - startY
      if (Math.abs(dy) < 8) return

      const dir: 1 | -1 = dy < 0 ? 1 : -1
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
      if (!lockedRef.current || !active) {
        active = false
        return
      }
      active = false
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

  // (Optional) keyboard support
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!lockedRef.current) return
      if (animLockRef.current) return

      const cur = idxRef.current
      const atFirst = cur === 0
      const atLast = cur === n - 1

      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        const dir: 1 | -1 = 1
        if (atLast) {
          unlockForExit()
          return
        }
        e.preventDefault()
        step(dir)
      }

      if (e.key === "ArrowUp" || e.key === "PageUp") {
        const dir: 1 | -1 = -1
        if (atFirst) {
          unlockForExit()
          return
        }
        e.preventDefault()
        step(dir)
      }
    }

    window.addEventListener("keydown", onKeyDown, { passive: false })
    return () => window.removeEventListener("keydown", onKeyDown as any)
  }, [n])

  const translatePct = (idx * 100) / n

  return (
    <section
      id="plans"
      ref={sectionRef as any}
      className="relative isolate h-[100svh] w-full overflow-hidden"
      style={{ background: "#F5F5F2" }}
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
      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-center px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto text-center text-black" style={{ opacity: sectionFade }}>
          <h1 className="leading-[0.82] tracking-tight text-current">
            <span
              className="block text-3xl sm:text-4xl md:text-5xl"
              style={{ fontWeight: 800, letterSpacing: "0.15em" }}
            >
              COACHING EXPERIENCE
            </span>
          </h1>
        </div>

        <div className="mx-auto mt-6 w-full">
          {/* BLACK WINDOW (constant size) */}
          <div
            className={cn(
              "relative mx-auto w-full overflow-hidden rounded-[32px] border border-black/10 bg-black shadow-sm"
            )}
          >
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
                  transition: `transform ${DURATION}ms ease-out`,
                  willChange: "transform",
                }}
              >
                {plans.map((p, i) => (
                  <div key={i} className="h-full">
                    <PlanCard plan={p} />
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
