import { defineCliConfig } from "sanity/cli";

import { dataset, projectId } from "./src/sanity/env";

export default defineCliConfig({
  api: { projectId, dataset },
  // Hosted Studio address: https://sewittfitness.sanity.studio
  studioHost: "sewittfitness",
  // Use the modern app-router-friendly auto-updates behaviour.
  deployment: { appId: "v67dhfe0u9efqp7c558iojym", autoUpdates: true },
});
