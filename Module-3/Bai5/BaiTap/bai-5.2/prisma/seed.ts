import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Same data as Bài 4.2 (5 categories, 20 products) so the two lessons stay consistent.
const categories = [
  { name: 'Điện thoại', slug: 'phone' },
  { name: 'Laptop', slug: 'laptop' },
  { name: 'Máy tính bảng', slug: 'tablet' },
  { name: 'Âm thanh', slug: 'audio' },
  { name: 'Phụ kiện', slug: 'accessory' },
];

const products = [
  { categorySlug: 'phone', title: 'iPhone 15 Pro', price: 28990000, brand: 'Apple', stock: 50, rating: 4.8, ratingCount: 320, thumbnail: 'https://picsum.photos/seed/p1/400' },
  { categorySlug: 'phone', title: 'Samsung Galaxy S24', price: 22990000, brand: 'Samsung', stock: 30, rating: 4.7, ratingCount: 210, thumbnail: 'https://picsum.photos/seed/p2/400' },
  { categorySlug: 'phone', title: 'Google Pixel 8', price: 18990000, brand: 'Google', stock: 25, rating: 4.5, ratingCount: 150, thumbnail: 'https://picsum.photos/seed/p3/400' },
  { categorySlug: 'phone', title: 'Xiaomi 14', price: 16990000, brand: 'Xiaomi', stock: 40, rating: 4.4, ratingCount: 180, thumbnail: 'https://picsum.photos/seed/p4/400' },
  { categorySlug: 'laptop', title: 'MacBook Air M2', price: 27990000, brand: 'Apple', stock: 20, rating: 4.9, ratingCount: 180, thumbnail: 'https://picsum.photos/seed/p5/400' },
  { categorySlug: 'laptop', title: 'Dell XPS 13', price: 22990000, brand: 'Dell', stock: 15, rating: 4.6, ratingCount: 140, thumbnail: 'https://picsum.photos/seed/p6/400' },
  { categorySlug: 'laptop', title: 'ASUS ROG Zephyrus', price: 35990000, brand: 'ASUS', stock: 12, rating: 4.5, ratingCount: 95, thumbnail: 'https://picsum.photos/seed/p7/400' },
  { categorySlug: 'laptop', title: 'Lenovo ThinkPad X1', price: 31990000, brand: 'Lenovo', stock: 18, rating: 4.6, ratingCount: 110, thumbnail: 'https://picsum.photos/seed/p8/400' },
  { categorySlug: 'tablet', title: 'iPad Pro 12.9', price: 23990000, brand: 'Apple', stock: 25, rating: 4.7, ratingCount: 260, thumbnail: 'https://picsum.photos/seed/p9/400' },
  { categorySlug: 'tablet', title: 'iPad Air', price: 16990000, brand: 'Apple', stock: 35, rating: 4.7, ratingCount: 240, thumbnail: 'https://picsum.photos/seed/p10/400' },
  { categorySlug: 'tablet', title: 'Galaxy Tab S9', price: 19990000, brand: 'Samsung', stock: 20, rating: 4.5, ratingCount: 120, thumbnail: 'https://picsum.photos/seed/p11/400' },
  { categorySlug: 'tablet', title: 'Xiaomi Pad 6', price: 8990000, brand: 'Xiaomi', stock: 30, rating: 4.3, ratingCount: 140, thumbnail: 'https://picsum.photos/seed/p12/400' },
  { categorySlug: 'audio', title: 'AirPods Pro 2', price: 5990000, brand: 'Apple', stock: 80, rating: 4.8, ratingCount: 540, thumbnail: 'https://picsum.photos/seed/p13/400' },
  { categorySlug: 'audio', title: 'Sony WH-1000XM5', price: 8490000, brand: 'Sony', stock: 45, rating: 4.8, ratingCount: 410, thumbnail: 'https://picsum.photos/seed/p14/400' },
  { categorySlug: 'audio', title: 'Bose QC Ultra', price: 9290000, brand: 'Bose', stock: 30, rating: 4.7, ratingCount: 200, thumbnail: 'https://picsum.photos/seed/p15/400' },
  { categorySlug: 'audio', title: 'JBL Flip 6', price: 2490000, brand: 'JBL', stock: 100, rating: 4.5, ratingCount: 350, thumbnail: 'https://picsum.photos/seed/p16/400' },
  { categorySlug: 'accessory', title: 'Anker 65W Charger', price: 890000, brand: 'Anker', stock: 120, rating: 4.6, ratingCount: 410, thumbnail: 'https://picsum.photos/seed/p17/400' },
  { categorySlug: 'accessory', title: 'Spigen Tough Case', price: 390000, brand: 'Spigen', stock: 200, rating: 4.4, ratingCount: 300, thumbnail: 'https://picsum.photos/seed/p18/400' },
  { categorySlug: 'accessory', title: 'Samsung 25W PowerBank', price: 1190000, brand: 'Samsung', stock: 90, rating: 4.3, ratingCount: 175, thumbnail: 'https://picsum.photos/seed/p19/400' },
  { categorySlug: 'accessory', title: 'Logitech MX Master 3', price: 2390000, brand: 'Logitech', stock: 60, rating: 4.8, ratingCount: 220, thumbnail: 'https://picsum.photos/seed/p20/400' },
];

async function main() {
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const created = await Promise.all(categories.map((c) => prisma.category.create({ data: c })));
  const idBySlug = new Map(created.map((c) => [c.slug, c.id]));

  await Promise.all(
    products.map((p) =>
      prisma.product.create({
        data: {
          title: p.title,
          price: p.price,
          thumbnail: p.thumbnail,
          brand: p.brand,
          stock: p.stock,
          rating: p.rating,
          ratingCount: p.ratingCount,
          categoryId: idBySlug.get(p.categorySlug)!,
        },
      })
    )
  );

  console.log(`🌱 Seeded ${created.length} categories, ${products.length} products`);
}

main().then(() => prisma.$disconnect()).catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
