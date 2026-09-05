import { useState } from "react";
import { toast } from "sonner";
import { disconnectSlack, getSlackConnectUrl } from "../../lib/api";
import { useAuth } from "../../lib/auth";

export default function SlackConnectButton() {
  const { user, refreshUser } = useAuth();
  const [connecting, setConnecting] = useState(false);

  async function handleDisconnect() {
    try {
      await disconnectSlack();
      toast.success("Slack disconnected");
      refreshUser();
    } catch {
      toast.error("Failed to disconnect Slack");
    }
  }

  async function handleConnect() {
    setConnecting(true);
    try {
      const url = await getSlackConnectUrl();
      window.location.href = url;
    } catch {
      toast.error("Failed to start Slack connection");
      setConnecting(false);
    }
  }

  if (user?.slackConnected) {
    return (
      <button
        type="button"
        onClick={handleDisconnect}
        className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
      >
        Slack connected — Disconnect
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleConnect}
      disabled={connecting}
      className="rounded-full border border-green-600 px-3 py-1.5 text-xs font-medium text-green-600 hover:bg-green-50 disabled:opacity-60"
    >
      {connecting ? "Connecting..." : "Connect Slack"}
    </button>
  );
}
