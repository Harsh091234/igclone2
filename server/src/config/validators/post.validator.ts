import {z} from "zod";

export const createPostSchema = z.object({
  caption: z.string().max(300).optional(),
 
});

