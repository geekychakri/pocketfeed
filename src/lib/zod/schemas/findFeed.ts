import z from "@/lib/zod";

export const getFeedUrlSchema = z.object({
  url: z.string().url(),
});
