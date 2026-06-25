# Bài 7.2 — Refresh token rotation

Bài lẻ luyện cơ chế **access token + refresh token** và **rotation/revoke**.

## Chạy
```bash
npm install
cp .env.example .env
npm run dev    # http://localhost:3002
```

## Endpoints
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/register` | tạo user |
| POST | `/login` | trả `{ accessToken, refreshToken }` |
| POST | `/refresh` | đưa refreshToken → trả cặp token MỚI (rotation) |
| POST | `/logout` | thu hồi refreshToken |

## Ghi chú
- Access token ngắn hạn (15m), refresh token dài hạn (7d).
- Mỗi user chỉ lưu **1** refresh token hợp lệ → gọi `/refresh` khiến token cũ vô hiệu (rotation).
- Token đã `/logout` thì `/refresh` trả 401 "revoked".
