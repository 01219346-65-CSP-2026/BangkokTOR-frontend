import { describe, expect, mock, test } from "bun:test";

// T17 (Sec P8) — proves the CSRF gate actually sits in front of a real,
// state-changing BFF route, not just the helper in isolation.
// Run with:   bun test src/app/api/ingest/capture
//
// `@/api/client` is deliberately NOT mocked here (unlike tors/insights'
// route test) — `mock.module` in bun:test is process-wide, not scoped per
// file, so two files mocking the same module specifier in the same `bun
// test` run clobber each other. Not needed anyway: every case below is
// decided before adminFetch would ever be called.
mock.module("@/lib/auth", () => ({ auth: async () => null }));

const { POST } = await import("./route");

function post(origin: string | null) {
  const headers = new Headers({ "Content-Type": "application/json" });
  if (origin !== null) headers.set("Origin", origin);
  return POST(
    new Request("http://app/api/ingest/capture", {
      method: "POST",
      headers,
      body: JSON.stringify({ projects: [] }),
    }),
  );
}

describe("POST /api/ingest/capture — cross-origin rejection", () => {
  test("a cross-origin POST is rejected with 403 before auth ever runs", async () => {
    const res = await post("http://evil.trueddns.com");

    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({ error: "Cross-origin request rejected" });
  });

  test("a POST with no Origin header at all is rejected the same way", async () => {
    const res = await post(null);
    expect(res.status).toBe(403);
  });

  test("a same-origin POST passes the CSRF gate and reaches the auth check", async () => {
    const res = await post("http://app");

    // Not signed in (mocked) — but crucially 401, not 403. A 403 here would
    // mean the CSRF gate itself blocked a legitimate same-origin request.
    expect(res.status).toBe(401);
  });
});
