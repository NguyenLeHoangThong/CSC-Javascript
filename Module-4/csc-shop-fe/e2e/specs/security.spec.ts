import { test, expect, API_URL, SEED_CUSTOMER } from "../fixtures/test-fixtures";

// Bài 36 — kiểm chứng phần hardening trên server ĐANG CHẠY THẬT.
//
// Unit test đã assert những điều này ở mức middleware; ở đây assert lại trên HTTP thật,
// vì thứ tự đăng ký middleware trong app.ts sai một dòng là mọi thứ im lặng ngừng
// hoạt động mà unit test vẫn xanh.

test.describe("Security headers", () => {
  test("helmet có hiệu lực và giấu dấu vết Express", async ({ request }) => {
    const res = await request.get(`${API_URL}/products`);

    expect(res.status()).toBe(200);
    const headers = res.headers();
    expect(headers["x-powered-by"]).toBeUndefined();
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["permissions-policy"]).toContain("camera=()");
  });

  test("limiter đang được mount (có header RateLimit-*)", async ({ request }) => {
    // Cố tình KHÔNG bắn đủ request để lĩnh 429: làm vậy sẽ khoá IP trong 15 phút và
    // các spec khác đỏ theo. Sự hiện diện của header đã chứng minh limiter nằm đúng chỗ.
    const res = await request.get(`${API_URL}/products`);
    const headers = res.headers();

    expect(headers["ratelimit-limit"] ?? headers["ratelimit"]).toBeDefined();
  });

  test("CORS từ origin lạ bị từ chối", async ({ request }) => {
    const res = await request.get(`${API_URL}/products`, {
      headers: { Origin: "https://ke-gian.example.com" },
    });

    // CORS middleware ném lỗi -> errorHandler trả 500 với message chung.
    // Điều quan trọng: KHÔNG có Access-Control-Allow-Origin cho origin lạ.
    expect(res.headers()["access-control-allow-origin"]).toBeUndefined();
  });

  test("CORS từ origin trong whitelist được chấp nhận", async ({ request }) => {
    const res = await request.get(`${API_URL}/products`, {
      headers: { Origin: "http://localhost:5173" },
    });

    expect(res.status()).toBe(200);
    expect(res.headers()["access-control-allow-origin"]).toBe("http://localhost:5173");
  });
});

test.describe("Phân quyền ở tầng API", () => {
  test("GET /users không token -> 401", async ({ request }) => {
    const res = await request.get(`${API_URL}/users`);
    expect(res.status()).toBe(401);
  });

  test("GET /stats không token -> 401 (Module 3 để public, lộ doanh thu)", async ({ request }) => {
    const res = await request.get(`${API_URL}/stats`);
    expect(res.status()).toBe(401);
  });

  test("customer gọi route admin -> 403 chứ không phải 401", async ({ request }) => {
    const login = await request.post(`${API_URL}/auth/login`, { data: SEED_CUSTOMER });
    const { accessToken } = (await login.json()).data;

    const res = await request.get(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // 401 = "bạn là ai?", 403 = "biết bạn là ai rồi, nhưng không đủ quyền".
    expect(res.status()).toBe(403);
  });

  test("token rác -> 401, không phải 500", async ({ request }) => {
    const res = await request.get(`${API_URL}/auth/me`, {
      headers: { Authorization: "Bearer day-khong-phai-jwt" },
    });

    expect(res.status()).toBe(401);
    expect((await res.json()).message).toBe("Invalid token");
  });

  test("login không bao giờ trả về password hay hash", async ({ request }) => {
    const res = await request.post(`${API_URL}/auth/login`, { data: SEED_CUSTOMER });
    const body = await res.json();

    expect(body.data.user).not.toHaveProperty("password");
    expect(body.data.user).not.toHaveProperty("refreshToken");
    expect(JSON.stringify(body)).not.toContain("$2b$");
  });
});

test.describe("Validate đầu vào", () => {
  test("sortBy lạ bị chặn 400 trước khi tới Prisma", async ({ request }) => {
    const res = await request.get(`${API_URL}/products?sortBy=DROP+TABLE+products`);

    expect(res.status()).toBe(400);
    expect((await res.json()).success).toBe(false);
  });

  test("GET /orders (admin) luôn có meta phân trang hợp lệ, không NaN", async ({ request }) => {
    // Bài 31 — Module 3 không validate query nên `page`/`limit` là undefined và
    // buildMeta trả về NaN.
    const login = await request.post(`${API_URL}/auth/login`, {
      data: { email: "admin@cscshop.com", password: "Admin@123456" },
    });
    const { accessToken } = (await login.json()).data;

    const res = await request.get(`${API_URL}/orders`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const body = await res.json();

    expect(res.status()).toBe(200);
    expect(body.meta.page).toBe(1);
    expect(body.meta.limit).toBe(20);
    expect(Number.isNaN(body.meta.pages)).toBe(false);
  });

  test("route không tồn tại trả 404 đúng format chung", async ({ request }) => {
    const res = await request.get(`${API_URL}/khong-ton-tai`);

    expect(res.status()).toBe(404);
    expect((await res.json()).success).toBe(false);
  });
});

test.describe("Hiệu năng (Bài 37)", () => {
  test("danh mục được đặt Cache-Control public", async ({ request }) => {
    const res = await request.get(`${API_URL}/categories`);

    expect(res.headers()["cache-control"]).toContain("max-age=600");
  });

  test("/health kiểm tra cả kết nối database", async ({ request }) => {
    const res = await request.get("http://localhost:3000/health");
    const body = await res.json();

    expect(res.status()).toBe(200);
    expect(body).toMatchObject({ status: "ok", database: "connected" });
  });
});
