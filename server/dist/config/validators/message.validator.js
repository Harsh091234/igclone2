import { z } from "zod";
export const createMessageSchema = z.object({
    cipherText: z.string().min(24).optional(),
    iv: z.string().length(16).optional(),
    senderPublicKey: z.string()
});
