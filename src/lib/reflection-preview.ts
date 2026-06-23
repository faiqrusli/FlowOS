export function parseReflectionLines(text: string): string[] {
  if (!text.trim()) return [];

  return text
    .split(/\n/)
    .map((line) => line.replace(/^[\s•\-*]+/, "").trim())
    .filter(Boolean);
}
