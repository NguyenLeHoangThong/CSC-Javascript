import { useRef, useState } from "react";
import { Alert, Box, Button, Chip, CircularProgress, Paper, Stack, TextField, Typography } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

import { aiApi } from "../../api/aiApi";

// A few one-tap examples: an empty AI box is intimidating, and people who do not know
// what to type simply never use the feature.
const EXAMPLE_QUERIES = [
  "laptop cho lập trình viên",
  "điện thoại chụp ảnh đẹp dưới 1000$",
  "tai nghe chống ồn đi máy bay",
];

/**
 * Bài 34 — AI for React.
 *
 * The three states an AI call has (loading / error / success) are ALL rendered here.
 * An LLM call is slow (~1-3s) and fails far more often than a normal endpoint
 * (rate limit, quota, timeout), so "forgot to handle the error branch" is not a
 * theoretical bug — it is the common case.
 */
const AISuggestWidget = () => {
  const [query, setQuery] = useState("");
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [cached, setCached] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Keeps the in-flight request so a second submit cancels the first one instead of
  // racing it — otherwise a slow first answer can overwrite a fast second answer.
  const controllerRef = useRef<AbortController | null>(null);

  const ask = async (rawQuery: string) => {
    const q = rawQuery.trim();
    if (q.length < 3) {
      setError("Hãy mô tả nhu cầu của bạn (ít nhất 3 ký tự).");
      return;
    }

    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      setLoading(true);
      setError(null);
      setSuggestion(null);

      const res = await aiApi.suggest(q, { signal: controller.signal });
      setSuggestion(res.data.data.suggestion);
      setCached(res.data.data.cached);
    } catch (err: unknown) {
      const e = err as { name?: string; code?: string; response?: { data?: { message?: string } } };
      if (e?.name === "CanceledError" || e?.code === "ERR_CANCELED") return; // superseded, not failed
      // The backend already turns 429 / quota / timeout into a readable sentence.
      setError(e?.response?.data?.message ?? "Không gọi được trợ lý AI. Vui lòng thử lại.");
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  };

  return (
    <Paper
      variant="outlined"
      sx={{ p: { xs: 2, md: 2.5 }, mb: 3, borderRadius: 3, borderStyle: "dashed" }}
    >
      {/* This MUI version only accepts style props inside `sx` — see Bài 38. */}
      <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1.5 }}>
        <AutoAwesomeIcon color="secondary" />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>Trợ lý mua sắm AI</Typography>
      </Stack>

      <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
        Mô tả nhu cầu của bạn, AI sẽ gợi ý sản phẩm phù hợp <strong>trong kho của CSC Shop</strong>.
      </Typography>

      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          void ask(query);
        }}
        sx={{ display: "flex", gap: 1.5, flexWrap: { xs: "wrap", sm: "nowrap" } }}
      >
        <TextField
          fullWidth
          size="small"
          label="Bạn đang cần gì?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={loading}
          // Mirrors the backend's MAX_QUERY_LENGTH so the user is stopped at the input
          // instead of by a 400. (`inputProps` is deprecated in this MUI version.)
          slotProps={{ htmlInput: { maxLength: 200 } }}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={loading || query.trim().length < 3}
          sx={{ whiteSpace: "nowrap", minWidth: 120 }}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <AutoAwesomeIcon />}
        >
          {loading ? "Đang nghĩ..." : "Gợi ý"}
        </Button>
      </Box>

      <Stack direction="row" spacing={1} useFlexGap sx={{ mt: 1.5, flexWrap: "wrap" }}>
        {EXAMPLE_QUERIES.map((example) => (
          <Chip
            key={example}
            label={example}
            size="small"
            variant="outlined"
            disabled={loading}
            onClick={() => {
              setQuery(example);
              void ask(example);
            }}
          />
        ))}
      </Stack>

      {/* ── State 2: error ── */}
      {error && (
        <Alert severity="warning" sx={{ mt: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* ── State 3: success ── */}
      {suggestion && (
        <Alert severity="info" icon={<AutoAwesomeIcon fontSize="inherit" />} sx={{ mt: 2 }}>
          {/* The model answers in plain text with line breaks — preserve them. */}
          <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>{suggestion}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
            {cached ? "⚡ Trả từ cache" : "✨ Gợi ý bởi AI"} — chỉ mang tính tham khảo.
          </Typography>
        </Alert>
      )}
    </Paper>
  );
};

export default AISuggestWidget;
