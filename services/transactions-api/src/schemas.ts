import z from "zod";

export const TransactionSchemaPayload = z.object({
  userId: z.string(),
  eventId: z.string(),
});
