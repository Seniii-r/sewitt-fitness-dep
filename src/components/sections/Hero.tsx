import { CALENDLY_URL } from "@/lib/site";

const Stars = () => (
  <span className="text-[--color-gold] tracking-[0.15em]" aria-label="5 star rating">
    ★★★★★
  </span>
);

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center bg-[--color-onyx] overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-no-repeat bg-center md:bg-right [background-size:cover] md:[background-size:auto_100%]"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(11,11,12,0.95) 35%, rgba(11,11,12,0.6) 70%, rgba(11,11,12,0.35) 100%), url('/images/hero1.jpeg')",
        }}
      />

      <div className="container-x relative z-10 pt-32 md:pt-40 pb-24">
        <div className="max-w-[820px] reveal">
          <h1 className="h-display text-[clamp(2.25rem,12vw,5rem)] leading-[0.95] text-[--color-smoke] mb-6">
            SEWITT.FITNESS
          </h1>
          <p className="text-[20px] md:text-[24px] text-[--color-smoke] font-light max-w-[640px] mb-4 reveal" data-delay="80">
            A complete coaching experience, not just workouts.
          </p>
          <p className="text-[16px] text-[--color-smoke]/70 max-w-[560px] mb-10 reveal" data-delay="160">
            Built for people who are ready to commit. Not for quick fixes or
            casual drop-ins.
          </p>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary reveal"
            data-delay="240"
          >
            Book Free Intro Session
          </a>
          <div className="mt-10 flex items-center gap-3 text-[--color-smoke]/60 text-[13px] md:text-[14px] italic reveal" data-delay="320">
            <Stars />
            <span>
              &ldquo;I would recommend Chris to anyone in a heartbeat.&rdquo; — Irene Elatrash
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
