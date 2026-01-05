import { z } from "zod";

export const editProfileSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name must be at most 50 characters")
    .regex(/^[A-Za-z\s]+$/, "Full name can only contain letters and spaces")
    .optional(),

  userName: z
    .string()
    .min(3, "Username must be at atleast 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(
      /^[a-zA-Z0-9._]+$/,
      "Username can only contain letters, numbers, dots, or underscores"
    ),
  bio: z.string().max(200, "Bio must be at most 200 characters").optional(),
  gender: z.enum(["male", "female", "other", "prefer not to say"]),
  customGender: z
    .string()
    .min(1, "Gender is required")
    .max(30, "Gender too long")
    .optional(),
  profilePic: z.string().optional(),
});

export type EditProfileInput = z.infer<typeof editProfileSchema>;