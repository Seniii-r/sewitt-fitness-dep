import posthog from "posthog-js"

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
  // Managed reverse proxy on our own subdomain (CNAME e.sewittfitness.ca →
  // PostHog), much harder for ad-blockers to block than the /ingest path.
  api_host: "https://e.sewittfitness.ca",
  ui_host: "https://us.posthog.com",
  // Include the defaults option as required by PostHog
  defaults: "2026-01-30",

  // Web analytics (Installation health): SPA pageviews + tab close / navigation away
  capture_pageview: "history_change",
  capture_pageleave: true,

  // Scroll depth shows up on $pageleave and on the next $pageview as $prev_pageview_* properties
  disable_scroll_properties: false,

  // Core Web Vitals → $web_vitals (also enable in Project Settings → Autocapture → Web vitals)
  capture_performance: {
    web_vitals: true,
    web_vitals_allowed_metrics: ["LCP", "CLS", "FCP", "INP"],
  },

  // Enables capturing unhandled exceptions via Error Tracking
  capture_exceptions: true,
  // Turn on debug in development mode
  debug: process.env.NODE_ENV === "development",
})
