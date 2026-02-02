// src/pages/SewittEdu.tsx
import { useState } from "react"
import { Link } from "react-router-dom"
import Footer from "./Footer"
import CTA from "./CTA"

const BRAND = {
  cream: "#F5F5F2",
  red: "#C1121F",
  gold: "#E9D050",
  ink: "#0B0B0C",
}

type EduSection = {
  title: string
  img: string
  body: string
}

const sections: EduSection[] = [
  {
    title: "Meal Prep",
    img: "/img/Hero.jpg",
    body:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    title: "Weightlifting",
    img: "/img/Hero.jpg",
    body:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vitae odio venenatis, tristique urna sed, consequat massa. Integer feugiat, arcu quis viverra gravida, mauris augue posuere purus, in aliquet leo risus vitae libero.",
  },
  {
    title: "Boxing",
    img: "/img/Hero.jpg",
    body:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris in mi nec dui pretium sagittis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
  },
]

function AccordionItem({
  title,
  img,
  body,
  open,
  onToggle,
}: {
  title: string
  img: string
  body: string
  open: boolean
  onToggle: () => void
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <div className="text-base font-semibold" style={{ color: BRAND.ink }}>
          {title}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium" style={{ color: BRAND.red }}>
            {open ? "Close" : "Open"}
          </span>
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full border"
            style={{
              borderColor: "rgba(0,0,0,0.12)",
              backgroundColor: open ? BRAND.gold : "white",
              color: BRAND.ink,
              transition: "background-color 200ms ease",
            }}
          >
            {open ? "−" : "+"}
          </span>
        </div>
      </button>

      <div
        className="grid transition-[grid-template-rows,opacity] duration-300 ease-out"
        style={{
          gridTemplateRows: open ? "1fr" : "0fr",
          opacity: open ? 1 : 0,
        }}
      >
        <div className="min-h-0">
          <div className="px-6 pb-6">
            <div className="grid gap-4 sm:grid-cols-[220px_1fr] sm:items-start">
              <div className="overflow-hidden rounded-xl bg-black/5">
                <img src={img} alt="" className="h-44 w-full object-cover sm:h-40" loading="lazy" />
              </div>
              <p className="text-sm leading-6 text-black/70">{body}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SewittEdu() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div style={{ backgroundColor: BRAND.cream }}>
      <header className="relative">
        <div className="mx-auto max-w-6xl px-5 pb-10 pt-10 sm:px-6 sm:pt-12">
          {/* Nav back */}
          <div className="mb-8 flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-white/90"
              style={{ color: BRAND.ink }}
            >
              <span
                className="inline-flex h-7 w-7 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: BRAND.red }}
              >
                ←
              </span>
              Back to Home
            </Link>

            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
              style={{ backgroundColor: BRAND.gold, color: BRAND.ink }}
            >
              Sewitt Education
              <span className="h-1 w-1 rounded-full" style={{ backgroundColor: BRAND.red }} />
              Learn • Train • Level up
            </div>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl" style={{ color: BRAND.ink }}>
            Sewitt <span style={{ color: BRAND.red }}>Edu</span>
          </h1>

          {/* Hero image under title */}
          <div className="mt-6 overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
            <div className="relative h-[260px] sm:h-[340px]">
              <img src="/img/Hero.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.35)" }} />

              <div className="absolute inset-0 flex items-center justify-center p-6">
                <div className="max-w-xl text-center">
                  <div className="text-sm font-semibold" style={{ color: BRAND.gold }}>
                    Start here
                  </div>
                  <div className="mt-2 text-sm text-white/80">
                    Learn the fundamentals, then go deeper in each topic below.
                  </div>

                  <a
                    href="#topics"
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-medium shadow-sm transition hover:bg-white/90"
                    style={{ color: BRAND.ink }}
                  >
                    Explore lessons
                    <span
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full text-white"
                      style={{ backgroundColor: BRAND.red }}
                    >
                      →
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-8 max-w-3xl text-sm leading-7 text-black/70">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore
            et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
        </div>
      </header>

      <main id="topics" className="mx-auto max-w-6xl px-5 pb-20 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight" style={{ color: BRAND.ink }}>
              Topics
            </h2>
            <p className="mt-1 text-sm text-black/60">
              Tap a section to expand, read, and collapse back to the title.
            </p>
          </div>

          <div className="hidden items-center gap-2 text-xs font-semibold sm:flex">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: BRAND.red }} />
            <span style={{ color: BRAND.ink }}>Structured</span>
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: BRAND.gold }} />
            <span style={{ color: BRAND.ink }}>Simple</span>
          </div>
        </div>

        <div className="grid gap-4">
          {sections.map((s, i) => (
            <AccordionItem
              key={s.title}
              title={s.title}
              img={s.img}
              body={s.body}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </main>

      <CTA />
      <Footer />
    </div>
  )
}
