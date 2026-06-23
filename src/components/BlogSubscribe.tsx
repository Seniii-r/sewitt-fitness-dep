"use client";

import { useState } from "react";
import posthog from "posthog-js";
import { subscribeEmail } from "@/lib/subscribe";

type Status = "idle" | "submitting" | "success" | "error";

export default function BlogSubscribe({
  className = "",
  source = "unknown",
}: {
  /** Extra classes on the outer wrapper (e.g. spacing for a given placement). */
  className?: string;
  /** Where the form was rendered — sent to analytics. */
  source?: string;
}) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setMessage("");

    const result = await subscribeEmail(email, company);
    if (result.ok) {
      setStatus("success");
      setMessage("You're on the list. We'll email you when new posts drop.");
      setEmail("");
      posthog.capture("blog_subscribe", { source });
    } else {
      setStatus("error");
      setMessage(result.error);
    }
  }

  return (
    <div
      className={`rounded-md border border-white/10 bg-onyx-3 p-8 md:p-10 ${className}`}
    >
      <div className="max-w-xl">
        <span className="label-mono text-gold">STAY IN THE LOOP</span>
        <h3 className="h-display text-[24px] md:text-[28px] text-smoke mt-4 leading-tight">
          Sign up for blog notifications
        </h3>
        <p className="mt-3 text-[14px] text-smoke/60 leading-relaxed">
          Get an email the moment a new Coaching Insight goes live. No spam —
          unsubscribe anytime.
        </p>
      </div>

      {status === "success" ? (
        <p className="mt-6 text-[15px] text-gold" role="status">
          {message}
        </p>
      ) : (
        <form
          onSubmit={onSubmit}
          className="mt-6 flex flex-col sm:flex-row gap-3 max-w-xl"
          noValidate
        >
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

          <label htmlFor="blog-subscribe-email" className="sr-only">
            Email address
          </label>
          <input
            id="blog-subscribe-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            disabled={status === "submitting"}
            className="flex-1 rounded-[2px] border border-white/15 bg-onyx px-4 py-3 text-[15px] text-smoke placeholder:text-smoke/35 outline-none transition-colors focus:border-brick disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={status === "submitting"}
            className="btn btn-primary disabled:opacity-60"
          >
            {status === "submitting" ? "Signing up…" : "Notify Me"}
          </button>
        </form>
      )}

      {status === "error" && (
        <p className="mt-3 text-[13px] text-brick" role="alert">
          {message}
        </p>
      )}
    </div>
  );
}
