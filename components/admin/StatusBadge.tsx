import type { ActivityAction, PublicationStatus, RequestStatus } from "@/lib/admin/types";

type Status = PublicationStatus | RequestStatus | ActivityAction;

const STYLES: Record<string, string> = {
  draft: "bg-[#f0e6d6] text-[#7a5b12] border-[#7a5b12]",
  pending: "bg-[#f0e6d6] text-[#7a5b12] border-[#7a5b12]",
  published: "bg-[#e4ecdf] text-[#3d6b2f] border-[#3d6b2f]",
  approved: "bg-[#e4ecdf] text-[#3d6b2f] border-[#3d6b2f]",
  uploaded: "bg-[#e4ecdf] text-[#3d6b2f] border-[#3d6b2f]",
  edited: "bg-[#e7e6da] text-[#6B6B6B] border-[#6B6B6B]",
  archived: "bg-[#e7e6da] text-[#6B6B6B] border-[#6B6B6B]",
  rejected: "bg-[#f3dde3] text-[#922842] border-[#922842]",
  deleted: "bg-[#f3dde3] text-[#922842] border-[#922842]",
};

export default function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[11px] font-medium capitalize ${
        STYLES[status] ?? "bg-[#e7e6da] text-[#6B6B6B] border-[#6B6B6B]"
      }`}
    >
      {status}
    </span>
  );
}
