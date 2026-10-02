import { getDatabase } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const database = await getDatabase();
    await database.command({ ping: 1 });

    return Response.json({ connected: true });
  } catch {
    return Response.json(
      { connected: false, error: "Unable to connect to MongoDB Atlas." },
      { status: 503 }
    );
  }
}
