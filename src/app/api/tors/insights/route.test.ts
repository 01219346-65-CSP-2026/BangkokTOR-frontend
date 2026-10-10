import { beforeEach, describe, expect, mock, test } from "bun:test";

// SPEC for feat/116 (frontend) — the proxy route between the browser and the
// backend. Run with:   bun test src/app/api/tors/insights
//
// The backend is never called: `publicFetch` is replaced with a fake that
// records the path it was asked for and answers with whatever `reply` says.

class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

const calls: string[] = [];
let reply: () => Promise<unknown> = async () => ({ ok: true });

mock.module("@/api/client", () => ({
  ApiError,
  publicFetch: (path: string) => {
    calls.push(path);
    return reply();
  },
}));

const { GET } = await import("./route");

beforeEach(() => {
  calls.length = 0;
  reply = async () => ({ ok: true });
});

describe("step 1: GET /api/tors/insights", () => {
  test("no province → the backend's insights for all of Thailand", async () => {
    const res = await GET(new Request("http://app/api/tors/insights"));
    expect(res.status).toBe(200);
    expect(calls).toEqual(["/api/tors/insights"]);
    expect(await res.json()).toEqual({ ok: true });
  });

  test("province is forwarded, encoded; nothing else is", async () => {
    await GET(new Request(`http://app/api/tors/insights?province=${encodeURIComponent("กรุงเทพมหานคร")}&admin=1`));
    expect(calls).toHaveLength(1);
    const url = new URL(calls[0]!, "http://backend");
    expect(url.pathname).toBe("/api/tors/insights");
    expect(url.searchParams.get("province")).toBe("กรุงเทพมหานคร");
    expect(url.searchParams.has("admin")).toBe(false);
  });

  test("a blank province is no province", async () => {
    await GET(new Request("http://app/api/tors/insights?province=%20%20"));
    expect(calls).toEqual(["/api/tors/insights"]);
  });

  test("a backend error keeps its status and message", async () => {
    reply = async () => {
      throw new ApiError("Backend unavailable", 503);
    };
    const res = await GET(new Request("http://app/api/tors/insights"));
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ error: "Backend unavailable" });
  });

  test("anything else is a 500 with a readable message, not a stack trace", async () => {
    reply = async () => {
      throw new TypeError("fetch failed");
    };
    const res = await GET(new Request("http://app/api/tors/insights"));
    expect(res.status).toBe(500);
    const body = (await res.json()) as { error: string };
    expect(body.error).toBeString();
    expect(body.error).not.toContain("TypeError");
  });
});
