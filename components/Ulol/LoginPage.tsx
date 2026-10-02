"use client";

import { useState } from "react";
import Image from "next/image";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering) {
      // Handle account creation logic here
    } else {
      // Handle login logic here
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-zinc-100 text-zinc-900 px-4 py-16 selection:bg-[#F4F3F2] selection:text-white">
      
      {/* Background Image with Light Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/try.jpg"
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
            className="w-full py-3.5 bg-[#922842] hover:bg-[#791B37] text-white text-xs font-[family-name:var(--font-mono)] uppercase tracking-wider rounded-xl font-medium transition-all shadow-md shadow-[#922842]/20 flex items-center justify-center gap-2"
          >
            <span>{isRegistering ? "Register" : "Sign In"}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200" />
          </div>
          <span className="relative px-3 bg-[#F4F3F2] text-[10px] uppercase tracking-widest text-zinc-400 font-[family-name:var(--font-mono)]">
            quick access via
          </span>
        </div>

        {/* Google Quick Access Option */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => {
              // Handle Google OAuth integration
            }}
            className="w-full py-3 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-xl flex items-center justify-center gap-3 text-sm font-medium text-zinc-700 shadow-sm transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

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