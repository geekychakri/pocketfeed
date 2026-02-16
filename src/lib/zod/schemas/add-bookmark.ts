import DOMPurify from "isomorphic-dompurify";

import z from "@/lib/zod";

const sanitizeInputString = (value: unknown): string => {
  if (typeof value !== "string") return String(value);

  return DOMPurify.sanitize(value).trim();
};

const sanitizedString = z.preprocess(sanitizeInputString, z.string());

const sanitizedUrl = z.preprocess(sanitizeInputString, z.string().url());

export const addBookmarkSchema = z.object({
  bookmarkLink: z.union([sanitizedString, sanitizedUrl]),
  bookmarkType: sanitizedString,
  bookmarkTitle: sanitizedString,
  bookmarkItem: z.any(), //TODO:
});
