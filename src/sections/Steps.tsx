// src/pages/Steps.tsx
import { Timeline, type TimelineEntry } from "../components/timeline"

export default function Steps() {
  const Bullet = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-start gap-2">
      <span className="mt-1.5 h-2 w-2 rounded-full bg-white/25" />
      <span>{children}</span>
    </div>
  )

  const data: TimelineEntry[] = [
    {
      title: "Step 1",
      content: (
        <div>
          <p className="text-sm text-white/80">
            <span className="font-semibold text-white"> Free Intro Assessment</span>{" "}
            We assess your goals, your current starting point, and what it will realistically take to reach your outcome.
          </p>

          <div className="mt-5 grid gap-2 text-sm text-white/65">
            <Bullet>Quick assessment and baseline</Bullet>
            <Bullet>Plan outline and expectations</Bullet>
            <Bullet>Answer questions, fix confusion</Bullet>
          </div>
        </div>
      ),
    },
    {
      title: "Step 2",
      content: (
        <div>
          <p className="text-sm text-white/80">
            <span className="font-semibold text-white">Clear Next Steps</span>{" "}
            You leave with clarity, expectations, and a simple plan for what happens next.
          </p>

          <div className="mt-5 grid gap-2 text-sm text-white/65">
            <Bullet>Weekly targets and progression</Bullet>
            <Bullet>Accountability + feedback</Bullet>
            <Bullet>Recovery tracked, not guessed</Bullet>
          </div>
        </div>
      ),
    },
    {
      title: "Step 3",
      content: (
        <div>
          <p className="text-sm text-white/80">
            <span className="font-semibold text-white">Ongoing coaching.</span>{" "}
            This is where the real results happen: continuous refinement, smarter training blocks, and support when life tries to derail you.
          </p>
          <div className="mt-5 grid gap-2 text-sm text-white/65">
            <Bullet>Adjust plan as you improve</Bullet>
            <Bullet>Long-term strategy and milestones</Bullet>
            <Bullet>Support when things get hard</Bullet>
          </div>
        </div>
      ),
    },
    {
      title: "Step 4",
      content: (
        <div>
          <p className="text-sm text-white/80">
            <span className="font-semibold text-white"> Results Compound</span>{" "}
            This is where the real results happen: continuous refinement, smarter training blocks, and support when life tries to derail you.
          </p>

          <div className="mt-5 grid gap-2 text-sm text-white/65">
            <Bullet>Adjust plan as you improve</Bullet>
            <Bullet>Long-term strategy and milestones</Bullet>
            <Bullet>Support when things get hard</Bullet>
          </div>

          {/* ✅ Center-bottom, responsive */}
          <div className="relative mt-10 flex justify-center pb-1 sm:pb-2 sm:right-40">
            <a
              href="#contact"
              className={[
                "inline-flex items-center justify-center",
                "px-6 sm:px-10 py-3 text-base sm:text-lg font-semibold",
                "transition-all hover:scale-[1.02]",
                "bg-white/10 text-[#F5F5F2] border border-white/15 backdrop-blur-md",
                "hover:bg-[#C1121F]/15 hover:border-[#C1121F]/40 hover:shadow-[0_18px_60px_rgba(193,18,31,0.45)]",
              ].join(" ")}
            >
              Book Free Intro Session
            </a>
          </div>
        </div>
      ),
    },
  ]

  return (
    <section id="plan">
    <div className="min-h-dvh bg-[#0B0B0C] text-white">
      <Timeline
        data={data}
        heading="How it Works"
        subheading="Book a free session → stay consistent weekly → get ongoing coaching."
        className="bg-[#0B0B0C]"
      />
    </div>
    </section>
  )
}
