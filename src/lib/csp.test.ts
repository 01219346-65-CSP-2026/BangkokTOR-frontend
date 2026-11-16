import { describe, expect, test } from "bun:test";
import { buildCsp, generateNonce } from "./csp";

function directive(csp: string, name: string): string[] {
  const found = csp.split(";").map((d) => d.trim()).find((d) => d.startsWith(`${name} `));
  return found ? found.split(/\s+/).slice(1) : [];
}

describe("buildCsp (T13)", () => {
  const csp = buildCsp("abc123==");

  test("script-src has no 'unsafe-inline' and carries the nonce", () => {
    const scripts = directive(csp, "script-src");
    expect(scripts).not.toContain("'unsafe-inline'");
    expect(scripts).toContain("'nonce-abc123=='");
    expect(scripts).toContain("'strict-dynamic'");
    expect(scripts).toContain("'self'");
  });

  test("production has no 'unsafe-eval'; dev adds it to script-src only", () => {
    expect(csp).not.toContain("'unsafe-eval'");
    const dev = buildCsp("n", { dev: true });
    expect(directive(dev, "script-src")).toContain("'unsafe-eval'");
    expect(directive(dev, "script-src")).not.toContain("'unsafe-inline'");
  });

  test("style-src keeps 'unsafe-inline' and never a nonce (a nonce would disable it)", () => {
    const styles = directive(csp, "style-src");
    expect(styles).toContain("'unsafe-inline'");
    expect(styles.some((v) => v.startsWith("'nonce-"))).toBe(false);
  });

  test("keeps the rest of the Caddy policy it replaces", () => {
    expect(directive(csp, "default-src")).toEqual(["'self'"]);
    expect(directive(csp, "img-src")).toEqual(["'self'", "data:", "https:"]);
    expect(directive(csp, "font-src")).toEqual(["'self'", "https://fonts.gstatic.com"]);
    expect(directive(csp, "connect-src")).toEqual(["'self'"]);
    expect(directive(csp, "frame-ancestors")).toEqual(["'none'"]);
    expect(directive(csp, "base-uri")).toEqual(["'self'"]);
    expect(directive(csp, "form-action")).toEqual(["'self'"]);
    expect(directive(csp, "object-src")).toEqual(["'none'"]);
  });
});

describe("generateNonce", () => {
  test("is 128 bits of base64 and differs every call", () => {
    const seen = new Set(Array.from({ length: 1000 }, generateNonce));
    expect(seen.size).toBe(1000);
    for (const nonce of seen) {
      expect(nonce).toMatch(/^[A-Za-z0-9+/]{22}==$/);
    }
  });
});
