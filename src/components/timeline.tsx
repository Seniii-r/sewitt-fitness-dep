// src/components/timeline.tsx
import React, { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

export type TimelineEntry = {
  title: string
  content: React.ReactNode
}

export function Timeline({
  data,
  className = "",
  heading = "Steps",
  subheading = "Book a free session → stay consistent weekly → get ongoing coaching.",
  showHeader = true,
}: {
  data: TimelineEntry[]
  className?: string
  heading?: string
  subheading?: string
  showHeader?: boolean
}) {
  const railMeasureRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const rafRef = useRef<number | null>(null)

  const [height, setHeight] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)

  // Measure rail height reliably (handles content changes + resize)
  useEffect(() => {
    const el = railMeasureRef.current
    if (!el) return

    const measure = () => setHeight(el.getBoundingClientRect().height || 0)
    measure()

    const ro =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null
    ro?.observe(el)

    window.addEventListener("resize", measure)
    return () => {
      ro?.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [])

  // Track which step is "hit" (closest to an anchor point in viewport)
  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)

      rafRef.current = requestAnimationFrame(() => {
        const anchorY = Math.round((window.innerHeight || 1) * 0.42) // tweak if you want earlier/later activation

        let bestIdx = 0
        let bestDist = Number.POSITIVE_INFINITY

        for (let i = 0; i < itemRefs.current.length; i++) {
          const node = itemRefs.current[i]
          if (!node) continue
          const r = node.getBoundingClientRect()

          // distance from anchor to the item's top-ish area
          const dist = Math.abs(r.top - anchorY)
          if (dist < bestDist) {
            bestDist = dist
            bestIdx = i
          }
        }

        setActiveIndex((prev) => (prev === bestIdx ? prev : bestIdx))
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
  }, [data.length])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  })

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height])
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1])

  return (
    <div
      ref={containerRef}
      className={["w-full font-sans bg-[#0B0B0C] text-white", className].join(" ")}
    >
      {showHeader && (
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 lg:px-10">
          <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
            {heading}
          </h2>
          <p className="mt-3 max-w-xl text-sm text-white/70 md:text-base">
            {subheading}
          </p>
        </div>
      )}

      <div
        ref={railMeasureRef}
        className="relative mx-auto max-w-7xl px-4 pb-24 md:px-8 lg:px-10"
      >
        {data.map((item, index) => {
          const isActive = activeIndex === index

          return (
            <div
              key={index}
              ref={(el) => {
                itemRefs.current[index] = el
              }}
              className="flex justify-start pt-10 md:pt-40 md:gap-10"
            >
              {/* LEFT sticky title column */}
              <div className="sticky top-40 z-40 relative flex flex-col items-center self-start max-w-xs md:w-full md:flex-row lg:max-w-sm">
                {/* Dot */}
                <div
                  className={[
                    "absolute left-3 flex h-10 w-10 items-center justify-center rounded-full ring-1 transition-colors duration-300",
                    isActive ? "bg-[#0B0B0C] ring-white/30" : "bg-[#0B0B0C] ring-white/10",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "h-4 w-4 rounded-full ring-1 transition-colors duration-300",
                      isActive ? "bg-white/45 ring-white/35" : "bg-white/10 ring-white/15",
                    ].join(" ")}
                  />
                </div>

                {/* Desktop title (brighten when active) */}
                <h3
                  className={[
                    "hidden md:block text-xl md:pl-20 md:text-5xl font-bold transition-colors duration-300",
                    isActive ? "text-white" : "text-white/35",
                  ].join(" ")}
                >
                  {item.title}
                </h3>
              </div>

              {/* RIGHT content column */}
              <div className="relative w-full pl-20 pr-4 md:pl-4">
                {/* Mobile title (brighten when active) */}
                <h3
                  className={[
                    "md:hidden block text-2xl mb-4 text-left font-bold transition-colors duration-300",
                    isActive ? "text-white" : "text-white/35",
                  ].join(" ")}
                >
                  {item.title}
                </h3>

                {item.content}
              </div>
            </div>
          )
        })}

        {/* Vertical rail */}
        <div
          style={{ height: height + "px" }}
          className={[
            "pointer-events-none absolute left-18 top-0 w-[2px] overflow-hidden",
            "bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))]",
            "from-transparent via-white/20 to-transparent",
            "[mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]",
          ].join(" ")}
        >
          <motion.div
            style={{ height: heightTransform, opacity: opacityTransform }}
            className="absolute inset-x-0 top-0 w-[2px] rounded-full bg-gradient-to-t from-[#C1121F] via-[#E9D050] to-transparent"
          />
        </div>
      </div>
    </div>
  )
}
