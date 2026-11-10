import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";

// Sec P11 (T19) — proves request() actually forwards the real client IP to
// the backend. The backend's own BangkokTOR-backend/src/middleware/
// rateLimit.test.ts proves it correctly KEYS on whatever arrives; this file
// proves the frontend actually SENDS it, which is the half of the fix that
// lives here.
//
// `next/headers`'s `headers()` throws outside a real Next.js request
// lifecycle, so it's faked the same way src/lib/mail/mailer.test.ts fakes
// `fetch`: a controllable stand-in, not the real thing.

let incomingHeaders = new Headers();
mock.module("next/headers", () => ({
  headers: async () => incomingHeaders,
}));

const { publicFetch } = await import("./client");

const realFetch = globalThis.fetch;
let calls: Array<{ url: string; headers: Headers }> = [];
function fakeFetch(status = 200, body = "{}") {
  calls = [];
  globalThis.fetch = mock(async (url: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: String(url), headers: new Headers(init?.headers) });
    return new Response(body, { status });
  }) as unknown as typeof fetch;
}

beforeEach(() => {
  process.env.BACKEND_URL = "http://backend";
  incomingHeaders = new Headers();
  fakeFetch();
});

afterEach(() => {
  globalThis.fetch = realFetch;
});

describe("request() — forwarding the real client IP", () => {
  test("forwards the frontend's own incoming X-Forwarded-For to the backend", async () => {
    incomingHeaders.set("x-forwarded-for", "203.0.113.7");

    await publicFetch("/api/tors");

    expect(calls).toHaveLength(1);
    expect(calls[0]!.headers.get("x-forwarded-for")).toBe("203.0.113.7");
  });

  test("the leftmost entry of a multi-hop chain is passed through unchanged", async () => {
    incomingHeaders.set("x-forwarded-for", "203.0.113.7, 10.0.0.5");

    await publicFetch("/api/tors");

    // Passed through as-is — the backend's own clientKey() takes the
    // leftmost entry, so this file doesn't need to parse it too.
    expect(calls[0]!.headers.get("x-forwarded-for")).toBe("203.0.113.7, 10.0.0.5");
  });

  test("sends no X-Forwarded-For at all when the incoming request had none", async () => {
    await publicFetch("/api/tors");

    expect(calls[0]!.headers.has("x-forwarded-for")).toBe(false);
  });
});
