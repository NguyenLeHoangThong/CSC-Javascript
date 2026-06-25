import prisma from '../src/db/prisma';
import { slugify } from '../src/utils/slug';

// Categories chosen to match the React storefront's category filter.
const categories = [
  { name: 'Smartphones', description: 'Latest phones from top brands' },
  { name: 'Laptops', description: 'Work and gaming laptops' },
  { name: 'Tablets', description: 'Tablets and 2-in-1 devices' },
  { name: 'Mobile Accessories', description: 'Cases, chargers and more' },
];

// Product seed grouped by category slug.
const products = [
  { categorySlug: 'smartphones', title: 'iPhone 15 Pro', price: 999, brand: 'Apple', stock: 40, rating: 4.8, ratingCount: 320, thumbnail: 'https://picsum.photos/seed/iphone15/400', description: 'A17 Pro chip, titanium design, 48MP camera.' },
  { categorySlug: 'smartphones', title: 'Samsung Galaxy S24 Ultra', price: 1199, brand: 'Samsung', stock: 30, rating: 4.7, ratingCount: 210, thumbnail: 'https://picsum.photos/seed/s24ultra/400', description: 'Snapdragon 8 Gen 3, S-Pen, 200MP camera.' },
  { categorySlug: 'smartphones', title: 'Google Pixel 8', price: 699, brand: 'Google', stock: 25, rating: 4.5, ratingCount: 150, thumbnail: 'https://picsum.photos/seed/pixel8/400', description: 'Tensor G3, best-in-class computational photography.' },
  { categorySlug: 'laptops', title: 'MacBook Pro 14"', price: 1999, brand: 'Apple', stock: 18, rating: 4.9, ratingCount: 180, thumbnail: 'https://picsum.photos/seed/mbp14/400', description: 'M3 Pro, Liquid Retina XDR display.' },
  { categorySlug: 'laptops', title: 'Dell XPS 15', price: 1499, brand: 'Dell', stock: 22, rating: 4.6, ratingCount: 140, thumbnail: 'https://picsum.photos/seed/xps15/400', description: 'Intel Core i7, OLED display, premium build.' },
  { categorySlug: 'laptops', title: 'ASUS ROG Zephyrus', price: 1799, brand: 'ASUS', stock: 12, rating: 4.5, ratingCount: 95, thumbnail: 'https://picsum.photos/seed/rog/400', description: 'RTX 4070, 240Hz display, gaming powerhouse.' },
  { categorySlug: 'tablets', title: 'iPad Air', price: 599, brand: 'Apple', stock: 35, rating: 4.7, ratingCount: 260, thumbnail: 'https://picsum.photos/seed/ipadair/400', description: 'M2 chip, 10.9-inch Liquid Retina display.' },
  { categorySlug: 'tablets', title: 'Samsung Galaxy Tab S9', price: 799, brand: 'Samsung', stock: 20, rating: 4.5, ratingCount: 120, thumbnail: 'https://picsum.photos/seed/tabs9/400', description: 'AMOLED display, S-Pen included, water resistant.' },
  { categorySlug: 'mobile-accessories', title: 'AirPods Pro 2', price: 249, brand: 'Apple', stock: 80, rating: 4.8, ratingCount: 540, thumbnail: 'https://picsum.photos/seed/airpods/400', description: 'Active noise cancellation, USB-C charging case.' },
  { categorySlug: 'mobile-accessories', title: 'Anker 65W Charger', price: 39, brand: 'Anker', stock: 120, rating: 4.6, ratingCount: 410, thumbnail: 'https://picsum.photos/seed/anker/400', description: 'GaN II, compact fast charger for phone & laptop.' },
  { categorySlug: 'mobile-accessories', title: 'Spigen Tough Armor Case', price: 19, brand: 'Spigen', stock: 200, rating: 4.4, ratingCount: 300, thumbnail: 'https://picsum.photos/seed/spigen/400', description: 'Military-grade drop protection with kickstand.' },
  { categorySlug: 'mobile-accessories', title: 'Samsung 25W Power Bank', price: 49, brand: 'Samsung', stock: 90, rating: 4.3, ratingCount: 175, thumbnail: 'https://picsum.photos/seed/powerbank/400', description: '10000mAh, USB-C super fast charging.' },
];

async function main() {
  console.log('🌱 Seeding CSC Shop...');

  // Reset business data (products first because they reference categories)
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // ── Categories ──
  const createdCategories = await Promise.all(
    categories.map((c) =>
      prisma.category.create({
        data: { name: c.name, slug: slugify(c.name), description: c.description },
      })
    )
  );
  console.log(`✅ Categories: ${createdCategories.length}`);

  // Map slug -> id so we can attach products to the right category
  const categoryIdBySlug = new Map(createdCategories.map((c) => [c.slug, c.id]));

  // ── Products ──
  await Promise.all(
    products.map((p) =>
      prisma.product.create({
        data: {
          title: p.title,
          slug: slugify(p.title),
          description: p.description,
          price: p.price,
          thumbnail: p.thumbnail,
          brand: p.brand,
          stock: p.stock,
          rating: p.rating,
          ratingCount: p.ratingCount,
          categoryId: categoryIdBySlug.get(p.categorySlug)!,
        },
      })
    )
  );
  console.log(`✅ Products: ${products.length}`);
  console.log('🎉 Seed complete!');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error('❌ Seed error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
