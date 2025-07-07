import { z } from "zod";

export const registerUserSchema = z.object({
  fullname: z.string().trim().min(1, "Full name is required"),
  username: z.string().trim().min(5, "Username is required").toLowerCase(),
  email: z.string().trim().email("Invalid email format").toLowerCase(),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters long"),
});

export const loginUserSchema = z.object({
  email: z.string().trim().email("Invalid email format").toLowerCase(),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters long"),
});
