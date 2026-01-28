import { z } from "zod";

export const createMessageSchema = z
  .object({
    text: z.string().max(2000).optional(),
  });
  
