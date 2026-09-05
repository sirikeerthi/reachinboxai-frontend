import { Clock } from "lucide-react";
import { formatDateTime } from "../../lib/format";
import type { EmailListItem } from "../../types/email";

const pillStyles: Record<EmailListItem["status"], string> = {
  SCHEDULED: "bg-orange-50 text-orange-600",
  SENT: "bg-green-50 text-green-700",
  FAILED: "bg-red-50 text-red-600",
};

export default function EmailListRow({
  item,
  dateField,
}: {
  item: EmailListItem;
  dateField: "scheduledAt" | "sentAt";
}) {
  return (
    <div className="flex items-center gap-4 border-b border-gray-50 px-1 py-4 hover:bg-gray-50">
      <span className="w-44 shrink-0 truncate font-semibold text-gray-900">
        To: {item.to}
      </span>

      <span
        className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${pillStyles[item.status]}`}
      >
        <Clock size={12} />
        {formatDateTime(item[dateField])}
      </span>

      <p className="min-w-0 flex-1 truncate text-sm">
        <span className="font-semibold text-gray-900">{item.subject}</span>
        <span className="text-gray-400"> - {item.body}</span>
      </p>
    </div>
  );
}
