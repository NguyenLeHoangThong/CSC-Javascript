import { defineConfig, devices } from "@playwright/test";

// Bài 32 (mở rộng) — E2E cho CSC Shop.
//
// Khác biệt so với Vitest ở cùng repo:
//   Vitest  = component/service test, mock hết, chạy trong jsdom, ~1s.
//   Playwright = chạy Chromium THẬT trên FE thật + backend thật + PostgreSQL thật.
// Vì thế Playwright bắt được đúng loại lỗi mà unit test không thể thấy: FE và BE mỗi
// bên "đúng" một mình nhưng gọi nhau sai tên field.

const FE_PORT = 5173;
const BE_PORT = 3000;

export const BASE_URL = `http://localhost:${FE_PORT}`;
export const API_URL = `http://localhost:${BE_PORT}/api/v1`;

export default defineConfig({
  testDir: "./e2e",

  // Test phải độc lập với nhau -> chạy song song được.
  fullyParallel: true,

  // Không cho `test.only` lọt lên CI (rất dễ vô tình chỉ chạy 1 test mà tưởng chạy hết).
  forbidOnly: !!process.env.CI,

  // CI hay chậm/nhiễu hơn máy local nên cho retry; local thì KHÔNG retry, để test flaky
  // lộ ra ngay thay vì bị giấu đi.
  retries: process.env.CI ? 2 : 0,

  // Trên CI giới hạn worker cho ổn định; local dùng mặc định (số core).
  workers: process.env.CI ? 2 : undefined,

  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],

  use: {
    baseURL: BASE_URL,

    // Giữ trace/screenshot/video của lần chạy hỏng để mở bằng
    // `npx playwright show-trace`. Chỉ bật khi retry/fail nên không làm chậm lần chạy xanh.
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",

    // Auto-waiting của Playwright đã lo phần chờ; các mốc này chỉ là chặn trên.
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  // Playwright tự khởi động CẢ HAI server rồi mới chạy test, và tự tắt khi xong.
  // Backend phải đứng trước: FE gọi API ngay ở lần render đầu.
  webServer: [
    {
      command: "npm run dev",
      cwd: "../csc-shop-api",
      // Chờ /health — endpoint này kiểm tra luôn cả kết nối DB (Bài 39), nên khi nó
      // xanh là chắc chắn Postgres cũng sẵn sàng, không phải "process đã start".
      url: `http://localhost:${BE_PORT}/health`,
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
      stdout: "pipe",
      stderr: "pipe",
    },
    {
      command: "npm run dev",
      url: BASE_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
  ],
});
