import { describe, it, expect, vi, beforeEach } from 'vitest';

// Bài 32 — testing a service that talks to the database.
//
// The DB is replaced with a mock: the test must run in CI where no Postgres exists,
// and it must be fast. `vi.mock` is HOISTED above every import, so the mock object it
// references must be hoisted too — that is what `vi.hoisted` is for. Declaring it as a
// plain `const` fails with "Cannot access 'prismaMock' before initialization".
const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('../../db/prisma', () => ({ default: prismaMock }));

import * as authService from '../authService';
import { AppError } from '../../types/api';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('authService.register', () => {
  it('rejects an email that is already registered with 409', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: 1, email: 'taken@shop.com' });

    // rejects.toThrow only checks the message, so assert the status code explicitly.
    await expect(
      authService.register({ name: 'Test', email: 'taken@shop.com', password: 'Passw0rd!' })
    ).rejects.toMatchObject({ statusCode: 409 });

    expect(prismaMock.user.create).not.toHaveBeenCalled();
  });

  it('hashes the password before it reaches the database', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue({ id: 1, name: 'Test', email: 'new@shop.com', role: 'customer' });

    const plainPassword = 'Passw0rd!';
    await authService.register({ name: 'Test', email: 'new@shop.com', password: plainPassword });

    const savedData = prismaMock.user.create.mock.calls[0][0].data;
    expect(savedData.password).not.toBe(plainPassword);
    // bcrypt hashes always start with $2a$ / $2b$ and are 60 chars long.
    expect(savedData.password).toMatch(/^\$2[aby]\$/);
    expect(savedData.password).toHaveLength(60);
  });

  it('never selects the password or refreshToken column', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue({ id: 1, name: 'Test', email: 'new@shop.com', role: 'customer' });

    await authService.register({ name: 'Test', email: 'new@shop.com', password: 'Passw0rd!' });

    // This is the Bài 36 rule enforced by a test: USER_SELECT is an allow-list, so a
    // future `select` change that adds `password: true` fails here.
    const select = prismaMock.user.create.mock.calls[0][0].select;
    expect(select).not.toHaveProperty('password');
    expect(select).not.toHaveProperty('refreshToken');
    expect(select).toMatchObject({ id: true, name: true, email: true, role: true });
  });
});

describe('authService.login', () => {
  it('gives the SAME error for an unknown email and a wrong password', async () => {
    // Leaking "email not found" vs "wrong password" tells an attacker which emails
    // exist on the site (user enumeration).
    prismaMock.user.findUnique.mockResolvedValue(null);
    const unknownEmail = await authService
      .login({ email: 'nobody@shop.com', password: 'whatever' })
      .catch((e: AppError) => e);

    prismaMock.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'real@shop.com',
      role: 'customer',
      // a valid bcrypt hash of some OTHER password
      password: '$2b$12$C6UzMDM.H6dfI/f/IKcEe.7YrgNz3.7CkPZ5RfeZ3Y1vYK6qdVQ2K',
    });
    const wrongPassword = await authService
      .login({ email: 'real@shop.com', password: 'definitely-wrong' })
      .catch((e: AppError) => e);

    expect((unknownEmail as AppError).statusCode).toBe(401);
    expect((wrongPassword as AppError).message).toBe((unknownEmail as AppError).message);
  });
});
