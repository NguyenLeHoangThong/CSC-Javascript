# Bài 9.1 — Production hardening

Bài lẻ luyện các middleware "must-have" khi đưa API lên production: **helmet**, **morgan**,
**express-rate-limit**, và **central error handler**.

## Chạy
```bash
npm install
cp .env.example .env
npm run dev    # http://localhost:3005
```

## Thử
```bash
curl -I localhost:3005/quotes          # xem secure headers (helmet)
for i in $(seq 1 7); do curl -s -o /dev/null -w "%{http_code}\n" localhost:3005/quotes; done  # request thứ 6+ → 429
curl localhost:3005/boom               # lỗi được error handler bắt → 500 JSON gọn
```

## Ghi chú
- **Thứ tự middleware**: helmet → cors → morgan → json → rate limit → routes → 404 → error handler.
- Error handler phải có **4 tham số** `(err, req, res, next)` và đặt **cuối cùng**.
- Rate limit ở đây để nhỏ (5 req/10s) cho dễ test trên lớp.
