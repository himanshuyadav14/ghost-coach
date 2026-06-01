import { z } from "zod";

import { objectIdSchema } from "@/lib/validations/common.schema";

export const sendMessageSchema = z.object({
  message: z
    .string()
    .min(1, "Message is required")
    .max(2000, "Message must be at most 2000 characters"),
  sessionId: objectIdSchema.optional(),
  threadId: objectIdSchema.optional(),
});

export type SendMessageSchemaInput = z.infer<typeof sendMessageSchema>;
