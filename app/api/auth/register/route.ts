import { NextResponse } from "next/server";
import { MongoServerError } from "mongodb";
import { hashPassword } from "@/lib/auth/password";
import { createSessionToken, sessionCookie } from "@/lib/auth/session";
import { usersCollection } from "@/lib/auth/users";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || password.length < 8) {
    return NextResponse.json(
      { error: "Enter your name, a valid email, and a password with at least 8 characters." },
      { status: 400 }
    );
  }

  try {
    const users = await usersCollection();
    const result = await users.insertOne({
      name,
      email,
      passwordHash: await hashPassword(password),
      role: "student",
      avatarUrl: null,
      createdAt: new Date(),
    });
    const user = { id: result.insertedId.toHexString(), name, email, role: "student" as const, avatarUrl: null };
    const response = NextResponse.json({ user }, { status: 201 });
    response.cookies.set("lnu-session", await createSessionToken(user), sessionCookie);
    return response;
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      return NextResponse.json({ error: "An account already exists for this email." }, { status: 409 });
    }
    return NextResponse.json({ error: "Unable to create your account." }, { status: 500 });
  }
}
