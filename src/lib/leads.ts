const SPLIT_REGEX = /[\s,;]+/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ParsedRecipients {
  emails: string[];
  skipped: string[];
}

export function parseLeadsText(text: string): ParsedRecipients {
  const tokens = text
    .split(SPLIT_REGEX)
    .map((token) => token.trim())
    .filter(Boolean);

  const seen = new Set<string>();
  const emails: string[] = [];
  const skipped: string[] = [];

  for (const token of tokens) {
    const normalized = token.toLowerCase();

    if (!EMAIL_PATTERN.test(normalized) || seen.has(normalized)) {
      skipped.push(token);
      continue;
    }

    seen.add(normalized);
    emails.push(normalized);
  }

  return { emails, skipped };
}

export async function parseLeadsFile(file: File): Promise<ParsedRecipients> {
  const text = await file.text();
  return parseLeadsText(text);
}

export function mergeRecipients(
  ...parsed: ParsedRecipients[]
): ParsedRecipients {
  const seen = new Set<string>();
  const emails: string[] = [];
  const skipped: string[] = [];

  for (const { emails: batch, skipped: batchSkipped } of parsed) {
    skipped.push(...batchSkipped);
    for (const email of batch) {
      if (seen.has(email)) {
        skipped.push(email);
        continue;
      }
      seen.add(email);
      emails.push(email);
    }
  }

  return { emails, skipped };
}
