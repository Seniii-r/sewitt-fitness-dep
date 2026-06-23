import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

// Write-enabled client used by server code only (e.g. the blog-published
// webhook patching `notifiedAt`). Requires SANITY_WRITE_TOKEN — never import
// this from client components.
export const writeClient = createClient({
  projectId: projectId || "placeholder",
  dataset,
  apiVersion,
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});
