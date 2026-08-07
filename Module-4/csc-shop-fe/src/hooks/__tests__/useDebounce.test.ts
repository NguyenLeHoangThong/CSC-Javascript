import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { useDebounce } from "../useDebounce";

// Bài 32 + 34 — testing a hook that depends on time.
//
// Fake timers turn "wait 400ms" into "advance the clock 400ms": the test is
// instant and deterministic instead of sleeping and hoping.
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useDebounce", () => {
  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("iphone", 400));
    expect(result.current).toBe("iphone");
  });

  it("does not update before the delay has elapsed", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 400), {
      initialProps: { value: "i" },
    });

    rerender({ value: "iphone" });
    act(() => {
      vi.advanceTimersByTime(399);
    });

    expect(result.current).toBe("i");
  });

  it("updates once the delay has elapsed", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 400), {
      initialProps: { value: "i" },
    });

    rerender({ value: "iphone" });
    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(result.current).toBe("iphone");
  });

  it("only emits the LAST value when typing quickly", () => {
    // This is the behaviour that saves the API calls: 5 keystrokes, 1 result.
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 400), {
      initialProps: { value: "" },
    });

    for (const value of ["i", "ip", "iph", "ipho", "iphone"]) {
      rerender({ value });
      act(() => {
        vi.advanceTimersByTime(100); // each keystroke is faster than the delay
      });
    }

    // 500ms of typing has passed, but the timer restarted on every keystroke.
    expect(result.current).toBe("");

    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(result.current).toBe("iphone");
  });
});
