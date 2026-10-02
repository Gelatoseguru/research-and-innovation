import { backendFetch } from "@/lib/backend";
import type { PublicationStatus, Study } from "./types";

export type StudySubmission = Omit<Study, "id" | "createdAt" | "updatedAt"> & {
  pdfFile?: File | null;
  coverImageFile?: File | null;
};

async function readStudies(response: Response): Promise<Study[]> {
  const body = await response.json();
  if (!response.ok) throw new Error(body.error ?? "Unable to load studies.");
  return body.studies ?? [];
}

async function readStudy(response: Response): Promise<Study | null> {
  const body = await response.json();
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(body.error ?? "Unable to load study.");
  return body.study;
}

function formDataForStudy(data: StudySubmission, method?: "PATCH") {
  const formData = new FormData();
  if (method) formData.append("_method", method);
  formData.append("title", data.title);
  formData.append("authors", JSON.stringify(data.authors));
  formData.append("program", data.program);
  formData.append("college", data.college);
  formData.append("year", data.year);
  formData.append("abstract", data.abstract);
  formData.append("keywords", JSON.stringify(data.keywords));
  formData.append("status", data.status);
  if (data.pdfFile) formData.append("pdf", data.pdfFile);
  if (data.coverImageFile) formData.append("cover", data.coverImageFile);
  return formData;
}

export async function getStudies(): Promise<Study[]> {
  return readStudies(await backendFetch("studies", { cache: "no-store" }));
}

export async function getPublishedStudies(): Promise<Study[]> {
  return readStudies(await backendFetch("studies", { cache: "no-store" }));
}

export async function getStudyById(id: string): Promise<Study | null> {
  return readStudy(await backendFetch(`studies/${id}`, { cache: "no-store" }));
}

export async function createStudy(data: StudySubmission): Promise<Study> {
  const study = await readStudy(await backendFetch("studies", { method: "POST", body: formDataForStudy(data) }));
  if (!study) throw new Error("Study was not created.");
  return study;
}

export async function updateStudy(id: string, patch: StudySubmission): Promise<Study | null> {
  return readStudy(await backendFetch(`studies/${id}`, { method: "POST", body: formDataForStudy(patch, "PATCH") }));
}

export async function deleteStudy(id: string): Promise<boolean> {
  const response = await backendFetch(`studies/${id}`, { method: "DELETE" });
  return response.ok;
}

export async function searchStudies(query: string, filters?: { program?: string; status?: PublicationStatus }): Promise<Study[]> {
  const studies = await getStudies();
  const normalizedQuery = query.trim().toLowerCase();
  return studies.filter((study) => {
    const matchesProgram = !filters?.program || study.program === filters.program;
    const matchesStatus = !filters?.status || study.status === filters.status;
    const matchesQuery = !normalizedQuery || study.title.toLowerCase().includes(normalizedQuery) ||
      study.authors.some((author) => author.toLowerCase().includes(normalizedQuery)) ||
      study.keywords.some((keyword) => keyword.toLowerCase().includes(normalizedQuery));
    return matchesProgram && matchesStatus && matchesQuery;
  });
}
