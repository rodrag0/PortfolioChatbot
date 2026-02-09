const BANNED_PATTERNS = [/free money/i, /http:\/\//i, /https:\/\//i];

export function isSpam(text: string) {
  if (text.trim().length < 3) return true;
  if (text.length > 1500) return true;
  return BANNED_PATTERNS.some((pattern) => pattern.test(text));
}
