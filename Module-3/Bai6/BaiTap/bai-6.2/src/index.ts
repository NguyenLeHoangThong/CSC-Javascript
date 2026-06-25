import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient, Prisma } from '@prisma/client';

// ── Bài 6.2: atomic money transfer with prisma.$transaction ──
// The whole point: debit + credit + log must ALL succeed or ALL roll back.
const app = express();
const PORT = process.env.PORT || 3002;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/accounts', async (req: Request, res: Response) => {
  const accounts = await prisma.account.findMany({ orderBy: { id: 'asc' } });
  res.json(accounts);
});

// POST /transfer { fromId, toId, amount }
app.post('/transfer', async (req: Request, res: Response) => {
  const { fromId, toId, amount } = req.body ?? {};
  if (!fromId || !toId || !amount || amount <= 0) {
    return res.status(400).json({ message: 'fromId, toId and a positive amount are required' });
  }
  if (fromId === toId) {
    return res.status(400).json({ message: 'Cannot transfer to the same account' });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const from = await tx.account.findUnique({ where: { id: Number(fromId) } });
      const to = await tx.account.findUnique({ where: { id: Number(toId) } });
      if (!from || !to) throw new Error('Account not found');

      const amt = new Prisma.Decimal(amount);
      // Insufficient funds → throw → the WHOLE transaction rolls back
      if (from.balance.lessThan(amt)) throw new Error('Insufficient balance');

      await tx.account.update({ where: { id: from.id }, data: { balance: { decrement: amt } } });
      await tx.account.update({ where: { id: to.id }, data: { balance: { increment: amt } } });
      const transfer = await tx.transfer.create({ data: { fromId: from.id, toId: to.id, amount: amt } });

      return transfer;
    });

    res.status(201).json({ message: 'Transfer complete', transfer: result });
  } catch (err: any) {
    // 'Insufficient balance' / 'Account not found' → 400
    res.status(400).json({ message: err.message });
  }
});

app.get('/transfers', async (req: Request, res: Response) => {
  const transfers = await prisma.transfer.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(transfers);
});

app.listen(PORT, () => console.log(`💸 Bài 6.2 wallet-transfer running on http://localhost:${PORT}`));
