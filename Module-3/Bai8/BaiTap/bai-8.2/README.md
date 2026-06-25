# Bài 8.2 — Ownership

Bài lẻ luyện kiểm tra **chủ sở hữu**: user chỉ sửa/xóa note của chính mình; **admin bypass**.

## Chạy
```bash
npm install
cp .env.example .env
npm run dev    # http://localhost:3004
```

Tài khoản seed: `admin@demo.com/admin123`, `alice@demo.com/alice123`, `bob@demo.com/bob123`.

## Endpoints
| Method | Endpoint | Quyền |
|--------|----------|-------|
| POST | `/login` | công khai |
| GET | `/notes` | đăng nhập (user thấy note mình, admin thấy hết) |
| POST | `/notes` | đăng nhập (note thuộc về mình) |
| PATCH/DELETE | `/notes/:id` | **chủ note** hoặc **admin** (người khác → 403) |

## Ghi chú
- `authorizeNoteOwner` tra note theo `:id`, so `ownerId` với `req.user.id`; admin được bỏ qua.
- Không tìm thấy note → 404; không phải chủ → 403.
