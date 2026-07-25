FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
RUN npm install -g pnpm@latest

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/ ./packages
COPY apps/ ./apps

RUN pnpm install --frozen-lockfile

COPY tsconfig.json next.config.ts next-env.d.ts postcss.config.mjs eslint.config.mjs ./
COPY prisma/ ./prisma
COPY src/ ./src
COPY public/ ./public

RUN pnpm build

FROM node:20-alpine AS runner
RUN apk add --no-cache curl

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --link /app/public ./public
COPY --from=builder --link /app/.next ./.next
COPY --from=builder --link /app/node_modules ./node_modules
COPY --from=builder --link /app/package.json ./package.json
COPY --from=builder --link /app/prisma ./prisma

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["pnpm", "start"]
