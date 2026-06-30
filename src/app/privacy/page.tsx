import type { Metadata } from "next";
import { INSTAGRAM_URL, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy — Sewitt Fitness",
  description:
    "How Sewitt Fitness collects, uses, and protects your personal information, and your rights under Canadian privacy law (PIPEDA).",
  alternates: { canonical: "/privacy" },
};

const EFFECTIVE_DATE = "June 27, 2026";
const LAST_UPDATED = "June 27, 2026";

// Shared text styles so every section reads consistently.
const heading = "mt-12 text-[18px] md:text-[20px] font-bold text-smoke";
const para = "mt-3 text-[15px] leading-relaxed text-smoke/75";
const list =
  "mt-3 list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-smoke/75 marker:text-gold";
const link = "text-gold underline-offset-2 hover:underline";

export default function PrivacyPolicyPage() {
  return (
    <>
      {/* Hero bar */}
      <section className="bg-onyx pt-32 md:pt-36 pb-10 md:pb-14">
        <div className="container-x mx-auto max-w-[820px]">
          <span className="label-mono text-gold">LEGAL</span>
          <h1 className="mt-6 h-display text-[clamp(2.25rem,9vw,3.5rem)] leading-[0.95] text-smoke">
            Privacy Policy
          </h1>
          <p className="mt-5 text-[13px] text-smoke/50">
            Effective Date: {EFFECTIVE_DATE} &nbsp;|&nbsp; Last Updated:{" "}
            {LAST_UPDATED}
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="bg-onyx pb-24">
        <article className="container-x mx-auto max-w-[820px]">
          <h2 className={heading}>1. Overview</h2>
          <p className={para}>
            Sewitt Fitness (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or
            &ldquo;our&rdquo;) operates the website{" "}
            <a
              href={SITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={link}
            >
              www.sewittfitness.ca
            </a>{" "}
            (the &ldquo;Site&rdquo;). This Privacy Policy explains what
            information we collect, how we use it, and your rights regarding that
            information. By using this Site, you agree to the terms of this
            policy.
          </p>

          <h2 className={heading}>2. Information We Collect</h2>
          <p className={para}>
            We may collect the following types of personal information:
          </p>
          <ul className={list}>
            <li>Name and email address (via the blog notification signup form)</li>
            <li>
              Appointment booking details (collected via Calendly when booking a
              Free Intro Session)
            </li>
            <li>
              General usage data (pages visited, session duration, device type)
              via analytics tools
            </li>
            <li>
              IP address and browser/device information through standard web
              server logs
            </li>
          </ul>
          <p className={para}>
            We do not collect payment information directly. If payment is
            processed, it is handled by third-party processors subject to their
            own privacy policies.
          </p>

          <h2 className={heading}>3. How We Use Your Information</h2>
          <p className={para}>We use collected information to:</p>
          <ul className={list}>
            <li>Send blog post notifications if you have opted in</li>
            <li>Facilitate the scheduling and coordination of coaching sessions</li>
            <li>Improve the Site and understand how visitors interact with it</li>
            <li>
              Communicate with prospective and current clients about coaching
              services
            </li>
          </ul>
          <p className={para}>
            We do not sell, rent, or trade your personal information to third
            parties.
          </p>

          <h2 className={heading}>4. Third-Party Services</h2>
          <p className={para}>
            This Site integrates with the following third-party platforms that
            may collect data independently:
          </p>
          <ul className={list}>
            <li>
              Calendly (appointment booking) — subject to Calendly&rsquo;s
              Privacy Policy at{" "}
              <a
                href="https://calendly.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className={link}
              >
                calendly.com/privacy
              </a>
            </li>
            <li>
              Instagram, TikTok, and Twitter/X (social media links) — subject to
              their respective privacy policies
            </li>
            <li>Web hosting and analytics providers</li>
          </ul>
          <p className={para}>
            We encourage you to review the privacy policies of any third-party
            services you interact with through this Site.
          </p>

          <h2 className={heading}>5. Cookies and Tracking</h2>
          <p className={para}>
            This Site may use cookies and similar tracking technologies to
            analyze traffic and improve user experience. You may disable cookies
            in your browser settings, though some features of the Site may not
            function as intended.
          </p>

          <h2 className={heading}>6. Email Communications</h2>
          <p className={para}>
            If you subscribe to blog notifications, we will send you emails when
            new Coaching Insights are published. You may unsubscribe at any time
            using the link provided in each email. We do not send unsolicited
            promotional emails.
          </p>

          <h2 className={heading}>7. Data Retention</h2>
          <p className={para}>
            We retain personal information only for as long as necessary to
            fulfill the purposes outlined in this policy, or as required by
            applicable law. Email addresses collected for blog notifications are
            retained until you unsubscribe.
          </p>

          <h2 className={heading}>8. Your Rights (Canadian Residents)</h2>
          <p className={para}>
            Under Canada&rsquo;s Personal Information Protection and Electronic
            Documents Act (PIPEDA) and applicable provincial privacy
            legislation, you have the right to:
          </p>
          <ul className={list}>
            <li>Access the personal information we hold about you</li>
            <li>Request corrections to inaccurate or incomplete information</li>
            <li>
              Withdraw consent for the collection or use of your information,
              subject to legal or contractual limitations
            </li>
            <li>
              Ask us to delete your personal information where we have no lawful
              basis to retain it
            </li>
          </ul>
          <p className={para}>
            To exercise any of these rights, contact us using the information
            below.
          </p>

          <h2 className={heading}>9. Children&rsquo;s Privacy</h2>
          <p className={para}>
            This Site is not directed at individuals under the age of 16. We do
            not knowingly collect personal information from children. If you
            believe a child has provided us with personal information, please
            contact us and we will take steps to remove it.
          </p>

          <h2 className={heading}>10. Security</h2>
          <p className={para}>
            We take reasonable measures to protect your personal information from
            unauthorized access, use, or disclosure. However, no method of
            transmission over the internet or electronic storage is 100% secure.
          </p>

          <h2 className={heading}>11. Changes to This Policy</h2>
          <p className={para}>
            We may update this Privacy Policy from time to time. The &ldquo;Last
            Updated&rdquo; date at the top of this page reflects the most recent
            revision. Continued use of the Site after any changes constitutes
            your acceptance of the updated policy.
          </p>

          <h2 className={heading}>12. Contact</h2>
          <p className={para}>
            For questions, requests, or concerns regarding this Privacy Policy,
            contact:
          </p>
          <div className="mt-3 text-[15px] leading-relaxed text-smoke/75">
            <p className="text-smoke">Sewitt Fitness</p>
            <p>
              Website:{" "}
              <a
                href={SITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={link}
              >
                www.sewittfitness.ca
              </a>
            </p>
            <p>
              Instagram:{" "}
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={link}
              >
                @sewittfitness.ca
              </a>
            </p>
          </div>

          <p className="mt-12 border-t border-white/10 pt-6 text-[13px] text-smoke/40">
            Sewitt Fitness — Mississauga &amp; Toronto, Ontario, Canada
          </p>
        </article>
      </section>
    </>
  );
}
