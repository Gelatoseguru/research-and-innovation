import "server-only";

import { Db, MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DB ?? "rimo_system";

if (!uri) {
  throw new Error("MONGODB_URI is not configured.");
}

const globalForMongo = globalThis as typeof globalThis & { mongoClientPromise?: Promise<MongoClient> };

const clientPromise = globalForMongo.mongoClientPromise ?? new MongoClient(uri).connect();
if (process.env.NODE_ENV !== "production") globalForMongo.mongoClientPromise = clientPromise;

export async function getDatabase(): Promise<Db> {
  return (await clientPromise).db(databaseName);
}
