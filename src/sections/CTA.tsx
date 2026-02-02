// src/sections/CTA.tsx
import { useRef } from "react"

const PAGE_BLACK = "#0B0B0C"

export default function CTA() {
  const ref = useRef<HTMLElement | null>(null)

  return (
    <section ref={ref as any} className="relative isolate w-full" style={{ backgroundColor: PAGE_BLACK }}>
      {/* Background image (no overlay, no fade) */}
      <div className="absolute inset-0 -z-10" style={{ backgroundColor: PAGE_BLACK }}>
        <img
          src="/img/footer.jpeg"
          alt=""
          className="h-full w-full object-cover"
          style={{
            objectPosition: "center 59%", // adjust this to move image up/down
          }}
          draggable={false}
        />
      </div>

      {/* CTA */}
      <div className="mx-auto flex min-h-[64dvh] max-w-6xl items-center justify-center px-5 py-19 sm:px-9 sm:py-21">
        <div className="mx-auto max-w-3xl text-center text-white">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-4xl"> Book Your Free Intro Assessment</h2>
          <p className="mt-3 text-sm text-white/75 sm:text-base">
            This isn’t a “free session.” It’s a structured entry point where we assess goals, set expectations, and confirm fit. If coaching makes sense, you’ll leave with a clear plan for the next steps.
          </p>

          <div className="mt-8">
            <a
                    href="#contact"
                    className={[
                      "absolute bottom-25 left-1/2 -translate-x-1/2",
                      "inline-flex items-center justify-center",
                      "px-10 py-3 text-base sm:text-lg font-semibold",
                      "transition-all hover:scale-[1.02]",
                      "bg-white/10 text-[#F5F5F2] border border-white/15 backdrop-blur-md",
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
