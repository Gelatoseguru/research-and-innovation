"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import RequireAdminAuth from "@/components/admin/RequireAdminAuth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAdminAuth>
      {/* Mobile top bar — the fixed sidebar only shows at md and above */}
      <div className="flex items-center gap-2 border-b-2 border-[#010100] bg-white px-4 py-3 md:hidden">
        <Image src="/logo-color.png" alt="LNU seal" width={28} height={28} className="h-7 w-7" />
        <span className="font-[family-name:var(--font-mono)] text-sm font-bold uppercase">LNU Archives — RIMO Admin</span>
      </div>

      <AdminSidebar />
      <main className="min-h-screen bg-[#E3E1E0] px-6 py-8 md:ml-60 md:px-10">
        {children}
      </main>
    </RequireAdminAuth>
  );
}
