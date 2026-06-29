# Bài 8.1 — API Quản lý Dự án (Authorization)

**Bài tập độc lập** của Bài 8. Luyện 2 cơ chế phân quyền: **RBAC** (`authorize(...roles)`) và
**Ownership** (`authorizeOwner(getOwnerId)` — admin bypass).

## 🎯 Kiến thức
- `authorize(...roles)`: sai role → 403
- `authorizeOwner(getOwnerId)`: không phải chủ sở hữu → 403; **admin luôn bypass**; không tìm thấy → 404
- Thứ tự middleware: `authenticate` (401) → `authorize`/`authorizeOwner` (403) → `validate` → controller
- Cùng 1 factory `authorizeOwner` dùng cho 2 callback khác nhau (project.ownerId vs task.assigneeId)

## 🚀 Chạy
```bash
npm install
cp .env.example .env          # điền JWT secrets
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run dev                  # http://localhost:3000
```
Tài khoản seed (pass `Password123`): `admin@pm.com` (admin), `manager@pm.com` (manager), `user@pm.com` (user).

## 🛡️ Permission Matrix
| Endpoint | user | manager | admin |
|----------|:----:|:-------:|:-----:|
| GET `/projects`, `/projects/:id` | ✅ | ✅ | ✅ |
| POST `/projects` | ✅ | ✅ | ✅ |
| PATCH/DELETE `/projects/:id` | chỉ owner | chỉ owner | ✅ (bypass) |
| GET `/projects/:id/tasks` | ✅ | ✅ | ✅ |
| POST `/projects/:id/tasks` | ❌ | ✅ | ✅ |
| PATCH `/tasks/:id` | chỉ assignee | chỉ assignee | ✅ (bypass) |
| DELETE `/tasks/:id` | ❌ | ❌ | ✅ |

## ✅ Tự kiểm tra
```bash
# user tạo task trong project → 403 (chỉ manager/admin)
# manager sửa project của người khác → 403 (không phải owner)
# admin sửa/xóa bất kỳ → 200 (bypass)
```

## ➡️ Buổi sau
Bài 8.2 — phân quyền admin cho **shop-backend** (products/categories + user mgmt + `/orders/my`).
