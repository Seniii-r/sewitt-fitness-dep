# Sanity CMS — Coaching Insights

The blog ("Coaching Insights") is powered by [Sanity](https://www.sanity.io).
Posts are edited in the Sanity Studio and read by the Next.js site. The data
layer lives in `src/lib/posts.ts` — components never talk to Sanity directly.

## One-time setup

### 1. Create a Sanity project
1. Go to <https://www.sanity.io/manage> and sign up / log in (free).
2. Create a new project. Name it e.g. **Sewitt Fitness**.
3. Create a dataset called `production` (keep it **public** so the site can read
   it without a token).
4. Copy the **Project ID**.

### 2. Configure environment variables
Edit `.env.local` and fill in the Project ID:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-10-01
```

> When you deploy (e.g. Vercel), add these same three variables to the host's
> environment settings.

### 3. Seed the existing 6 posts (optional but recommended)
1. In <https://www.sanity.io/manage> → **API → Tokens**, create a token with
   **Editor** permissions.
2. Put it in `.env.local` as `SANITY_WRITE_TOKEN=...`
3. Run:

```bash
pnpm seed
```

This uploads the cover images from `public/images` and creates the 6 original
posts. Safe to re-run (it overwrites by slug). You can delete the token after.

### 4. Open the Studio (where the coach adds posts)
Run it locally:

```bash
pnpm studio:dev      # opens the editor at http://localhost:3333
```

Or publish a hosted editor the coach can use from anywhere:

```bash
pnpm studio:deploy   # hosts it at https://<your-choice>.sanity.studio
```

The coach logs in with the email you invite (Project → Members in
sanity.io/manage), then clicks **Coaching Insight → Create** to write posts:
title, category, excerpt, cover image, body (rich text), date, read time, and a
"Featured" toggle for the big slot at the top of the Coaching Insights page.

## How it works
- `src/sanity/schemaTypes/postType.ts` — the post fields the coach fills in.
- `src/sanity/lib/client.ts` — read client (CDN + 60s revalidate).
- `src/lib/posts.ts` — `getAllPosts`, `getPostBySlug`, `getRelatedPosts`, etc.
- New/edited posts appear on the site within ~60 seconds (ISR), no redeploy.
