"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { UploadCloud, Check } from "lucide-react";
import AdminTopBar from "@/components/admin/AdminTopBar";
import TagInput from "@/components/admin/TagInput";
import { useAdminAuth } from "@/lib/admin/auth-context";
import {
  createStudy,
  getStudyById,
  updateStudy,
} from "@/lib/admin/research-service";
import { addActivityLog } from "@/lib/admin/activity-service";
import type { PublicationStatus } from "@/lib/admin/types";

const PROGRAMS = ["PhD", "MAEd", "MAN"];
const COLLEGES = ["College of Education", "College of Nursing", "College of Medicine"];

function UploadResearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const { admin } = useAdminAuth();

  const [loadingExisting, setLoadingExisting] = useState(!!editId);
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState<string[]>([]);
  const [program, setProgram] = useState(PROGRAMS[0]);
  const [college, setCollege] = useState(COLLEGES[0]);
  const [year, setYear] = useState("");
  const [abstract, setAbstract] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [pdfName, setPdfName] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [status, setStatus] = useState<PublicationStatus>("draft");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!editId) return;
    getStudyById(editId).then((s) => {
      if (!s) {
        setLoadingExisting(false);
        return;
      }
      setTitle(s.title);
      setAuthors(s.authors);
      setProgram(s.program);
      setCollege(s.college);
      setYear(s.year);
      setAbstract(s.abstract);
      setKeywords(s.keywords);
      setPdfName(s.pdfName);
      setStatus(s.status);
      setLoadingExisting(false);
    });
  }, [editId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    const payload = {
      title,
      authors: authors.length ? authors : ["Unnamed author"],
      program,
      college,
      year,
      abstract,
      keywords,
      pdfName,
      status,
      uploadedBy: admin?.name ?? "Unknown admin",
      pdfFile,
    };

    try {
      if (editId) {
        await updateStudy(editId, payload);
        await addActivityLog({
          actor: admin?.name ?? "Unknown admin",
          action: "edited",
          target: title,
        });
      } else {
        await createStudy(payload);
        await addActivityLog({
          actor: admin?.name ?? "Unknown admin",
          action: status === "published" ? "published" : "uploaded",
          target: title,
        });
      }
      setSubmitted(true);
      setTimeout(() => router.push("/admin/research"), 900);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to save the study.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingExisting) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-sm font-medium text-gray-400">Loading study…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 w-full max-w-7xl mx-auto">
      <AdminTopBar title={editId ? "Edit Study" : "Research Details"} showBack />

      <form
        onSubmit={handleSubmit}
        className="w-full rounded-[2.5rem] border border-[#6B6B6B] bg-white/60 p-8 sm:p-10 shadow-xl shadow-gray-200/40 backdrop-blur-2xl"
      >
        {submitted && (
          <div className="mb-6 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm font-medium text-emerald-800 backdrop-blur-md">
            <Check size={16} /> {editId ? "Study updated successfully." : "Study submitted successfully."}
          </div>
        )}
        {submitError && (
          <div className="mb-5 rounded-lg bg-[#f3dde3] px-4 py-3 text-sm text-[#791B37]">
            {submitError}
          </div>
        )}

        {/* Horizontal Landscape Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Primary Details (Spans 7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <label className="mb-1.5 block font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] text-gray-500">
                Research title
              </label>
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Full title of the study"
                className="w-full rounded-2xl border border-gray-200/80 bg-white/70 px-4 py-3 text-sm text-gray-900 outline-none backdrop-blur-md transition-all focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-200/50"
              />
            </div>

            <TagInput
              label="Author(s)"
              values={authors}
              onChange={setAuthors}
              placeholder="Last name, first initial — press enter to add"
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] text-gray-500">
                  Program / course
                </label>
                <div className="relative">
                  <select
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                    className="w-full appearance-none rounded-2xl border border-gray-200/80 bg-white/70 px-4 py-3 text-sm text-gray-900 outline-none backdrop-blur-md transition-all focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-200/50"
                  >
                    {PROGRAMS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] text-gray-500">
                  College / department
                </label>
                <div className="relative">
                  <select
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full appearance-none rounded-2xl border border-gray-200/80 bg-white/70 px-4 py-3 text-sm text-gray-900 outline-none backdrop-blur-md transition-all focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-200/50"
                  >
                    {COLLEGES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] text-gray-500">
                Abstract
              </label>
              <textarea
                required
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
                rows={6}
                placeholder="This publishes publicly once status is set to Published"
                className="w-full rounded-2xl border border-gray-200/80 bg-white/70 p-4 text-sm text-gray-900 outline-none backdrop-blur-md transition-all focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-200/50"
              />
            </div>
          </div>

          {/* Right Column: Files, Publishing Settings & Submit Action (Spans 5 cols) */}
          <div className="lg:col-span-5 space-y-5 flex flex-col justify-between h-full">
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] text-gray-500">
                    Publication year
                  </label>
                  <input
                    required
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="2026"
                    inputMode="numeric"
                    className="w-full rounded-2xl border border-gray-200/80 bg-white/70 px-4 py-3 text-sm text-gray-900 outline-none backdrop-blur-md transition-all focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-200/50"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] text-gray-500">
                    Publication status
                  </label>
                  <div className="relative">
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as PublicationStatus)}
                      className="w-full appearance-none rounded-2xl border border-gray-200/80 bg-white/70 px-4 py-3 text-sm text-gray-900 outline-none backdrop-blur-md transition-all focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-200/50"
                    >
                      <option value="draft">Draft (not public yet)</option>
                      <option value="published">Published (visible on public site)</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>
              </div>

              <TagInput
                label="Keywords"
                values={keywords}
                onChange={setKeywords}
                placeholder="e.g. retention, blended learning — press enter"
              />

              <div>
                <label className="mb-1.5 block font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] text-gray-500">
                  Research PDF
                </label>
                <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-300 bg-white/40 py-12 px-6 text-sm text-gray-600 transition-all hover:bg-white/60 hover:border-gray-400 backdrop-blur-md">
                  <UploadCloud size={20} className="text-gray-500" />
                  <span className="font-medium text-gray-800 text-center truncate max-w-xs">{pdfName ? pdfName : "Click to select a PDF file"}</span>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    required={!editId}
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      setPdfFile(file);
                      setPdfName(file?.name ?? null);
                    }}
                  />
                </label>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-[#6B6B6B] py-3.5 text-xs font-medium text-white shadow-md shadow-gray-900/10 transition-all hover:bg-[#922842] disabled:opacity-60"
              >
                {submitting ? "Saving…" : editId ? "Save changes" : "Submit study"}
              </button>
              <p className="mt-3 text-center text-xs text-gray-500">
                Setting status to Published makes this study visible on the public site immediately.
              </p>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}

export default function UploadResearchPage() {
  return (
    <Suspense fallback={<div className="flex h-96 items-center justify-center"><p className="text-sm font-medium text-gray-400">Loading…</p></div>}>
      <UploadResearchForm />
    </Suspense>
  );
}