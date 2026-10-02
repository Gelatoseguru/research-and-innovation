import type { LucideIcon } from "lucide-react";

export default function StatCard({
  label,
  value,
  icon: Icon,
  tone = "light",
}: {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  tone?: "light" | "dark";
}) {
  const isDark = tone === "dark";
  return (
    <div
      className={`rounded-2xl border-2 border-[#010100] p-4 ${
        isDark ? "bg-[#010100] text-white" : "bg-white text-[#010100]"
      }`}
    >
      <div className="flex items-center justify-between">
        <p className={`text-xs ${isDark ? "text-white/60" : "text-[#6B6B6B]"}`}>
          {label}
        </p>
        {Icon && <Icon size={15} className={isDark ? "text-white/70" : "text-[#922842]"} />}
      </div>
      <p className="mt-2 font-[family-name:var(--font-mono)] text-2xl font-bold">
        {value}
      </p>
    </div>
  );
}
