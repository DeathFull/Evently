import z from "zod";

export const UserSchemaPayload = z.object({
	email: z.string().email(),
	phone: z.string().optional().nullable(),
	firstName: z.string(),
	lastName: z.string(),
	password: z.string().min(6),
});

export const UserUpdateSchemaPayload = z.object({
	email: z.string().email().optional(),
	phone: z.string().optional().nullable(),
	password: z.string().min(6).optional(),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	role: z.enum(["ADMIN", "USER", "EMPLOYEE"]).optional(),
});
