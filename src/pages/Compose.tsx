import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Paperclip } from "lucide-react";
import Button from "../components/ui/Button";
import { Input, TextArea } from "../components/ui/Input";
import { useScheduleEmail } from "../hooks/useEmails";
import { parseLeadsFile, parseLeadsText } from "../lib/leads";
import { ApiError } from "../lib/api";
import { dateToLocalInputValue, localInputValueToUtcIso } from "../lib/datetime";

function nextQuickTime(hoursFromNow: number): string {
  const date = new Date(Date.now() + hoursFromNow * 60 * 60 * 1000);
  date.setSeconds(0, 0);
  return dateToLocalInputValue(date);
}

export default function Compose() {
  const navigate = useNavigate();
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [recipientsText, setRecipientsText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [scheduledAt, setScheduledAt] = useState(nextQuickTime(24));
  const [delaySeconds, setDelaySeconds] = useState(2);
  const [hourlyLimit, setHourlyLimit] = useState(100);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scheduleMutation = useScheduleEmail();

  const { emails: allEmails, skipped } = parseLeadsText(recipientsText);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    const parsed = await parseLeadsFile(file);
    setRecipientsText((prev) => {
      const existing = prev.trim();
      const joined = parsed.emails.join(", ");
      return existing ? `${existing}, ${joined}` : joined;
    });
    setFileName(file.name);
    if (parsed.skipped.length > 0) {
      toast.warning(
        `Skipped ${parsed.skipped.length} invalid entr${parsed.skipped.length === 1 ? "y" : "ies"} in ${file.name}`,
      );
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (allEmails.length === 0) {
      toast.error("Add at least one recipient email");
      return;
    }
    if (!subject.trim() || !body.trim()) {
      toast.error("Subject and body are required");
      return;
    }

    try {
      await scheduleMutation.mutateAsync({
        to: allEmails,
        subject,
        body,
        scheduled_at: localInputValueToUtcIso(scheduledAt),
        delayMs: Math.max(0, Math.round(delaySeconds * 1000)),
        hourlyLimit,
      });
      toast.success(`Scheduled ${allEmails.length} email(s)`);
      navigate("/dashboard");
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Failed to schedule email";
      toast.error(message);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">
          Compose New Email
        </h1>
      </header>

      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-3xl flex-col gap-4 p-6"
      >
        <div>
          <TextArea
            id="recipients"
            label="To (comma or newline separated)"
            placeholder="jane@example.com, john@example.com"
            rows={2}
            value={recipientsText}
            onChange={(e) => setRecipientsText(e.target.value)}
          />
          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
            >
              <Paperclip size={14} />
              Upload CSV/TXT
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.txt"
              className="hidden"
              onChange={handleFileChange}
            />
            {fileName && (
              <span className="text-xs text-gray-500">{fileName}</span>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {allEmails.length} email address{allEmails.length === 1 ? "" : "es"}{" "}
            detected
          </p>
          {skipped.length > 0 && (
            <p className="mt-1 text-xs text-amber-600">
              Skipped {skipped.length} invalid or duplicate entr
              {skipped.length === 1 ? "y" : "ies"}: {skipped.join(", ")}
            </p>
          )}
        </div>

        <Input
          id="subject"
          label="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject"
        />

        <TextArea
          id="body"
          label="Body"
          rows={12}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Type your message..."
        />

        <div className="grid grid-cols-3 gap-3">
          <Input
            id="scheduledAt"
            label="Start time"
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
          />
          <Input
            id="delay"
            label="Delay between emails (s)"
            type="number"
            min={0}
            value={delaySeconds}
            onChange={(e) => setDelaySeconds(Number(e.target.value))}
          />
          <Input
            id="hourlyLimit"
            label="Hourly limit"
            type="number"
            min={1}
            value={hourlyLimit}
            onChange={(e) => setHourlyLimit(Number(e.target.value))}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate("/dashboard")}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={scheduleMutation.isPending}>
            Schedule
          </Button>
        </div>
      </form>
    </div>
  );
}
