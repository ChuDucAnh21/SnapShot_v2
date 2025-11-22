# syntax=docker/dockerfile:1.7

########################
# 1) Base with pnpm
########################
FROM node:22-slim AS base
# Setup pnpm via Corepack and a predictable PNPM_HOME
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable
WORKDIR /app

########################
# 2) Install deps (cached)
########################
FROM base AS deps
# Copy only files needed to resolve dependencies
COPY package.json pnpm-lock.yaml ./
# Use BuildKit cache for pnpm store (speeds up rebuilds)
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile

########################
# 3) Build (Next.js standalone)
########################
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
# Copy the rest of the app
COPY . .
# Recommended: disable telemetry in CI builds
ENV NEXT_TELEMETRY_DISABLED=1
# Build the application
RUN pnpm run build

########################
# 4) Runtime (tiny)
########################
FROM node:22-slim AS runner
ENV NODE_ENV=production
WORKDIR /app

# Copy the minimal standalone server and required assets
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

# Run as the non-root 'node' user provided by the base image
USER node

# Default local port; on Cloud Run just set $PORT
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
EXPOSE 3000

# The standalone build outputs server.js
CMD ["node", "server.js"]