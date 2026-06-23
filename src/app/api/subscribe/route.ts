import { NextResponse } from "next/server";

import {
  RESEND_SEGMENT_ID,
  getResend,
  isResendConfigured,
} from "@/lib/resend";

// Resend SDK needs the Node runtime (not edge).
export const runtime = "nodejs";

// Basic, permissive email shape check — Resend does the real validation.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let email: unknown;
  let honeypot: unknown;
  try {
    const body = await req.json();
    email = body?.email;
    honeypot = body?.company; // hidden field; bots fill it in
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }

  // Silently accept bots so they don't retry, but don't subscribe them.
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return NextResponse.json(
      { ok: false, error: "Enter a valid email address." },
      { status: 400 }
    );
  }

  if (!isResendConfigured) {
    console.error("[subscribe] Resend not configured (key/audience missing)");
    return NextResponse.json(
      { ok: false, error: "Subscriptions are not available right now." },
      { status: 503 }
    );
  }

  try {
    const { error } = await getResend().contacts.create({
      email: email.trim().toLowerCase(),
      unsubscribed: false,
      segments: [{ id: RESEND_SEGMENT_ID }],
    });

    // A contact that already exists is a success from the user's POV.
    if (error && !/already exists|already a contact/i.test(error.message)) {
      console.error("[subscribe] Resend error:", error);
      return NextResponse.json(
        { ok: false, error: "Couldn't subscribe. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[subscribe] Unexpected error:", err);
    return NextResponse.json(
      { ok: false, error: "Couldn't subscribe. Please try again." },
      { status: 500 }
    );
  }
}
