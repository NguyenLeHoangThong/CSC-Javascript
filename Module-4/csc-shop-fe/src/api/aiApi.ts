import axiosClient from "./axiosClient";

// Bài 34 — the frontend NEVER talks to Gemini directly.
//
// A browser cannot keep a secret: anything in `import.meta.env.VITE_*` is compiled
// into the JS bundle and readable by every visitor. The Gemini key lives on the
// server, and the browser only ever calls our own API.
export interface AISuggestion {
  query: string;
  suggestion: string;
  cached: boolean;
}

export const aiApi = {
  suggest: (q: string, config?: { signal?: AbortSignal }) =>
    axiosClient.get<{ success: boolean; data: AISuggestion }>("/ai/suggest", {
      params: { q },
      signal: config?.signal,
    }),
};
