// Usage (run inside my-app):
//   node scripts/reset-admin-password.mjs admin@lnu.edu.ph MyNewPassword123
//
// It reads MONGODB_URI and MONGODB_DB from .env.local, shows what is in the
// database, and sets a new password for that account.

import { readFileSync } from "node:fs";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

function loadEnv(file) {
  const env = {};
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return env;
}

const [, , emailArg, newPassword] = process.argv;
if (!emailArg || !newPassword || newPassword.length < 8) {
  console.log("Usage: node scripts/reset-admin-password.mjs admin@lnu.edu.ph NewPassword (8+ characters)");
  process.exit(1);
}

let env;
try {
  env = loadEnv(".env.local");
} catch {
  console.log("Could not read .env.local. Run this from inside the my-app folder.");
  process.exit(1);
}

const dbName = env.MONGODB_DB || "rimo_system";
const client = new MongoClient(env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 });

try {
  await client.connect();
  const db = client.db(dbName);
  const users = db.collection("users");

  console.log(`Connected. Database: "${dbName}"`);
  const count = await users.countDocuments();
  console.log(`Users in this database: ${count}`);

  if (count === 0) {
    console.log("\nThe users collection is EMPTY (or missing) in this database.");
    console.log("Import users.json into this database in Compass, then run this again.");
    const names = (await client.db().admin().listDatabases()).databases.map((d) => d.name);
    console.log("Databases found on this server:", names.join(", "));
    process.exit(1);
  }

  const email = emailArg.trim().toLowerCase();
  const user = await users.findOne({ email });
  if (!user) {
    console.log(`\nNo user with email "${email}". Emails that exist:`);
    for (const u of await users.find({}, { projection: { email: 1, role: 1 } }).toArray()) {
      console.log(`  - ${u.email} (${u.role})`);
    }
    process.exit(1);
  }

  const hash = await bcrypt.hash(newPassword, 10);
  await users.updateOne(
    { _id: user._id },
    { $set: { password: hash, is_active: true, updated_at: new Date() } },
  );
  console.log(`\nDone. ${email} (${user.role}) can now log in with the new password.`);
} catch (error) {
  console.log("\nFailed:", error.message);
  process.exit(1);
} finally {
  await client.close();
}
