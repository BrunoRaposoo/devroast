# Padrões tRPC

## Estrutura de Arquivos

```
src/
  trpc/
    init.ts              # initTRPC, context, base router
    routers/
      _app.ts           # AppRouter (root router)
      metrics.ts        # Router de métricas (exemplo)
  app/api/trpc/[trpc]/
    route.ts            # API route handler (fetch adapter)
  client/trpc/
    client.tsx         # TRPCProvider (Client Components)
    query-client.ts    # Query client factory
```

## Padrão de Router

```typescript
// src/trpc/init.ts
import { initTRPC } from "@trpc/server";
import { cache } from "react";

export const createTRPCContext = cache(async () => {
  return {
    // Context compartilhado (ex: db, user, etc)
  };
});

const t = initTRPC.create();

export const createTRPCRouter = t.router;
export const baseProcedure = t.procedure;
```

```typescript
// src/trpc/routers/metrics.ts
import { eq, sql } from "drizzle-orm";
import { baseProcedure, createTRPCRouter } from "../init";
import { db } from "@/db";
import { roastResults, codeSubmissions } from "@/db/schema";

export const metricsRouter = createTRPCRouter({
  getStats: baseProcedure.query(async () => {
    // Query ao banco
    const [totalSubmissions] = await db
      .select({ count: sql<number>`count(*)` })
      .from(codeSubmissions);

    return {
      totalRoasts: totalSubmissions?.count ?? 0,
      avgScore: 0,
    };
  }),
});
```

```typescript
// src/trpc/routers/_app.ts
import { createTRPCRouter } from "../init";
import { metricsRouter } from "./metrics";

export const appRouter = createTRPCRouter({
  metrics: metricsRouter,
});

export type AppRouter = typeof appRouter;
```

## API Route

```typescript
// src/app/api/trpc/[trpc]/route.ts
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createTRPCContext } from "../../../../trpc/init";
import { appRouter } from "../../../../trpc/routers/_app";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });

export { handler as GET, handler as POST };
```

## Client Usage

```typescript
// Componente Client
"use client";

import NumberFlow from "@number-flow/react";
import { useQuery } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@/trpc/routers/_app";

const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `/api/trpc`,
    }),
  ],
});

function MyComponent() {
  const { data, isLoading } = useQuery({
    queryKey: ["metrics", "getStats"],
    queryFn: () => trpcClient.metrics.getStats.query(),
  });

  // ...
}
```

## Regras

1. **Nomenclatura**: `nomeRouter.ts` para routers
2. **Context**: Criar via `cache()` do React para reutilizar entre requests
3. **Imports**: Usar `@/trpc/` para imports internos
4. **Types**: Exportar `AppRouter` para uso em Client Components
5. **DB**: Importar `db` de `@/db` para queries

## Provider Setup

O tRPC Provider já está configurado no `layout.tsx` via `TRPCProviderWrapper`.

Para usar em Client Components:
```typescript
import { useQuery } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";

// Criar client diretamente (não usar hooks do provider)
```
