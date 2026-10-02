"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Quote,
  Download,
  Share2,
  Bookmark,
  Users,
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

// Mock research data
const researchData = [
  {
    id: 1,
    title: "Digital Archives and Institutional Memory Preservation",
    authors: ["Maria Santos", "Louie Fernandez"],
    program: "Information Technology",
    year: "2026",
    date: "March 2026",
    doi: "10.32598/uni.arch.2026.0114",
    reads: 214,
    citations: 0,
    keywords: ["Digital Preservation", "Institutional Archives", "Records Management"],
    abstract:
      "Background and Purpose: As universities generate an increasing volume of digital records, institutional memory becomes vulnerable to format obsolescence and inconsistent archiving practices. This study examines how digital archiving frameworks can be adapted to safeguard institutional memory within a Philippine higher education context. Materials and Methods: A mixed-methods design combined document analysis of existing archival policies with structured interviews of records officers across five departments. Data were coded thematically and cross-checked against international digital preservation standards. Results: Findings show that inconsistent metadata practices and the absence of a unified retention schedule were the leading causes of information loss. Departments that adopted structured digital repositories reported significantly faster retrieval times and fewer duplicate records. Conclusion: The study proposes a lightweight institutional framework for digital preservation that can be adopted without extensive infrastructure investment, prioritizing metadata standardization and staff training as the highest-impact interventions.",
  },
  {
    id: 2,
    title: "Pedagogical Strategies in Post-Pandemic Higher Education",
    authors: ["Juan Dela Cruz"],
    program: "Education",
    year: "2025",
    date: "September 2025",
    doi: "10.32598/uni.edu.2025.0087",
    reads: 389,
    citations: 2,
    keywords: ["Higher Education", "Pedagogy", "Post-Pandemic Learning"],
    abstract:
      "Background and Purpose: The shift back to in-person instruction after prolonged remote learning left many instructors re-evaluating their teaching approaches. This paper explores which pedagogical strategies adopted during the pandemic were retained, adapted, or abandoned once classes resumed on campus. Materials and Methods: A descriptive survey was administered to 156 faculty members across three colleges, supplemented by focus group discussions. Results: Blended assessment methods and asynchronous supplementary materials were the most widely retained strategies, while fully synchronous online lectures were the most frequently abandoned. Faculty cited student engagement and workload balance as the main deciding factors. Conclusion: The study recommends a formal framework for evaluating which pandemic-era teaching innovations merit permanent adoption, rather than leaving the decision to individual instructor preference.",
  },
  {
    id: 3,
    title: "Language Evolution and Regional Dialects in Leyte",
    authors: ["Ana Reyes"],
    program: "Arts and Sciences",
    year: "2026",
    date: "January 2026",
    doi: "10.32598/uni.arts.2026.0032",
    reads: 501,
    citations: 1,
    keywords: ["Sociolinguistics", "Dialectology", "Waray Language"],
    abstract:
      "Background and Purpose: Regional dialects shift gradually under the influence of migration, media exposure, and generational change. This study documents lexical and phonological variation in Waray-speaking communities across Leyte province over the last two decades. Materials and Methods: Field recordings were gathered from 60 respondents spanning three age groups across six municipalities, then analyzed for phonetic shift and vocabulary substitution against a 1998 baseline corpus. Results: Younger respondents showed measurable convergence toward Tagalog-influenced vocabulary in everyday speech, while older respondents preserved traditional forms almost entirely intact. Coastal municipalities showed faster convergence than inland ones. Conclusion: The findings suggest media exposure, more than formal schooling, is the primary driver of dialectal shift, and the study recommends targeted documentation efforts before further generational turnover.",
  },
  {
    id: 4,
    title: "Automated Thesis Repository and Retrieval System",
    authors: ["Mark Villanueva", "Cristine Abad"],
    program: "Information Technology",
    year: "2025",
    date: "June 2025",
    doi: "10.32598/uni.it.2025.0201",
    reads: 673,
    citations: 4,
    keywords: ["Information Retrieval", "Digital Repository", "Full-Text Search"],
    abstract:
      "Background and Purpose: Manual thesis cataloging slows down retrieval and makes cross-program research discovery difficult. This paper presents the design and evaluation of an automated repository system built to index, tag, and surface undergraduate and graduate theses by topic similarity rather than folder structure alone. Materials and Methods: The system was built using a vector-based similarity search layer over a relational metadata store, then evaluated against 300 real retrieval queries submitted by faculty and students. Results: The automated system reduced average retrieval time by 64% compared to the previous manual catalog, and returned relevant related theses that keyword search alone had missed in 41% of test queries. Conclusion: The study concludes that similarity-based retrieval meaningfully improves research discoverability in an institutional repository and outlines a path for wider rollout across additional colleges.",
  },
  {
    id: 5,
    title: "Community Engagement Frameworks for Local Governance",
    authors: ["Elena Gomez"],
    program: "Public Administration",
    year: "2025",
    date: "November 2025",
    doi: "10.32598/uni.pa.2025.0159",
    reads: 322,
    citations: 3,
    keywords: ["Local Governance", "Civic Participation", "Public Policy"],
    abstract:
      "Background and Purpose: Community engagement is frequently cited as a pillar of good local governance, yet participation rates in barangay-level consultations remain low. This study evaluates which engagement formats correlate with higher resident turnout and follow-through. Materials and Methods: A comparative case study examined engagement records across eight barangays over 18 months, combined with resident surveys on perceived accessibility and trust. Results: Barangays that used small, recurring neighborhood-level sessions saw substantially higher sustained participation than those relying on single large town-hall events. Perceived responsiveness of officials to prior feedback was the strongest predictor of continued attendance. Conclusion: The study recommends shifting from episodic large-scale consultations toward smaller recurring formats paired with visible follow-through on past resident input.",
  },
];

