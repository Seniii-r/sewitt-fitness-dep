"use client"

import Hero from "@/sections/Hero"
import Plans from "@/sections/Plans"
import Testimonials from "@/sections/Testimonials"
import Coach from "@/sections/Coach"
import FAQ from "@/sections/FAQ"
import CTA from "@/sections/CTA"
import Footer from "@/sections/Footer"
import Steps from "@/sections/Steps"

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-white text-zinc-950">
      <main>
        <Hero />
        <Plans />
        <Steps />
        <Testimonials />
        <Coach />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
