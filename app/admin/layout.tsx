import type { ReactNode } from "react";
import { AuthProvider } from "@/lib/admin/auth-context";
import { fraunces, inter, mono } from "@/lib/admin/fonts";

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <div
        className={`${fraunces.variable} ${inter.variable} ${mono.variable} font-[family-name:var(--font-body)] min-h-screen bg-[#E3E1E0] text-[#010100]`}
      >
        {children}
      </div>
    </AuthProvider>
  );
}
