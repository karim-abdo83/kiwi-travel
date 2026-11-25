import type { RichText } from "./types";

export type RichTextSegment = { text: string; href?: string };

const LINK = /\[([^\]]+)\]\(([^)]+)\)/g;

/** `trip:<slug>` → `/trips/<slug>`; other targets are internal paths without the locale prefix. */
function resolveHref(target: string) {
  return target.startsWith("trip:") ? `/trips/${target.slice(5)}` : target;
}

export function parseRichText(text: RichText): RichTextSegment[] {
  const segments: RichTextSegment[] = [];
  let last = 0;
  for (const match of text.matchAll(LINK)) {
    const index = match.index ?? 0;
    if (index > last) segments.push({ text: text.slice(last, index) });
    segments.push({ text: match[1]!, href: resolveHref(match[2]!) });
    last = index + match[0].length;
  }
  if (last < text.length) segments.push({ text: text.slice(last) });
  return segments;
}

/** Same text without link markup (for JSON-LD). */
export function toPlainText(text: RichText): string {
  return text.replace(LINK, "$1");
}
