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
nvm use
pnpm install
```

O backend agora também possui `.nvmrc`, então `nvm use` já resolve a versão esperada (`22`).

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

Ou, usando o script do projeto:

```bash
cd back
pnpm docker:up
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

## Formato da API

Base URL:

```text
http://127.0.0.1:3333/api
```

Convenções de resposta:

- Endpoints de coleção retornam `{ "data": [...], "meta": { "total", "limit", "offset" } }`
- Endpoints de item único retornam `{ "data": { ... } }`
- Erros retornam `{ "error": { "code", "message", "details?" } }`

## Exemplos de CRUD

Defina a base URL local primeiro:

```bash
BASE_URL=http://127.0.0.1:3333/api
```

### Times

Criar um time:

```bash
curl -X POST "$BASE_URL/teams" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Platform",
    "colorHex": "#2563EB",
    "description": "Owns the shared app experience"
  }'
```

Listar times:

```bash
curl "$BASE_URL/teams?limit=20&offset=0&search=plat"
```

Buscar um time:

```bash
curl "$BASE_URL/teams/TEAM_ID"
```

Atualizar um time:

```bash
curl -X PUT "$BASE_URL/teams/TEAM_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Platform Core",
    "description": "Owns shared flows and foundations"
  }'
```

Excluir um time:

```bash
curl -X DELETE "$BASE_URL/teams/TEAM_ID"
```

### Tarefas

Criar uma tarefa:

```bash
curl -X POST "$BASE_URL/tasks" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Prepare sprint board",
    "description": "Group tasks by delivery team",
    "status": "Pendente",
    "dueDate": "2026-05-31T18:00:00.000Z",
    "teamIds": ["TEAM_ID"]
  }'
```

Listar tarefas com filtros:

```bash
curl "$BASE_URL/tasks?teamId=TEAM_ID&status=Pendente&sort=dueDate&limit=20&offset=0"
```

Se precisar usar o status `Em Progresso` na query string, encode o espaço: `Em%20Progresso`.

Buscar uma tarefa:

```bash
curl "$BASE_URL/tasks/TASK_ID"
```

Atualizar uma tarefa:

```bash
curl -X PUT "$BASE_URL/tasks/TASK_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Prepare sprint board",
    "status": "Em Progresso",
    "teamIds": ["TEAM_ID"]
  }'
```

Excluir uma tarefa:

```bash
curl -X DELETE "$BASE_URL/tasks/TASK_ID"
```

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
nvm use
pnpm prisma:generate
```

### 3. Rode as migrations

```bash
cd back
nvm use
pnpm prisma:migrate
```

### 4. Rode o seed

```bash
cd back
nvm use
pnpm prisma:seed
```

### 5. Suba a API

```bash
cd back
nvm use
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
pnpm seed
pnpm docker:up
pnpm docker:down
pnpm docker:logs
```

Notas rápidas sobre execução:

- `pnpm dev` é o comando para desenvolvimento local com recarregamento automático.
- `pnpm start` executa `dist/server.js`, então ele deve ser usado depois de `pnpm build`.
- `pnpm docker:up` sobe a stack em modo destacado, alinhado com o fluxo recomendado deste README.
- No fluxo com Docker, o container da API executa `prisma:generate`, `prisma:migrate:deploy` e `prisma:seed` antes de iniciar o servidor.

## Testes

```bash
cd back
nvm use
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

Ele também limpa os dados existentes antes de recriar a base inicial, o que facilita validar rapidamente os fluxos do app, mas vale evitar esse comando se você quiser preservar dados locais.
