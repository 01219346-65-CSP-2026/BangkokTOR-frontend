// The three pipeline controls, called from client components. They go through
// the Next proxy (src/app/api/pipeline/[...path]/route.ts), which adds the
// admin token server-side — nothing here ever sees it.
//
// Plain async functions, not hooks: loading and error state belong to the
// component that owns the button.

async function post<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`/api/pipeline/${path}`, {
    method: "POST",
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = (await res.json().catch(() => null)) as { error?: string } | null;
  if (!res.ok) throw new Error(data?.error ?? `Request failed (${res.status})`);
  return data as T;
}

/** Ask workers to stop after their current row. */
export const stopWorkers = (ids: string[]) =>
  post<{ flagged: number }>("workers/stop", { ids });

/** Drop heartbeat rows for workers that are dead or stopped-and-quiet. */
export const flushDeadWorkers = () => post<{ removed: number }>("workers/flush");

/** Put the ingest row behind this error back to pending. 409 for oversize. */
export const retryError = (errorId: string) =>
  post<{ projectId: string; status: string }>(`errors/${errorId}/retry`);
