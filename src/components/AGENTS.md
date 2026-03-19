# Padrões de Componentes

## Estrutura

```
src/components/
  ui/                    # Componentes UI reutilizáveis
    button.tsx
    toggle.tsx
    code-editor.tsx
    code-block.tsx
    score-ring.tsx
  metrics.tsx            # Componente de métricas
  navbar.tsx             # Navbar
  trpc-provider.tsx      # Provider tRPC wrapper
```

## Client vs Server Components

### Server Components (padrão)
- Páginas em `src/app/`
- Componentes que não precisam de interatividade
- Podem acessar DB diretamente via tRPC caller

```typescript
// src/app/page.tsx (Server Component por padrão)
// Não usar "use client" se não precisar de estado
export default function Home() {
  return <div>...</div>;
}
```

### Client Components
- Usar `"use client"` no topo do arquivo
- Componentes interativos (useState, useEffect, event handlers)
- Acesso via hooks (useQuery, useTRPC, etc.)

```typescript
"use client";

import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

## Composição de Componentes

### Estrutura Hierárquica

```tsx
// Exemplo: Card com sub-componentes
<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
    <CardDescription>Descrição</CardDescription>
  </CardHeader>
  <CardContent>
    Conteúdo
  </CardContent>
</Card>
```

### Importação

```typescript
// De componentes UI
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { CodeBlock } from "@/components/ui/code-block";

// De outros componentes
import { Metrics } from "@/components/metrics";
import { Navbar } from "@/components/navbar";
```

## Padrões de Loading/Error

### Skeleton Loading

```tsx
function MyComponentSkeleton() {
  return (
    <div className="flex items-center gap-4">
      <div className="h-8 w-20 animate-pulse rounded bg-border" />
      <div className="h-4 w-16 animate-pulse rounded bg-border" />
    </div>
  );
}
```

### Suspense com Animation

```tsx
function MetricsContent() {
  const { data, isLoading } = useQuery({...});

  if (isLoading || !data) {
    return <MetricsSkeleton />;
  }

  // Animar números com NumberFlow
  return (
    <NumberFlow value={data.value} />
  );
}
```

## Nomenclatura

| Tipo | Padrão | Exemplo |
|------|---------|---------|
| Arquivo | kebab-case | `code-editor.tsx` |
| Componente | PascalCase | `CodeEditor` |
| Props | PascalCase | `CodeEditorProps` |
| Arquivo de page | `page.tsx` | `src/app/leaderboard/page.tsx` |

## Checklist Novo Componente

- [ ] Server ou Client Component?
- [ ] Skeleton para loading state?
- [ ] Animation para transição de dados?
- [ ] Variantes com tv() se aplicável?
- [ ] Classes Tailwind (não CSS hardcoded)?
- [ ] Cores via variáveis CSS?
- [ ] displayName definido?
