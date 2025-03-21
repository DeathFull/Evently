ARG NODE_VERSION=18-alpine
ARG PNPM_VERSION=10.4.1

FROM node:${NODE_VERSION} AS base
RUN npm install --global corepack@latest && corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate

WORKDIR /app

FROM base AS builder

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY . .

RUN --mount=type=cache,target=/root/.pnpm-store pnpm install --frozen-lockfile --filter ...events-api

WORKDIR /app/services/events-api

COPY /services/events-api/src ./src
COPY /services/events-api/tsconfig.json ./
RUN pnpm build

FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY . .

RUN --mount=type=cache,target=/root/.pnpm-store pnpm install --prod --frozen-lockfile --filter ...events-api

FROM node:${NODE_VERSION} AS final

ENV NODE_ENV=production

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/services/events-api/node_modules ./services/events-api/node_modules

COPY --from=builder /app/services/events-api/dist ./services/events-api/dist
COPY --from=builder /app/services/events-api/package.json ./services/events-api/package.json

WORKDIR /app/services/events-api

EXPOSE 3000
CMD ["npm", "start"]