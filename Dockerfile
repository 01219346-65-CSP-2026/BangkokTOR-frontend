FROM oven/bun:1 AS base
WORKDIR /app

FROM base AS install
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM node:22-slim AS build
WORKDIR /app
COPY --from=install /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS release
ENV NODE_ENV=production
COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static

EXPOSE 3003
ENV PORT=3003
ENV HOSTNAME=0.0.0.0

USER bun
ENTRYPOINT ["bun", "run", "server.js"]
