FROM node:24-alpine AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME/bin:$PATH"
RUN corepack enable

# Build all services
FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
RUN pnpm deploy --filter=web --prod /app/web
RUN pnpm deploy --filter=backend --prod /app/api
RUN pnpm deploy --filter=shared --prod /app/shared
RUN pnpm deploy --filter=slug --prod /app/extensions/slug
RUN pnpm deploy --filter=tiptap --prod /app/extensions/tiptap

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
