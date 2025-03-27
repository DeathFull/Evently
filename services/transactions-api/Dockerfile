ARG NODE_VERSION=18-alpine
ARG PNPM_VERSION=10.4.1

FROM node:${NODE_VERSION} AS base
RUN npm install --global corepack@latest && corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate

WORKDIR /app

FROM base AS builder

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY . .

RUN --mount=type=cache,target=/root/.pnpm-store pnpm install --frozen-lockfile --filter ...transactions-api

WORKDIR /app/services/transactions-api

COPY /services/transactions-api/src ./src
COPY /services/transactions-api/tsconfig.json ./
RUN pnpm build

COPY /services/transactions-api/src/swagger.yaml ./dist/

FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY . .

RUN --mount=type=cache,target=/root/.pnpm-store pnpm install --prod --frozen-lockfile --filter ...transactions-api

FROM node:${NODE_VERSION} AS final

ENV NODE_ENV=production

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/services/transactions-api/node_modules ./services/transactions-api/node_modules

COPY --from=builder /app/services/transactions-api/dist ./services/transactions-api/dist
COPY --from=builder /app/services/transactions-api/package.json ./services/transactions-api/package.json

WORKDIR /app/services/transactions-api

EXPOSE 3000
CMD ["npm", "start"]