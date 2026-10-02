"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAdminAuth } from "@/lib/admin/auth-context";

export default function AdminLoginPage() {
  const { login } = useAdminAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const result = await login(email, password);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error ?? "Something went wrong.");
      return;
    }
    router.push("/admin");
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-zinc-100 text-zinc-900 px-4 py-16 selection:bg-[#F4F3F2] selection:text-white">
      
      {/* Background Image with Light Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/photo.jpg"
          alt="Background"
          fill
          priority
          className="object-cover object-center opacity-30 blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-red/40" />
      </div>

      {/* Centered Auth Card */}
      <div className="relative z-10 w-full max-w-md bg-[#F4F3F2]/60 backdrop-blur-2xl border border-zinc-200/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-zinc-300/50">
        
        {/* Card Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-200/80 bg-white/70 shadow-sm backdrop-blur-md">
            <Image
              src="/RIMO.png"
              alt="Lyceum-Northwestern University seal"
              width={28}
              height={28}
              className="h-7 w-7 object-contain"
            />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 font-[family-name:var(--font-fraunces)]">
            <span className="text-[#922842] font-[family-name:var(--font-fraunces)]">
              WALA
            </span>{" "}
            PA
          </h2>
          <p className="text-xs text-zinc-500 mt-1.5 font-[family-name:var(--font-mono)] uppercase tracking-[0.15em]">
            RIMO Admin Login
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-[#791B37]/30 bg-[#791B37]/10 px-4 py-3 text-xs font-medium text-[#791B37] backdrop-blur-md">
            {error}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email Field */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
              <Mail size={16} />
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@lnu.edu.ph"
              className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#922842] transition-colors"
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
              <Lock size={16} />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
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

          {/* Remember me & Forgot Password */}
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-[#922842] hover:bg-[#791B37] text-white text-xs font-[family-name:var(--font-mono)] uppercase tracking-wider rounded-xl font-medium transition-all shadow-md shadow-[#922842]/20 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <span>{submitting ? "Signing in…" : "Sign In"}</span>
            <ArrowRight size={16} />
          </button>
        </form>

      </div>
    </div>
  );
}