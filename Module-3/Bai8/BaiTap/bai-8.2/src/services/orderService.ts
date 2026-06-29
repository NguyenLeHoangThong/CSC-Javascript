import prisma from '../db/prisma';
import { Prisma } from '@prisma/client';
import { AppError } from '../types/api';

interface OrderInput {
  userName: string;
  userEmail: string;
  userPhone: string;
  address: string;
  provinceCode?: string | null;
  wardCode?: string | null;
  deliveryDate?: Date | null;
  note?: string | null;
  items: { productId: number; title: string; price: number; quantity: number; thumbnail: string }[];
}

// Create an order with a 4-step transaction. Either all steps succeed, or nothing is written.
// userId is optional: set when a logged-in user checks out, null for a guest.
export async function createOrder(input: OrderInput, userId?: number) {
  return prisma.$transaction(async (tx) => {
    // STEP 1: validate stock for every line
    for (const item of input.items) {
      const product = await tx.product.findUnique({ where: { id: item.productId } });
      if (!product) throw new AppError(404, `Sản phẩm id=${item.productId} không tồn tại`);
      if (product.stock < item.quantity) {
        throw new AppError(409, `"${product.title}" chỉ còn ${product.stock} sản phẩm`);
      }
    }

    // STEP 2: compute total from the snapshot prices
    const totalAmount = input.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // STEP 3: create Order + OrderItems (nested write) — snapshot title/price/thumbnail
    const order = await tx.order.create({
      data: {
        userId: userId ?? null,
        userName: input.userName,
        userEmail: input.userEmail,
        userPhone: input.userPhone,
        address: input.address,
        provinceCode: input.provinceCode ?? null,
        wardCode: input.wardCode ?? null,
        deliveryDate: input.deliveryDate ?? null,
        note: input.note ?? null,
        totalAmount: new Prisma.Decimal(totalAmount),
        items: {
          create: input.items.map((item) => ({
            productId: item.productId,
            title: item.title,
            price: new Prisma.Decimal(item.price),
            quantity: item.quantity,
            thumbnail: item.thumbnail,
          })),
        },
      },
      include: { items: true },
    });

    // STEP 4: decrement stock for every product
    await Promise.all(
      input.items.map((item) =>
        tx.product.update({ where: { id: item.productId }, data: { stock: { decrement: item.quantity } } })
      )
    );

    return order;
  });
}

export async function findById(id: number) {
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) throw new AppError(404, 'Không tìm thấy đơn hàng');
  return order;
}

// Orders that belong to one user (newest first) — for GET /orders/my
export async function findByUserId(userId: number) {
  return prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });
}

// Owner of an order (null if not found or guest order) — for authorizeOwner on GET /orders/:id
export async function getOwnerId(id: number): Promise<number | null> {
  const order = await prisma.order.findUnique({ where: { id }, select: { userId: true } });
  return order?.userId ?? null;
}

// Admin: list every order (optionally filter by status), newest first.
export async function findAll(query: { status?: string; page: number; limit: number }) {
  const { status, page, limit } = query;
  const where = status ? { status: status as any } : {};
  const [data, total] = await prisma.$transaction([
    prisma.order.findMany({ where, include: { items: true }, orderBy: { createdAt: 'desc' }, take: limit, skip: (page - 1) * limit }),
    prisma.order.count({ where }),
  ]);
  return { data, total };
}

// Admin: change order status.
export async function updateStatus(id: number, status: string) {
  await findById(id);
  return prisma.order.update({ where: { id }, data: { status: status as any } });
}
