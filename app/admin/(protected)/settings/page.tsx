"use client";

import Link from "next/link";
import { ArrowLeft, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/lib/admin/auth-context";
import AdminTopBar from "@/components/admin/AdminTopBar";

export default function SettingsPage() {
  const { admin, logout } = useAdminAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.replace("/admin/login");
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="px-5">
        <AdminTopBar title="Settings" />
      </div>

      <div className="max-w-lg rounded-[2rem] border border-white/85 bg-white/60 p-8 shadow-xl shadow-gray-200/40 backdrop-blur-2xl">
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] text-gray-400">
          Signed in as
        </p>
        <p className="mt-2 font-[family-name:var(--font-display)] text-lg font-semibold text-gray-900">{admin?.name}</p>
        <p className="text-sm text-gray-500">{admin?.email}</p>
        <p className="mt-1 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider text-[#922842] font-medium">
          {admin?.role}
        </p>

        <div className="my-6 h-px bg-gray-200/80" />

        <div className="space-y-3">
          <Link
            href="/"
            className="flex items-center justify-between rounded-2xl border border-gray-200/80 bg-white/70 px-4 py-3 text-sm font-medium text-gray-700 shadow-sm backdrop-blur-md transition-all hover:bg-gray-100 hover:text-gray-900"
          >
            <span className="flex items-center gap-2">
              <ArrowLeft size={16} className="text-gray-400" /> Back to public site
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-between rounded-2xl border border-[#791B37]/30 bg-[#791B37]/10 px-4 py-3 text-sm font-medium text-[#791B37] shadow-sm backdrop-blur-md transition-all hover:bg-[#791B37]/20 hover:border-[#791B37]/50"
          >
            <span className="flex items-center gap-2">
              <LogOut size={16} /> Log out
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}