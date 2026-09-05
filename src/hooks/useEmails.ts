import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getEmailCounts,
  listEmails,
  scheduleEmail,
  searchEmails,
} from "../lib/api";
import type { EmailListItem, ScheduleEmailPayload } from "../types/email";

export function useEmailList(status: "SCHEDULED" | "SENT" | "FAILED") {
  return useQuery({
    queryKey: ["emails", "list", status],
    queryFn: () => listEmails(status),
  });
}

export function useSentEmails() {
  const sent = useEmailList("SENT");
  const failed = useEmailList("FAILED");

  const isLoading = sent.isLoading || failed.isLoading;

  const items: EmailListItem[] | undefined = isLoading
    ? undefined
    : [...(sent.data ?? []), ...(failed.data ?? [])].sort((a, b) => {
        const aTime = a.sentAt ? new Date(a.sentAt).getTime() : 0;
        const bTime = b.sentAt ? new Date(b.sentAt).getTime() : 0;
        return bTime - aTime;
      });

  function refetch() {
    sent.refetch();
    failed.refetch();
  }

  return { items, isLoading, error: sent.error ?? failed.error, refetch };
}

export function useEmailSearch(query: string) {
  return useQuery({
    queryKey: ["emails", "search", query],
    queryFn: () => searchEmails(query),
    enabled: query.trim().length > 0,
  });
}

export function useEmailCounts() {
  return useQuery({
    queryKey: ["emails", "counts"],
    queryFn: getEmailCounts,
  });
}

export function useScheduleEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ScheduleEmailPayload) => scheduleEmail(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emails"] });
    },
  });
}
