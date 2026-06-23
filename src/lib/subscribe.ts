// Client-side helper to add an email to the Resend audience via /api/subscribe.
// Shared by the inline BlogSubscribe form and the first-visit popup so the
// honeypot field and error handling stay identical in both places.
export type SubscribeResult = { ok: true } | { ok: false; error: string };

export async function subscribeEmail(
  email: string,
  company = "" // honeypot — real users leave this blank
): Promise<SubscribeResult> {
  try {
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, company }),
    });
    const data: { ok?: boolean; error?: string } = await res
      .json()
      .catch(() => ({}));

    if (res.ok && data.ok) return { ok: true };
    return {
      ok: false,
      error: data.error || "Something went wrong. Please try again.",
    };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}
