import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";

// T15 — content-type confusion on the public PDF proxy.
// Run with:   bun test src/app/api/tors/[id]/documents
//
// `@/api/client` is NOT mocked (mock.module is process-wide in bun:test and
// would clobber other route tests). The backend is faked at `fetch` instead,
// which is what publicRaw calls.

const { GET } = await import("./route");

const TOR = "6650a1b2c3d4e5f6a7b8c9d0";
const DOC = "6650a1b2c3d4e5f6a7b8c9d1";

const realFetch = globalThis.fetch;
const realBackend = process.env.BACKEND_URL;
let calls: string[] = [];

function upstream(body: BodyInit | null, init: ResponseInit) {
  globalThis.fetch = mock(async (url: string | URL | Request) => {
    calls.push(String(url));
    return new Response(body, init);
  }) as unknown as typeof fetch;
}

function get(id: string, documentId: string) {
  return GET(new Request(`http://app/api/tors/${id}/documents/${documentId}/file`), {
    params: Promise.resolve({ id, documentId }),
  });
}

beforeEach(() => {
  calls = [];
  process.env.BACKEND_URL = "http://backend";
});
afterEach(() => {
  globalThis.fetch = realFetch;
  if (realBackend === undefined) delete process.env.BACKEND_URL;
  else process.env.BACKEND_URL = realBackend;
});

describe("GET document file — the response is always a PDF", () => {
  test("a real PDF is relayed as application/pdf, inline, nosniff", async () => {
    upstream("%PDF-1.7 ...", {
      status: 200,
      headers: { "Content-Type": "application/pdf", "Content-Length": "11" },
    });
    const res = await get(TOR, DOC);

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("application/pdf");
    expect(res.headers.get("content-disposition")).toBe(`inline; filename="${DOC}.pdf"`);
    expect(res.headers.get("x-content-type-options")).toBe("nosniff");
    expect(res.headers.get("content-length")).toBe("11");
    expect(await res.text()).toBe("%PDF-1.7 ...");
    expect(calls).toEqual([`http://backend/api/tors/${TOR}/documents/${DOC}/file`]);
  });

  test("an upstream text/html file is still served as application/pdf", async () => {
    upstream("<script>alert(document.cookie)</script>", {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
    const res = await get(TOR, DOC);
    expect(res.headers.get("content-type")).toBe("application/pdf");
    expect(res.headers.get("x-content-type-options")).toBe("nosniff");
  });

  test("an upstream SVG is still served as application/pdf", async () => {
    upstream("<svg onload=alert(1)></svg>", { status: 200, headers: { "Content-Type": "image/svg+xml" } });
    expect((await get(TOR, DOC)).headers.get("content-type")).toBe("application/pdf");
  });

  test("the upstream Content-Disposition is never copied", async () => {
    upstream("x", {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="evil.html"',
      },
    });
    const disposition = (await get(TOR, DOC)).headers.get("content-disposition");
    expect(disposition).toBe(`inline; filename="${DOC}.pdf"`);
    expect(disposition).not.toContain("evil");
  });

  test("a non-numeric upstream Content-Length is dropped", async () => {
    upstream("x", { status: 200, headers: { "Content-Length": "1, 2" } });
    // Response normalises some values; the point is it is never the raw string.
    expect((await get(TOR, DOC)).headers.get("content-length")).not.toBe("1, 2");
  });

  test("upstream 404 stays 404, other failures become 502", async () => {
    upstream(null, { status: 404 });
    expect((await get(TOR, DOC)).status).toBe(404);
    upstream(null, { status: 500 });
    expect((await get(TOR, DOC)).status).toBe(502);
  });
});

describe("GET document file — invalid ids return 400 without calling the backend", () => {
  const bad = [
    "",
    "abc",
    "6650a1b2c3d4e5f6a7b8c9d", // 23
    "6650a1b2c3d4e5f6a7b8c9d0a", // 25
    "6650a1b2c3d4e5f6a7b8c9dz", // non-hex
    "../../api/user",
    "6650a1b2c3d4e5f6a7b8c9d0/../x",
    "6650a1b2c3d4e5f6a7b8c9d0%2F..",
    "6650a1b2c3d4e5f6a7b8c9d0?x=1",
    "6650a1b2c3d4e5f6a7b8c9d0\n",
  ];

  for (const value of bad) {
    test(`TOR id ${JSON.stringify(value)}`, async () => {
      upstream("x", { status: 200 });
      const res = await get(value, DOC);
      expect(res.status).toBe(400);
      expect(calls).toEqual([]);
    });

    test(`document id ${JSON.stringify(value)}`, async () => {
      upstream("x", { status: 200 });
      const res = await get(TOR, value);
      expect(res.status).toBe(400);
      expect(calls).toEqual([]);
    });
  }

  test("uppercase hex is accepted", async () => {
    upstream("x", { status: 200 });
    expect((await get(TOR.toUpperCase(), DOC)).status).toBe(200);
  });
});
