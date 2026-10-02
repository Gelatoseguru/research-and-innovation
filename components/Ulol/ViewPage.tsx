"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Quote,
  Download,
  User2Icon,
  Eye,
  FileText,
  ChevronRight,
  X,
  CheckCircle,
  Mail,
  Lock,
  User,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import { useStudentAuth } from "@/components/auth/StudentAuthProvider";
import { backendFetch } from "@/lib/backend";

type ResearchPaper = {
  id: string; // MongoDB ObjectId string
  title: string;
  authors: string[];
  program: string;
  year: string;
  date: string;
  doi: string;
  reads: number;
  citations: number;
  keywords: string[];
  abstract: string;
  pdfUrl: string | null;
};

// Pulls the filename out of a Content-Disposition header, if the server sent one.
function filenameFromDisposition(header: string | null): string | null {
  if (!header) return null;
  const utf8 = /filename\*=UTF-8''([^;]+)/i.exec(header);
  if (utf8) {
    try {
      return decodeURIComponent(utf8[1].trim());
    } catch {
      /* fall through */
    }
  }
  const plain = /filename="?([^";]+)"?/i.exec(header);
  return plain ? plain[1].trim() : null;
}

export default function ViewPage() {
  const searchParams = useSearchParams();
  const { user, login, register } = useStudentAuth();
  const requestedId = searchParams.get("id") ?? "";
  const [paper, setPaper] = useState<ResearchPaper | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const maxReads = 700;
  const maxCitations = 5;

  // States for Tabs and Modal
  const [activeTab, setActiveTab] = useState("overview");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState("auth"); // 'auth' | 'reason' | 'success'
  const [requestReason, setRequestReason] = useState("");
  const [requestError, setRequestError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [showLoginNotice, setShowLoginNotice] = useState(false);
  const [requestStatus, setRequestStatus] = useState<"pending" | "approved" | "rejected" | null>(null);

  // Download states
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!requestedId) {
      setLoading(false);
      setLoadError("No study selected.");
      return;
    }

    setLoading(true);
    setLoadError(null);

    backendFetch(`studies/${encodeURIComponent(requestedId)}`, { cache: "no-store" })
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.error ?? "Study not found.");
        return body;
      })
      .then((body) => {
        if (cancelled) return;
        const study = body.study as {
          id: string;
          title: string;
          authors: string[];
          program: string;
          year: string;
          abstract: string;
          keywords: string[];
          createdAt: string;
          views?: number;
          pdfUrl?: string | null;
        };
        setPaper({
          id: study.id,
          title: study.title,
          authors: study.authors ?? [],
          program: study.program,
          year: study.year,
          date: new Date(study.createdAt).toLocaleDateString(undefined, { month: "long", year: "numeric" }),
          doi: "Not assigned",
          reads: study.views ?? 0,
          citations: 0,
          keywords: study.keywords ?? [],
          abstract: study.abstract,
          pdfUrl: study.pdfUrl ?? null,
        });
      })
      .catch((err: unknown) => {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : "Unable to load this study.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [requestedId]);

  // Login Form States
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    if (!paper || !user || user.role !== "student") {
      queueMicrotask(() => setRequestStatus(null));
      return;
    }
    const studyId = paper.id;

    backendFetch("requests", { cache: "no-store" })
      .then((response) => response.json())
      .then((body) => {
        const forThisStudy: { studyId: string; status: "pending" | "approved" | "rejected" }[] =
          (body.requests ?? []).filter((request: { studyId: string }) => request.studyId === studyId);
        const approved = forThisStudy.find((request) => request.status === "approved");
        setRequestStatus(approved?.status ?? forThisStudy[0]?.status ?? null);
      })
      .catch(() => setRequestStatus(null));
  }, [paper, user]);

  const isStudent = !!user && user.role === "student";

  // Close the modal if the student already has a pending/approved request for this study.
  useEffect(() => {
    if (isModalOpen && modalStep === "reason" && (requestStatus === "pending" || requestStatus === "approved")) {
      setIsModalOpen(false);
    }
  }, [isModalOpen, modalStep, requestStatus]);

  const openLoginModal = () => {
    setModalStep("auth");
    setAuthError(null);
    setIsModalOpen(true);
  };

  const handleRequestClick = () => {
    if (!isStudent) {
      setShowLoginNotice(true);
      return;
    }
    setShowLoginNotice(false);
    setModalStep("reason");
    setRequestReason("");
    setRequestError(null);
    setIsModalOpen(true);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthSubmitting(true);
    setAuthError(null);
    const result = isRegistering ? await register(name, email, password) : await login(email, password);
    setAuthSubmitting(false);
    if (!result.ok) {
      setAuthError(result.error);
      return;
    }
    setPassword("");
    setShowLoginNotice(false);
    setRequestReason("");
    setRequestError(null);
    setModalStep("reason");
  };

  const handleReasonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paper || !requestReason.trim()) return;
    const response = await backendFetch("requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studyId: paper.id,
        studyTitle: paper.title,
        purpose: requestReason,
      }),
    });
    if (!response.ok) {
      const body = await response.json();
      setRequestError(body.error ?? "Unable to submit your request.");
      return;
    }
    setRequestStatus("pending");
    setModalStep("success");
  };

  const handleDownload = async () => {
    if (!paper || downloading) return;
    setDownloading(true);
    setDownloadError(null);
    try {
      const response = await backendFetch(`studies/${encodeURIComponent(paper.id)}/download`, {
        cache: "no-store",
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? "Unable to download this file.");
      }

      const raw = await response.blob();
      if (raw.size === 0) throw new Error("The downloaded file is empty.");
      if (!(await raw.slice(0, 4).text()).startsWith("%PDF")) throw new Error("The server did not return a valid PDF.");
      const blob = new Blob([raw], { type: "application/pdf" });
      const fallbackName =
        (paper.title.replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "_") || "manuscript") + ".pdf";
      const filename = filenameFromDisposition(response.headers.get("Content-Disposition")) ?? fallbackName;

      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } catch (err) {
      setDownloadError(err instanceof Error ? err.message : "Unable to download this file.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading || !paper) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-zinc-200/60 to-stone-200 text-zinc-900 font-sans px-6 sm:px-12 pt-24 sm:pt-28 pb-16">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/Publications"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-zinc-500 hover:text-[#922842] transition-colors font-[family-name:var(--font-mono)]"
          >
            <ArrowLeft size={13} />
            Research List
          </Link>
          <p className="mt-10 text-sm text-zinc-500">
            {loading ? "Loading study…" : loadError ?? "Study not found."}
          </p>
        </div>
      </div>
    );
  }

  const canDownload = isStudent && requestStatus === "approved" && !!paper.pdfUrl;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-zinc-200/60 to-stone-200 text-zinc-900 font-sans px-6 sm:px-10 pt-24 sm:pt-28 pb-16">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb / back nav */}
        <div className="mb-6 flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-500 font-[family-name:var(--font-mono)]">
          <Link
            href="/Publications"
            className="inline-flex items-center gap-1.5 hover:text-[#922842] transition-colors"
          >
            <ArrowLeft size={13} />
            Research List
          </Link>
          <ChevronRight size={12} className="text-zinc-400" />
          <span className="text-zinc-500">{paper.program}</span>
        </div>

        {/* Header block */}
        <div className="mb-8 border-b border-zinc-300 pb-6">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="px-2.5 py-1 rounded-md bg-[#922842]/10 border border-[#922842]/20 text-[#922842] text-[10px] uppercase tracking-wider font-[family-name:var(--font-mono)]">
              Thesis / Article
            </span>
            <span className="px-2.5 py-1 rounded-md bg-zinc-50 border border-zinc-300 text-zinc-600 text-[10px] uppercase tracking-wider font-[family-name:var(--font-mono)]">
              {canDownload ? "Full text available" : "Abstract only"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-light tracking-tight font-[family-name:var(--font-fraunces)] text-zinc-900 mb-4 max-w-4xl leading-tight">
            {paper.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-500 font-[family-name:var(--font-mono)] mb-5">
            <span>{paper.date}</span>
            <span className="text-zinc-400">&bull;</span>
            <span>DOI: {paper.doi}</span>
          </div>

          {/* Authors */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {paper.authors.map((author) => (
              <div
                key={author}
                className="inline-flex items-center gap-2 pr-3 pl-1.5 py-1.5 rounded-full bg-zinc-50 border border-zinc-200"
              >
                <div className="w-6 h-6 rounded-full bg-[#922842]/10 text-[#922842] flex items-center justify-center text-[10px] font-semibold font-[family-name:var(--font-mono)]">
                  {author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <span className="text-xs text-zinc-700 font-medium">{author}</span>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-8 border-b border-zinc-200">
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === "overview"
                  ? "text-[#922842] border-b-2 border-[#922842]"
                  : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("citations")}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === "citations"
                  ? "text-[#922842] border-b-2 border-[#922842]"
                  : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              Citations
            </button>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left column — Dynamic Content based on Tabs */}
          <div className="lg:col-span-8 space-y-6">
            {activeTab === "overview" && (
              <>
                {/* Abstract */}
                <div className="bg-[#FAFAFA] border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                  <h2 className="text-xs uppercase tracking-widest text-[#922842] font-[family-name:var(--font-mono)] mb-3">
                    Abstract
                  </h2>
                  <p className="text-[15px] leading-relaxed text-zinc-700">
                    {paper.abstract}
                  </p>

                  <div className="mt-6 pt-5 border-t border-dashed border-zinc-200 flex flex-wrap gap-2">
                    {paper.keywords.map((kw) => (
                      <span
                        key={kw}
                        className="px-2.5 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-[11px] text-zinc-600 font-[family-name:var(--font-mono)]"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Full-text access panel */}
                <div className="bg-[#FAFAFA] border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#922842]/10 flex items-center justify-center flex-shrink-0">
                      <FileText size={18} className="text-[#922842]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-zinc-900 mb-1">
                        {requestStatus === "approved" ? "Full-text access approved" : "Full-text access"}
                      </h3>
                      <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                        {isStudent
                          ? requestStatus === "approved"
                            ? "Your request has been approved. Use Download File in the Actions panel."
                            : requestStatus === "pending"
                            ? "Your request is awaiting review by the repository administrator."
                            : "You are signed in. Request access to the complete manuscript below."
                          : "Log in to request access to the complete manuscript."}
                      </p>
                      {requestStatus !== "approved" && (
                        <button
                          onClick={handleRequestClick}
                          disabled={requestStatus === "pending"}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#922842] text-white text-xs font-medium hover:bg-[#7a2137] transition-colors shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <Download size={13} />
                          {requestStatus === "pending" ? "Request pending" : "Request full-text"}
                        </button>
                      )}
                      {showLoginNotice && !isStudent && (
                        <p className="mt-3 rounded-lg border border-[#922842]/30 bg-[#922842]/10 px-3 py-2 text-xs text-[#791B37]">
                          Log in first to request access.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "citations" && (
              <div className="bg-[#FAFAFA] border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-sm animate-in fade-in duration-300">
                <h2 className="text-lg font-semibold text-zinc-900 mb-6">
                  Cited by {paper.citations} publications
                </h2>
                {paper.citations > 0 ? (
                  <ul className="space-y-6">
                    <li className="border-b border-zinc-200 pb-5 last:border-0">
                      <h4 className="text-[15px] font-medium text-[#922842] hover:underline cursor-pointer mb-2">
                        Modernizing Institutional Repositories in Southeast Asia
                      </h4>
                      <p className="text-sm text-zinc-700 mb-1">
                        Villanueva, M., & Santos, D. (2027)
                      </p>
                      <p className="text-xs text-zinc-500 font-[family-name:var(--font-mono)]">
                        Journal of Educational Technology • DOI: 10.1234/jet.2027.05
                      </p>
                    </li>
                    {paper.citations > 1 && (
                      <li className="border-b border-zinc-200 pb-5 last:border-0">
                        <h4 className="text-[15px] font-medium text-[#922842] hover:underline cursor-pointer mb-2">
                          Evaluating Similarity-Based Retrieval in Academic Archives
                        </h4>
                        <p className="text-sm text-zinc-700 mb-1">
                          Reyes, A., & Gomez, E. (2027)
                        </p>
                        <p className="text-xs text-zinc-500 font-[family-name:var(--font-mono)]">
                          International Conference on Information Systems
                        </p>
                      </li>
                    )}
                  </ul>
                ) : (
                  <div className="text-center py-10">
                    <Quote size={24} className="text-zinc-300 mx-auto mb-3" />
                    <p className="text-sm text-zinc-500">
                      No citations have been recorded for this manuscript yet.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right column — stats & actions */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#EFECE8] border border-zinc-200/50 rounded-2xl p-6 shadow-sm">
              <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-[family-name:var(--font-mono)] mb-4">
                Metrics
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-zinc-600 mb-1.5">
                    <span className="inline-flex items-center gap-1.5">
                      <Eye size={13} /> Reads
                    </span>
                    <span className="font-semibold text-zinc-900">
                      {paper.reads}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-zinc-300 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#922842]"
                      style={{
                        width: `${Math.min((paper.reads / maxReads) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-zinc-600 mb-1.5">
                    <span className="inline-flex items-center gap-1.5">
                      <Quote size={13} /> Citations
                    </span>
                    <span className="font-semibold text-zinc-900">
                      {paper.citations}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-zinc-300 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-zinc-600"
                      style={{
                        width: `${Math.min(
                          (paper.citations / maxCitations) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#FAFAFA] border border-zinc-200 rounded-2xl p-6 space-y-3 shadow-sm">
              <h3 className="text-[10px] uppercase tracking-widest text-[#292928] font-[family-name:var(--font-mono)] mb-1">
                Actions
              </h3>

              {!isStudent && (
                <button
                  onClick={openLoginModal}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-zinc-300 bg-white text-zinc-700 text-xs font-medium hover:border-[#922842] hover:text-[#922842] transition-colors shadow-sm"
                >
                  <User2Icon size={14} />
                  Log in
                </button>
              )}

              {canDownload ? (
                <>
                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={downloading}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#922842] text-white text-xs font-medium hover:bg-[#7a2137] transition-colors shadow-sm disabled:cursor-wait disabled:opacity-60"
                  >
                    <Download size={14} />
                    {downloading ? "Preparing download…" : "Download File"}
                  </button>
                  {downloadError && (
                    <p className="rounded-lg border border-[#922842]/30 bg-[#922842]/10 px-3 py-2 text-[11px] text-[#791B37]">
                      {downloadError}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <button
                    disabled
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-zinc-200 bg-zinc-100 text-zinc-400 text-xs font-medium cursor-not-allowed"
                  >
                    <Download size={14} />
                    Download File
                  </button>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">
                    {!isStudent
                      ? "Log in and request access to unlock the download."
                      : requestStatus === "pending"
                      ? "Waiting for admin approval."
                      : requestStatus === "rejected"
                      ? "Your last request was declined. You can submit a new one."
                      : "Request full-text access first. The download unlocks once an admin approves it."}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Request Full Text Modal with Integrated Login/Register */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-zinc-200/80">
            <div className="p-6 sm:p-8">
              {/* Centered Header Section with Absolute Close Button */}
              <div className="relative mb-6 text-center px-8">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute right-0 top-0 text-zinc-400 hover:text-zinc-700 transition-colors p-1"
                >
                  <X size={20} />
                </button>

                <h3 className="text-xl font-bold tracking-tight text-zinc-900 font-[family-name:var(--font-fraunces)] text-center">
                  {modalStep === "auth"
                    ? isRegistering
                      ? "Create Account"
                      : "Sign In Required"
                    : modalStep === "reason"
                    ? "Request Full-Text"
                    : "Request Submitted"}
                </h3>
                <p className="text-xs text-zinc-500 mt-1 font-[family-name:var(--font-mono)] text-center">
                  {modalStep === "auth"
                    ? isRegistering
                      ? "Join the LNU Archives repository"
                      : "Sign in to continue your request"
                    : modalStep === "reason"
                    ? "Provide a brief reason for accessing this manuscript"
                    : "Your request has been successfully queued"}
                </p>
              </div>

              {/* Step 1: Integrated Login / Register Card */}
              {modalStep === "auth" && (
                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  {authError && (
                    <p className="rounded-xl border border-[#922842]/30 bg-[#922842]/10 px-3 py-2 text-xs text-[#791B37]">
                      {authError}
                    </p>
                  )}
                  {isRegistering && (
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                        <User size={16} />
                      </span>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full name"
                        className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#922842] transition-colors"
                      />
                    </div>
                  )}

                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                      <Mail size={16} />
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email address"
                      className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#922842] transition-colors"
                    />
                  </div>

                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                      <Lock size={16} />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={isRegistering ? "Create password" : "Password"}
                      className="w-full pl-10 pr-10 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#922842] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-700 transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>


                  <button
                    type="submit"
                    disabled={authSubmitting}
                    className="w-full py-3.5 bg-[#922842] hover:bg-[#791B37] text-white text-xs font-[family-name:var(--font-mono)] uppercase tracking-wider rounded-xl font-medium transition-all shadow-md shadow-[#922842]/20 flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
                  >
                    <span>
                      {authSubmitting ? "Please wait…" : isRegistering ? "Register & Continue" : "Sign In & Continue"}
                    </span>
                    <ArrowRight size={16} />
                  </button>

                  <div className="text-center mt-4 text-xs text-zinc-500 font-[family-name:var(--font-mono)]">
                    {isRegistering ? "Already have an account? " : "Don't have an account? "}
                    <button
                      type="button"
                      onClick={() => setIsRegistering(!isRegistering)}
                      className="text-[#922842] hover:underline font-medium"
                    >
                      {isRegistering ? "Sign in" : "Create account"}
                    </button>
                  </div>
                </form>
              )}

              {/* Step 2: Request Reason Form */}
              {modalStep === "reason" && (
                <form onSubmit={handleReasonSubmit} className="space-y-4">
                  {requestError && (
                    <p className="rounded-xl border border-[#922842]/30 bg-[#922842]/15 px-3 py-2 text-xs text-[#791B37]">
                      {requestError}
                    </p>
                  )}
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1.5 font-[family-name:var(--font-mono)]">
                      State your purpose for requesting this study
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={requestReason}
                      onChange={(e) => setRequestReason(e.target.value)}
                      placeholder="e.g., Needed for related literature in my undergraduate thesis on educational technology..."
                      className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#922842] transition-colors resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#922842] hover:bg-[#791B37] text-white text-xs font-[family-name:var(--font-mono)] uppercase tracking-wider rounded-xl font-medium transition-all shadow-md shadow-[#922842]/20 flex items-center justify-center gap-2"
                  >
                    <span>Submit Request</span>
                    <ArrowRight size={16} />
                  </button>
                </form>
              )}

              {/* Step 3: Success View */}
              {modalStep === "success" && (
                <div className="text-center py-4 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle size={24} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-zinc-900">
                      Request submitted successfully!
                    </p>
                    <p className="text-xs text-zinc-500 leading-relaxed font-[family-name:var(--font-mono)]">
                      The repository administrator will review your purpose. You will be notified once access is granted.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-full py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-[family-name:var(--font-mono)] uppercase tracking-wider rounded-xl font-medium transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}