import prisma from '../db/prisma';
import { Prisma, OrderStatus } from '@prisma/client';
import { AppError } from '../types/api';
import { buildSkip } from '../utils/pagination';
import { USER_PUBLIC_SELECT } from '../constants/userSelect';

// Bài 31 — Clean Code & Refactor.
//
// What changed vs Module 3:
//   1. `status as any` -> the real Prisma `OrderStatus` enum (a typo is now a
//      compile error instead of a runtime Postgres error).
//   2. `findAll(query: { ... })` -> an exported `OrderQuery` interface, validated
//      by orderQuerySchema before it reaches this file.
//   3. The per-item `findUnique` loop inside the transaction (N+1) -> one
//      `findMany({ where: { id: { in: [...] } } })`.
//   4. The per-item stock `update` loop -> `updateMany` per product… kept as a loop
//      because each product needs its own decrement value, but now outside the
//      validation pass so the transaction is as short as possible.

export interface OrderInput {
  userId?: number | null; // set when the buyer is logged in; null = guest checkout
  customerName: string;
  email: string;
  phone: string;
  address: string;
  provinceCode?: string | null;
  wardCode?: string | null;
  note?: string | null;
  deliveryDate?: string | null;
  items: { productId: number; quantity: number }[];
}

export interface OrderQuery {
  status?: OrderStatus;
  page: number;
  limit: number;
}

// Every list endpoint includes the same relations — one constant, no drift.
const ORDER_INCLUDE = {
  items: { include: { product: { select: { title: true, thumbnail: true } } } },
} satisfies Prisma.OrderInclude;

// Create an order inside ONE transaction: either the order is written AND stock is
// reduced, or nothing happens at all.
export async function create(input: OrderInput) {
  // Merge duplicate lines first ("2 × iPhone" sent twice = quantity 4), otherwise the
  // stock check below would validate each line against the full stock and oversell.
  const quantityByProductId = new Map<number, number>();
  for (const item of input.items) {
    quantityByProductId.set(item.productId, (quantityByProductId.get(item.productId) ?? 0) + item.quantity);
  }
  const productIds = [...quantityByProductId.keys()];

  return prisma.$transaction(async (tx) => {
    // 1. ONE query for every product in the cart (was: one query per item).
    const products = await tx.product.findMany({ where: { id: { in: productIds } } });
    const productById = new Map(products.map((p) => [p.id, p]));

    let totalAmount = new Prisma.Decimal(0);
    const itemsData: { productId: number; quantity: number; price: Prisma.Decimal }[] = [];

    // 2. Validate every line and compute the total from DB prices — never from prices
    //    the client sent, which a user could tamper with.
    for (const [productId, quantity] of quantityByProductId) {
      const product = productById.get(productId);
      if (!product) throw new AppError(404, `Product ${productId} not found`);
      if (product.stock < quantity) {
        throw new AppError(409, `"${product.title}" only has ${product.stock} left in stock`);
      }

      itemsData.push({ productId, quantity, price: product.price });
      totalAmount = totalAmount.plus(product.price.times(quantity));
    }

    // 3. Create the order together with its items (nested write).
    const order = await tx.order.create({
      data: {
        userId: input.userId ?? null,
        customerName: input.customerName,
        email: input.email,
        phone: input.phone,
        address: input.address,
        provinceCode: input.provinceCode ?? null,
        wardCode: input.wardCode ?? null,
        note: input.note ?? null,
        deliveryDate: input.deliveryDate ? new Date(input.deliveryDate) : null,
        totalAmount,
        items: { create: itemsData },
      },
      include: ORDER_INCLUDE,
    });

    // 4. Decrement stock — still inside the transaction, so a failure here rolls the
    //    order back too.
    await Promise.all(
      itemsData.map((item) =>
        tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      )
    );

    return order;
  });
}

export async function findAll(query: OrderQuery) {
  const { status, page, limit } = query;
  const where: Prisma.OrderWhereInput = { ...(status && { status }) };

  const [orders, total] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      include: { ...ORDER_INCLUDE, user: { select: USER_PUBLIC_SELECT } },
      orderBy: { createdAt: 'desc' },
      skip: buildSkip(page, limit),
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return { data: orders, total };
}

// Orders that belong to a specific logged-in user (newest first).
export async function findByUser(userId: number) {
  return prisma.order.findMany({
    where: { userId },
    include: ORDER_INCLUDE,
    orderBy: { createdAt: 'desc' },
  });
}

// Return the userId that owns an order (null if the order does not exist).
// Used by authorizeOwner so a customer can only read their own order.
export async function findOwnerId(id: number): Promise<number | null> {
  const order = await prisma.order.findUnique({ where: { id }, select: { userId: true } });
  return order?.userId ?? null;
}

export async function findById(id: number) {
  const order = await prisma.order.findUnique({ where: { id }, include: ORDER_INCLUDE });
  if (!order) throw new AppError(404, 'Order not found');
  return order;
}

export async function updateStatus(id: number, status: OrderStatus) {
  return prisma.order.update({ where: { id }, data: { status } });
}
