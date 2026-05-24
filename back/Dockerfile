FROM node:22-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile || pnpm install

COPY . .

EXPOSE 3333

CMD ["sh", "-c", "pnpm prisma:generate && pnpm prisma:migrate:deploy && pnpm prisma:seed && pnpm dev"]
