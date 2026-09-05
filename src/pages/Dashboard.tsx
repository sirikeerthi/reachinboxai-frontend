import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RefreshCw, Search } from "lucide-react";
import { useAuth } from "../lib/auth";
import { useEmailList, useEmailSearch, useSentEmails } from "../hooks/useEmails";
import EmailTable from "../components/dashboard/EmailTable";
import SlackConnectButton from "../components/dashboard/SlackConnectButton";
import type { EmailListItem } from "../types/email";

type Tab = "SCHEDULED" | "SENT";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState<Tab>("SCHEDULED");
  const [query, setQuery] = useState("");

  const slackStatus = searchParams.get("slack");

  const scheduled = useEmailList("SCHEDULED");
  const sent = useSentEmails();
  const search = useEmailSearch(query);

  useEffect(() => {
    if (!slackStatus) {
      return;
    }
    const timeout = setTimeout(() => {
      searchParams.delete("slack");
      setSearchParams(searchParams, { replace: true });
    }, 4000);
    return () => clearTimeout(timeout);
  }, [slackStatus, searchParams, setSearchParams]);

  const isSearching = query.trim().length > 0;

  const activeItems: EmailListItem[] | undefined = isSearching
    ? search.data?.filter((item) =>
        tab === "SCHEDULED"
          ? item.status === "SCHEDULED"
          : item.status === "SENT" || item.status === "FAILED",
      )
    : tab === "SCHEDULED"
      ? scheduled.data
      : sent.items;

  const isLoading = isSearching
    ? search.isFetching
    : tab === "SCHEDULED"
      ? scheduled.isLoading
      : sent.isLoading;

  const activeError = isSearching
    ? search.error
    : tab === "SCHEDULED"
      ? scheduled.error
      : sent.error;

  function handleRefresh() {
    scheduled.refetch();
    sent.refetch();
    if (isSearching) {
      search.refetch();
    }
  }

  return (
    <div className="flex min-h-screen bg-white">
      <aside className="flex w-72 flex-col border-r border-gray-200 p-5">
        <div className="mb-6 text-2xl font-black tracking-tight">ONB</div>

        <div className="mb-4 flex items-center gap-3 rounded-xl bg-gray-50 p-3">
          <img
            src={user?.avatorUrl}
            alt=""
            className="h-9 w-9 rounded-full object-cover"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-gray-900">
              {user?.name}
            </p>
            <p className="truncate text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/compose")}
          className="mb-6 w-full rounded-full border border-green-600 py-2 font-medium text-green-600 transition hover:bg-green-50"
        >
          Compose
        </button>

        <p className="mb-2 px-2 text-xs font-medium tracking-wide text-gray-400">
          CORE
        </p>

        <nav className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => setTab("SCHEDULED")}
            className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium ${
              tab === "SCHEDULED"
                ? "bg-green-50 text-gray-900"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span>Scheduled</span>
            <span className="text-gray-400">{scheduled.data?.length ?? 0}</span>
          </button>
          <button
            type="button"
            onClick={() => setTab("SENT")}
            className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium ${
              tab === "SENT"
                ? "bg-green-50 text-gray-900"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span>Sent</span>
            <span className="text-gray-400">{sent.items?.length ?? 0}</span>
          </button>
        </nav>

        <div className="mt-6">
          <SlackConnectButton />
        </div>

        <button
          type="button"
          onClick={logout}
          className="mt-auto text-left text-sm text-gray-500 hover:text-gray-800"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 p-6">
        {slackStatus === "connected" && (
          <div className="mb-4 rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">
            Slack connected successfully.
          </div>
        )}
        {slackStatus === "error" && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
            Failed to connect Slack. Please try again.
          </div>
        )}

        <div className="mb-5 flex items-center gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-full bg-gray-50 px-4 py-2.5">
            <Search size={16} className="text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
            />
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
            aria-label="Refresh"
          >
            <RefreshCw size={16} />
          </button>
        </div>

        <EmailTable
          items={activeItems}
          isLoading={isLoading}
          error={activeError}
          dateField={tab === "SCHEDULED" ? "scheduledAt" : "sentAt"}
          emptyTitle={
            tab === "SCHEDULED" ? "No scheduled emails" : "No sent emails"
          }
          emptyDescription={
            tab === "SCHEDULED"
              ? "Compose an email to schedule your first send."
              : "Emails you send will show up here."
          }
        />
      </main>
    </div>
  );
}
