import z from "@/lib/zod";

const ACCEPTED_FILE_TYPES = ["text/x-opml+xml", "text/x-opml", "text/xml"];

export const checkOPMLFileFormat = z.instanceof(File).refine((file) => {
  return ACCEPTED_FILE_TYPES.includes(file.type);
}, "File must be .xml or .opml format");
