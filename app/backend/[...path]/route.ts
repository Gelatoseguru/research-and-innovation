/**
 * RIMO API — replaces php-backend/index.php + bootstrap.php.
 * Same URLs (/backend/...), same JSON responses, but stored in MongoDB.
 */
import { NextRequest, NextResponse } from "next/server";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import bcrypt from "bcryptjs";
import { ObjectId, type Db, type Document } from "mongodb";
import { getDb } from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ path?: string[] }> };
type Role = "admin" | "student";
type Folder = "avatars" | "studies" | "covers";
type Kind = "pdf" | "jpg" | "png" | "webp";

const COOKIE = "rimo_session";
const WEEK = 60 * 60 * 24 * 7;
const MAX_UPLOAD = 10 * 1024 * 1024;
const UPLOAD_ROOT = join(process.cwd(), "storage", "uploads");
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OID = /^[a-f0-9]{24}$/i;

const CONTENT_TYPES: Record<string, string> = {
  pdf: "application/pdf",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

/* ------------------------------------------------------------------ */
/* Small helpers                                                       */
/* ------------------------------------------------------------------ */

class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const json = (data: unknown, status = 200) => NextResponse.json(data, { status });
const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const toOid = (v: unknown): ObjectId | null => (typeof v === "string" && OID.test(v) ? new ObjectId(v) : null);
const iso = (d: unknown) => (d instanceof Date ? d.toISOString() : "");
const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const isDuplicateKey = (e: unknown) => typeof e === "object" && e !== null && (e as { code?: number }).code === 11000;

function jsonList(value: unknown): string[] {
  const clean = (items: unknown[]) => items.map((x) => String(x).trim()).filter(Boolean);
  if (Array.isArray(value)) return clean(value);
  if (typeof value !== "string") return [];
  try {
    const decoded = JSON.parse(value);
    if (Array.isArray(decoded)) return clean(decoded);
  } catch {
    /* not JSON, treat as comma-separated */
  }
  return clean(value.split(","));
}

/** Old rows point at /rimo-api/uploads/... or /uploads/...; new files live at /backend/uploads/... */
function publicFileUrl(p: unknown): string | null {
  if (typeof p !== "string" || !p) return null;
  if (p.startsWith("/rimo-api/uploads/")) return p.replace("/rimo-api/uploads/", "/backend/uploads/");
  if (p.startsWith("/uploads/")) return `/backend${p}`;
  return p;
}

/* ------------------------------------------------------------------ */
/* Sessions (same signed-cookie idea as the PHP version)               */
/* ------------------------------------------------------------------ */

function sessionSecret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("SESSION_SECRET in .env.local must be at least 32 characters.");
  return s;
}
const sign = (payload: string) => createHmac("sha256", sessionSecret()).update(payload).digest("hex");

function setSession(res: NextResponse, user: Document) {
  const payload = Buffer.from(
    JSON.stringify({ id: String(user._id), role: user.role, exp: Math.floor(Date.now() / 1000) + WEEK }),
  ).toString("base64url");
  res.cookies.set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: WEEK,
  });
}

function clearSession(res: NextResponse) {
  res.cookies.set(COOKIE, "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
}

async function currentUser(req: NextRequest, db: Db): Promise<Document | null> {
  const token = req.cookies.get(COOKIE)?.value;
  if (!token || !token.includes(".")) return null;

  const [payload, signature = ""] = token.split(".", 2);
  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;

  let claims: { id?: unknown; exp?: unknown } | null = null;
  try {
    claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return null;
  }
  const id = toOid(claims?.id);
  if (!id || typeof claims?.exp !== "number" || claims.exp < Date.now() / 1000) return null;

  return db.collection("users").findOne({ _id: id, is_active: true }, { projection: { password: 0 } });
}

async function requireUser(req: NextRequest, db: Db, role?: Role): Promise<Document> {
  const user = await currentUser(req, db);
  if (!user) throw new HttpError(401, "Please sign in first.");
  if (role && user.role !== role) throw new HttpError(403, "You do not have permission for this action.");
  return user;
}

function publicUser(user: Document) {
  return {
    id: String(user._id),
    name: user.full_name,
    email: user.email,
    role: user.role,
    avatarUrl: publicFileUrl(user.avatar_url),
  };
}

/* ------------------------------------------------------------------ */
/* Uploads (saved in <project>/storage/uploads, served at /backend/uploads/...) */
/* ------------------------------------------------------------------ */

function sniff(buf: Buffer): Kind | null {
  if (buf.subarray(0, 4).toString("latin1") === "%PDF") return "pdf";
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (buf.subarray(0, 4).toString("latin1") === "RIFF" && buf.subarray(8, 12).toString("latin1") === "WEBP") return "webp";
  return null;
}

async function saveUpload(form: FormData | null, field: string, folder: Folder, allowed: Kind[]): Promise<string | null> {
  const file = form?.get(field);
  if (!file || typeof file === "string" || file.size === 0) return null;
  if (file.size > MAX_UPLOAD) throw new HttpError(400, "The uploaded file is invalid or larger than 10 MB.");

  const buf = Buffer.from(await file.arrayBuffer());
  const kind = sniff(buf); // checks the real file contents, not just the name
  if (!kind || !allowed.includes(kind)) throw new HttpError(400, "This file type is not allowed.");

  const name = `${randomBytes(16).toString("hex")}.${kind}`;
  const dir = join(UPLOAD_ROOT, folder);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, name), buf);
  return `/backend/uploads/${folder}/${name}`;
}

