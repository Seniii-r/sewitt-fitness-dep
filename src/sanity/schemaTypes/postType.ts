import { defineField, defineType } from "sanity";

export const postType = defineType({
  name: "post",
  title: "Coaching Insight",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      description: "Auto-generated from the title — used in the page URL.",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Training", value: "Training" },
          { title: "Nutrition", value: "Nutrition" },
          { title: "Mindset", value: "Mindset" },
        ],
        layout: "radio",
      },
      initialValue: "Training",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "thumbnail",
      title: "Thumbnail image",
      type: "image",
      description:
        "Shown on cards and listings. Leave empty to reuse the cover image.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "Describe the image for accessibility/SEO.",
        }),
      ],
    }),
    defineField({
      name: "thumbnailCaption",
      title: "Thumbnail caption",
      type: "text",
      rows: 2,
      description:
        "Short caption shown under the title on cards. Leave empty to reuse the excerpt.",
      validation: (rule) => rule.max(280),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      description:
        "Short summary used for SEO and the featured slot (1–2 sentences).",
      validation: (rule) => rule.required().max(280),
    }),
    defineField({
      name: "mainImage",
      title: "Cover image",
      type: "image",
      description: "The large image shown at the top of the post page.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "Describe the image for accessibility/SEO.",
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "date",
      title: "Publish date",
      type: "date",
      initialValue: () => new Date().toISOString().slice(0, 10),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "readTime",
      title: "Read time",
      type: "string",
      description: 'e.g. "5 min read"',
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      description:
        "Show this post in the large featured slot at the top of Coaching Insights.",
      initialValue: false,
    }),
    defineField({
      name: "notifiedAt",
      title: "Notified at",
      type: "datetime",
      description:
        "Set automatically once subscribers have been emailed about this post. Clear it to re-send the announcement.",
      readOnly: true,
      hidden: true,
    }),
  ],
  orderings: [
    {
      title: "Publish date, newest first",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "category", media: "mainImage" },
  },
});
