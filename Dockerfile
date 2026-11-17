FROM oven/bun:1@sha256:1d22548f177f4ff38e0c15baa3c2c46c6c2060ba2d1bc573bb4720b407548f1d AS base
WORKDIR /app

FROM base AS install
COPY package.json bun.lock ./
# The concurrency cap is not cosmetic: the deploy box's network made the
# default parallel fetch flake mid-install. Kept in the repo rather than
# hand-edited in the prod checkout, where it broke `git pull --ff-only`.
RUN bun install --frozen-lockfile --network-concurrency 4

FROM node:22-slim@sha256:e9f565d32859f0cbfb52125eafe8be39390f24dac302dc3cdf566e8ba3ab21ee AS build
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
