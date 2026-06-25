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

// Create a short-lived access token + a long-lived refresh token.
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

// Fields safe to send back to the client (never password / refreshToken).
const USER_SELECT = { id: true, name: true, email: true, role: true, createdAt: true } as const;

export async function register(input: { name: string; email: string; password: string }) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw new AppError(409, 'Email is already registered');

  // Hash the password — bcrypt adds a random salt, so equal passwords get different hashes.
  const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

  return prisma.user.create({
    data: { name: input.name, email: input.email, password: hashedPassword },
    select: USER_SELECT,
  });
}

export async function login(input: { email: string; password: string }) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  // Use ONE generic message for both "no such email" and "wrong password"
  // to avoid leaking which emails exist (user enumeration).
  const isValid = user && (await bcrypt.compare(input.password, user.password));
  if (!user || !isValid) {
    throw new AppError(401, 'Invalid email or password');
  }

  const tokens = generateTokens({ id: user.id, email: user.email, role: user.role });

  // Persist the refresh token so we can revoke it on logout.
  await prisma.user.update({ where: { id: user.id }, data: { refreshToken: tokens.refreshToken } });

  return {
    ...tokens,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
}

export async function refreshTokens(oldRefreshToken: string) {
  // 1. Verify the refresh token signature
  let payload: { id: number };
  try {
    payload = jwt.verify(oldRefreshToken, REFRESH_SECRET) as { id: number };
  } catch {
    throw new AppError(401, 'Invalid or expired refresh token');
  }

  // 2. Make sure it still matches what's stored (not revoked / rotated)
  const user = await prisma.user.findUnique({ where: { id: payload.id } });
  if (!user || user.refreshToken !== oldRefreshToken) {
    throw new AppError(401, 'Refresh token has been revoked');
  }

  // 3. Rotation: issue a brand new pair and overwrite the stored token
  const tokens = generateTokens({ id: user.id, email: user.email, role: user.role });
  await prisma.user.update({ where: { id: user.id }, data: { refreshToken: tokens.refreshToken } });
  return tokens;
}

export async function logout(userId: number) {
  // Clearing the stored refresh token makes it unusable for future /refresh calls.
  await prisma.user.update({ where: { id: userId }, data: { refreshToken: null } });
}

export async function getProfile(userId: number) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: USER_SELECT });
  if (!user) throw new AppError(404, 'User not found');
  return user;
}
