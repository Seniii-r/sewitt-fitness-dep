// src/App.tsx
import { Routes, Route } from "react-router-dom"

import Hero from "./sections/Hero"
import Plans from "./sections/Plans"
import Testimonials from "./sections/Testimonials"
import Coach from "./sections/Coach"
import FAQ from "./sections/FAQ"
import CTA from "./sections/CTA"
import Footer from "./sections/Footer"
import SewittEdu from "./sections/SewittEdu"
import Steps from "./sections/Steps"

function LandingPage() {
  return (
    <>
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
    </>
  )
}

export default function App() {
  return (
    <div className="min-h-dvh bg-white text-zinc-950">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sewitt-edu" element={<SewittEdu />} />
      </Routes>
    </div>
  )
}
