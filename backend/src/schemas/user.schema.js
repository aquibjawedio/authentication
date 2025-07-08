import { z } from "zod";

export const getCurrentUserSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(5, "Username must be at least 5 characters long")
    .max(16, "Username must not exceed 16 characters"),
});
