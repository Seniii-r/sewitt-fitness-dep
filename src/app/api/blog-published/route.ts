import { NextResponse } from "next/server";
import { SIGNATURE_HEADER_NAME, isValidSignature } from "@sanity/webhook";

import {
  RESEND_SEGMENT_ID,
  RESEND_FROM,
  getResend,
  isResendConfigured,
} from "@/lib/resend";
import { writeClient } from "@/sanity/lib/writeClient";

// Resend + Sanity SDKs need the Node runtime. We also need the raw request
// body for signature verification, so no body parsing happens before this.
export const runtime = "nodejs";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.sewittfitness.ca"
).replace(/\/$/, "");

type WebhookPost = {
  _id?: string;
  slug?: string;
  title?: string;
  excerpt?: string;
  notifiedAt?: string | null;
};

function buildEmailHtml(post: WebhookPost): string {
  const url = `${SITE_URL}/coaching-insights/${post.slug}`;
  const title = escapeHtml(post.title ?? "New Coaching Insight");
  const excerpt = escapeHtml(post.excerpt ?? "");

  return `<!doctype html>
<html>
  <body style="margin:0;background:#0b0b0c;font-family:Helvetica,Arial,sans-serif;color:#f5f5f2;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b0b0c;padding:32px 0;">
      <tr><td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
          <tr><td style="padding:0 24px;">
            <p style="margin:0 0 24px;font-family:'Courier New',monospace;text-transform:uppercase;letter-spacing:0.18em;font-size:12px;color:#e9d050;">New Coaching Insight</p>
            <h1 style="margin:0 0 16px;font-size:26px;line-height:1.2;color:#f5f5f2;">${title}</h1>
            ${excerpt ? `<p style="margin:0 0 28px;font-size:16px;line-height:1.6;color:rgba(245,245,242,0.75);">${excerpt}</p>` : ""}
            <a href="${url}" style="display:inline-block;background:#c1121f;color:#f5f5f2;text-decoration:none;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;font-size:14px;padding:16px 32px;border-radius:2px;">Read It</a>
            <p style="margin:40px 0 0;font-size:12px;line-height:1.6;color:rgba(245,245,242,0.4);">
              You're receiving this because you signed up for blog notifications at sewittfitness.ca.<br/>
              <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:rgba(245,245,242,0.55);">Unsubscribe</a>
            </p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(req: Request) {
  const secret = process.env.SANITY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[blog-published] SANITY_WEBHOOK_SECRET not set");
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  // Raw body is required for signature verification.
  const body = await req.text();
  const signature = req.headers.get(SIGNATURE_HEADER_NAME) ?? "";

  const valid = await isValidSignature(body, signature, secret);
  if (!valid) {
    return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 401 });
  }

  let post: WebhookPost;
  try {
    post = JSON.parse(body);
  } catch {
    return NextResponse.json({ ok: false, error: "Bad payload" }, { status: 400 });
  }

  if (!post._id || !post.slug) {
    return NextResponse.json({ ok: true, skipped: "missing id/slug" });
  }

  // Dedupe guard: only ever email once per post (re-publishes/edits re-fire the
  // webhook, but notifiedAt is already set). Clear notifiedAt to re-announce.
  if (post.notifiedAt) {
    return NextResponse.json({ ok: true, skipped: "already notified" });
  }

  if (!isResendConfigured) {
    console.error("[blog-published] Resend not configured (key/audience missing)");
    return NextResponse.json({ ok: false, error: "Resend not configured" }, { status: 503 });
  }

  const resend = getResend();

  // Create the broadcast, then send it to the audience.
  const created = await resend.broadcasts.create({
    segmentId: RESEND_SEGMENT_ID,
    from: RESEND_FROM,
    subject: post.title ?? "New Coaching Insight",
    html: buildEmailHtml(post),
  });

  if (created.error || !created.data?.id) {
    console.error("[blog-published] broadcast create failed:", created.error);
    return NextResponse.json({ ok: false, error: "Broadcast create failed" }, { status: 502 });
  }

  const sent = await resend.broadcasts.send(created.data.id);
  if (sent.error) {
    console.error("[blog-published] broadcast send failed:", sent.error);
    return NextResponse.json({ ok: false, error: "Broadcast send failed" }, { status: 502 });
  }

  // Mark the post as notified so it isn't emailed again.
  try {
    await writeClient
      .patch(post._id)
      .set({ notifiedAt: new Date().toISOString() })
      .commit();
  } catch (err) {
    // The email already went out; log loudly but don't fail the webhook.
    console.error("[blog-published] failed to set notifiedAt:", err);
  }

  return NextResponse.json({ ok: true, broadcastId: created.data.id });
}
