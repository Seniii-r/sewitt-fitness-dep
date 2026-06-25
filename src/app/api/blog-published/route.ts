import { NextResponse } from "next/server";
import { SIGNATURE_HEADER_NAME, isValidSignature } from "@sanity/webhook";

import {
  RESEND_SEGMENT_ID,
  RESEND_FROM,
  RESEND_REPLY_TO,
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

function postUrl(post: WebhookPost): string {
  return `${SITE_URL}/coaching-insights/${post.slug}`;
}

// Plain, personal-looking note. Marketing-style emails (dark template, big CTA
// buttons, image-heavy layouts, no plaintext part) are what Gmail files under
// "Promotions". A simple single-column message with a normal text link and a
// matching plaintext alternative reads as a personal email and is far more
// likely to land in the Primary tab.
function buildEmailHtml(post: WebhookPost): string {
  const url = postUrl(post);
  const title = escapeHtml(post.title ?? "New Coaching Insight");
  const excerpt = escapeHtml(post.excerpt ?? "");

  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#ffffff;">
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;line-height:1.6;color:#1a1a1a;max-width:560px;margin:0 auto;padding:24px;">
      <p style="margin:0 0 16px;">Hey,</p>
      <p style="margin:0 0 16px;">I just put up a new post on the Sewitt Fitness blog:</p>
      <p style="margin:0 0 8px;font-size:19px;font-weight:700;color:#111;">${title}</p>
      ${excerpt ? `<p style="margin:0 0 16px;color:#444;">${excerpt}</p>` : ""}
      <p style="margin:0 0 24px;"><a href="${url}" style="color:#c1121f;font-weight:600;">Read the full post &rarr;</a></p>
      <p style="margin:0;">&mdash; Chris</p>
      <p style="margin:0 0 24px;color:#777;">Sewitt Fitness</p>
      <p style="margin:0;border-top:1px solid #eaeaea;padding-top:12px;font-size:12px;line-height:1.6;color:#999;">
        You're getting this because you signed up for blog updates at sewittfitness.ca.
        <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#999;">Unsubscribe</a>.
      </p>
    </div>
  </body>
</html>`;
}

function buildEmailText(post: WebhookPost): string {
  const url = postUrl(post);
  const title = post.title ?? "New Coaching Insight";
  const excerpt = post.excerpt ?? "";

  return [
    "Hey,",
    "",
    "I just put up a new post on the Sewitt Fitness blog:",
    "",
    title,
    ...(excerpt ? ["", excerpt] : []),
    "",
    `Read the full post: ${url}`,
    "",
    "— Chris",
    "Sewitt Fitness",
    "",
    "You're getting this because you signed up for blog updates at sewittfitness.ca.",
    "Unsubscribe: {{{RESEND_UNSUBSCRIBE_URL}}}",
  ].join("\n");
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

  // Create the broadcast, then send it to the audience. We send both an HTML
  // and a plaintext part, a personal preview line, and (when configured) a
  // reply-to — all signals that push Gmail toward the Primary tab.
  const created = await resend.broadcasts.create({
    segmentId: RESEND_SEGMENT_ID,
    from: RESEND_FROM,
    ...(RESEND_REPLY_TO ? { replyTo: RESEND_REPLY_TO } : {}),
    subject: post.title ?? "New Coaching Insight",
    previewText: post.excerpt ?? "A new post is up on the Sewitt Fitness blog.",
    html: buildEmailHtml(post),
    text: buildEmailText(post),
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
