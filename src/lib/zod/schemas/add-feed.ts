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
  rssUrl: sanitizedUrl,
  title: sanitizedString,
});
export const addFeedSchema = z
  .strictObject({
    feeds: z.array(feedSchema),
    favicon: sanitizedUrl,
    siteUrl: sanitizedUrl,
    folder: sanitizedString,
  })
  .partial({
    favicon: true,
  });
