import { NextResponse } from "next/server";
import { ApiError, publicRaw } from "@/api/client";

/** A Mongo ObjectId: 24 hex characters. Both route ids are one. */
const OBJECT_ID = /^[a-f0-9]{24}$/i;

/**
 * Streams one PDF expanded from a TOR's bundle. The backend decides what is
 * reachable (right TOR, right kind, file on disk); this route only relays the
 * bytes.
 *
 * T15: it relays the bytes, NOT the upstream's description of them. This
 * response is served from the app's own origin, so a stored HTML or SVG file
 * labelled `text/html` would run as a page of this site. Content-Type is
 * therefore always application/pdf and Content-Disposition is built here;
 * `nosniff` stops the browser from second-guessing the type. A file that is
 * not really a PDF then fails to open as one — it never renders as markup.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; documentId: string }> },
) {
  const { id, documentId } = await params;

  // Decided before the backend is called: a malformed id never leaves the BFF.
  if (!OBJECT_ID.test(id) || !OBJECT_ID.test(documentId)) {
    return NextResponse.json({ error: "Invalid document id." }, { status: 400 });
  }

  try {
    const upstream = await publicRaw(`/api/tors/${id}/documents/${documentId}/file`);

    if (!upstream.ok || !upstream.body) {
      return NextResponse.json(
        { error: "This file is not available." },
        { status: upstream.status === 404 ? 404 : 502 },
      );
    }

    const headers = new Headers({
      "Content-Type": "application/pdf",
      // The id is validated hex, so it is safe inside the quoted filename.
      "Content-Disposition": `inline; filename="${documentId}.pdf"`,
      "X-Content-Type-Options": "nosniff",
    });
    const length = upstream.headers.get("content-length");
    if (length && /^\d+$/.test(length)) headers.set("Content-Length", length);

    return new Response(upstream.body, { status: 200, headers });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("tor document file proxy failed:", error);
    return NextResponse.json({ error: "Could not load this file." }, { status: 500 });
  }
}
