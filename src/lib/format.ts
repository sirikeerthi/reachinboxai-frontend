// Backend sends UTC ISO strings; omitting `timeZone` below renders them in the viewer's local timezone.
export function formatDateTime(value: string | null): string {
  if (!value) {
    return "—";
  }

  return new Date(value).toLocaleString(undefined, {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    month: "short",
    day: "numeric",
  });
}
