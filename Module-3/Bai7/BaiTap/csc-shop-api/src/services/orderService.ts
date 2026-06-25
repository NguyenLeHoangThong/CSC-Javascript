import prisma from '../db/prisma';
import { Prisma } from '@prisma/client';
import { AppError } from '../types/api';
import { buildSkip } from '../utils/pagination';

interface OrderInput {
  userId?: number | null; // set when the buyer is logged in (Bài 7)
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

// Create an order inside ONE transaction. This is the key idea of Bài 6:
// either every step succeeds (order created + stock reduced) or nothing is written.
export async function create(input: OrderInput) {
  return prisma.$transaction(async (tx) => {
    let totalAmount = new Prisma.Decimal(0);
    const itemsData: { productId: number; quantity: number; price: Prisma.Decimal }[] = [];

    // 1. Validate each line: product exists and has enough stock. Compute the total.
    for (const item of input.items) {
      const product = await tx.product.findUnique({ where: { id: item.productId } });
      if (!product) throw new AppError(404, `Product ${item.productId} not found`);
      if (product.stock < item.quantity) {
        throw new AppError(409, `"${product.title}" only has ${product.stock} left in stock`);
      }

      itemsData.push({ productId: product.id, quantity: item.quantity, price: product.price });
      totalAmount = totalAmount.plus(product.price.times(item.quantity));
    }

    // 2. Create the order together with its items (nested write).
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
      include: { items: { include: { product: { select: { title: true, thumbnail: true } } } } },
    });

    // 3. Decrement stock for each product — still inside the transaction.
    for (const item of itemsData) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return order;
  });
}

export async function findAll(query: { status?: string; page: number; limit: number }) {
  const { status, page, limit } = query;
  const where: Prisma.OrderWhereInput = { ...(status && { status: status as any }) };

  const [orders, total] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      include: { items: true },
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
    include: { items: { include: { product: { select: { title: true, thumbnail: true } } } } },
    orderBy: { createdAt: 'desc' },
  });
}

export async function findById(id: number) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: { select: { title: true, thumbnail: true } } } } },
  });
  if (!order) throw new AppError(404, 'Order not found');
  return order;
}

export async function updateStatus(id: number, status: string) {
  return prisma.order.update({
    where: { id },
    data: { status: status as any },
  });
}
