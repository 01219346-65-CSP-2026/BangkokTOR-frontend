/**
 * T13: React 19 blocks `javascript:` hrefs on its own, but nothing stops
 * `data:`, `vbscript:`, or any other scheme a scraped document or an LLM's
 * extracted text could contain. Use everywhere an href comes from data —
 * backend fields like a TOR's `sourceUrl` or a document's `url` — rather
 * than a hardcoded string in this codebase.
 *
 * Parses with `new URL()` instead of pattern-matching the string: the URL
 * spec requires leading/trailing control characters and whitespace to be
 * stripped and the scheme lowercased before comparison, which is exactly
 * where a naive `startsWith("http")` check has historically been bypassed
 * (" javascript:...", "JaVaScRiPt:..."). This is an allowlist, not a
 * blocklist — any scheme other than http/https fails closed, including ones
 * nobody's thought to ban yet (`data:`, `vbscript:`, `file:`, `blob:`, …).
 */
export function safeHref(url: string | null | undefined): string | undefined {
  if (!url) return undefined;

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return undefined;
  }

  return parsed.protocol === "http:" || parsed.protocol === "https:" ? url : undefined;
}
