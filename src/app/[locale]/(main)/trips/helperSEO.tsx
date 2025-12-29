function normalizeSpaces(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function trimToWordBoundary(text: string, max: number) {
  if (text.length <= max) return text;

  const trimmed = text.slice(0, max);
  const lastSpace = trimmed.lastIndexOf(" ");
  return lastSpace > 0 ? trimmed.slice(0, lastSpace) : trimmed;
}

export function ensureLengthRange(
  text: string,
  min: number,
  max: number,
  fallbackSuffix = "",
): string {
  let result = normalizeSpaces(text);

  if (result.length > max) {
    result = trimToWordBoundary(result, max);
  }

  if (result.length < min && fallbackSuffix) {
    result = normalizeSpaces(`${result} ${fallbackSuffix}`);

    if (result.length > max) {
      result = trimToWordBoundary(result, max);
    }
  }

  return result;
}

