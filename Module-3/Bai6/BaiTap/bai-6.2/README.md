# Bài 6.2 — Wallet transfer (transaction)

Bài lẻ luyện **transaction nguyên tử**: chuyển tiền giữa 2 tài khoản bằng `prisma.$transaction`.

## Chạy
```bash
npm install
cp .env.example .env
npm run prisma:migrate -- --name init
npm run prisma:seed          # Alice=1000, Bob=500
npm run dev                  # http://localhost:3002
```

## Endpoints
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/accounts` | danh sách tài khoản + số dư |
| POST | `/transfer` | `{ fromId, toId, amount }` |
| GET | `/transfers` | lịch sử chuyển khoản |

## Thử
```bash
curl -X POST localhost:3002/transfer -H "Content-Type: application/json" -d '{"fromId":1,"toId":2,"amount":300}'
curl -X POST localhost:3002/transfer -H "Content-Type: application/json" -d '{"fromId":2,"toId":1,"amount":99999}'  # → 400 Insufficient balance, KHÔNG đổi số dư
```

## Ghi chú
- Trừ tiền + cộng tiền + ghi log nằm trong **1** `$transaction` → hoặc thành công hết, hoặc rollback hết.
- Nếu số dư không đủ → `throw` → toàn bộ rollback, số dư giữ nguyên.
- Dùng `Prisma.Decimal` cho tiền (không dùng Float).
