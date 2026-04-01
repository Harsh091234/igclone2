import { z } from "zod";

export const registerUserSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(5, "Email must be at least 5 characters long")
    .max(50, "Email must not exceed 50 characters")
    .email("Invalid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(50, "Password too long")
    .regex(/[A-Z]/, "Must include at least one uppercase letter")
    .regex(/[a-z]/, "Must include at least one lowercase letter")
    .regex(/[0-9]/, "Must include at least one number")
    .regex(/[@$!%*?&]/, "Must include at least one special character"),
});
