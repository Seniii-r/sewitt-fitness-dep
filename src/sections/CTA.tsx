// src/sections/CTA.tsx
import { useRef, useState, useEffect } from "react"

const PAGE_BLACK = "#0B0B0C"

export default function CTA() {
  const ref = useRef<HTMLElement | null>(null)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.src = "/img/footer.jpeg"
  }, [])

  return (
    <section ref={ref as any} className="relative isolate w-full" style={{ backgroundColor: PAGE_BLACK }}>
      {/* Background image */}
      <div className="absolute inset-0 -z-10" style={{ backgroundColor: PAGE_BLACK }}>
        <img
          src={hovered ? "/img/footer.jpeg" : "/img/footer2.jpeg"}
          alt=""
          className="h-full w-full object-cover transition-opacity duration-300"
          style={{ objectPosition: "center 99%" }}
          draggable={false}
        />
      </div>

      {/* CTA */}
      <div className="mx-auto flex min-h-[64dvh] max-w-6xl items-center justify-center px-5 py-16 sm:px-9 sm:py-21">
        {/* push content up, but not ridiculously on mobile */}
        <div className="mx-auto max-w-3xl text-center text-white -translate-y-8 sm:-translate-y-14">
          {/* Title (replaced only) */}
          <h1 className="leading-[0.82] tracking-tight text-white">
            <span
              className="block text-3xl sm:text-4xl md:text-5xl"
              style={{ fontWeight: 800, letterSpacing: "0.15em" }}
            >
              Book Your Free Intro Assessment
            </span>
          </h1>

          <p className="mt-5 text-sm text-white/75 sm:text-base">
            This isn’t a “free session.” It’s a structured entry point where we assess goals, set expectations, and confirm fit. If coaching makes sense, you’ll leave with a clear plan for the next steps.
          </p>

          <div className="mt-8 flex justify-center">
            <a
              href="https://calendly.com/sewitt-fitness-calendly/30min?"
              target="_blank"
              rel="noopener noreferer"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              className={[
                "inline-flex items-center justify-center",
                "px-8 sm:px-10 py-3 text-base sm:text-lg font-semibold",
                "transition-all hover:scale-[1.02]",
                "bg-white/10 text-[#F5F5F2] border border-white/15 backdrop-blur-md",
                "hover:bg-[#C1121F]/15 hover:border-[#C1121F]/40 hover:shadow-[0_18px_60px_rgba(193,18,31,0.45)]",
              ].join(" ")}
            >
              Book Free Into Session
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
