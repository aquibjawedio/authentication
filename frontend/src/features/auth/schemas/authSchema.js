import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email format"),
  password: z.string().trim().min(8, "Password must be of 8 chars"),
});

export const registerSchema = z.object({
  fullname: z.string().trim().min(1, "Full name is required"),
  username: z.string().trim().min(5, "Username is required"),
  email: z.string().trim().toLowerCase().email("Invalid email format"),
  password: z.string().trim().min(8, "Password must be of 8 chars"),
});
