import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  // Fall back to a placeholder so the client can be constructed before the
  // project id is configured. All data fetches are guarded by
  // `isSanityConfigured`, so this placeholder is never actually queried.
  projectId: projectId || "placeholder",
  dataset,
  apiVersion,
  // CDN is fine for published content; we rely on Next's revalidate for freshness.
  useCdn: true,
});
