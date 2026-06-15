/**
 * One-time seed: imports the original Coaching Insights posts (and their cover
 * images from /public/images) into Sanity.
 *
 * Usage:
 *   1. Fill NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local
 *   2. Create an Editor token at https://sanity.io/manage and put it in
 *      .env.local as SANITY_WRITE_TOKEN
 *   3. Run:  pnpm seed
 *
 * Safe to re-run — documents use stable _ids (createOrReplace).
 */
import { createClient } from "@sanity/client";
import { readFileSync, existsSync } from "node:fs";
import { join, basename } from "node:path";
import { randomUUID } from "node:crypto";

// --- Minimal .env.local loader (no extra dependency) -----------------------
function loadEnv() {
  const path = join(process.cwd(), ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}
loadEnv();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId) throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID");
if (!token) throw new Error("Missing SANITY_WRITE_TOKEN (Editor token)");

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-10-01",
  token,
  useCdn: false,
});

type SeedPost = {
  slug: string;
  title: string;
  excerpt: string;
  thumbCaption: string;
  body: string[];
  category: "Training" | "Nutrition" | "Mindset";
  date: string;
  readTime: string;
  image: string; // path under /public
  featured?: boolean;
};

const key = () => randomUUID().slice(0, 8);

function toBlocks(paragraphs: string[]) {
  return paragraphs.map((text) => ({
    _type: "block",
    _key: key(),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: key(), text, marks: [] }],
  }));
}

