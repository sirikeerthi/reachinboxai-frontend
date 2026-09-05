const API_URL = import.meta.env.VITE_API_URL as string;
const TOKEN_KEY = "auth_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const body = (await res.json()) as ApiResponse<T>;

  if (!res.ok || !body.success) {
    throw new ApiError(body.message || "Request failed", res.status);
  }

  return body.data;
}

export function googleLoginUrl(): string {
  return `${API_URL}/auth/google`;
}

export async function getSlackConnectUrl(): Promise<string> {
  const { url } = await apiFetch<{ url: string }>("/auth/slack/connect");
  return url;
}

export function listEmails(status: "SCHEDULED" | "SENT" | "FAILED") {
  return apiFetch<import("../types/email").EmailListItem[]>(
    `/api/emails/list?status=${status}`,
  );
}

export function searchEmails(query: string, status?: string) {
  const params = new URLSearchParams({ q: query });
  if (status) {
    params.set("status", status);
  }
  return apiFetch<import("../types/email").EmailListItem[]>(
    `/api/emails/search?${params.toString()}`,
  );
}

export function scheduleEmail(
  payload: import("../types/email").ScheduleEmailPayload,
) {
  return apiFetch<{ id: number }>("/api/emails/schedule", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getEmailCounts() {
  return apiFetch<import("../types/email").EmailCount[]>("/api/emails/count");
}

export function disconnectSlack() {
  return apiFetch<null>("/auth/slack", { method: "DELETE" });
}
