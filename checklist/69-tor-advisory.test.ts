import { describe, expect, test } from "bun:test";
import { source } from "./helpers.ts";

// PASSING CRITERIA for feat/69 (frontend) — the wiring part.
// Run with:   bun test checklist/69

const PAGE = "src/app/(public)/tor/[id]/page.tsx";
const PROXY = "src/app/api/tors/[id]/advisory/route.ts";

describe("feat/69 checklist", () => {
  test("the proxy checks the session and sends the signed token", () => {
    const proxy = source(PROXY);
    expect(proxy).toContain("await auth()");
    expect(proxy).toContain("authedFetch");
    expect(proxy).not.toContain("publicFetch");
  });

  test("the page asks for the advisory only when signed in", () => {
    const page = source(PAGE);
    expect(page).toContain("<AdvisorySection");
    expect(page).toContain("signedIn ? `/api/tors/${encodeURIComponent(id)}/advisory` : null");
  });

  test("no grade letter or score is typed on the frontend", () => {
    const api = source("src/api/tors.ts");
    const type = api.slice(api.indexOf("export type TorAdvisory = {"), api.indexOf("/** One neutral observation"));
    expect(type).toContain("level");
    expect(type).not.toContain("grade");
    expect(type).not.toContain("score");
  });
});
