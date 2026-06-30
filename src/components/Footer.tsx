"use client";

import Link from "next/link";
import { INSTAGRAM_URL, TWITTER_URL, TIKTOK_URL } from "@/lib/site";
import LiquidEther from "@/components/LiquidEther";

const PAGE_BLACK = "#0B0B0C";

export default function Footer() {
  return (
    <footer className="relative text-white/70" style={{ backgroundColor: PAGE_BLACK }}>
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

      <div className="relative z-10 mx-auto flex min-h-[38dvh] max-w-6xl flex-col justify-between px-5 py-12 sm:px-6 sm:py-16">
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
              <Link href="/#home" className="hover:text-white">Home</Link>
              <Link href="/#about" className="hover:text-white">About</Link>
              <Link href="/#coaching-experience" className="hover:text-white">Coaching Experience</Link>
              <Link href="/#testimonials" className="hover:text-white">Testimonials</Link>
              <Link href="/#faq" className="hover:text-white">FAQ</Link>
            </div>
          </div>

          <div className="md:justify-self-end">
            <div className="text-xs font-medium text-white/80">Socials</div>
            <div className="mt-3 grid gap-2 text-xs">
              <a href={TWITTER_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white">Twitter</a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white">Instagram</a>
              <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white">TikTok</a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Sewitt Fitness. All rights reserved.</span>
          <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
