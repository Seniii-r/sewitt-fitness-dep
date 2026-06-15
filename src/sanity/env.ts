// projectId/dataset are public (they ship in the browser bundle), so hardcoded
// fallbacks are safe. They also let the standalone Sanity Studio build resolve
// config — the Studio (Vite) doesn't expose NEXT_PUBLIC_* the way Next.js does,
// so it relies on SANITY_STUDIO_* or these fallbacks.
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ||
  process.env.SANITY_STUDIO_API_VERSION ||
  "2024-10-01";

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  process.env.SANITY_STUDIO_DATASET ||
  "production";

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  process.env.SANITY_STUDIO_PROJECT_ID ||
  "3xibzxbb";

/** True once a Sanity project id has been configured. */
export const isSanityConfigured = projectId.length > 0;
