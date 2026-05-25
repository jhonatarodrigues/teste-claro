# Frontend

Aplicação mobile em React Native + Expo + TypeScript para gerenciar times e tarefas.

## Stack

- Expo
- React Native
- TypeScript
- React Query
- React Hook Form
- Zod
- NativeWind
- Lucide React Native
- pnpm

## Requisitos

- Node.js `22`
- pnpm `10+`
- Backend rodando em `http://127.0.0.1:3333`

## Instalação

```bash
cd front
nvm use
pnpm install
```

## Como rodar

### 1. Suba o backend primeiro

O frontend consome a API real. Se o backend não estiver rodando, as telas não conseguirão carregar os dados.

### 2. Inicie o Expo

```bash
cd front
nvm use
pnpm start -- --reset-cache --port 8081
```

Depois disso:

- pressione `i` para abrir no iOS Simulator
- pressione `a` para abrir no Android Emulator
- pressione `w` para abrir no navegador

## URL da API

O app resolve a URL da API nesta ordem:

1. `EXPO_PUBLIC_API_URL`
2. Android emulator: `http://10.0.2.2:3333/api`
3. Web: `http://localhost:3333/api`
4. iOS simulator: `http://127.0.0.1:3333/api`

Se quiser forçar manualmente uma URL:

```bash
cd front
nvm use
EXPO_PUBLIC_API_URL=http://127.0.0.1:3333/api pnpm start -- --reset-cache --port 8081
```

## Scripts

```bash
pnpm start
pnpm android
pnpm ios
pnpm web
pnpm test
pnpm typecheck
```

## Testes

```bash
cd front
nvm use
pnpm test -- --runInBand
pnpm typecheck
```

## Observações

- O projeto usa `pnpm`, não `npm`.
- O arquivo `.nvmrc` já está configurado com Node `22`.
- Para desenvolvimento local, o comportamento mais estável é rodar com o cache limpo: `pnpm start -- --reset-cache`.
