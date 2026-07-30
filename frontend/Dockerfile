# ---- Build ----
FROM node:24-alpine AS build

RUN corepack enable

RUN corepack install --global pnpm@11.11.0
WORKDIR /app

# Copy dependency files first for Docker layer caching
COPY  package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY ./frontend/package.json ./frontend/

# Install dependencies
RUN pnpm install --filter frontend --frozen-lockfile

# Copy application source
COPY ./frontend ./frontend/

# Vite environment variable
ARG VITE_API_URL=http://localhost:5000/api
ENV VITE_API_URL=${VITE_API_URL}

# Build frontend
RUN pnpm approve-builds esbuild
RUN pnpm build:frontend


# ---- Serve ----
FROM nginx:1.27-alpine AS production

COPY --from=build /app/frontend/dist /usr/share/nginx/html
COPY ./frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
