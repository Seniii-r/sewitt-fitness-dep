const Stars = ({ count = 5 }: { count?: number }) => (
  <span className="text-gold tracking-[0.15em]" aria-label={`${count} star rating`}>
    {"★".repeat(count)}
  </span>
);

const featured = {
  name: "Felipe Carmo",
  quote:
    "I have had Chris as my gym personal trainer for the past 3 years and I am positive he is one of the most amazing professionals I've ever had the opportunity of working with. His commitment to your goals is unmatched and his knowledge is exceptional.",
};

const grid = [
  {
    name: "Rose Daniels",
    quote:
      "I've never felt more supported by a trainer. Chris creates a space where women feel comfortable, respected, and actually listened to, while still being pushed.",
  },
  {
    name: "Irene Elatrash",
    quote:
      "I would recommend Chris to anyone in a heartbeat. His approach is truly a holistic one, not just focusing on physical strength but on the mind-body connection as well.",
  },
  {
    name: "Robert Meschino",
    quote:
      "I would like to thank Chris, my first trainer Victor, my second trainer for keeping me motivated and building my self-confidence. Before working with these guys I had no idea what I was doing.",
  },
];

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="bg-cream text-onyx section"
    >
      <div className="container-x">
        <div className="text-center mb-12 md:mb-16">
          <span className="label-mono text-brick reveal">REAL RESULTS</span>
          <p className="mt-6 text-[18px] text-onyx max-w-[640px] mx-auto reveal" data-delay="80">
            Proof beats promises. Here&rsquo;s what clients say after putting in the work.
          </p>
        </div>

        {/* Featured */}
        <div className="bg-white rounded-lg shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-8 md:p-12 max-w-[960px] mx-auto reveal">
          <Stars />
          <blockquote className="mt-5 text-[20px] md:text-[22px] italic text-onyx leading-snug">
            &ldquo;{featured.quote}&rdquo;
          </blockquote>
          <div className="mt-6 font-bold text-[16px] text-onyx">
            — {featured.name}
          </div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-6 mt-16 max-w-[960px] mx-auto">
          {grid.map((t, i) => (
            <div
              key={t.name}
              className="bg-white rounded-lg shadow-[0_2px_12px_rgba(0,0,0,0.08)] p-7 md:p-8 transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] reveal"
              data-delay={String(60 * i)}
            >
              <Stars />
              <blockquote className="mt-4 text-[15px] md:text-[16px] text-[#333333] leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="mt-5 font-bold text-[15px] text-onyx">
                — {t.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
