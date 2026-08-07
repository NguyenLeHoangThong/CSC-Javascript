# Bài 40 — DevOps: multi-stage build.
#
# Why two stages: the toolchain needed to BUILD (typescript, ts-node, @types/*, the
# whole src/ tree) is dead weight at RUNTIME. Building in one stage and copying only
# the artefacts into a clean base keeps the final image small and shrinks the attack
# surface — a compiler that is not in the image cannot be abused.
#
# Base image note: `-bookworm-slim` (glibc) rather than `-alpine` (musl), because
# `bcrypt` ships prebuilt glibc binaries. On alpine npm would have to compile it from
# source, which needs python3/make/g++ in the image.

# ─────────────────────────── Stage 1: builder ───────────────────────────
FROM node:22-bookworm-slim AS builder

WORKDIR /app

# Copy manifests FIRST. Docker caches each layer, so as long as package*.json are
# unchanged the (slow) install layer is reused even when src/ changes.
COPY package*.json ./
# `npm ci` installs exactly what package-lock.json pins — reproducible, unlike `npm i`.
RUN npm ci

# Prisma Client is generated code; it must exist before tsc type-checks the app.
COPY prisma ./prisma
RUN npx prisma generate

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Drop dev dependencies so the next stage can copy a production-only node_modules.
RUN npm prune --omit=dev

# ────────────────────────── Stage 2: production ─────────────────────────
FROM node:22-bookworm-slim AS production

# Prisma's query engine needs OpenSSL, which slim images do not ship.
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production

WORKDIR /app

# Copy only what the running app needs: compiled JS, production deps, the Prisma
# schema + generated client. No src/, no tests, no tsconfig.
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY package.json ./

# Never run as root: a container escape then starts from an unprivileged account.
# The official node image already provides the `node` user (uid 1000).
USER node

EXPOSE 3000

# Docker's own liveness probe. Compose (and orchestrators) use it to decide whether
# the container is actually serving, not merely started.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:3000/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# Run the compiled entry point directly — exec form, so node is PID 1 and receives
# SIGTERM for the graceful shutdown implemented in server.ts.
CMD ["node", "dist/server.js"]
