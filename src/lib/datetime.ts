// datetime-local inputs show/accept local wall-clock time with no timezone marker.
// A string without a timezone marker parses as local time per the ES spec, so
// round-tripping through `new Date(...)` here (not `+"Z"`) is what keeps this correct.

export function dateToLocalInputValue(date: Date): string {
  const localMs = date.getTime() - date.getTimezoneOffset() * 60_000;
  return new Date(localMs).toISOString().slice(0, 16);
}

export function localInputValueToUtcIso(value: string): string {
  return new Date(value).toISOString();
}
