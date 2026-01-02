import {z} from "zod";

export const createPostSchema = z.object({
  caption: z.string().max(300).optional(),
 
});

export const commentPostSchema = z.object({
   text: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(300, "Comment cannot exceed 300 characters"),
 
});