export default function ViewPage() {
  const params = useParams();
  const id = Number(params?.id);
  const paper = researchData.find((item) => item.id === id) ?? researchData[0];

  const maxReads = 700;
  const maxCitations = 5;

  // States for Tabs and Modal
  const [activeTab, setActiveTab] = useState("overview");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState("auth"); // 'auth' | 'reason' | 'success'
  const [requestReason, setRequestReason] = useState("");

  // Login Form States (from your snippet)
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleRequestClick = () => {
    setModalStep("auth");
    setRequestReason("");
    setIsModalOpen(true);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate successful login/registration, then move to reason step
    setModalStep("reason");
  };

  const handleReasonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestReason.trim()) return;
    setModalStep("success");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-zinc-200/60 to-stone-200 text-zinc-900 font-sans px-6 sm:px-12 pt-28 sm:pt-36 pb-16">
      {/* Breadcrumb / back nav */}
      <div className="mb-8 flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-500 font-[family-name:var(--font-mono)]">
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
      <div className="mb-10 border-b border-zinc-300 pb-8">
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span className="px-2.5 py-1 rounded-md bg-[#922842]/10 border border-[#922842]/20 text-[#922842] text-[10px] uppercase tracking-wider font-[family-name:var(--font-mono)]">
            Thesis / Article
          </span>
          <span className="px-2.5 py-1 rounded-md bg-zinc-50 border border-zinc-300 text-zinc-600 text-[10px] uppercase tracking-wider font-[family-name:var(--font-mono)]">
            Abstract only
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-light tracking-tight font-[family-name:var(--font-fraunces)] text-zinc-900 mb-5 max-w-4xl">
          {paper.title}
        </h1>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-500 font-[family-name:var(--font-mono)] mb-6">
          <span>{paper.date}</span>
          <span className="text-zinc-400">&bull;</span>
          <span>DOI: {paper.doi}</span>
        </div>

        {/* Authors */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
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
          <button
            onClick={() => setActiveTab("references")}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === "references"
                ? "text-[#922842] border-b-2 border-[#922842]"
                : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            References
          </button>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column — Dynamic Content based on Tabs */}
        <div className="lg:col-span-8 space-y-8">
          {activeTab === "overview" && (
            <>
              {/* Abstract */}
              <div className="bg-[#FAFAFA] border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-xs uppercase tracking-widest text-zinc-400 font-[family-name:var(--font-mono)] mb-4">
                  Abstract
                </h2>
                <p className="text-[15px] leading-7 text-zinc-700">
                  {paper.abstract}
                </p>

                <div className="mt-8 pt-6 border-t border-dashed border-zinc-200 flex flex-wrap gap-2">
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

              {/* Full-text locked panel */}
              <div className="bg-[#FAFAFA] border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#922842]/10 flex items-center justify-center flex-shrink-0">
                    <FileText size={18} className="text-[#922842]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-zinc-900 mb-1">
                      Full-text not available in this preview
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                      The complete manuscript is held by the repository administrator. Request access to read full-text.
                    </p>
                    <button
                      onClick={handleRequestClick}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#922842] text-white text-xs font-medium hover:bg-[#7a2137] transition-colors shadow-sm"
                    >
                      <Download size={13} />
                      Request full-text
                    </button>
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

          {activeTab === "references" && (
            <div className="bg-[#FAFAFA] border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-sm animate-in fade-in duration-300">
              <h2 className="text-lg font-semibold text-zinc-900 mb-6">
                References
              </h2>
              <ul className="space-y-4 list-decimal pl-5">
                <li className="text-[14px] leading-relaxed text-zinc-700 pl-2">
                  Borgman, C. L. (2007).{" "}
                  <span className="italic">
                    Scholarship in the digital age: Information, infrastructure,
                    and the Internet.
                  </span>{" "}
                  MIT press.
                </li>
                <li className="text-[14px] leading-relaxed text-zinc-700 pl-2">
                  Lynch, C. A. (2003). Institutional repositories: essential
                  infrastructure for scholarship in the digital age.{" "}
                  <span className="italic">
                    Association of Research Libraries
                  </span>
                  , 226, 1-7.
                </li>
                <li className="text-[14px] leading-relaxed text-zinc-700 pl-2">
                  National Commission for Culture and the Arts. (2019).{" "}
                  <span className="italic">
                    Guidelines on Preserving Institutional Memory in Higher
                    Education.
                  </span>{" "}
                  Manila, Philippines.
                </li>
                <li className="text-[14px] leading-relaxed text-zinc-700 pl-2">
                  Salton, G., & McGill, M. J. (1983).{" "}
                  <span className="italic">
                    Introduction to modern information retrieval.
                  </span>{" "}
                  McGraw-Hill.
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Right column — stats & actions */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#EFECE8] border border-zinc-200/50 rounded-2xl p-6 shadow-sm">
            <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-[family-name:var(--font-mono)] mb-5">
              Metrics
            </h3>

            <div className="space-y-5">
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
            <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-[family-name:var(--font-mono)] mb-1">
              Actions
            </h3>
            <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-zinc-300 bg-white text-zinc-700 text-xs font-medium hover:border-[#922842] hover:text-[#922842] transition-colors shadow-sm">
              <Bookmark size={14} />
              Save for later
            </button>
            <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-zinc-300 bg-white text-zinc-700 text-xs font-medium hover:border-[#922842] hover:text-[#922842] transition-colors shadow-sm">
              <Share2 size={14} />
              Share link
            </button>
          </div>
        </div>
      </div>

      {/* Request Full Text Modal with Integrated Login/Register */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-zinc-200/80">
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-zinc-900 font-[family-name:var(--font-fraunces)]">
                    {modalStep === "auth"
                      ? isRegistering
                        ? "Create Account"
                        : "Sign In Required"
                      : modalStep === "reason"
                      ? "Request Full-Text"
                      : "Request Submitted"}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1 font-[family-name:var(--font-mono)]">
                    {modalStep === "auth"
                      ? isRegistering
                        ? "Join the LNU Archives repository"
                        : "Sign in to continue your request"
                      : modalStep === "reason"
                      ? "Provide a brief reason for accessing this manuscript"
                      : "Your request has been successfully queued"}
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-zinc-400 hover:text-zinc-700 transition-colors p-1"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Step 1: Integrated Login / Register Card */}
              {modalStep === "auth" && (
                <form onSubmit={handleAuthSubmit} className="space-y-4">
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

                  {!isRegistering && (
                    <div className="flex items-center justify-between text-xs text-zinc-600 px-0.5 pt-0.5">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={remember}
                          onChange={(e) => setRemember(e.target.checked)}
                          className="rounded border-zinc-300 text-[#922842] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                        />
                        <span>Remember me</span>
                      </label>
                      <a href="#forgot" className="hover:text-[#922842] transition-colors font-medium">
                        Forgot password?
                      </a>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#922842] hover:bg-[#791B37] text-white text-xs font-[family-name:var(--font-mono)] uppercase tracking-wider rounded-xl font-medium transition-all shadow-md shadow-[#922842]/20 flex items-center justify-center gap-2 mt-2"
                  >
                    <span>{isRegistering ? "Register & Continue" : "Sign In & Continue"}</span>
                    <ArrowRight size={16} />
                  </button>

                  <div className="text-center mt-4 text-xs text-zinc-500 font-[family-name:var(--font-mono)]">
                    {isRegistering ? "Already have an account? " : "Don't have an account? "}
                    <button
                      type="button"
                      onClick={() => setIsRegistering(!isRegistering)}
                      className="text-zinc-900 font-semibold hover:text-[#922842] underline underline-offset-4"
                    >
                      {isRegistering ? "Sign In" : "Create Account"}
                    </button>
                  </div>
                </form>
              )}

              {/* Step 2: Request Reason */}
              {modalStep === "reason" && (
                <form onSubmit={handleReasonSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-2 font-[family-name:var(--font-mono)]">
                      Reason for Request
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={requestReason}
                      onChange={(e) => setRequestReason(e.target.value)}
                      placeholder="Please specify how you intend to use this manuscript (e.g., literature review, thesis citation, personal research)..."
                      className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#922842] transition-colors resize-none"
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setModalStep("auth")}
                      className="px-4 py-2.5 rounded-xl border border-zinc-200 text-zinc-600 text-xs font-medium hover:bg-zinc-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-[#922842] hover:bg-[#791B37] text-white text-xs font-medium transition-colors shadow-sm"
                    >
                      Submit Request
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: Success Confirmation */}
              {modalStep === "success" && (
                <div className="text-center py-6">
                 <div className="w-12 h-12 rounded-full bg-zinc-200/60 backdrop-blur-sm text-zinc-700 flex items-center justify-center mx-auto mb-4 border border-zinc-300/50">
  <CheckCircle size={24} />
</div>
                  <h4 className="text-base font-semibold text-zinc-900 mb-1">
                    Request Received
                  </h4>
                  <p className="text-xs text-zinc-500 leading-relaxed mb-6 max-w-xs mx-auto">
                    The repository administrator will review your request.
                  </p>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium rounded-xl transition-colors shadow-sm"
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