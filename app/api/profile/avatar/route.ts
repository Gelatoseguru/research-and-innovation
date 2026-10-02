import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getSession } from "@/lib/auth/session";
import { usersCollection } from "@/lib/auth/users";

const maximumAvatarBytes = 1_000_000;

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "student") {
    return NextResponse.json({ error: "Student session required." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("avatar");
  if (!(file instanceof File) || !file.type.startsWith("image/") || file.size > maximumAvatarBytes) {
    return NextResponse.json({ error: "Choose an image smaller than 1 MB." }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const avatarUrl = `data:${file.type};base64,${bytes.toString("base64")}`;
  const users = await usersCollection();
  await users.updateOne({ _id: new ObjectId(session.id) }, { $set: { avatarUrl } });

  return NextResponse.json({ avatarUrl });
}
