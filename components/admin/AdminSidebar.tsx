"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileStack,
  Upload,
  Inbox,
  Users,
  History,
  Settings,
  LogOut,
} from "lucide-react";
import { useAdminAuth } from "@/lib/admin/auth-context";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/research", label: "Research List", icon: FileStack },
  { href: "/admin/research/upload", label: "Upload Research", icon: Upload },
  { href: "/admin/requests", label: "Access Requests", icon: Inbox },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/activity", label: "Activity Logs", icon: History },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAdminAuth();

  function handleLogout() {
    logout();
    router.replace("/admin/login");
  }

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 shrink-0 flex-col border-r border-white/80 bg-white/60 px-4 py-6 shadow-xl shadow-gray-200/30 backdrop-blur-2xl md:flex">
      {/* Logo mark with glassmorphism */}
      <Link href="/admin" className="mb-8 flex items-center gap-3 px-2">
        <span className="flex h-11 w-11 items-center justify-center ">
          <Image src="/SHOE.png" alt="LNU seal" width={32} height={32} className="h-13 w-12 object-contain" />
        </span>
        <span className="font-[family-name:var(--font-fraunces)] text-sm font-bold uppercase tracking-wide text-[#922842]">
          LNU Archives
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1.5">
        {NAV.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-3.5 py-3 text-xs font-[family-name:var(--font-mono)] uppercase tracking-wider font-medium transition-all backdrop-blur-md ${
                isActive
                  ? "border border-[#922842]/30 bg-[#922842]/10 text-[#922842] shadow-sm font-semibold"
                  : "border border-transparent text-gray-600 hover:bg-white/50 hover:text-gray-900"
              }`}
            >
              <Icon size={16} className={isActive ? "text-[#922842]" : "text-gray-400"} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 flex flex-col gap-1.5 border-t border-[#6B6B6B] pt-4">
        <Link
          href="/admin/settings"
          className={`flex items-center gap-3 rounded-2xl px-3.5 py-3 text-xs font-[family-name:var(--font-mono)] uppercase tracking-wider font-medium transition-all backdrop-blur-md ${
            pathname === "/admin/settings"
              ? "border border-[#922842]/30 bg-[#922842]/10 text-[#922842] shadow-sm font-semibold"
              : "border border-transparent text-gray-600 hover:bg-white/50 hover:text-gray-900"
          }`}
        >
          <Settings size={16} className={pathname === "/admin/settings" ? "text-[#922842]" : "text-gray-400"} />
          Settings
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-2xl border border-transparent px-3.5 py-3 text-left text-xs font-[family-name:var(--font-mono)] uppercase tracking-wider font-medium text-gray-600 transition-all hover:border-[#791B37]/20 hover:bg-[#791B37]/10 hover:text-[#791B37] backdrop-blur-md"
        >
          <LogOut size={16} className="text-gray-400" />
          Log out
        </button>
      </div>
    </aside>
  );
}