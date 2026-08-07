import { useEffect, useState } from "react";

/**
 * Bài 34 — delay a fast-changing value.
 *
 * Typing "macbook" fires 7 renders. Without debouncing that is 7 API calls, of which
 * only the last one matters. This hook returns the value only after it has stopped
 * changing for `delay` ms.
 *
 * The cleanup is the whole trick: every keystroke cancels the previous timer, so the
 * timer that finally fires is the one started by the last keystroke.
 */
export function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
