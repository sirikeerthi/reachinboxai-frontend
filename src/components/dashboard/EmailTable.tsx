import { AlertTriangle, Inbox } from "lucide-react";
import EmptyState from "../ui/EmptyState";
import Spinner from "../ui/Spinner";
import EmailListRow from "./EmailListRow";
import type { EmailListItem } from "../../types/email";

interface EmailTableProps {
  items: EmailListItem[] | undefined;
  isLoading: boolean;
  error?: unknown;
  dateField: "scheduledAt" | "sentAt";
  emptyTitle: string;
  emptyDescription: string;
}

export default function EmailTable({
  items,
  isLoading,
  error,
  dateField,
  emptyTitle,
  emptyDescription,
}: EmailTableProps) {
  if (isLoading) {
    return <Spinner label="Loading emails..." />;
  }

  if (error) {
    return (
      <EmptyState
        icon={<AlertTriangle size={32} />}
        title="Couldn't load emails"
        description="Something went wrong fetching this list. Try refreshing."
      />
    );
  }

  if (!items || items.length === 0) {
    return (
      <EmptyState
        icon={<Inbox size={32} />}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <div>
      {items.map((item, index) => (
        <EmailListRow
          key={`${item.to}-${index}`}
          item={item}
          dateField={dateField}
        />
      ))}
    </div>
  );
}
