import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { adminFetch, ApiError } from "@/api/client";
import { rejectCrossOrigin } from "@/lib/sameOrigin";

// The admin panel's e-GP CSV import (admin/pipeline/CsvImport.tsx).
//
// It posts to the same backend route as the capture extension
// (tools/egp-capture): POST /api/ingest/capture, which queues the project ids
// and returns at once; the ingest worker reads each one from e-GP. Going
// through here keeps ADMIN_TOKEN server-side, and adds the staff check the
// backend's token gate cannot make. Same checks as the pipeline proxy.

/** The backend's MAX_CAPTURE. The page sends smaller batches than this. */
const MAX_PROJECTS = 2_000;

export async function POST(request: Request) {
  const blocked = rejectCrossOrigin(request);
  if (blocked) return blocked;

  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }
  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Without the token the backend answers 404 on purpose (adminToken.ts).
  if (!process.env.ADMIN_TOKEN) {
    return NextResponse.json(
      { error: "ADMIN_TOKEN is not set in the frontend env. Copy it from the backend .env." },
      { status: 500 },
    );
  }

  const body = (await request.json().catch(() => null)) as { projects?: unknown } | null;
  if (!Array.isArray(body?.projects) || body.projects.length > MAX_PROJECTS) {
    return NextResponse.json(
      { error: `projects must be an array of at most ${MAX_PROJECTS}` },
      { status: 400 },
    );
  }

  // Only the fields the backend reads, re-serialised: the browser's copy of
  // the CSV row (status and all) stays here.
  const projects = body.projects.map((raw) => {
    const p = (raw ?? {}) as Record<string, unknown>;
    return { projectId: p.projectId, title: p.title, agency: p.agency, province: p.province };
  });

  try {
    const data = await adminFetch("/api/ingest/capture", {
      method: "POST",
      body: JSON.stringify({ projects, source: "egp-csv" }),
    });
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("csv import failed:", error);
    return NextResponse.json({ error: "Import failed." }, { status: 500 });
  }
}
