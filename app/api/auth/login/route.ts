import { NextResponse } from "next/server";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSessionToken, sessionCookie } from "@/lib/auth/session";
import { toSessionUser, usersCollection } from "@/lib/auth/users";

async function findOrCreateConfiguredAdmin(email: string, password: string) {
  const configuredEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  if (!configuredEmail || email !== configuredEmail || password !== process.env.ADMIN_PASSWORD) {
    return null;
  }

  const users = await usersCollection();
  const existing = await users.findOne({ email });
  if (existing) return existing;

  const name = process.env.ADMIN_NAME ?? "LNU Administrator";
  const result = await users.insertOne({
    name,
    email,
    passwordHash: await hashPassword(password),
    role: "admin",
    avatarUrl: null,
    createdAt: new Date(),
  });
  return users.findOne({ _id: result.insertedId });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const users = await usersCollection();
  let user = await users.findOne({ email });
  if (!user) user = await findOrCreateConfiguredAdmin(email, password);

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const sessionUser = toSessionUser(user);
  const response = NextResponse.json({ user: sessionUser });
  response.cookies.set("lnu-session", await createSessionToken(sessionUser), sessionCookie);
  return response;
}
