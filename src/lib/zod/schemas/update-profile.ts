import z from "@/lib/zod";

export const updateProfileSchema = z.object({
  fullname: z.string(),
  website: z.union([
    z.string().refine((value) => {
      const urlRegex =
        /^(https?:\/\/)?(www\.)?[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(\:[0-9]{1,5})?(\/[^\s]*)?$/;

      return urlRegex.test(value);
    }, "Please provide a valid URL"),
    z.literal(""),
  ]),
  bio: z.string().max(160, "Bio must be 160 characters or less.."),
  birthday: z.string().date("Please provide a valid date."),
});
