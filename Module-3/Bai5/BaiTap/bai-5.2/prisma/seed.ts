import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.movie.deleteMany();
  await prisma.genre.deleteMany();

  const action = await prisma.genre.create({ data: { name: 'Action' } });
  const drama = await prisma.genre.create({ data: { name: 'Drama' } });

  await prisma.movie.createMany({
    data: [
      { title: 'Mad Max: Fury Road', year: 2015, rating: 8.1, genreId: action.id },
      { title: 'John Wick', year: 2014, rating: 7.4, genreId: action.id },
      { title: 'The Shawshank Redemption', year: 1994, rating: 9.3, genreId: drama.id },
    ],
  });
  console.log('🌱 Seeded genres + movies');
}

main().then(() => prisma.$disconnect());
