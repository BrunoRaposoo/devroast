# tRPC + Next.js

## Conclusão da Pesquisa

### Alternativas avaliadas

- **tRPC** - API typesafe sem geração de código
- **REST** - Padrão, mas sem typesafety automática
- **GraphQL** - Flexível, mas mais complexo

### Recomendação

**tRPC com TanStack React Query (v11)**

Justificativa:
- Typesafe end-to-end sem código boilerplate
- Integração nativa com Next.js App Router (Server Components)
- Documentação excelente para SSR
- Suporte a prefetch e hydration

---

## Especificação

### Estrutura de Arquivos

```
src/
  server/
    trpc/
      index.ts      # initTRPC, context, router base
      routers/
        _app.ts     # AppRouter (root router)
      api/
        route.ts    # API route handler (fetch adapter)
  client/
    trpc/
      client.tsx    # TRPCProvider (Client Components)
      server.tsx    # tRPC proxy (Server Components)
      query-client.ts
```

### API Routes

- `GET|POST /api/trpc/[trpc]` - Handler tRPC

### Usage

**Server Components:**
```tsx
import { trpc } from '@/client/trpc/server';

const data = await trpc.roast.create.query({ code, language });
```

**Client Components:**
```tsx
import { useTRPC } from '@/client/trpc/client';

const { data } = useQuery(useTRPC().roast.create.query({ code, language }));
```

---

## To-Dos

- [ ] TODO 1: Instalar dependências (@trpc/server, @trpc/client, @trpc/tanstack-react-query, @tanstack/react-query, zod)
- [ ] TODO 2: Criar API route `/api/trpc/[trpc]`
- [ ] TODO 3: Configurar server tRPC (init, context, base router)
- [ ] TODO 4: Criar routers (codeSubmission, roastResult, leaderboard)
- [ ] TODO 5: Configurar client tRPC (Provider, hooks)
- [ ] TODO 6: Configurar TRPCReactProvider no layout
- [ ] TODO 7: Criar exemplos de queries/mutations

---

## Perguntas

- ❓ Quais endpoints/routers são necessários? (submissão, leaderboard, resultados)
- ❓ O projeto vai usar autenticação? (afeta context)
- ❓ Precisamos de mutations além de queries?
