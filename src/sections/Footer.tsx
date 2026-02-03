// src/components/Footer.tsx
const PAGE_BLACK = "#0B0B0C"

export default function Footer() {
  return (
    <footer className="relative text-white/70" style={{ backgroundColor: PAGE_BLACK }}>
      {/* Footer height tuned so CTA + Footer ~ 100dvh */}
      <div className="mx-auto flex min-h-[38dvh] max-w-6xl flex-col justify-between px-5 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_0.8fr_0.8fr]">
          <div>
            <div className="text-white/90">Sewitt Fitness</div>
            <p className="mt-2 max-w-sm text-xs leading-5 text-white/60">
              Improve your performance with personalized coaching plans.
            </p>
            <div className="mt-6 text-xs text-white/35">Created by The Ikigai Project</div>
          </div>

          <div className="md:justify-self-end">
            <div className="text-xs font-medium text-white/80">Sections</div>
            <div className="mt-3 grid gap-2 text-xs">
              <a href="#" className="hover:text-white">About</a>
              <a href="#" className="hover:text-white">Coaching</a>
              <a href="#" className="hover:text-white">Reviews</a>
              <a href="#contact" className="hover:text-white">Contact</a>
            </div>
          </div>

          <div className="md:justify-self-end">
            <div className="text-xs font-medium text-white/80">Socials</div>
            <div className="mt-3 grid gap-2 text-xs">
              <a href="#" className="hover:text-white">Twitter</a>
              <a href="#" className="hover:text-white">Instagram</a>
              <a href="#" className="hover:text-white">TikTok</a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-white/40">
          © {new Date().getFullYear()} Perform. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
