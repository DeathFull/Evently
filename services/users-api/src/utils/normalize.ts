import type { PublicUser, User } from "../types";

export function normalizeUser({ user }: { user: User }): PublicUser {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
  };
}
