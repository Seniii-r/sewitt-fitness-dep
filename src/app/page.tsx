import Hero from "@/components/sections/Hero";
import TrustBar from "@/components/sections/TrustBar";
import WhoThisIsFor from "@/components/sections/WhoThisIsFor";
import CoachingExperience from "@/components/sections/CoachingExperience";
import HowItWorks from "@/components/sections/HowItWorks";
import Objections from "@/components/sections/Objections";
import Testimonials from "@/components/sections/Testimonials";
import About from "@/components/sections/About";
import FAQ from "@/components/sections/FAQ";
import BlogPreview from "@/components/sections/BlogPreview";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <WhoThisIsFor />
      <CoachingExperience />
      <HowItWorks />
      <Objections />
      <Testimonials />
      <About />
      <FAQ />
      <BlogPreview />
    </>
  );
}
