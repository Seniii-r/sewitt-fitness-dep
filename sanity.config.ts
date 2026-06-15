/**
 * Sanity Studio configuration.
 * Run locally with `pnpm studio:dev`, publish with `pnpm studio:deploy`
 * (hosts the editor at https://<project>.sanity.studio).
 */
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";

import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schema } from "./src/sanity/schemaTypes";

export default defineConfig({
  name: "default",
  title: "Sewitt Fitness",
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool(),
    // Vision lets you run GROQ queries against your dataset from the Studio.
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
