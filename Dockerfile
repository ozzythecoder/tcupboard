FROM node:24-alpine AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME/bin:$PATH"
RUN corepack enable

# Build all services
FROM base AS build
WORKDIR /usr/src/app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/web/package.json ./apps/web/
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared/package.json ./packages/shared/
COPY packages/extensions/slug/package.json ./packages/extensions/slug/
COPY packages/extensions/tiptap/package.json ./packages/extensions/tiptap/

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY . .
RUN pnpm run -r build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm deploy --filter=web --prod /app/web && \
    pnpm deploy --filter=backend --prod /app/api && \
    pnpm deploy --filter=shared --prod /app/shared && \
    pnpm deploy --filter=slug --prod /app/extensions/slug && \
    pnpm deploy --filter=tiptap --prod /app/extensions/tiptap

# Serve API
FROM base AS api-runner
WORKDIR /app/api
COPY --from=build /app/api /app/api
COPY --from=build /app/shared /app/shared
EXPOSE 3001
CMD ["node", "dist/server.js"]

# Reverse proxy
FROM caddy:2.11.4-alpine AS caddy
WORKDIR /app

COPY --from=build /app/web/dist ./www/
COPY conf/Caddyfile ./Caddyfile

EXPOSE 80
EXPOSE 443
EXPOSE 2019

# Directus build
FROM directus/directus:12.1.1 AS directus
WORKDIR /directus

COPY --from=build /app/extensions /directus/extensions

EXPOSE 8055
