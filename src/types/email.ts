export type EmailStatus = "SCHEDULED" | "SENT" | "FAILED";

export interface EmailListItem {
  to: string;
  sentAt: string | null;
  scheduledAt: string;
  status: EmailStatus;
  subject: string;
  body: string;
}

export interface ScheduleEmailPayload {
  to: string[];
  subject: string;
  body: string;
  scheduled_at: string;
  delayMs: number;
  hourlyLimit: number;
}

export interface EmailCount {
  status: "SENT" | "FAILED";
  count: string;
}
