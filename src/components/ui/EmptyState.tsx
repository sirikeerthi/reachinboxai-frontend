import type { ReactNode } from "react";

export default function EmptyState({
  icon,
  title,
  description,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
      {icon && <div className="text-gray-300">{icon}</div>}
      <p className="text-sm font-medium text-gray-700">{title}</p>
      {description && <p className="text-sm text-gray-400">{description}</p>}
    </div>
  );
}
