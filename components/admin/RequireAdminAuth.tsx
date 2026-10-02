"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/lib/admin/auth-context";

// NOTE: this only blocks rendering client-side. Real protection also
// needs a server-side check (e.g. Next.js middleware.ts reading a
// signed session cookie) once real auth exists — otherwise someone
// could still hit an /api/admin/* route directly without a session.
export default function RequireAdminAuth({ children }: { children: ReactNode }) {
  const { admin, loading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !admin) router.replace("/admin/login");
  }, [loading, admin, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-[#6B6B6B]">
        Checking session…
      </div>
    );
  }
  if (!admin) return null;
  return <>{children}</>;
}
