<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Sewitt Fitness landing page. Here is a summary of every change made:

- **`instrumentation-client.ts`** (new file): Initializes PostHog client-side using the Next.js 15.3+ `instrumentation-client` pattern. Configured with a reverse proxy (`/ingest`), exception capture enabled, and debug mode in development.
- **`next.config.ts`**: Added PostHog reverse-proxy rewrites (`/ingest/static/*` and `/ingest/*`) and `skipTrailingSlashRedirect: true` to ensure reliable event ingestion.
- **`.env.local`**: Added `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` (covered by `.gitignore`).
- **`src/sections/Hero.tsx`**: Added `nav_link_clicked` on desktop and mobile nav links (with `source` and `label`/`href` properties), `hero_cta_clicked` on the top-right CTA, and `book_session_clicked` on both mobile and desktop hero booking links.
- **`src/sections/CTA.tsx`**: Added `book_session_clicked` on the main booking CTA button.
- **`src/sections/Steps.tsx`**: Added `book_session_clicked` on the Step 4 booking CTA.
- **`src/sections/FAQ.tsx`**: Added `faq_item_toggled` when a user opens an accordion item (includes `question` and `action: 'open'` properties).
- **`src/sections/Plans.tsx`**: Added `see_coaching_works_clicked` on the "See How Coaching Works" button inside the coaching carousel.
- **`src/sections/SewittEdu.tsx`**: Added `edu_topic_expanded` when a user opens an accordion topic on the Sewitt Edu page (includes `topic` property).

## Events tracked

| Event | Description | File |
|---|---|---|
| `book_session_clicked` | User clicks a Book Free Intro Session CTA (Calendly link). Primary conversion event. Includes `source` property: `hero_mobile`, `hero_desktop`, `steps_section`, or `cta_section`. | `src/sections/Hero.tsx`, `src/sections/Steps.tsx`, `src/sections/CTA.tsx` |
| `nav_link_clicked` | User clicks a navigation link in the hero navbar. Includes `label`, `href`, and `source` (desktop/mobile) properties. | `src/sections/Hero.tsx` |
| `hero_cta_clicked` | User clicks the "See How Coaching Works" button in the hero top-right. | `src/sections/Hero.tsx` |
| `faq_item_toggled` | User expands an FAQ accordion item. Includes `question` and `action: 'open'` properties. | `src/sections/FAQ.tsx` |
| `see_coaching_works_clicked` | User clicks "See How Coaching Works" inside the coaching experience carousel. | `src/sections/Plans.tsx` |
| `edu_topic_expanded` | User expands an education topic accordion on the Sewitt Edu page. Includes `topic` property. | `src/sections/SewittEdu.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/385445/dashboard/1477708
- **Book Session Clicks Over Time** (line chart, 30-day trend): https://us.posthog.com/project/385445/insights/t48daeDr
- **Conversion Funnel: Hero → Coaching → Book Session** (3-step funnel): https://us.posthog.com/project/385445/insights/t3nKeVub
- **Book Session Clicks by Source** (bar chart by CTA location): https://us.posthog.com/project/385445/insights/WUDhjYMs
- **FAQ Topic Interest** (bar chart by question opened): https://us.posthog.com/project/385445/insights/IOvdbYTL
- **Nav Link Clicks by Label** (bar chart by nav label): https://us.posthog.com/project/385445/insights/ans83pfY

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
