// src/sections/Hero.tsx
import { useEffect, useMemo, useState } from "react"
import { cn } from "../lib/cn"

type Testimonial = {
  quote: string
  name: string
}

const BRAND = {
  onyx: "#0B0B0C",
  smoke: "#F5F5F2",
  red: "#C1121F",
  gold: "#E9D050",
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

export default function Hero() {
  const nav = useMemo(
    () => [
      { label: "Home", href: "#home" },
      { label: "Coaching Experience", href: "#plans" },
      { label: "How it Works", href: "#plan" },
      { label: "Testimonials", href: "#testimonials" },
      { label: "About", href: "#coach" },
      { label: "FAQ", href: "#FAQ" },
    ],
    []
  )

  const testimonials: Testimonial[] = useMemo(
    () => [
      {
        quote: "Sewitt helped me lose many, many pounds. I finally feel in control again.",
        name: "Martha Jenkins",
      },
      {
        quote: "Sewitt not only helped me level up my weightlifting game, I added serious weight to my lifts.",
        name: "Paul Stuart",
      },
      {
        quote: "The plan was simple, consistent, and it actually worked. The progress felt inevitable.",
        name: "Nadia Rahman",
      },
    ],
    []
  )

  const [idx, setIdx] = useState(0)
  const [show, setShow] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setShow(false)
      setTimeout(() => {
        setIdx((v) => (v + 1) % testimonials.length)
        setShow(true)
      }, 240)
    }, 4200)

    return () => clearInterval(interval)
  }, [testimonials.length])

  const current = testimonials[idx]

  const [fade, setFade] = useState(1)

  useEffect(() => {
    const el = document.getElementById("home")
    if (!el) return

    let ratioFade = 1
    const thresholds = Array.from({ length: 51 }, (_, i) => i / 50)

    const HOLD_PX = 220
    const RAMP_PX = 260

    const obs = new IntersectionObserver(
      ([entry]) => {
        ratioFade = clamp01(entry.intersectionRatio)
      },
      { threshold: thresholds }
    )

    obs.observe(el)

    const onScroll = () => {
      const y = window.scrollY || 0

      if (y <= HOLD_PX) {
        setFade(1)
        return
      }

      const rampT = clamp01((y - HOLD_PX) / RAMP_PX)
      const next = 1 - rampT * (1 - ratioFade)
      setFade(next)
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)

    return () => {
      obs.disconnect()
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  useEffect(() => {
    const id = "sf-permanent-marker-font"
    if (document.getElementById(id)) return
    const link = document.createElement("link")
    link.id = id
    link.rel = "stylesheet"
    link.href = "https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap"
    document.head.appendChild(link)
  }, [])

  // ✅ Mobile menu state
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <section
      id="home"
      className={[
        "relative isolate overflow-hidden transition-opacity duration-500 ease-out",
        "min-h-[100dvh] md:h-[100vh] md:max-h-[100vh]",
      ].join(" ")}
      style={{ opacity: fade }}
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(11, 11, 12, 1)" }} />
        <div
          className="absolute sm:inset-0"
          style={{
            background: "radial-gradient(900px 480px at 20% 30%, rgba(233, 208, 80, 0.19), transparent 60%)",
          }}
        />
        <div
          className="absolute sm:inset-0"
          style={{
            background: "radial-gradient(700px 420px at 0% 0%, rgba(233, 208, 80, 0.19), transparent 62%)",
          }}
        />
      </div>

      <div className="mx-auto flex h-full w-full flex-col px-5 sm:px-8 lg:px-16 2xl:px-24">
        <div className="pt-4 sm:pt-6">
          <div className="flex items-center justify-between">
            {/* ✅ Desktop nav (unchanged) */}
            <nav className="hidden items-center gap-6 text-sm md:flex" style={{ color: `${BRAND.smoke}B3` }}>
              {nav.map((x) => (
                <a key={x.label} href={x.href} className="hover:text-[#F5F5F2]">
                  {x.label}
                </a>
              ))}
            </nav>

            {/* ✅ Mobile menu button */}
            <div className="relative md:hidden">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="inline-flex items-center justify-center border px-4 py-2 text-xs font-semibold backdrop-blur-md"
                style={{
                  color: BRAND.smoke,
                  borderColor: "rgba(245,245,242,0.18)",
                  backgroundColor: "rgba(11,11,12,0.35)",
                }}
                aria-expanded={menuOpen}
                aria-label="Open menu"
              >
                Menu
              </button>

              {menuOpen && (
                <div
                  className="absolute left-0 mt-3 w-56 overflow-hidden rounded-2xl border backdrop-blur-md"
                  style={{
                    borderColor: "rgba(245,245,242,0.16)",
                    backgroundColor: "rgba(11,11,12,0.75)",
                  }}
                >
                  <div className="grid py-2">
                    {nav.map((x) => (
                      <a
                        key={x.label}
                        href={x.href}
                        onClick={() => setMenuOpen(false)}
                        className="px-4 py-3 text-sm transition-colors hover:bg-white/10"
                        style={{ color: "rgba(245,245,242,0.85)" }}
                      >
                        {x.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Top-right CTA */}
            <a
              href="#plan"
              className="inline-flex items-center gap-3 px-3 py-2 text-xs font-semibold shadow-lg transition-transform hover:scale-[1.01] sm:px-4 sm:text-sm"
              style={{
                backgroundColor: BRAND.red,
                color: BRAND.smoke,
                border: "1px solid rgba(193, 18, 31, 1)",
              }}
            >
              See How Coaching Works
            </a>
          </div>
        </div>

        <div className="flex flex-1 items-center py-10 sm:py-12 md:py-0">
          <div className="w-full">
            <div className="grid w-full items-start gap-10 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="max-w-2xl">
                {/* ✅ MOBILE ONLY: H1 ABOVE IMAGE */}
                <div className="lg:hidden">
                  <h1 className="leading-[0.82] tracking-tight" style={{ color: BRAND.smoke }}>
                    <span
                      className="block text-5xl sm:text-6xl md:text-9xl"
                      style={{
                        fontWeight: 800,
                        letterSpacing: "0.15em",
                      }}
                    >
                      SEWITT.
                      <span className="block text-5xl sm:text-6xl md:text-9xl">FITNESS</span>
                    </span>
                  </h1>

                  {/* ✅ MOBILE ONLY: IMAGE + BUTTON ON IMAGE (gold overlay removed) */}
                  <div className="relative mt-6 w-full overflow-hidden">
                    <img
                      src="/img/hero1.jpeg"
                      alt="Sewitt"
                      className="h-[340px] w-full object-cover sm:h-[520px]"
                      style={{ backgroundColor: "rgba(11, 11, 12, 1)" }}
                    />

                    {/* Bottom dark fade (keeps readability) */}
                    <div
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
                      style={{
                        background: "linear-gradient(to top, rgba(11,11,12,0.85), transparent)",
                      }}
                    />

                    {/* CTA ON IMAGE */}
                    <a
                      href="https://calendly.com/sewitt-fitness-calendly/30min?"
                      target="_blank"
                      rel="noopener noreferer"
                      className={[
                        "absolute left-1/2 -translate-x-1/2 z-10",
                        "bottom-5",
                        "inline-flex items-center justify-center",
                        "px-3 py-1 text-sm sm:text-m font-semibold",
                        "transition-all active:scale-[0.99]",
                        "bg-white/10 text-[#F5F5F2] text-center border border-white/15 backdrop-blur-md",
                        "hover:bg-[#C1121F]/15 hover:border-[#C1121F]/40 hover:shadow-[0_18px_60px_rgba(193,18,31,0.45)]",
                      ].join(" ")}
                    >
                      Book Free Intro <br></br>Session
                    </a>
                  </div>
                </div>

                {/* ✅ DESKTOP ONLY: original H1 stays where it was */}
                <div className="hidden lg:block">
                  <h1 className="leading-[0.82] tracking-tight" style={{ color: BRAND.smoke }}>
                    <span
                      className="block text-5xl sm:text-6xl md:text-9xl"
                      style={{
                        fontWeight: 800,
                        letterSpacing: "0.15em",
                      }}
                    >
                      SEWITT.
                      <span className="block text-5xl sm:text-6xl md:text-9xl">FITNESS</span>
                    </span>
                  </h1>
                </div>

                <h2 className="mt-6 text-2xl font-semibold leading-[1.06] sm:text-4xl" style={{ color: BRAND.smoke }}>
                  A complete coaching experience, not just workouts.
                </h2>

                <p className="mt-5 text-sm leading-6 sm:text-base sm:leading-7" style={{ color: "rgba(245,245,242,0.72)" }}>
                  Train with structure, accountability, and a coach you work closely with over time, so your results
                  actually stick. Consistency beats intensity, the plan adapts as you progress, and the process stays
                  clear.
                </p>

                <div
                  className="mt-7 w-full max-w-xl overflow-hidden rounded-3xl border p-5 backdrop-blur-md"
                  style={{
                    borderColor: "rgba(245, 245, 242, 0.18)",
                    backgroundColor: "rgba(11,11,12,0.48)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold" style={{ color: "rgba(245,245,242,0.75)" }}>
                      Client proof
                    </div>
                    <div className="flex items-center gap-1" style={{ color: BRAND.gold }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                      <span className="ml-2 text-xs" style={{ color: "rgba(245,245,242,0.65)" }}>
                        100+ coached
                      </span>
                    </div>
                  </div>

                  <div className="relative mt-3 h-[96px] sm:h-[96px]">
                    <div className={cn("absolute inset-0 transition-opacity duration-500 ease-out", show ? "opacity-100" : "opacity-0")}>
                      <p className="text-sm leading-6" style={{ color: "rgba(245,245,242,0.90)" }}>
                        “{current.quote}”
                      </p>
                      <div className="mt-2 text-xs font-semibold" style={{ color: "rgba(245,245,242,0.65)" }}>
                        – {current.name}
                      </div>
                    </div>
                  </div>

                  <a
                    href="#testimonials"
                    className="mt-2 inline-block text-xs font-semibold transition-colors hover:text-white"
                    style={{ color: "rgba(245,245,242,0.75)" }}
                  >
                    Read more results →
                  </a>
                </div>
              </div>

              {/* ✅ DESKTOP ONLY (unchanged): image + button overlay */}
              <div className="hidden justify-center lg:flex lg:justify-end">
                <div className="relative w-full max-w-[720px]">
                  <img
                    src="/img/hero1.jpeg"
                    alt="Sewitt"
                    className="h-[340px] w-full object-cover sm:h-[520px] lg:h-[720px]"
                    style={{ backgroundColor: "rgba(11, 11, 12, 1)" }}
                  />

                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
                    style={{
                      background: "linear-gradient(to top, rgba(11,11,12,0.85), transparent)",
                    }}
                  />

                  <a
                    href="https://calendly.com/sewitt-fitness-calendly/30min?"
                    target="_blank"
                    rel="noopener noreferer"
                    className={[
                      "absolute left-1/2 -translate-x-1/2",
                      "bottom-5 sm:bottom-7",
                      "inline-flex items-center justify-center",
                      "px-6 sm:px-10 py-3 text-base sm:text-lg font-semibold",
                      "transition-all hover:scale-[1.02]",
                      "bg-white/10 text-[#F5F5F2] border border-white/15 backdrop-blur-md",
                      "hover:bg-[#C1121F]/15 hover:border-[#C1121F]/40 hover:shadow-[0_18px_60px_rgba(193,18,31,0.45)]",
                    ].join(" ")}
                  >
                    Book Free Intro Session
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
