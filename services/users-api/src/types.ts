export interface User {
	id: string;
	email: string;
	password: string;
	phone?: string | null;
	lastName: string;
	firstName: string;
	role: "ADMIN" | "OPERATOR" | "USER";
}

export interface PublicUser {
	id: string;
	email: string;
	lastName: string;
	firstName: string;
	phone?: string | null;
}

export interface UserUpdate {
	email?: string | null;
	password?: string | null;
	phone?: string | null;
	lastName?: string | null;
	firstName?: string | null;
	role?: "ADMIN" | "OPERATOR" | "USER" | null;
}
