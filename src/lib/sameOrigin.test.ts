import { afterEach, beforeEach, describe, expect, spyOn, test } from "bun:test";
import { rejectCrossOrigin } from "./sameOrigin";

// T17 (Sec P8) — the shared CSRF gate every state-changing BFF route calls
// first. Run with:   bun test src/lib/sameOrigin

function request(origin: string | null, url = "http://app/api/profile") {
  const headers = new Headers();
  if (origin !== null) headers.set("Origin", origin);
  return new Request(url, { method: "POST", headers });
}

const savedAuthUrl = process.env.AUTH_URL;

beforeEach(() => {
  process.env.AUTH_URL = "http://app";
});

afterEach(() => {
  if (savedAuthUrl === undefined) delete process.env.AUTH_URL;
  else process.env.AUTH_URL = savedAuthUrl;
});

describe("rejectCrossOrigin", () => {
  test("passes a request whose Origin matches the app's public origin", () => {
    expect(rejectCrossOrigin(request("http://app"))).toBeNull();
  });

  test("rejects with 403 when Origin is missing", async () => {
    const res = rejectCrossOrigin(request(null));
    expect(res).not.toBeNull();
    expect(res!.status).toBe(403);
    expect(await res!.json()).toEqual({ error: "Cross-origin request rejected" });
  });

  test("rejects with 403 when Origin does not match, even a sibling subdomain", async () => {
    const res = rejectCrossOrigin(request("http://evil.trueddns.com"));
    expect(res).not.toBeNull();
    expect(res!.status).toBe(403);
  });

  test("a scheme or port mismatch alone is still a rejection", () => {
    expect(rejectCrossOrigin(request("https://app"))).not.toBeNull();
    expect(rejectCrossOrigin(request("http://app:81"))).not.toBeNull();
  });

  // The production regression: Caddy terminates TLS and forwards plain HTTP,
  // so request.url is http:// on an internal host while the browser's Origin
  // is the public https:// one.
  test("passes behind a TLS-terminating proxy when Origin matches AUTH_URL", () => {
    process.env.AUTH_URL = "https://munyin.xyz";
    const proxied = request("https://munyin.xyz", "http://localhost:3003/api/profile");
    expect(rejectCrossOrigin(proxied)).toBeNull();
  });

  test("compares against AUTH_URL's origin, ignoring any path on it", () => {
    process.env.AUTH_URL = "https://munyin.xyz/api/auth";
    expect(rejectCrossOrigin(request("https://munyin.xyz"))).toBeNull();
  });

  test("ignores request.url: a request claiming to be from its own host is still checked", () => {
    process.env.AUTH_URL = "https://munyin.xyz";
    const spoofed = request("http://evil.example", "http://evil.example/api/profile");
    expect(rejectCrossOrigin(spoofed)).not.toBeNull();
  });

  test("fails closed when AUTH_URL is unset or invalid", () => {
    const log = spyOn(console, "error").mockImplementation(() => {});
    delete process.env.AUTH_URL;
    expect(rejectCrossOrigin(request("http://app"))).not.toBeNull();
    process.env.AUTH_URL = "not a url";
    expect(rejectCrossOrigin(request("http://app"))).not.toBeNull();
    expect(log).toHaveBeenCalledTimes(2);
    log.mockRestore();
  });
});
