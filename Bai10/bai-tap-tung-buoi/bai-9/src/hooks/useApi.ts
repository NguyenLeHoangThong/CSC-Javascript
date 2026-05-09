import { useState, useEffect, useRef } from "react";
import axios from "axios";
import type { ApiState } from "../types/api";

// Generic hook — T được infer từ caller
// useApi<Product[]>(url) → trả về ApiState<Product[]>
export function useApi<T>(url: string): ApiState<T> {
  const [state, setState] = useState<ApiState<T>>({ status: "idle" });
  // useRef để cache — không trigger re-render khi cache thay đổi
  const cache = useRef<Record<string, T>>({});

  useEffect(() => {
    if (!url) return;

    // Trả về từ cache nếu đã fetch trước đó
    if (cache.current[url]) {
      setState({ status: "success", data: cache.current[url] });
      return;
    }

    // AbortController: hủy request khi component unmount hoặc url thay đổi
    const controller = new AbortController();
    setState({ status: "loading" });

    axios
      .get<T>(url, { signal: controller.signal })
      .then((res) => {
        cache.current[url] = res.data;
        setState({ status: "success", data: res.data });
      })
      .catch((err: unknown) => {
        if (axios.isCancel(err)) return; // Bỏ qua lỗi do abort
        const message = err instanceof Error ? err.message : "Unknown error";
        setState({ status: "error", error: message });
      });

    // Cleanup: abort request khi effect cleanup
    return () => controller.abort();
  }, [url]);

  return state;
}
