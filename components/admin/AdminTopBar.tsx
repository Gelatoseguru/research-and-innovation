"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, User } from "lucide-react";
import { useAdminAuth } from "@/lib/admin/auth-context";

export default function AdminTopBar({
  title,
  showBack = false,
}: {
  title: string;
  showBack?: boolean;
}) {
  const router = useRouter();
  const { admin } = useAdminAuth();

  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => router.back()}
            aria-label="Go back"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200/80 bg-white/80 text-gray-600 shadow-sm backdrop-blur-md transition-all hover:bg-white hover:text-gray-900"
          >
            <ArrowLeft size={16} />
          </button>
        )}
        <h1 className="font-[family-name:var(--font-mono)] text-xl font-bold uppercase tracking-tight text-gray-700">
          {title}
        </h1>
      </div>
    </div>
  );
}