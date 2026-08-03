import { defineCollection } from "astro:content";
import { file } from "astro/loaders";
import { z } from "astro/zod";

const faqs = defineCollection({
  loader: file("./src/assets/data/faqs.json"),
  schema: z.object({
    id: z.number(),
    question: z.string(),
    answer: z.string(),
  }),
});

const registryItems = defineCollection({
  loader: file("./src/assets/data/registry-items.json"),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    suggestedPrice: z.number(),
    image: z.string(),
  }),
});

export const collections = { faqs, registryItems };