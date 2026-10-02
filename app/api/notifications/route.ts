import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getSession } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "student") {
    return NextResponse.json({ notifications: [] });
  }

  const database = await getDatabase();
  const notifications = await database
    .collection("notifications")
    .find({ userId: new ObjectId(session.id) })
    .sort({ createdAt: -1 })
    .limit(20)
    .toArray();

  return NextResponse.json({
    notifications: notifications.map((notification) => ({
      id: notification._id.toHexString(),
      message: notification.message,
      status: notification.status,
      read: Boolean(notification.readAt),
      createdAt: notification.createdAt.toISOString(),
    })),
  });
}

export async function PATCH() {
  const session = await getSession();
  if (!session || session.role !== "student") {
    return NextResponse.json({ error: "Student session required." }, { status: 401 });
  }

  const database = await getDatabase();
  await database.collection("notifications").updateMany(
    { userId: new ObjectId(session.id), readAt: null },
    { $set: { readAt: new Date() } }
  );
  return NextResponse.json({ ok: true });
}
