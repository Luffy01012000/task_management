# ---- Base ----
FROM oven/bun:1.3.14-debian AS base

WORKDIR /app

COPY package.json bun.lock ./
COPY .env.example ./.env


# ---- Dependencies ----
FROM base AS deps

RUN bun install --frozen-lockfile


# ---- Build ----
FROM deps AS build

COPY . .

RUN bun run build


# ---- Production ----
FROM node:24-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package.json  ./

# Install production dependencies with Bun
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/.env ./.env
COPY --from=build /app/dist ./dist

EXPOSE 5000

CMD ["node", "dist/server.js"]
