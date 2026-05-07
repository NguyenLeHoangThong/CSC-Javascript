import { useState, useEffect, useRef } from "react";
import axios from "axios";
import type { ApiState } from "../types/api";

export function useApi<T>(url: string) {
  const [state, setState] = useState<ApiState<T>>({ status: "idle" });
  const cache = useRef<Record<string, T>>({});

  useEffect(() => {
    if (!url) return;
    if (cache.current[url]) {
      setState({ status: "success", data: cache.current[url] });
      return;
    }

    const controller = new AbortController();
    setState({ status: "loading" });

    axios
      .get<T>(url, { signal: controller.signal })
      .then((res) => {
        cache.current[url] = res.data;
        setState({ status: "success", data: res.data });
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        setState({ status: "error", error: err.message });
      });

    return () => controller.abort();
  }, [url]);

  return state;
}
