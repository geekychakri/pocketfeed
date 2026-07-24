import z from "@/lib/zod";

export const validateFeedbinEmailSchema = z.object({
  feedbinEmail: z.string().email("Please enter a valid email address"),
  feedbinPassword: z.string().min(1, "Password is required"),
});
