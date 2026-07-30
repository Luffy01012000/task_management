# ---- Base ----
FROM node:24-alpine AS base

WORKDIR /app

RUN corepack enable

RUN corepack install --global pnpm@11.11.0




# ---- Dependencies ----
FROM base AS deps

COPY  package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY ./backend/package.json ./backend/

RUN pnpm install --filter backend --frozen-lockfile


# ---- Build ----
FROM deps AS build

COPY ./backend ./backend
RUN pnpm approve-builds esbuild
RUN pnpm build:backend


# ---- Production ----
FROM node:24-alpine AS production

RUN corepack enable

RUN corepack install --global pnpm@11.11.0

WORKDIR /app

ENV NODE_ENV=production

COPY  package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY ./backend/package.json ./backend/

RUN pnpm install --prod --filter backend --ignore-script --frozen-lockfile
COPY --from=build /app/backend/dist ./backend/dist

EXPOSE 5000

CMD ["node", "backend/dist/server.js"]
