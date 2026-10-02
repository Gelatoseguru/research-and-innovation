"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useStudentAuth } from "@/components/auth/StudentAuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, register } = useStudentAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const result = isRegistering
      ? await register(name, email, password)
      : await login(email, password);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.replace(searchParams.get("redirect") || "/");
  };

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

      {/* Centered Auth Card (Light Mode) */}
      <div className="relative z-10 w-full max-w-md bg-[#F4F3F2]/60 backdrop-blur-2xl border border-zinc-200/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-zinc-300/50">
        
        {/* Card Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 font-[family-name:var(--font-fraunces)]">
            {isRegistering ? (
              "Create Account"
            ) : (
              <>
                <span className="text-[#922842] font-[family-name:var(--font-fraunces)]">
                  LNU
                </span>{" "}
                ARCHIVES
              </>
            )}
          </h2>
          <p className="text-xs text-zinc-500 mt-1.5 font-[family-name:var(--font-mono)]">
            {isRegistering ? "Join the LNU Archives repository" : "Your academic universe awaits"}
          </p>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="rounded-xl border border-[#922842]/30 bg-[#922842]/10 px-3 py-2 text-xs text-[#791B37]">
              {error}
            </p>
          )}
          
          {/* Full Name Field (Only visible during registration) */}
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
              placeholder="Email address"
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

          {/* Remember me & Forgot Password (Fixed spacing & balanced alignment) */}
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-[#922842] hover:bg-[#791B37] text-white text-xs font-[family-name:var(--font-mono)] uppercase tracking-wider rounded-xl font-medium transition-all shadow-md shadow-[#922842]/20 flex items-center justify-center gap-2"
          >
            <span>{submitting ? "Please wait…" : isRegistering ? "Register" : "Sign In"}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        

        

        {/* Toggle between Login and Create Account view */}
        <div className="text-center mt-6 text-xs text-zinc-500 font-[family-name:var(--font-mono)]">
          {isRegistering ? "Already have an account? " : "Don't have an account? "}
          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-zinc-900 font-semibold hover:text-[#922842] underline underline-offset-4"
          >
            {isRegistering ? "Sign In" : "Create Account"}
          </button>
        </div>

      </div>
    </div>
  );
}
