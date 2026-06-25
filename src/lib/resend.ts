// Resend client + small helpers for the blog-notification feature.
// Server-only: this reads RESEND_API_KEY, never expose it to the browser.
import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

// Resend replaced Audiences with Segments; `audienceId` is deprecated in the
// SDK in favour of segment ids. See
// https://resend.com/docs/dashboard/segments/migrating-from-audiences-to-segments
export const RESEND_SEGMENT_ID = process.env.RESEND_SEGMENT_ID ?? "";
export const RESEND_FROM =
  process.env.RESEND_FROM ?? "Sewitt Fitness <onboarding@resend.dev>";

// Reply-to for notifications. Pointing replies at a real, monitored inbox is a
// strong signal to Gmail that the mail is a personal message (Primary) rather
// than a bulk blast (Promotions). Leave unset to omit the header entirely —
// the sending domain has receiving disabled, so don't reply-to an @-domain
// address that can't actually receive mail.
export const RESEND_REPLY_TO = process.env.RESEND_REPLY_TO || undefined;

/** True once the API key and segment are configured. */
export const isResendConfigured = Boolean(apiKey && RESEND_SEGMENT_ID);

// Construct lazily so a missing key doesn't crash module import (e.g. during
// build or on routes that never touch Resend).
let client: Resend | null = null;
export function getResend(): Resend {
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set");
  }
  if (!client) client = new Resend(apiKey);
  return client;
}
