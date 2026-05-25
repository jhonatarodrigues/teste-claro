# Backend

API REST em Node.js + Express + TypeScript para gerenciar times e tarefas.

## Stack

- Node.js
- Express
- TypeScript
- Prisma
- MySQL
- Docker Compose
- Zod
- Vitest
- Supertest
- pnpm

## Requisitos

- Node.js `22`
- pnpm `10+`
- Docker Desktop ativo

## Instalação

```bash
cd back
nvm use 22
pnpm install
```

## Variáveis de ambiente

O projeto usa `.env` no backend.

Se precisar recriar:

```bash
cd back
cp .env.example .env
```

Variáveis atuais:

- `PORT=3333`
- `DATABASE_URL=mysql://claro:claro@127.0.0.1:3307/claro`
- `LOG_LEVEL=info`

## Como rodar com Docker

Esse é o fluxo recomendado.

### 1. Suba a stack

```bash
cd back
docker compose up -d --build
```

### 2. Verifique os containers

```bash
cd back
docker compose ps
```

### 3. Verifique a saúde da API

```bash
curl -sS http://127.0.0.1:3333/health
```

## Portas locais

- API: `3333`
- MySQL no container: `3306`
- MySQL exposto no host: `3307`

O MySQL usa `3307` no host porque `3306` pode já estar ocupada na máquina local.

## Como rodar sem Docker

Se você quiser rodar a API localmente e usar apenas o banco do Docker:

### 1. Suba apenas o banco

```bash
cd back
docker compose up -d db
```

### 2. Gere o Prisma Client

```bash
cd back
nvm use 22
pnpm prisma:generate
```

### 3. Rode as migrations

```bash
cd back
nvm use 22
pnpm prisma:migrate
```

### 4. Rode o seed

```bash
cd back
nvm use 22
pnpm prisma:seed
```

### 5. Suba a API

```bash
cd back
nvm use 22
pnpm dev
```

## Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm test
pnpm typecheck
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:migrate:deploy
pnpm prisma:seed
pnpm docker:up
pnpm docker:down
pnpm docker:logs
```

## Testes

```bash
cd back
nvm use 22
pnpm test
pnpm typecheck
```

## Logs e parada da stack

```bash
cd back
docker compose logs -f api
docker compose down
```

## Seed

O seed atual cria:

- `3` times
- `10` tarefas

Isso facilita validar rapidamente os fluxos do app.