async function serveUpload(folder: string, file: string) {
  const okFolder = ["avatars", "studies", "covers"].includes(folder);
  const okFile = /^[a-f0-9]{32}\.(pdf|jpe?g|png|webp)$/i.test(file);
  if (!okFolder || !okFile) throw new HttpError(404, "File not found.");
  try {
    const data = await readFile(join(UPLOAD_ROOT, folder, file));
    const ext = file.split(".")[1].toLowerCase();
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": CONTENT_TYPES[ext] ?? "application/octet-stream",
        "Content-Disposition": "inline",
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    throw new HttpError(404, "File not found.");
  }
}

/* ------------------------------------------------------------------ */
/* Data helpers                                                        */
/* ------------------------------------------------------------------ */

async function listStudies(db: Db, filter: Document, limit = 0): Promise<Document[]> {
  return db
    .collection("studies")
    .aggregate([
      { $match: filter },
      { $sort: { created_at: -1 } },
      ...(limit > 0 ? [{ $limit: limit }] : []),
      { $lookup: { from: "users", localField: "uploaded_by", foreignField: "_id", as: "uploader" } },
      { $addFields: { uploaded_by_name: { $ifNull: [{ $arrayElemAt: ["$uploader.full_name", 0] }, ""] } } },
      { $project: { uploader: 0 } },
    ])
    .toArray();
}

function studyDto(s: Document) {
  return {
    id: String(s._id),
    title: s.title,
    authors: jsonList(s.authors),
    program: s.course ?? "",
    college: s.category ?? "",
    year: s.year_published != null ? String(s.year_published) : "",
    abstract: s.abstract ?? "",
    keywords: jsonList(s.keywords),
    pdfName: s.file_url ? basename(String(s.file_url)) : null,
    pdfUrl: publicFileUrl(s.file_url),
    coverImageName: s.cover_image_url ? basename(String(s.cover_image_url)) : null,
    coverImageUrl: publicFileUrl(s.cover_image_url),
    status: s.status,
    uploadedBy: s.uploaded_by_name ?? "",
    createdAt: iso(s.created_at),
    updatedAt: iso(s.updated_at),
    views: Number(s.views ?? 0),
  };
}

async function activity(db: Db, actorId: ObjectId, action: string, target: string) {
  await db.collection("activity_logs").insertOne({ actor_id: actorId, action, target, created_at: new Date() });
}

/* ------------------------------------------------------------------ */
/* The router                                                          */
/* ------------------------------------------------------------------ */

