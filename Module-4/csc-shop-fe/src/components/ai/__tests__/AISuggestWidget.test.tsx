import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Bài 34 — an AI feature has three visible states, and all three must be tested.
// The network layer is mocked: a real Gemini call would be slow, cost money and
// return different words every run.
const { suggestMock } = vi.hoisted(() => ({ suggestMock: vi.fn() }));

vi.mock("../../../api/aiApi", () => ({ aiApi: { suggest: suggestMock } }));

import AISuggestWidget from "../AISuggestWidget";

const okResponse = (suggestion: string, cached = false) => ({
  data: { success: true, data: { query: "q", suggestion, cached } },
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("AISuggestWidget", () => {
  it("keeps the button disabled until the query is long enough", async () => {
    const user = userEvent.setup();
    render(<AISuggestWidget />);

    const button = screen.getByRole("button", { name: /gợi ý/i });
    expect(button).toBeDisabled();

    await user.type(screen.getByLabelText(/bạn đang cần gì/i), "la");
    expect(button).toBeDisabled(); // 2 chars — the backend would answer 400

    await user.type(screen.getByLabelText(/bạn đang cần gì/i), "ptop");
    expect(button).toBeEnabled();
  });

  // ── State 1: loading ──
  it("shows the loading state while the request is in flight", async () => {
    const user = userEvent.setup();
    // A promise we control, so the widget stays in its loading state.
    let resolve!: (value: unknown) => void;
    suggestMock.mockReturnValue(new Promise((r) => { resolve = r; }));

    render(<AISuggestWidget />);
    await user.type(screen.getByLabelText(/bạn đang cần gì/i), "laptop lập trình");
    await user.click(screen.getByRole("button", { name: /gợi ý/i }));

    expect(await screen.findByRole("button", { name: /đang nghĩ/i })).toBeDisabled();

    resolve(okResponse("Gợi ý: MacBook Pro 14\""));
    await waitFor(() => expect(screen.queryByText(/đang nghĩ/i)).not.toBeInTheDocument());
  });

  // ── State 3: success ──
  it("renders the suggestion returned by the API", async () => {
    const user = userEvent.setup();
    suggestMock.mockResolvedValue(okResponse('Gợi ý: MacBook Pro 14" — hợp cho lập trình.'));

    render(<AISuggestWidget />);
    await user.type(screen.getByLabelText(/bạn đang cần gì/i), "laptop lập trình");
    await user.click(screen.getByRole("button", { name: /gợi ý/i }));

    expect(await screen.findByText(/MacBook Pro 14"/)).toBeInTheDocument();
    expect(screen.getByText(/gợi ý bởi ai/i)).toBeInTheDocument();
    expect(suggestMock).toHaveBeenCalledWith("laptop lập trình", expect.anything());
  });

  it("labels a cached answer differently so the origin is honest", async () => {
    const user = userEvent.setup();
    suggestMock.mockResolvedValue(okResponse("Gợi ý: Dell XPS 15", true));

    render(<AISuggestWidget />);
    await user.click(screen.getByRole("button", { name: /laptop cho lập trình viên/i }));

    expect(await screen.findByText(/trả từ cache/i)).toBeInTheDocument();
  });

  // ── State 2: error ──
  it("shows the backend's message when the AI is rate limited", async () => {
    const user = userEvent.setup();
    suggestMock.mockRejectedValue({
      response: { data: { message: "AI is busy right now. Please retry in a few seconds." } },
    });

    render(<AISuggestWidget />);
    await user.type(screen.getByLabelText(/bạn đang cần gì/i), "tai nghe");
    await user.click(screen.getByRole("button", { name: /gợi ý/i }));

    expect(await screen.findByText(/AI is busy right now/i)).toBeInTheDocument();
    // A failure must not leave a stale suggestion on screen.
    expect(screen.queryByText(/gợi ý bởi ai/i)).not.toBeInTheDocument();
  });

  it("falls back to a generic message when the server says nothing useful", async () => {
    const user = userEvent.setup();
    suggestMock.mockRejectedValue(new Error("Network Error"));

    render(<AISuggestWidget />);
    await user.type(screen.getByLabelText(/bạn đang cần gì/i), "máy tính bảng");
    await user.click(screen.getByRole("button", { name: /gợi ý/i }));

    expect(await screen.findByText(/không gọi được trợ lý ai/i)).toBeInTheDocument();
  });

  it("fills the input and asks when an example chip is clicked", async () => {
    const user = userEvent.setup();
    suggestMock.mockResolvedValue(okResponse("Gợi ý: Dell XPS 15"));

    render(<AISuggestWidget />);
    await user.click(screen.getByRole("button", { name: /laptop cho lập trình viên/i }));

    expect(suggestMock).toHaveBeenCalledWith("laptop cho lập trình viên", expect.anything());
    expect(await screen.findByText(/Dell XPS 15/)).toBeInTheDocument();
  });
});