const POSTS: SeedPost[] = [
  {
    slug: "the-case-for-consistency",
    title: "The case for consistency over intensity",
    excerpt:
      "The flashy stuff sells. The boring stuff works. A look at why showing up matters more than how hard you go on any given day.",
    thumbCaption: "Why showing up beats going hard.",
    body: [
      "Most people overestimate what one hard session can do and underestimate what twelve months of average sessions can do. The math isn't close.",
      "When you train consistently with the same coach, patterns show up. Adjustments happen in real time. Progress compounds. The first eight weeks aren't about transformation — they're about removing guesswork.",
      "If you're choosing between an intense program you'll abandon in six weeks and a moderate one you'll hold for a year, the moderate one wins every time. Pick the version you can actually sustain. Then we make it harder together, in steps.",
    ],
    category: "Training",
    date: "2026-04-22",
    readTime: "5 min read",
    image: "/images/blog-consistency.png",
    featured: true,
  },
  {
    slug: "what-real-accountability-looks-like",
    title: "What real accountability actually looks like",
    excerpt:
      "Accountability isn't a check-in text on Monday. It's a system that makes the wrong decision harder than the right one.",
    thumbCaption: "Structure beats motivation, every time.",
    body: [
      "There's a difference between motivation and accountability. Motivation is a feeling. Accountability is a structure.",
      "Real accountability removes the daily decision. You don't decide whether to train Tuesday at 6:30am — you've already decided. The coach is there. The plan is written. The only thing left is to show up.",
      "When clients tell me they finally feel different about training, it's usually not because they got more motivated. It's because the structure is doing the heavy lifting.",
    ],
    category: "Mindset",
    date: "2026-04-08",
    readTime: "4 min read",
    image: "/images/blog-accountability.png",
  },
  {
    slug: "eating-around-training",
    title: "Eating around training, simplified",
    excerpt:
      "You don't need a macro spreadsheet to make progress. You need a few non-negotiables done consistently for long enough.",
    thumbCaption: "Three rules beat any complicated diet.",
    body: [
      "Most clients don't have a nutrition problem. They have a consistency problem dressed up as a nutrition problem.",
      "Three rules, applied for ninety days, will outperform any complicated diet: enough protein, enough total food to support training, and enough sleep to recover from it.",
      "Once those three are stable, we can layer in nuance. Until they are, the nuance is noise.",
    ],
    category: "Nutrition",
    date: "2026-03-19",
    readTime: "6 min read",
    image: "/images/blog-eating.png",
  },
  {
    slug: "why-the-first-six-weeks-look-slow",
    title: "Why the first six weeks look slow",
    excerpt:
      "Early weeks build infrastructure: technique, recovery patterns, weekly rhythm. The visible results show up later, on top of that.",
    thumbCaption: "The slow start is the infrastructure.",
    body: [
      "Clients who panic at week three almost always become the strongest case studies by month six. The first phase is infrastructure work.",
      "We're calibrating intensity, dialing in technique, and building a weekly rhythm that survives travel, work spikes, and bad sleep. None of it is photogenic.",
      "Then the curve bends. The same effort starts producing visibly different outputs. That's not a coincidence — it's the infrastructure paying out.",
    ],
    category: "Training",
    date: "2026-03-05",
    readTime: "5 min read",
    image: "/images/blog-sixweeks.png",
  },
  {
    slug: "the-myth-of-the-quick-fix",
    title: "The myth of the quick fix",
    excerpt:
      "Six-week transformations sell because the math is appealing. The catch is what they don't tell you happens in week seven.",
    thumbCaption: "What the 6-week programs don't tell you.",
    body: [
      "Short stints produce short results. That isn't a moral statement, it's a structural one. The systems that produce lasting change need time to be built.",
      "When a client comes from a transformation program, the first job is usually rebuilding their relationship with sustainable training. Crash programs leave debt — physical and psychological.",
      "If you want results that hold, you have to give the process enough runway. The trade-off for slower start is a result that actually lasts.",
    ],
    category: "Mindset",
    date: "2026-02-18",
    readTime: "4 min read",
    image: "/images/blog-quickfix.png",
  },
  {
    slug: "protein-targets-without-the-spreadsheet",
    title: "Protein targets without the spreadsheet",
    excerpt:
      "Most people undershoot protein not because they don't know better, but because they don't structure meals to make hitting it easy.",
    thumbCaption: "Hit your protein without tracking a thing.",
    body: [
      "The number isn't the hard part. The structure around the number is.",
      "Two strategies do most of the work: a protein-anchored breakfast, and one repeatable lunch you can default to when the week falls apart. Get those two locked, and the daily target stops being something you 'try' to hit.",
      "Stop tracking. Start designing the day so the target is the natural result of the meals you actually eat.",
    ],
    category: "Nutrition",
    date: "2026-02-04",
    readTime: "5 min read",
    image: "/images/blog-protein.png",
  },
];

async function run() {
  for (const post of POSTS) {
    const imgPath = join(process.cwd(), "public", post.image);
    if (!existsSync(imgPath)) {
      console.warn(`! image not found, skipping cover: ${post.image}`);
    }

    let imageRef: string | undefined;
    if (existsSync(imgPath)) {
      console.log(`↑ uploading ${post.image} ...`);
      const asset = await client.assets.upload("image", readFileSync(imgPath), {
        filename: basename(imgPath),
      });
      imageRef = asset._id;
    }

    await client.createOrReplace({
      _id: `post-${post.slug}`,
      _type: "post",
      title: post.title,
      slug: { _type: "slug", current: post.slug },
      category: post.category,
      excerpt: post.excerpt,
      thumbnailCaption: post.thumbCaption,
      body: toBlocks(post.body),
      date: post.date,
      readTime: post.readTime,
      featured: post.featured ?? false,
      ...(imageRef
        ? {
            mainImage: {
              _type: "image",
              alt: post.title,
              asset: { _type: "reference", _ref: imageRef },
            },
            // Start the thumbnail as the same image; the coach can swap it later.
            thumbnail: {
              _type: "image",
              alt: post.title,
              asset: { _type: "reference", _ref: imageRef },
            },
          }
        : {}),
    });
    console.log(`✓ ${post.slug}`);
  }
  console.log(`\nDone — seeded ${POSTS.length} posts.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
