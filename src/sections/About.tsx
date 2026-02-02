import { useEffect, useMemo, useState } from "react"
import { cn } from "../lib/cn"

export default function About() {
  const images = useMemo(() => ["/img/about1.jpg", "/img/about2.jpg"], [])
  const [idx, setIdx] = useState(0)
  const [show, setShow] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setShow(false)
      setTimeout(() => {
        setIdx((v) => (v + 1) % images.length)
        setShow(true)
      }, 450)
    }, 5200)

    return () => clearInterval(interval)
  }, [images.length])

  return (
    <section id="about" className="mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-28">
      <div className="grid gap-12 md:grid-cols-[1.25fr_1fr] md:items-center">
        {/* Text (big like your screenshot) */}
        <div className="text-zinc-900">
          <p className="max-w-2xl text-3xl leading-[1.15] tracking-tight sm:text-5xl">
            From beginners to seasoned pros, I create custom plans{" "}
            <span className="text-zinc-500">
              tailored to help you unlock your full potential and succeed in races.
            </span>
          </p>
        </div>

        {/* Single image that crossfades */}
        <div className="flex justify-end">
          <div className="relative h-[220px] w-[420px] overflow-hidden rounded-3xl bg-zinc-200 shadow-sm sm:h-[260px] sm:w-[520px]">
            <img
              src={images[idx]}
              alt=""
              className={cn(
                "absolute inset-0 h-full w-full object-cover",
                "transition-opacity duration-700 ease-in-out",
                show ? "opacity-100" : "opacity-0"
              )}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
