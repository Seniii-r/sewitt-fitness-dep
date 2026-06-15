import { defineCliConfig } from "sanity/cli";

import { dataset, projectId } from "./src/sanity/env";

export default defineCliConfig({
  api: { projectId, dataset },
  // Use the modern app-router-friendly auto-updates behaviour.
  autoUpdates: true,
});
