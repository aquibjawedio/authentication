import { z } from "zod";

export const getCurrentUserSchema = z.object({
  userId: z.string().trim().min(1, "User ID is required"),
});
