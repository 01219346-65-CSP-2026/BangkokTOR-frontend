import { describe, expect, test } from "bun:test";
import { rejectCrossOrigin } from "./sameOrigin";

// T17 (Sec P8) — the shared CSRF gate every state-changing BFF route calls
// first. Run with:   bun test src/lib/sameOrigin

function request(origin: string | null, url = "http://app/api/profile") {
  const headers = new Headers();
  if (origin !== null) headers.set("Origin", origin);
  return new Request(url, { method: "POST", headers });
}

describe("rejectCrossOrigin", () => {
  test("passes a request whose Origin matches the app's own origin", () => {
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
    expect(rejectCrossOrigin(request("http://app:81", "http://app:80/api/profile"))).not.toBeNull();
  });
});
