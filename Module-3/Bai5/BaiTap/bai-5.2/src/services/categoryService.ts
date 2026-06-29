import prisma from '../db/prisma';

// List categories with how many products each has.
export async function findAll() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: 'asc' },
  });
  return categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug, productCount: c._count.products }));
}
