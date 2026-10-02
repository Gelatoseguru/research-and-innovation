import type { PublicationStatus, Study } from "./types";

// ---------------------------------------------------------------------
// This module is the ONLY place that reads or writes study records.
// Right now it's an in-memory mock array. Once your MongoDB API routes
// exist, replace each function body with a real fetch, e.g.:
//
//   export async function getStudies() {
//     return fetch("/api/studies").then((r) => r.json());
//   }
//
// Because both the admin dashboard AND the public homepage will import
// their study data from an API backed by the same database, a study an
// admin publishes here shows up on the public site immediately — there
// is no separate "sync" step to build.
// ---------------------------------------------------------------------

let studies: Study[] = [
  {
    id: "LNU-ED-2024-014",
    title: "Effects of blended learning on student retention",
    authors: ["J. dela Cruz"],
    program: "PhD in Education",
    college: "College of Education",
    year: "2024",
    abstract:
      "This study examines how blended learning formats affect student retention across two academic years.",
    keywords: ["blended learning", "retention", "education"],
    pdfName: "blended-learning-2024.pdf",
    coverImageName: null,
    status: "published",
    uploadedBy: "J. Manalo",
    createdAt: "2024-03-11T09:00:00.000Z",
    updatedAt: "2024-03-14T10:00:00.000Z",
  },
  {
    id: "LNU-MN-2023-088",
    title: "Community mental health interventions post-pandemic",
    authors: ["R. Santos"],
    program: "MAN",
    college: "College of Nursing",
    year: "2023",
    abstract:
      "An evaluation of community-based mental health programs implemented in the years following the pandemic.",
    keywords: ["mental health", "community health", "nursing"],
    pdfName: "mental-health-2023.pdf",
    coverImageName: null,
    status: "draft",
    uploadedBy: "J. Manalo",
    createdAt: "2023-11-02T09:00:00.000Z",
    updatedAt: "2023-11-02T09:00:00.000Z",
  },
  {
    id: "LNU-ED-2023-041",
    title: "Teacher workload and burnout in public secondary schools",
    authors: ["K. Ramos"],
    program: "MAEd",
    college: "College of Education",
    year: "2023",
    abstract:
      "A survey-based study on workload distribution and reported burnout among public secondary school teachers.",
    keywords: ["teacher workload", "burnout", "education"],
    pdfName: "teacher-workload-2023.pdf",
    coverImageName: null,
    status: "published",
    uploadedBy: "R. Fernandez",
    createdAt: "2023-08-20T09:00:00.000Z",
    updatedAt: "2023-08-22T09:00:00.000Z",
  },
];

function delay<T>(value: T, ms = 350): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function getStudies(): Promise<Study[]> {
  return delay([...studies]);
}

export async function getPublishedStudies(): Promise<Study[]> {
  return delay(studies.filter((s) => s.status === "published"));
}

export async function getStudyById(id: string): Promise<Study | null> {
  return delay(studies.find((s) => s.id === id) ?? null);
}

export async function createStudy(
  data: Omit<Study, "id" | "createdAt" | "updatedAt">
): Promise<Study> {
  const now = new Date().toISOString();
  const programCode = data.program.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase() || "GN";
  const newStudy: Study = {
    ...data,
    id: `LNU-${programCode}-${data.year}-${String(Math.floor(Math.random() * 900) + 100)}`,
    createdAt: now,
    updatedAt: now,
  };
  studies = [newStudy, ...studies];
  return delay(newStudy);
}

export async function updateStudy(
  id: string,
  patch: Partial<Study>
): Promise<Study | null> {
  studies = studies.map((s) =>
    s.id === id ? { ...s, ...patch, updatedAt: new Date().toISOString() } : s
  );
  return delay(studies.find((s) => s.id === id) ?? null);
}

export async function deleteStudy(id: string): Promise<boolean> {
  studies = studies.filter((s) => s.id !== id);
  return delay(true);
}

export async function searchStudies(
  query: string,
  filters?: { program?: string; status?: PublicationStatus }
): Promise<Study[]> {
  let results = studies;
  if (filters?.program) results = results.filter((s) => s.program === filters.program);
  if (filters?.status) results = results.filter((s) => s.status === filters.status);
  if (query.trim()) {
    const q = query.trim().toLowerCase();
    results = results.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.keywords.some((k) => k.toLowerCase().includes(q)) ||
        s.authors.some((a) => a.toLowerCase().includes(q))
    );
  }
  return delay(results);
}
