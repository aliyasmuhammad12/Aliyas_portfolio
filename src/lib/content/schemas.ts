import { z } from "zod";

export const metricSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});

export const contentFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.coerce.date(),
  tags: z.array(z.string()).default([]),
  coverImage: z.string().min(1),
  role: z.string().optional(),
  stack: z.array(z.string()).default([]),
  metrics: z.array(metricSchema).default([]),
  featured: z.boolean().default(false),
  clientUrl: z.string().url().optional(),
});

export const caseStudyFrontmatterSchema = contentFrontmatterSchema;

export const blogFrontmatterSchema = contentFrontmatterSchema;

export type ContentMetric = z.infer<typeof metricSchema>;
export type ContentFrontmatter = z.infer<typeof contentFrontmatterSchema>;
export type CaseStudyFrontmatter = z.infer<typeof caseStudyFrontmatterSchema>;
export type BlogFrontmatter = z.infer<typeof blogFrontmatterSchema>;
