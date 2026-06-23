"use client";

import { useEffect, useRef, useState } from "react";
import posthog from "posthog-js";
import { subscribeEmail } from "@/lib/subscribe";

type Status = "idle" | "submitting" | "success" | "error";

// Once dismissed or subscribed, this flag keeps the popup from ever showing
// again in the same browser.
const SEEN_KEY = "sewitt:blog-notif-popup-seen";
// Small delay so the popup doesn't slam the user the instant the page paints.
const SHOW_DELAY_MS = 2500;

export default function BlogNotificationsPopup() {
  const [open, setOpen] = useState(false); // in the DOM at all
  const [visible, setVisible] = useState(false); // drives the enter/exit transition
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  function markSeen() {
    try {
      localStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* localStorage unavailable — nothing to persist */
    }
  }

  function close() {
    setVisible(false);
    window.setTimeout(() => setOpen(false), 200); // let the exit transition play
  }

  function dismiss(reason: string) {
    markSeen();
    posthog.capture("blog_notif_popup_dismissed", { reason });
    close();
  }

  // First-visit check. Reading localStorage in an effect (not during render)
  // keeps the server render and the first client render identical.
  useEffect(() => {
    let seen = true;
    try {
      seen = localStorage.getItem(SEEN_KEY) === "1";
    } catch {
      // Private mode / blocked storage — don't nag on every load.
      seen = true;
    }
    if (seen) return;

    const t = window.setTimeout(() => {
      setOpen(true);
      posthog.capture("blog_notif_popup_shown");
    }, SHOW_DELAY_MS);
    return () => window.clearTimeout(t);
  }, []);

  // Trigger the enter transition once mounted, lock scroll, wire up Escape.
  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => {
      setVisible(true);
      inputRef.current?.focus();
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss("escape");
    };
    document.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
    // dismiss/close are stable enough for this one-shot modal.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setMessage("");

    const result = await subscribeEmail(email, company);
    if (result.ok) {
      markSeen();
      setStatus("success");
      setEmail("");
      posthog.capture("blog_subscribe", { source: "first_visit_popup" });
      window.setTimeout(close, 2400); // auto-dismiss after the checkmark
    } else {
      setStatus("error");
      setMessage(result.error);
    }
  }

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="blog-notif-popup-title"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close"
        onClick={() => dismiss("backdrop")}
        className="absolute inset-0 h-full w-full cursor-default bg-black/70 backdrop-blur-sm"
      />

      {/* Card */}
      <div
        className={`relative w-full max-w-md rounded-md border border-white/10 bg-onyx-3 p-8 shadow-2xl transition-all duration-200 md:p-10 ${
          visible ? "translate-y-0 scale-100" : "translate-y-3 scale-[0.98]"
        }`}
      >
        <button
          type="button"
          onClick={() => dismiss("close-button")}
          aria-label="Close"
          className="absolute right-4 top-4 text-smoke/40 transition-colors hover:text-smoke"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M5 5l10 10M15 5L5 15"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {status === "success" ? (
          <div className="py-4 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 bg-gold/10">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <path
                  d="M6 14.5l5 5 11-12"
                  stroke="var(--color-gold)"
                  strokeWidth="2.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="h-display text-[22px] text-smoke">You&rsquo;re in.</h3>
            <p className="mt-3 text-[14px] leading-relaxed text-smoke/60">
              We&rsquo;ll email you the moment a new Coaching Insight goes live.
            </p>
          </div>
        ) : (
          <>
            <span className="label-mono text-gold">STAY IN THE LOOP</span>
            <h3
              id="blog-notif-popup-title"
              className="mt-4 text-[24px] leading-tight text-smoke md:text-[26px]"
            >
              Sign up for blog notifications
            </h3>
            <p className="mt-3 text-[14px] leading-relaxed text-smoke/60">
              Get an email the moment a new Coaching Insight goes live. No spam —
              unsubscribe anytime.
            </p>

            <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3" noValidate>
              {/* Honeypot — hidden from humans, tempting to bots. */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="hidden"
                aria-hidden="true"
              />

              <label htmlFor="blog-notif-popup-email" className="sr-only">
                Email address
              </label>
              <input
                id="blog-notif-popup-email"
                ref={inputRef}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                disabled={status === "submitting"}
                className="rounded-[2px] border border-white/15 bg-onyx px-4 py-3 text-[15px] text-smoke outline-none transition-colors placeholder:text-smoke/35 focus:border-brick disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={status === "submitting"}
                className="btn btn-primary w-full disabled:opacity-60"
              >
                {status === "submitting" ? "Signing up…" : "Notify Me"}
              </button>
            </form>

            {status === "error" && (
              <p className="mt-3 text-[13px] text-brick" role="alert">
                {message}
              </p>
            )}

            <button
              type="button"
              onClick={() => dismiss("no-thanks")}
              className="mt-4 w-full text-center text-[12px] text-smoke/40 transition-colors hover:text-smoke/70"
            >
              No thanks
            </button>
          </>
        )}
      </div>
    </div>
  );
}
