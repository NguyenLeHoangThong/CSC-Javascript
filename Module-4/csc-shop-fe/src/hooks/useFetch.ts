import { useCallback, useEffect, useRef, useState } from "react";
import axiosClient from "../api/axiosClient";

/**
 * Bài 34 — the loading/error/data triplet, written once.
 *
 * HomePage, ProductDetailPage, MyOrdersPage and all three admin pages each repeated
 * the same twenty lines: three useStates, a useEffect, a try/catch/finally, and an
 * AbortController that half of them forgot. This hook is that block, extracted.
 *
 * Two details that are easy to get wrong and are handled here:
 *   - Abort on unmount / on a changed URL, so a slow response cannot call setState
 *     after the component is gone, and so a stale response cannot overwrite a newer one.
 *   - `params` is compared by VALUE. Callers pass object literals, which are a new
 *     reference on every render; using the object itself in the dependency array
 *     would re-fetch forever.
 */
export interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFetch<T>(
  url: string | null, // null = do not fetch yet (e.g. waiting for an id)
  params?: Record<string, unknown>
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(Boolean(url));
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  // Serialise the params so the effect depends on their VALUE, not their identity.
  const paramsKey = JSON.stringify(params ?? {});

  // Keep the latest params in a ref so the effect can read them without listing the
  // object itself as a dependency.
  const paramsRef = useRef(params);
  paramsRef.current = params;

  useEffect(() => {
    if (!url) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axiosClient.get(url, { params: paramsRef.current, signal: controller.signal });
        // The API always answers { success, data, ... } — unwrap it here so callers
        // never write `res.data.data`.
        setData(res.data?.data ?? res.data);
      } catch (err: unknown) {
        // An aborted request is not a failure: the component moved on deliberately.
        if (isAbortError(err)) return;
        setError(extractMessage(err));
      } finally {
        // Guard: after an abort the component is usually unmounted already.
        if (!controller.signal.aborted) setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [url, paramsKey, reloadToken]);

  const refetch = useCallback(() => setReloadToken((n) => n + 1), []);

  return { data, loading, error, refetch };
}

function isAbortError(err: unknown): boolean {
  const e = err as { name?: string; code?: string };
  return e?.name === "CanceledError" || e?.code === "ERR_CANCELED";
}

// Prefer the backend's own `message` — it is written for humans and already
// translated — and fall back to something generic.
function extractMessage(err: unknown): string {
  const e = err as { response?: { data?: { message?: string } }; message?: string };
  return e?.response?.data?.message ?? e?.message ?? "Đã có lỗi xảy ra. Vui lòng thử lại.";
}
