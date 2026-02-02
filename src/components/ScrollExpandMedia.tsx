// src/components/ScrollExpandMedia.tsx
import { useEffect, useMemo, useRef, useState, type ReactNode, type CSSProperties } from "react"
import { cn } from "../lib/cn"

type ScrollExpandMediaProps = {
  id?: string
  mediaType?: "image" | "video"
  mediaSrc: string
  posterSrc?: string
  bgImageSrc: string

  // mid-way media swap (ONLY media, not background)
  swapMediaSrc?: string
  swapAt?: number // 0..1 where swap centers
  swapWidth?: number // 0..1 how wide the swap fade is

  title?: string
  subtitle?: string
  scrollHint?: string
  children?: ReactNode
  className?: string

  runwayVh?: number
  mediaOffsetY?: number

  // ✅ ensures the section ends on EXACT color
  baseBg?: string
}

const PAGE_BLACK = "#0B0B0C"

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))
const smoothstep = (t: number) => t * t * (3 - 2 * t)

export default function ScrollExpandMedia({
  id,
  mediaType = "image",
  mediaSrc,
  posterSrc,
  bgImageSrc,

  swapMediaSrc,
  swapAt = 0.55,
  swapWidth = 0.22,

  title,
  subtitle,
  scrollHint = "Scroll to expand",
  children,
  className,

  runwayVh = 110,
  mediaOffsetY = 56,

  baseBg = PAGE_BLACK,
}: ScrollExpandMediaProps) {
  const stageWrapRef = useRef<HTMLDivElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const [p, setP] = useState(0) // 0..1

  // scroll -> progress (purely scroll driven, fully reversible, no measuring bugs)
  useEffect(() => {
    const onScroll = () => {
      if (!stageWrapRef.current) return
      if (rafRef.current) cancelAnimationFrame(rafRef.current)

      rafRef.current = requestAnimationFrame(() => {
        const el = stageWrapRef.current!
        const rect = el.getBoundingClientRect()
        const vh = window.innerHeight || 1
        const runwayPx = Math.max(1, (runwayVh / 100) * vh)

        // 0 when stage reaches top, 1 after runwayPx scroll
        const raw = -rect.top / runwayPx
        setP(smoothstep(clamp01(raw)))
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
  }, [runwayVh])

  // title fades away near the end
  const titleOpacity = clamp01(1 - (p - 0.82) / 0.18)
  const hintOpacity = clamp01(1 - p * 1.2)

  // media swap factor (0..1)
  const swapT = useMemo(() => {
    if (!swapMediaSrc || mediaType !== "image") return 0
    const start = clamp01(swapAt - swapWidth / 2)
    const end = clamp01(swapAt + swapWidth / 2)
    const t = (p - start) / Math.max(0.0001, end - start)
    return smoothstep(clamp01(t))
  }, [p, swapMediaSrc, swapAt, swapWidth, mediaType])

  const mediaStyle: CSSProperties = useMemo(
    () => ({
      width: `calc(320px + ${p} * (min(95vw, 1200px) - 320px))`,
      height: `calc(360px + ${p} * (min(62vh, 560px) - 360px))`,
      borderRadius: `calc(28px + ${(1 - p)} * 10px)`,
      boxShadow: "0px 0px 50px rgba(0,0,0,0.35)",
      transform: `translateY(${mediaOffsetY}px)`,
      willChange: "width,height,transform,border-radius",
    }),
    [p, mediaOffsetY]
  )

  return (
    <section id={id} className={cn("relative isolate", className)} style={{ backgroundColor: baseBg }}>
      {/* stage runway: sticky lives ONLY in here */}
      <div
        ref={stageWrapRef}
        className="relative"
        style={{
          height: `calc(100vh + ${runwayVh}vh)`,
          backgroundColor: baseBg,
        }}
      >
        <div className="sticky top-0 flex min-h-screen items-start justify-center pt-10 sm:pt-12">
          {/* Background (guaranteed to end at baseBg) */}
          <div className="pointer-events-none absolute inset-0 -z-10" style={{ backgroundColor: baseBg }}>
            {/* base color always there */}
            <div className="absolute inset-0" style={{ backgroundColor: baseBg }} />

            {/* background image fades out fully */}
            <img
              src={bgImageSrc}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              style={{ opacity: 1 - p }}
            />

            {/* scrim uses SAME base color so end color never shifts */}
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: baseBg,
                opacity: 0.35 + p * 0.65, // goes to 1 at end (still baseBg)
              }}
            />

            {/* gradient for readability early, fades OUT completely */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to right, rgba(0,0,0,0.65), rgba(0,0,0,0.35), rgba(0,0,0,0.15))",
                opacity: (1 - p) * 0.55,
              }}
            />
          </div>

          <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-6">
            {/* Title block */}
            <div className="flex flex-col items-center text-center">
              {title && (
                <h2
                  className="text-4xl font-semibold tracking-tight text-white sm:text-6xl"
                  style={{
                    opacity: titleOpacity,
                    transform: `translateX(-${p * 6}vw) translateY(${(1 - titleOpacity) * -8}px)`,
                  }}
                >
                  {title}
                </h2>
              )}
              {subtitle && (
                <p
                  className="mt-2 text-sm text-white/70 sm:text-base"
                  style={{
                    opacity: titleOpacity,
                    transform: `translateX(${p * 6}vw)`,
                  }}
                >
                  {subtitle}
                </p>
              )}
              <p className="mt-3 text-xs text-white/60" style={{ opacity: hintOpacity }}>
                {scrollHint}
              </p>
            </div>

            {/* Media */}
            <div
              className="relative z-10 mx-auto mt-10 overflow-hidden bg-white/10 ring-1 ring-white/15 backdrop-blur-md"
              style={mediaStyle}
            >
              {mediaType === "video" ? (
                <video
                  src={mediaSrc}
                  poster={posterSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="relative h-full w-full">
                  <img
                    src={mediaSrc}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ opacity: 1 - swapT }}
                  />
                  {swapMediaSrc && (
                    <img
                      src={swapMediaSrc}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                      style={{ opacity: swapT }}
                    />
                  )}
                </div>
              )}

              <div className="absolute inset-0 bg-black/20" />
            </div>
          </div>
        </div>
      </div>

      {/* after animation: real page content (same baseBg, no seam) */}
      <div className="relative" style={{ backgroundColor: baseBg }}>
        <div className="mx-auto max-w-6xl px-5 pb-24 pt-16 sm:px-6 sm:pb-28">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6">
              {title && <h3 className="text-2xl font-semibold tracking-tight text-white">{title}</h3>}
              {subtitle && <p className="mt-2 text-sm text-white/70">{subtitle}</p>}
            </div>

            <div className="rounded-3xl border border-white/12 bg-white/10 p-6 text-white/85 backdrop-blur-md">
              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
