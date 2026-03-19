# DevRoast

## Setup

```bash
npm install
npm run dev
```

## Comandos

- `npm run dev` - Desenvolvimento
- `npm run build` - Build produção
- `npm run lint` - Verificar código
- `npm run db:up` - Iniciar PostgreSQL (Docker)
- `npm run db:push` - Push schema Drizzle
- `npm run db:seed` - Popular banco com dados fictícios
- `npm run db:studio` - Abrir Drizzle Studio

## Estrutura de Pastas

```
src/
  app/                    # Next.js App Router (páginas)
    api/trpc/            # API routes tRPC
    leaderboard/         # Página de leaderboard
    roast/[id]/          # Página de resultado de roast
  components/
    ui/                  # Componentes UI reutilizáveis
    metrics.tsx           # Componente de métricas
    navbar.tsx            # Navbar
    trpc-provider.tsx     # Provider tRPC
  db/
    schema.ts             # Schema Drizzle
    seed.ts               # Seed do banco
    migrations/           # Migrations Drizzle
  trpc/                   # tRPC (servidor)
    init.ts              # Configuração tRPC
    routers/             # Routers tRPC
      _app.ts           # AppRouter
      metrics.ts         # Router de métricas
```

## Padrões de Desenvolvimento

### 1. Antes de Implementar
Sempre criar um spec em `specs/<feature-name>.md` seguindo o formato em `specs/AGENTS.md`.

### 2. UI Components
Ver `src/components/ui/AGENTS.md` para padrões completos.

### 3. tRPC
Ver `src/trpc/AGENTS.md` para padrões completos.

### 4. Componentes
Ver `src/components/AGENTS.md` para padrões completos.

### 5. Estilização
- Tailwind CSS v4
- Variáveis CSS para cores (ver `src/components/ui/AGENTS.md`)
- Fontes: JetBrains Mono (primary), Geist (secondary)

### 6. Variantes de Componentes
- Button: `primary`, `secondary`, `outline`, `ghost`, `destructive`
- Badge: `critical`, `warning`, `good`, `needs_serious_help`
- Card: `default`, `critical`, `warning`, `good`
