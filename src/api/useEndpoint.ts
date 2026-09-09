"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// The one client-side fetch hook. Every page that reads from /api/* goes
// through here, so stale-response handling and error shape are decided once
// rather than re-invented per page.
//
// Fetch-on-mount plus an explicit refresh. Deliberately not polling: grading a
// single TOR takes one to three minutes, so a fast interval would spend queries
// to redraw the same numbers. The user asks when they want to know.
//
// No TanStack Query / SWR on purpose — see AGENTS.md ("add no new
// dependencies"). With a handful of read-only call sites and no caching or
// mutations, a query library is not yet earning its place.

type State<T> = {
  data: T | null;
  error: string | null;
  isLoading: boolean;
};

export type UseEndpointOptions<TResponse, TData> = {
  /**
   * Map the response before it reaches state, so a component never holds the
   * raw backend shape. Must be stable across renders (module-level function or
   * useCallback) — it is a dependency of the fetch.
   */
  select?: (response: TResponse) => TData;
};

/**
 * @param path      URL to fetch, relative to the app's own origin.
 * @param options   Optional `select` transform.
 *
 * `TResponse` is what the endpoint returns; `TData` is what the component gets.
 * They are the same type unless `select` is given.
 */
export function useEndpoint<TResponse, TData = TResponse>(
  path: string,
  options: UseEndpointOptions<TResponse, TData> = {},
) {
  const { select } = options;

  const [state, setState] = useState<State<TData>>({
    data: null,
    error: null,
    isLoading: true,
  });

  // Bumped per request so a slow response to an abandoned request can never
  // overwrite a newer one.
  const requestId = useRef(0);
  // Aborts the request itself, which the id guard alone cannot do — that only
  // discards the answer once it arrives. The two solve adjacent problems.
  const inFlight = useRef<AbortController | null>(null);

  // Held in a ref so passing an inline `select` does not re-run the fetch on
  // every render. Synced in an effect rather than assigned during render —
  // writing a ref mid-render is not safe under concurrent rendering, which is
  // what react-hooks/refs is guarding against.
  const selectRef = useRef(select);
  useEffect(() => {
    selectRef.current = select;
  }, [select]);

  const run = useCallback(async (target: string) => {
    const id = ++requestId.current;

    inFlight.current?.abort();
    const controller = new AbortController();
    inFlight.current = controller;

    try {
      const res = await fetch(target, { cache: "no-store", signal: controller.signal });
      const body = await res.json().catch(() => null);

      if (id !== requestId.current) return;

      if (!res.ok) {
        setState({
          data: null,
          error: body?.error ?? `Request failed (${res.status}).`,
          isLoading: false,
        });
        return;
      }

      const transform = selectRef.current;
      setState({
        data: transform ? transform(body as TResponse) : (body as TData),
        error: null,
        isLoading: false,
      });
    } catch (cause) {
      // An abort is this request being replaced or unmounted, not a failure to
      // report — reporting it would flash an error during normal navigation.
      if (cause instanceof DOMException && cause.name === "AbortError") return;
      if (id !== requestId.current) return;

      setState({
        data: null,
        error: "Could not reach the server. Check your connection and try again.",
        isLoading: false,
      });
    }
  }, []);

  useEffect(() => {
    // Fetching on mount is exactly the "subscribe to an external system and
    // setState in a callback" case the rule permits: every setState inside
    // `run` happens after an await, never synchronously in this effect body,
    // and a stale response is discarded via requestId. The linter cannot see
    // across the useCallback boundary to confirm that, hence the disable.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void run(path);

    return () => inFlight.current?.abort();
  }, [path, run]);

  const refresh = useCallback(() => {
    setState((prev) => ({ ...prev, isLoading: true }));
    void run(path);
  }, [path, run]);

  return { ...state, refresh };
}
