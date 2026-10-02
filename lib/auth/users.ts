import "server-only";

import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import type { SessionUser, UserRole } from "./session";

export type DatabaseUser = {
  _id?: ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  avatarUrl?: string | null;
  createdAt: Date;
};

export function toSessionUser(user: DatabaseUser & { _id: ObjectId }): SessionUser {
  return {
    id: user._id.toHexString(),
    name: user.name,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl ?? null,
  };
}

export async function usersCollection() {
  const database = await getDatabase();
  const users = database.collection<DatabaseUser>("users");
  await users.createIndex({ email: 1 }, { unique: true });
  return users;
}
