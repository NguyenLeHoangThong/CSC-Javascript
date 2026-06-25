import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import prisma from '../db/prisma';
import { AppError } from '../types/api';

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES || '15m';
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || '7d';

interface TokenUser {
  id: number;
  email: string;
  role: string;
}

// Helper: tạo cặp access + refresh token
function generateTokens(user: TokenUser) {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    ACCESS_SECRET,
    { expiresIn: ACCESS_EXPIRES } as SignOptions
  );
  const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES,
  } as SignOptions);
  return { accessToken, refreshToken };
}

// ============================================
// Register — đăng ký tài khoản mới
// ============================================
export async function register(input: {
  name: string;
  email: string;
  password: string;
}) {
  // 1. Kiểm tra email đã tồn tại chưa
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  });
  if (existing) throw new AppError(409, 'Email đã được đăng ký');

  // 2. Hash password — KHÔNG bao giờ lưu plain text
  const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

  // 3. Lưu vào database, chỉ select các field an toàn (không trả password)
  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
}

// ============================================
// Login — đăng nhập và cấp token
// ============================================
export async function login(input: { email: string; password: string }) {
  // 1. Tìm user theo email
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  // 2. Kiểm tra user tồn tại VÀ password đúng — dùng chung 1 thông báo lỗi
  //    để tránh user enumeration attack (không tiết lộ email có tồn tại hay không)
  const isValid =
    user && (await bcrypt.compare(input.password, user.password));
  if (!user || !isValid) {
    throw new AppError(401, 'Email hoặc mật khẩu không đúng');
  }

  // 3. Tạo cặp token
  const tokens = generateTokens({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  // 4. Lưu refresh token vào DB — để có thể revoke khi logout
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: tokens.refreshToken },
  });

  // 5. Trả về tokens và thông tin user (không có password)
  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

// ============================================
// Refresh — cấp cặp token mới (rotation)
// ============================================
export async function refreshTokens(oldRefreshToken: string) {
  // 1. Verify chữ ký của refresh token
  let payload: { id: number };
  try {
    payload = jwt.verify(oldRefreshToken, REFRESH_SECRET) as { id: number };
  } catch {
    throw new AppError(401, 'Refresh token không hợp lệ hoặc đã hết hạn');
  }

  // 2. Kiểm tra refresh token có khớp với DB không (đảm bảo chưa bị revoke)
  const user = await prisma.user.findUnique({ where: { id: payload.id } });
  if (!user || user.refreshToken !== oldRefreshToken) {
    throw new AppError(401, 'Refresh token đã bị thu hồi');
  }

  // 3. Tạo cặp token mới — Refresh Token Rotation
  const tokens = generateTokens({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  // 4. Cập nhật refresh token mới vào DB — token cũ không dùng lại được
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: tokens.refreshToken },
  });

  return tokens;
}

// ============================================
// Logout — revoke refresh token
// ============================================
export async function logout(userId: number) {
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });
}

// ============================================
// Lấy thông tin user hiện tại
// ============================================
export async function getProfile(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
  if (!user) throw new AppError(404, 'Không tìm thấy người dùng');
  return user;
}
