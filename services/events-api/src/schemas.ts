import z from "zod";

export const EventSchemaPayload = z.object({
  type: z.enum(["CONCERT", "SPECTACLE", "FESTIVAL"]),
  date: z.date(),
  price: z.number(),
  location: z.string(),
  name: z.string(),
});

export const EventUpdateSchemaPayload = z.object({
  type: z.enum(["CONCERT", "SPECTACLE", "FESTIVAL"]).optional(),
  date: z.date().optional(),
  price: z.number().optional(),
  location: z.string().optional(),
  name: z.string().optional(),
});
