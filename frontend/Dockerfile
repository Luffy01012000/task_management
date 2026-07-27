# ---- Build ----
FROM oven/bun:1.3.14-debian AS build

WORKDIR /app

# Copy dependency files first for Docker layer caching
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy application source
COPY . .

# Vite environment variable
ARG VITE_API_URL=http://localhost:5000/api
ENV VITE_API_URL=${VITE_API_URL}

# Build frontend
RUN bun run build


# ---- Serve ----
FROM nginx:1.27-alpine AS production

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]