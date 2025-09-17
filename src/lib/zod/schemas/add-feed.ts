import DOMPurify from "isomorphic-dompurify";

import z from "@/lib/zod";

const sanitizeInputString = (value: unknown): string => {
  // if (value === "") return value;
  if (typeof value !== "string") return String(value);

  return DOMPurify.sanitize(value).trim();
};

// Custom preprocessors for different field types
const sanitizedString = z.preprocess(sanitizeInputString, z.string());

const sanitizedUrl = z.preprocess(sanitizeInputString, z.string().url());

const feedSchema = z.object({
  rssURL: sanitizedUrl,
  title: sanitizedString,
});
export const addFeedSchema = z
  .object({
    feeds: z.array(feedSchema),
    favicon: sanitizedUrl,
    siteURL: sanitizedUrl,
    folder: sanitizedString,
  })
  .partial({
    favicon: true,
  });
