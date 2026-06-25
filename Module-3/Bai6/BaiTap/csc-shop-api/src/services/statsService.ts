import prisma from '../db/prisma';

// Bài 6: aggregate queries — count(), aggregate(), groupBy().
export async function getStats() {
  const [totalProducts, totalCategories, totalOrders, revenueAgg, stockAgg] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.count(),
    // Sum of all order totals = gross revenue
    prisma.order.aggregate({ _sum: { totalAmount: true } }),
    // Total units currently in stock
    prisma.product.aggregate({ _sum: { stock: true } }),
  ]);

  // Group orders by status -> [{ status, count }]
  const ordersByStatus = await prisma.order.groupBy({
    by: ['status'],
    _count: true,
    orderBy: { status: 'asc' },
  });

  // Product count per category (uses the relation _count)
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: 'asc' },
  });

  return {
    summary: {
      totalProducts,
      totalCategories,
      totalOrders,
      totalStock: stockAgg._sum.stock ?? 0,
      revenue: revenueAgg._sum.totalAmount ? Number(revenueAgg._sum.totalAmount) : 0,
    },
    ordersByStatus: ordersByStatus.map((o) => ({ status: o.status, count: o._count })),
    productsByCategory: categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      productCount: c._count.products,
    })),
  };
}
