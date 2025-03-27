import z from "zod";

export const AuthSchemaPayload = z.object({
	password: z.string(),
	email: z.string().email(),
});

export const RegisterSchemaPayload = z.object({
	password: z.string().min(6),
	email: z.string().email(),
});
