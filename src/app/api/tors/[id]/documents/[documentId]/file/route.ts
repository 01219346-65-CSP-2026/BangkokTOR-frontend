import { NextResponse } from "next/server";
import { ApiError, publicRaw } from "@/api/client";

/**
 * Streams one PDF expanded from a TOR's bundle. The backend decides what is
 * reachable (right TOR, right kind, file on disk); this route only relays the
 * bytes and the headers that make the browser open it as a PDF.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; documentId: string }> },
) {
  const { id, documentId } = await params;

  try {
    const upstream = await publicRaw(
      `/api/tors/${encodeURIComponent(id)}/documents/${encodeURIComponent(documentId)}/file`,
    );

    if (!upstream.ok || !upstream.body) {
      return NextResponse.json(
        { error: "This file is not available." },
        { status: upstream.status === 404 ? 404 : 502 },
      );
    }

    const headers = new Headers();
    for (const name of ["content-type", "content-length", "content-disposition"]) {
      const value = upstream.headers.get(name);
      if (value) headers.set(name, value);
    }

    return new Response(upstream.body, { status: 200, headers });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("tor document file proxy failed:", error);
    return NextResponse.json({ error: "Could not load this file." }, { status: 500 });
  }
}
