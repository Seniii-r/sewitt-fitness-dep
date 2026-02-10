// src/components/Footer.tsx
const PAGE_BLACK = "#0B0B0C"
import LiquidEther from "../components/LiquidEther"

export default function Footer() {
  return (
    <footer className="relative text-white/70" style={{ backgroundColor: PAGE_BLACK }}>
      {/* Footer height tuned so CTA + Footer ~ 100dvh */}
      <LiquidEther
          colors={["#E9D050", "#E9D050", "#E9D050"]}
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: 0.55,
          }}
        />


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
              <a href="#home" className="hover:text-white">Home</a>
              <a href="#coach" className="hover:text-white">About</a>
              <a href="#plans" className="hover:text-white">Coaching experience</a>
              <a href="#testimonials" className="hover:text-white">Testamonials</a>
              <a href="#FAQ" className="hover:text-white">FAQ</a>
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
