// src/sections/Coach.tsx
import { useEffect, useMemo, useState } from "react"
import { cn } from "../lib/cn"

const BRAND = {
  onyx: "#0B0B0C",
  smoke: "#F5F5F2",
  red: "#C1121F",
}

export default function CoachAbout() {
  const images = useMemo(() => ["/img/sewitbox.jpeg", "/img/sewitdeadlift.jpeg"], [])
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const t = window.setInterval(() => {
      setIdx((v) => (v + 1) % images.length)
    }, 3000)
    return () => window.clearInterval(t)
  }, [images.length])

  return (
    <section
      id="coach"
      className="relative isolate overflow-hidden"
      style={{
        background: BRAND.onyx,
        minHeight: "100vh",
      }}
    >
      {/* TOP RED WAVE / GLOW */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[460px]" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(900px 380px at 100% 100%, rgba(193, 18, 31, 0.45), transparent 60%)",
          }}
        />
        <div
          className="absolute -top-28 left-1/2 h-[560px] w-[1500px] -translate-x-1/2 rounded-[999px]"
          style={{
            background: "radial-gradient(closest-side, rgba(193, 18, 31, 0.30), transparent 70%)",
            filter: "blur(10px)",
            transform: "translateX(40%) rotate(-6deg)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-44"
          style={{
            background: "linear-gradient(to bottom, rgba(11,11,12,0), rgba(11,11,12,1))",
          }}
        />
      </div>

      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-6 sm:px-12 lg:px-16 2xl:px-24">
        {/* Content */}
        <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10">
          {/* LEFT: crossfade images (bigger) */}
          <div className="relative">
            <div className="relative h-[520px] w-full sm:h-[620px] lg:h-[680px]">
              {images.map((src, i) => (
                <img
                  key={`${src}-${i}`}
                  src={src}
                  alt=""
                  className={cn(
                    "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out",
                    i === idx ? "opacity-100" : "opacity-0"
                  )}
                  style={{
                    borderRadius: "30px",
                    filter: "contrast(1.02) saturate(1.02)",
                  }}
                  draggable={false}
                />
              ))}

              {/* edge fade so the image blends into onyx */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  borderRadius: "30px",
                  background: "radial-gradient(closest-side, rgba(11,11,12,0.00) 58%, rgba(11,11,12,0.92) 100%)",
                }}
              />

              {/* subtle vignette */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  borderRadius: "30px",
                  background: "linear-gradient(90deg, rgba(11,11,12,0.03), rgba(11,11,12,0.55))",
                }}
              />
            </div>
          </div>

          {/* RIGHT: Title + text (title centered above paragraph) */}
          <div className="lg:pl-2">
            <h2
              className="text-center font-semibold uppercase tracking-[0.28em]"
              style={{
                color: "rgba(245,245,242,0.78)",
                fontSize: "clamp(16px, 1.6vw, 22px)",
              }}
            >
              About Sewitt Fitness
            </h2>

            <div className="mt-8">
              <p className="text-base leading-7 sm:text-lg sm:leading-8" style={{ color: "rgba(245,245,242,0.86)" }}>
                Sewitt Fitness is built around delivering a complete personal training experience. From structured
                programming to clear expectations and ongoing accountability, every part of the process is designed to
                support long-term progress.
              </p>

              <p className="mt-6 text-base leading-7 sm:text-lg sm:leading-8" style={{ color: "rgba(245,245,242,0.76)" }}>
                This isn’t about quick fixes or isolated sessions. It’s about working closely with a coach over time,
                removing guesswork, and building consistency until results become normal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
