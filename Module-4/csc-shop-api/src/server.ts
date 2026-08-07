import app from './app';
import prisma from './db/prisma';

// Bài 32 / Bài 39 — the ONLY job of this file is to bind a port and shut down cleanly.
// Everything else lives in app.ts so tests can import the app without a listening socket.
const port = Number(process.env.PORT) || 3000;

const server = app.listen(port, () => {
  console.log(`🛒 CSC Shop API running on http://localhost:${port} (${process.env.NODE_ENV ?? 'development'})`);
});

// Render sends SIGTERM before replacing a container. Finish in-flight requests and
// release the Postgres connections instead of dropping them — on a free tier with
// ~97 connections, leaked pools are what eventually breaks deploys.
async function shutdown(signal: string) {
  console.log(`\n${signal} received — shutting down...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });

  // Do not hang forever if a request is stuck.
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));

export default server;