async function handle(req: NextRequest, ctx: Ctx): Promise<NextResponse> {
  try {
    const { path: segments = [] } = await ctx.params;
    const route = segments.join("/");

    // Public file downloads don't need the database.
    if (segments[0] === "uploads" && segments.length === 3 && req.method === "GET") {
      return await serveUpload(segments[1], segments[2]);
    }

    const db = await getDb();

    // Form bodies (file uploads). The frontend may send POST + _method=PATCH, like it did with PHP.
    let method = req.method.toUpperCase();
    let form: FormData | null = null;
    const contentType = req.headers.get("content-type") ?? "";
    if (method !== "GET" && method !== "HEAD" && /multipart\/form-data|x-www-form-urlencoded/.test(contentType)) {
      form = await req.formData();
      const override = form.get("_method");
      if (method === "POST" && typeof override === "string" && override) method = override.toUpperCase();
    }
    const readJson = async (): Promise<Record<string, unknown>> => {
      try {
        const v = await req.json();
        return v && typeof v === "object" ? (v as Record<string, unknown>) : {};
      } catch {
        return {};
      }
    };
    const field = (k: string) => str(form?.get(k));

    /* ---------- health ---------- */
    if (route === "health" && method === "GET") {
      await db.command({ ping: 1 });
      return json({ connected: true });
    }

    /* ---------- auth ---------- */
    if (route === "auth/register" && method === "POST") {
      const input = await readJson();
      const name = str(input.name);
      const email = str(input.email).toLowerCase();
      const password = typeof input.password === "string" ? input.password : "";
      if (name.length < 2 || !EMAIL.test(email) || password.length < 8) {
        throw new HttpError(400, "Enter your name, a valid email, and a password with at least 8 characters.");
      }
      const users = db.collection("users");
      if (await users.findOne({ email }, { projection: { _id: 1 } })) {
        throw new HttpError(409, "An account already exists for this email.");
      }
      const now = new Date();
      const doc = {
        full_name: name,
        email,
        password: await bcrypt.hash(password, 10),
        role: "student",
        student_id: null,
        course: null,
        is_active: true,
        avatar_url: null,
        created_at: now,
        updated_at: now,
      };
      try {
        const result = await users.insertOne(doc);
        const user = { ...doc, _id: result.insertedId };
        const res = json({ user: publicUser(user) }, 201);
        setSession(res, user);
        return res;
      } catch (error) {
        if (isDuplicateKey(error)) throw new HttpError(409, "An account already exists for this email.");
        throw error;
      }
    }

    if (route === "auth/login" && method === "POST") {
      const input = await readJson();
      const email = str(input.email).toLowerCase();
      const password = typeof input.password === "string" ? input.password : "";
      const user = await db.collection("users").findOne({ email, is_active: true });
      let ok = false;
      if (user) {
        try {
          ok = await bcrypt.compare(password, String(user.password));
        } catch {
          ok = false;
        }
      }
      if (!user || !ok) throw new HttpError(401, "Invalid email or password.");
      const res = json({ user: publicUser(user) });
      setSession(res, user);
      return res;
    }

    if (route === "auth/session" && method === "GET") {
      const user = await currentUser(req, db);
      return json({ user: user ? publicUser(user) : null });
    }

    if (route === "auth/logout" && method === "POST") {
      const res = json({ ok: true });
      clearSession(res);
      return res;
    }

    if (route === "profile/avatar" && method === "POST") {
      const user = await requireUser(req, db, "student");
      const url = await saveUpload(form, "avatar", "avatars", ["jpg", "png", "webp"]);
      if (!url) throw new HttpError(400, "Choose an image smaller than 10 MB.");
      await db.collection("users").updateOne({ _id: user._id }, { $set: { avatar_url: url, updated_at: new Date() } });
      return json({ avatarUrl: url });
    }

    /* ---------- studies ---------- */
    if (segments[0] === "studies") {
      const idSegment = segments[1];
      const studyId = idSegment ? toOid(idSegment) : null;
      if (idSegment && !studyId) throw new HttpError(404, "Study not found.");
      const user = await currentUser(req, db);
      const isAdmin = user?.role === "admin";
      const studies = db.collection("studies");

      if (method === "GET" && !studyId) {
        const params = new URL(req.url).searchParams;
        const search = str(params.get("search"));
        const status = str(params.get("status"));
        const filter: Document = {};
        if (!isAdmin) filter.status = "published";
        else if (status) filter.status = status;
        if (search) {
          const re = new RegExp(escapeRegex(search), "i");
          filter.$or = [{ title: re }, { authors: re }, { keywords: re }];
        }
        const rows = await listStudies(db, filter, params.has("recent") ? 6 : 0);
        return json({ studies: rows.map(studyDto) });
      }

      if (method === "GET" && studyId) {
        const [study] = await listStudies(db, { _id: studyId }, 1);
        if (!study || (!isAdmin && study.status !== "published")) throw new HttpError(404, "Study not found.");
        if (!isAdmin) {
          await studies.updateOne({ _id: studyId }, { $inc: { views: 1 } });
          study.views = Number(study.views ?? 0) + 1;
        }
        return json({ study: studyDto(study) });
      }

      if (method === "POST" && !studyId) {
        const admin = await requireUser(req, db, "admin");
        const title = field("title");
        const abstract = field("abstract");
        const authors = jsonList(form?.get("authors"));
        const program = field("program");
        const college = field("college");
        const year = parseInt(field("year"), 10) || 0;
        const keywords = jsonList(form?.get("keywords"));
        const status = field("status");
        if (!title || !abstract || !authors.length || !year || !["draft", "published"].includes(status)) {
          throw new HttpError(400, "Complete the required study details and attach a PDF.");
        }
        const pdf = await saveUpload(form, "pdf", "studies", ["pdf"]);
        if (!pdf) throw new HttpError(400, "Complete the required study details and attach a PDF.");
        const cover = await saveUpload(form, "cover", "covers", ["jpg", "png", "webp"]);

        const now = new Date();
        const result = await studies.insertOne({
          title,
          abstract,
          authors,
          course: program,
          year_published: year,
          keywords,
          file_url: pdf,
          cover_image_url: cover,
          uploaded_by: admin._id,
          category: college,
          status,
          views: 0,
          created_at: now,
          updated_at: now,
        });
        await activity(db, admin._id, status === "published" ? "published" : "uploaded", title);
        const [created] = await listStudies(db, { _id: result.insertedId }, 1);
        return json({ study: studyDto(created) }, 201);
      }

      if (method === "PATCH" && studyId) {
        const admin = await requireUser(req, db, "admin");
        const existing = await studies.findOne({ _id: studyId });
        if (!existing) throw new HttpError(404, "Study not found.");

        const pick = (k: string, fallback: unknown) => (form?.has(k) ? field(k) : str(fallback));
        const title = pick("title", existing.title);
        const abstract = pick("abstract", existing.abstract);
        const authors = form?.has("authors") ? jsonList(form.get("authors")) : jsonList(existing.authors);
        const program = pick("program", existing.course);
        const college = pick("college", existing.category);
        const year = form?.has("year") ? parseInt(field("year"), 10) || 0 : Number(existing.year_published) || 0;
        const keywords = form?.has("keywords") ? jsonList(form.get("keywords")) : jsonList(existing.keywords);
        const status = pick("status", existing.status);
        if (!title || !abstract || !authors.length || !year || !["draft", "published", "archived"].includes(status)) {
          throw new HttpError(400, "Complete the required study details.");
        }
        const pdf = (await saveUpload(form, "pdf", "studies", ["pdf"])) ?? existing.file_url;
        const cover = (await saveUpload(form, "cover", "covers", ["jpg", "png", "webp"])) ?? existing.cover_image_url ?? null;

        await studies.updateOne(
          { _id: studyId },
          {
            $set: {
              title,
              abstract,
              authors,
              course: program,
              year_published: year,
              keywords,
              file_url: pdf,
              cover_image_url: cover,
              category: college,
              status,
              updated_at: new Date(),
            },
          },
        );
        await activity(db, admin._id, status === "archived" ? "archived" : "edited", title);
        const [updated] = await listStudies(db, { _id: studyId }, 1);
        return json({ study: studyDto(updated) });
      }

      if (method === "DELETE" && studyId) {
        const admin = await requireUser(req, db, "admin");
        const archived = await studies.findOneAndUpdate(
          { _id: studyId, status: { $ne: "archived" } },
          { $set: { status: "archived", updated_at: new Date() } },
          { returnDocument: "before" },
        );
        if (!archived) throw new HttpError(404, "Study not found or is already archived.");
        await activity(db, admin._id, "archived", String(archived.title));
        return json({ ok: true });
      }
    }

    /* ---------- requests ---------- */
    if (segments[0] === "requests") {
      const idSegment = segments[1];
      const requestId = idSegment ? toOid(idSegment) : null;
      const requests = db.collection("requests");

      if (method === "GET" && !idSegment) {
        const user = await requireUser(req, db);
        const match: Document = user.role === "student" ? { requested_by: user._id } : {};
        const rows = await requests
          .aggregate([
            { $match: match },
            { $sort: { requested_at: -1 } },
            { $lookup: { from: "studies", localField: "study_id", foreignField: "_id", as: "study" } },
            { $lookup: { from: "users", localField: "requested_by", foreignField: "_id", as: "requester" } },
            { $unwind: "$study" },
            { $unwind: "$requester" },
          ])
          .toArray();
        return json({
          requests: rows.map((r) => ({
            id: String(r._id),
            studyId: String(r.study_id),
            studyTitle: r.study.title,
            requesterName: r.requester.full_name,
            requesterEmail: r.requester.email,
            purpose: r.purpose,
            status: r.status,
            requestedAt: iso(r.requested_at),
          })),
        });
      }

      if (method === "POST" && !idSegment) {
        const student = await requireUser(req, db, "student");
        const input = await readJson();
        const studyId = toOid(input.studyId);
        const purpose = str(input.purpose);
        if (!studyId || purpose.length < 10) {
          throw new HttpError(400, "Please include a reason of at least 10 characters.");
        }
        const study = await db.collection("studies").findOne({ _id: studyId, status: "published" });
        if (!study) throw new HttpError(404, "This study is no longer available.");
        const pending = await requests.findOne({ study_id: studyId, requested_by: student._id, status: "pending" });
        if (pending) throw new HttpError(409, "You already have a pending request for this study.");

        const now = new Date();
        const result = await requests.insertOne({
          study_id: studyId,
          requested_by: student._id,
          status: "pending",
          purpose,
          requested_at: now,
          responded_at: null,
          responded_by: null,
        });
        await db.collection("notifications").insertOne({
          recipient_id: null,
          recipient_role: "admin",
          type: "new_request",
          message: `New request for "${study.title}"`,
          related_request_id: result.insertedId,
          related_study_id: studyId,
          is_read: false,
          created_at: now,
        });
        return json({ request: { id: String(result.insertedId), status: "pending" } }, 201);
      }

      if (method === "PATCH" && requestId) {
        const admin = await requireUser(req, db, "admin");
        const input = await readJson();
        const status = str(input.status);
        if (!["approved", "rejected"].includes(status)) throw new HttpError(400, "Invalid request status.");

        const now = new Date();
        // Only succeeds if the request is still pending, so two admins can't both answer it.
        const updated = await requests.findOneAndUpdate(
          { _id: requestId, status: "pending" },
          { $set: { status, responded_at: now, responded_by: admin._id } },
          { returnDocument: "after" },
        );
        if (!updated) throw new HttpError(409, "This request is no longer pending.");

        const study = await db.collection("studies").findOne({ _id: updated.study_id });
        const title = String(study?.title ?? "this study");
        await db.collection("notifications").insertOne({
          recipient_id: updated.requested_by,
          recipient_role: "student",
          type: `request_${status}`,
          message: `Your request for "${title}" was ${status}.`,
          related_request_id: requestId,
          related_study_id: updated.study_id,
          is_read: false,
          created_at: now,
        });
        await activity(db, admin._id, status, title);
        return json({ request: { id: String(requestId), status } });
      }
    }

    /* ---------- notifications ---------- */
    if (route === "notifications" && method === "GET") {
      const student = await requireUser(req, db, "student");
      const items = await db
        .collection("notifications")
        .find({ recipient_id: student._id, recipient_role: "student" })
        .sort({ created_at: -1 })
        .limit(20)
        .toArray();
      return json({
        notifications: items.map((n) => ({
          id: String(n._id),
          message: n.message,
          status: String(n.type).replace("request_", ""),
          read: Boolean(n.is_read),
          createdAt: iso(n.created_at),
        })),
      });
    }

    if (route === "notifications" && method === "PATCH") {
      const student = await requireUser(req, db, "student");
      await db
        .collection("notifications")
        .updateMany({ recipient_id: student._id, recipient_role: "student" }, { $set: { is_read: true } });
      return json({ ok: true });
    }

    /* ---------- admin ---------- */
    if (route === "admin/users" && method === "GET") {
      await requireUser(req, db, "admin");
      const rows = await db
        .collection("users")
        .aggregate([
          { $match: { role: "student" } },
          { $sort: { created_at: -1 } },
          { $lookup: { from: "requests", localField: "_id", foreignField: "requested_by", as: "reqs" } },
          { $addFields: { requests_count: { $size: "$reqs" } } },
          { $project: { reqs: 0, password: 0 } },
        ])
        .toArray();
      return json({
        users: rows.map((u) => ({
          id: String(u._id),
          name: u.full_name,
          email: u.email,
          role: u.role,
          requestsCount: Number(u.requests_count),
          joinedAt: iso(u.created_at),
        })),
      });
    }

    if (route === "activity" && method === "GET") {
      await requireUser(req, db, "admin");
      const rows = await db
        .collection("activity_logs")
        .aggregate([
          { $sort: { created_at: -1 } },
          { $limit: 100 },
          { $lookup: { from: "users", localField: "actor_id", foreignField: "_id", as: "actor" } },
          { $addFields: { actor_name: { $arrayElemAt: ["$actor.full_name", 0] } } },
          { $project: { actor: 0 } },
        ])
        .toArray();
      return json({
        logs: rows.map((r) => ({
          id: String(r._id),
          actor: r.actor_name ?? "Unknown admin",
          action: r.action,
          target: r.target,
          timestamp: iso(r.created_at),
        })),
      });
    }

    throw new HttpError(404, "Endpoint not found.");
  } catch (error) {
    if (error instanceof HttpError) return json({ error: error.message }, error.status);
    console.error(error);
    return json({ error: "The server could not complete this request." }, 500);
  }
}

export { handle as GET, handle as POST, handle as PATCH, handle as PUT, handle as DELETE };
