import { z } from "zod";

export const updateUserSchema = z.object({
  fullname: z.string().trim().min(1, "Full name is required"),
  email: z.string().trim().toLowerCase().email("Invalid email format"),
  username: z.string().trim().min(5, "Username is required"),
  bio: z.string().trim().optional(),
  avatarUrl: z.string().trim().url("Invalid URL format").optional(),
});
