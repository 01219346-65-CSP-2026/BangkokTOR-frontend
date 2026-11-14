import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";
import { ApiError, publicFetch, publicRaw } from "./client.ts";

const realFetch = globalThis.fetch;
const originalBackendUrl = process.env.BACKEND_URL;

beforeEach(() => {
  process.env.BACKEND_URL = "http://internal-backend:8003";
});

afterEach(() => {
  globalThis.fetch = realFetch;
  if (originalBackendUrl === undefined) delete process.env.BACKEND_URL;
  else process.env.BACKEND_URL = originalBackendUrl;
});

describe("backend client errors", () => {
  test("does not pass backend error text or hostnames to callers", async () => {
    globalThis.fetch = mock(async () =>
      new Response(
        JSON.stringify({
          error: "Database unavailable at mongodb://private.internal:27017",
        }),
        { status: 500 },
      ),
    ) as unknown as typeof fetch;

    await expect(publicFetch("/api/tors")).rejects.toMatchObject({
      status: 500,
      message: "The request could not be completed.",
    });
  });

  test("does not pass connection errors or backend hostnames to callers", async () => {
    globalThis.fetch = mock(async () => {
      throw new Error("connect ECONNREFUSED internal-backend:8003");
    }) as unknown as typeof fetch;

    await expect(publicFetch("/api/tors")).rejects.toMatchObject({
      status: 503,
      message: "Service temporarily unavailable.",
    });
    await expect(publicRaw("/api/tors/123/file")).rejects.toMatchObject({
      status: 503,
      message: "Service temporarily unavailable.",
    });
  });

  test("uses a generic message when the backend URL is not configured", async () => {
    delete process.env.BACKEND_URL;

    await expect(publicFetch("/api/tors")).rejects.toBeInstanceOf(ApiError);
    await expect(publicRaw("/api/tors/123/file")).rejects.toMatchObject({
      status: 503,
      message: "Service temporarily unavailable.",
    });
  });
});
