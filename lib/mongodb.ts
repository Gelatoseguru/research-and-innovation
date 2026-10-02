import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "rimo_system";

// Keep one connection alive across hot-reloads in `npm run dev`.
const g = globalThis as typeof globalThis & { _rimoMongo?: Promise<Db> };

async function connect(): Promise<Db> {
  if (!uri) {
    throw new Error("MONGODB_URI is missing in .env.local");
  }

  const client = await new MongoClient(uri, { serverSelectionTimeoutMS: 8000 }).connect();
  const db = client.db(dbName);

  // Same indexes the MySQL tables had. Safe to run every time.
  await Promise.all([
    db.collection("users").createIndex({ email: 1 }, { unique: true }),
    db.collection("requests").createIndex({ requested_by: 1, study_id: 1, status: 1 }),
    db.collection("notifications").createIndex({ recipient_id: 1, is_read: 1, created_at: -1 }),
    db.collection("studies").createIndex({ status: 1, created_at: -1 }),
  ]).catch((error: unknown) => {
    console.error("Index setup skipped:", error instanceof Error ? error.message : error);
  });

  return db;
}

export function getDb(): Promise<Db> {
  if (!g._rimoMongo) {
    g._rimoMongo = connect().catch((error) => {
      g._rimoMongo = undefined; // let the next request try again
      throw error;
    });
  }
  return g._rimoMongo;
}
