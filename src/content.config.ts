import { defineCollection } from "astro:content";
import { file } from "astro/loaders";
import { z } from "astro/zod";

const faqs = defineCollection({
  loader: file("./src/assets/data/faqs.json"),
  schema: z.object({
    id: z.string(),
    answer: z.string(),
  }),
});

export const collections = { faqs };