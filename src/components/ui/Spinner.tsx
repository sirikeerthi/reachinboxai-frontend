import { Loader2 } from "lucide-react";

export default function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-20 text-gray-400">
      <Loader2 className="animate-spin" size={22} />
      {label && <p className="text-sm">{label}</p>}
    </div>
  );
}
