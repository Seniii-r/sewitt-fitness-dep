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
import { urlForImage } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url";

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

// Cover image + category aren't in the webhook payload, so fetch them from
// Sanity by id (writeClient is token-authed + useCdn:false, so it sees the
// just-published doc immediately). Best-effort: a failure just drops the image.
type PostMedia = {
  mainImage?: SanityImageSource;
  imageAlt?: string;
  category?: string;
};

async function fetchPostMedia(id: string): Promise<PostMedia> {
  try {
    const res = await writeClient.fetch<PostMedia | null>(
      `*[_id == $id][0]{ mainImage, "imageAlt": mainImage.alt, category }`,
      { id }
    );
    return res ?? {};
  } catch (err) {
    console.error("[blog-published] failed to fetch post media:", err);
    return {};
  }
}

function postUrl(post: WebhookPost): string {
  return `${SITE_URL}/coaching-insights/${post.slug}`;
}

// Brand-styled announcement: dark frame, brick/gold accents, the post cover
// image and title, and a single CTA. Kept to one image + one button with a
// matching plaintext part so it still reads as a real message (not a flyer)
// and stays out of the Promotions tab.
function buildEmailHtml(
  post: WebhookPost,
  opts: { coverUrl: string | null; category: string | null; imageAlt: string }
): string {
  const url = postUrl(post);
  const title = escapeHtml(post.title ?? "New Coaching Insight");
  const excerpt = escapeHtml(post.excerpt ?? "");
  const eyebrow = escapeHtml((opts.category ?? "New Coaching Insight").toUpperCase());
  const alt = escapeHtml(opts.imageAlt || post.title || "Sewitt Fitness");

  const cover = opts.coverUrl
    ? `<tr><td style="padding:0;">
              <img src="${opts.coverUrl}" alt="${alt}" width="600" style="display:block;width:100%;max-width:600px;height:auto;border:0;" />
            </td></tr>`
    : "";

  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#0b0b0c;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b0b0c;">
      <tr><td align="center" style="padding:24px 12px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background:#111214;border-radius:6px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
          <tr><td style="padding:20px 28px;background:#0b0b0c;">
            <span style="font-size:18px;font-weight:800;letter-spacing:0.06em;color:#f5f5f2;">SEWITT<span style="color:#c1121f;">.</span>FITNESS</span>
          </td></tr>
          <tr><td style="height:3px;line-height:3px;font-size:0;background:#c1121f;">&nbsp;</td></tr>
          ${cover}
          <tr><td style="padding:28px 28px 4px;">
            <p style="margin:0 0 12px;font-family:'Courier New',monospace;text-transform:uppercase;letter-spacing:0.18em;font-size:11px;color:#e9d050;">${eyebrow}</p>
            <h1 style="margin:0 0 14px;font-size:24px;line-height:1.25;font-weight:800;color:#f5f5f2;">${title}</h1>
            ${excerpt ? `<p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:rgba(245,245,242,0.72);">${excerpt}</p>` : ""}
            <table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="border-radius:2px;background:#c1121f;">
              <a href="${url}" style="display:inline-block;padding:14px 30px;color:#f5f5f2;text-decoration:none;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;font-size:13px;">Read the full post</a>
            </td></tr></table>
          </td></tr>
          <tr><td style="padding:24px 28px 28px;">
            <p style="margin:0;font-size:15px;color:#f5f5f2;">&mdash; Chris</p>
            <p style="margin:2px 0 0;font-size:13px;color:rgba(245,245,242,0.5);">Sewitt Fitness</p>
          </td></tr>
          <tr><td style="padding:18px 28px;background:#0b0b0c;border-top:1px solid rgba(245,245,242,0.08);">
            <p style="margin:0;font-size:12px;line-height:1.6;color:rgba(245,245,242,0.4);">
              You're getting this because you signed up for blog updates at sewittfitness.ca.<br/>
              <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:rgba(245,245,242,0.6);">Unsubscribe</a>
            </p>
          </td></tr>
        </table>
      </td></tr>
    </table>
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

  // Pull the cover image (and category) for the branded email. Best-effort —
  // if it fails the email just renders without the cover.
  const media = await fetchPostMedia(post._id);
  const coverUrl = media.mainImage
    ? urlForImage(media.mainImage)
        .width(1200)
        .height(600)
        .fit("crop")
        .auto("format")
        .quality(80)
        .url()
    : null;

  // Create the broadcast, then send it to the audience. We send both an HTML
  // and a plaintext part, a personal preview line, and (when configured) a
  // reply-to — all signals that push Gmail toward the Primary tab.
  const created = await resend.broadcasts.create({
    segmentId: RESEND_SEGMENT_ID,
    from: RESEND_FROM,
    ...(RESEND_REPLY_TO ? { replyTo: RESEND_REPLY_TO } : {}),
    subject: post.title ?? "New Coaching Insight",
    previewText: post.excerpt ?? "A new post is up on the Sewitt Fitness blog.",
    html: buildEmailHtml(post, {
      coverUrl,
      category: media.category ?? null,
      imageAlt: media.imageAlt ?? "",
    }),
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
