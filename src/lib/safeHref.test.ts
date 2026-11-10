import { describe, expect, test } from "bun:test";
import { safeHref } from "./safeHref";

// T13 — stored XSS from a scraped or LLM-extracted href. Run with:
//   bun test src/lib/safeHref

describe("safeHref", () => {
  test("rejects javascript:, data:, and vbscript:", () => {
    expect(safeHref("javascript:alert(1)")).toBeUndefined();
    expect(safeHref("data:text/html,<script>alert(1)</script>")).toBeUndefined();
    expect(safeHref("vbscript:msgbox(1)")).toBeUndefined();
  });

  test("passes http and https through unchanged", () => {
    expect(safeHref("http://example.com")).toBe("http://example.com");
    expect(safeHref("https://egp2.bangkok.go.th/project-detail/abc")).toBe(
      "https://egp2.bangkok.go.th/project-detail/abc",
    );
    expect(safeHref("https://example.com/path?q=1#frag")).toBe("https://example.com/path?q=1#frag");
  });

  test("not bypassable by case or leading whitespace", () => {
    expect(safeHref("JaVaScRiPt:alert(1)")).toBeUndefined();
    expect(safeHref("  javascript:alert(1)")).toBeUndefined();
    expect(safeHref("\tjavascript:alert(1)")).toBeUndefined();
  });

  test("rejects other unsafe-for-a-link schemes too — this is an allowlist", () => {
    expect(safeHref("file:///etc/passwd")).toBeUndefined();
    expect(safeHref("blob:https://example.com/uuid")).toBeUndefined();
    expect(safeHref("ftp://example.com/x")).toBeUndefined();
  });

  test("empty, null, undefined, and unparseable strings are all undefined", () => {
    expect(safeHref("")).toBeUndefined();
    expect(safeHref(null)).toBeUndefined();
    expect(safeHref(undefined)).toBeUndefined();
    expect(safeHref("not a url at all")).toBeUndefined();
    // No scheme, and not resolvable without a base — URL() throws on this.
    expect(safeHref("/relative/path")).toBeUndefined();
  });
});
