import "server-only";

import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

export type UserRole = "student" | "admin";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string | null;
};

const sessionCookieName = "lnu-session";
const secret = process.env.SESSION_SECRET;

if (!secret || secret.length < 32) {
  throw new Error("SESSION_SECRET must be set to a value of at least 32 characters.");
}

const encodedSecret = new TextEncoder().encode(secret);

export const sessionCookie = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

export async function createSessionToken(user: SessionUser) {
  return new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedSecret);
}

export async function getSession(): Promise<SessionUser | null> {
  const token = (await cookies()).get(sessionCookieName)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, encodedSecret, { algorithms: ["HS256"] });
    if (
      typeof payload.id !== "string" ||
      typeof payload.name !== "string" ||
      typeof payload.email !== "string" ||
      (payload.role !== "student" && payload.role !== "admin")
    ) {
      return null;
    }

    return {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      avatarUrl: typeof payload.avatarUrl === "string" ? payload.avatarUrl : null,
    };
  } catch {
    return null;
  }
}

export { sessionCookieName };
