import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import prisma from '../db/prisma';
import { AppError } from '../types/api';

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES || '15m';
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || '7d';

function generateTokens(user: { id: number; email: string; role: string }) {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    ACCESS_SECRET,
    { expiresIn: ACCESS_EXPIRES } as SignOptions
  );
  const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES } as SignOptions);
  return { accessToken, refreshToken };
}

export async function register(input: { name: string; email: string; password: string }) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw new AppError(409, 'Email đã được đăng ký');
  const password = await bcrypt.hash(input.password, SALT_ROUNDS);
  return prisma.user.create({
    data: { name: input.name, email: input.email, password },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
}

export async function login(input: { email: string; password: string }) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  // Same message for both cases → avoid user enumeration
  const ok = user && (await bcrypt.compare(input.password, user.password));
  if (!user || !ok) throw new AppError(401, 'Email hoặc mật khẩu không đúng');

  const tokens = generateTokens(user);
  await prisma.user.update({ where: { id: user.id }, data: { refreshToken: tokens.refreshToken } });
  return { ...tokens, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
}

export async function refreshTokens(oldRefreshToken: string) {
  let payload: { id: number };
  try {
    payload = jwt.verify(oldRefreshToken, REFRESH_SECRET) as { id: number };
  } catch {
    throw new AppError(401, 'Refresh token không hợp lệ hoặc đã hết hạn');
  }
  const user = await prisma.user.findUnique({ where: { id: payload.id } });
  // Must match what we stored → otherwise it was rotated or revoked
  if (!user || user.refreshToken !== oldRefreshToken) throw new AppError(401, 'Refresh token đã bị thu hồi');

  // Rotation: brand-new pair, overwrite stored token
  const tokens = generateTokens(user);
  await prisma.user.update({ where: { id: user.id }, data: { refreshToken: tokens.refreshToken } });
  return tokens;
}

export async function logout(userId: number) {
  await prisma.user.update({ where: { id: userId }, data: { refreshToken: null } });
}

export async function getProfile(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  if (!user) throw new AppError(404, 'Không tìm thấy người dùng');
  return user;
}
