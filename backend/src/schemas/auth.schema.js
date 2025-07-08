import { z } from "zod";

export const registerUserSchema = z.object({
  fullname: z.string().trim().min(1, "Full name is required"),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(5, "Username must be at least 5 characters long")
    .max(16, "Username must not exceed 16 characters"),
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

export const verifyEmailSchema = z.object({
  token: z.string().trim().min(1, "Email verification token is required"),
});

export const resendVerificationEmailSchema = z.object({
  email: z.string().trim().email("Invalid email format").toLowerCase(),
});
