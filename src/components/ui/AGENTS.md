# Padrões de Criação de Componentes UI

Este documento define os padrões para criação de novos componentes UI no projeto.

## Fontes

O projeto utiliza duas fontes configuradas no `layout.tsx`:
- **Primária (monospace)**: JetBrains Mono (`--font-primary`)
- **Secundária**: Geist (`--font-secondary`)

## Estrutura Base

Todo componente deve seguir esta estrutura:

```tsx
import { type HTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { tv, type VariantProps } from "tailwind-variants";

// 1. Definição de variantes com tv
const componentVariants = tv({
  base: "classes base aplicáveis a todas as variantes",
  variants: {
    variant: {
      primary: "classes para variante primary",
      secondary: "classes para variante secondary",
      outline: "classes para variante outline",
      ghost: "classes para variante ghost",
      destructive: "classes para variante destructive",
    },
    size: {
      default: "tamanho padrão",
      sm: "tamanho small",
      lg: "tamanho large",
      icon: "tamanho para ícone",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "default",
  },
});

// 2. Interface de Props
export interface ComponentProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentVariants> {
  asChild?: boolean;
}

// 3. Componente com forwardRef
export const Component = forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <div
        className={twMerge(componentVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

Component.displayName = "Component";
```

## Paleta de Cores

O projeto define as seguintes variáveis CSS em `globals.css`:

### Cores de Tema
| Variável | Uso |
|----------|-----|
| `--primary` | Cor principal da aplicação |
| `--primary-foreground` | Texto sobre cor primária |
| `--secondary` | Cor secundária |
| `--secondary-foreground` | Texto sobre cor secundária |
| `--muted` | Cores subdued |
| `--muted-foreground` | Texto sobre cores muted |
| `--accent` | Cor de destaque |
| `--accent-foreground` | Texto sobre cor de destaque |
| `--destructive` | Ações destrutivas |
| `--destructive-foreground` | Texto sobre cor destrutiva |
| `--background` | Fundo da página |
| `--foreground` | Texto principal |
| `--card` | Fundo de cards |
| `--card-foreground` | Texto em cards |
| `--border` | Bordas |
| `--input` | Inputs |
| `--ring` | Anéis de focus |

### Cores de Accent
| Variável | Cor |
|----------|-----|
| `--green-primary` | #22c55e |
| `--accent-green` | #10b981 |
| `--accent-amber` | #f59e0b |
| `--accent-orange` | #f97316 |
| `--accent-red` | #ef4444 |
| `--accent-blue` | #3b82f6 |

### Border Radius
| Variável | Valor |
|----------|-------|
| `--radius-sm` | 0px |
| `--radius-md` | 16px |
| `--radius-pill` | 999px |

## Classes CSS Frequentes

### Base
- `inline-flex items-center justify-center gap-2`
- `rounded-md` (ou `--radius-md` via CSS)
- `font-mono text-sm font-medium`
- `transition-colors`
- `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`
- `disabled:pointer-events-none disabled:opacity-50`

### Tamanhos
| Size | Classes |
|------|---------|
| default | h-10 px-6 py-2 |
| sm | h-8 px-3 text-xs |
| lg | h-12 px-8 text-base |
| icon | h-10 w-10 |

## Regras de Nomenclatura

1. **Arquivo**: `nomedoComponente.tsx` (kebab-case com iniciais minúsculas)
2. **Variantes**: `nomedoComponenteVariants` (camelCase)
3. **Props**: `NomedoComponenteProps` (PascalCase)
4. **Componente**: `NomedoComponente` (PascalCase)

## Check-list para Novo Componente

- [ ] Definir variantes com `tv()` incluindo `variant` e `size`
- [ ] Criar interface de Props estendendo `VariantProps`
- [ ] Usar `forwardRef` para o componente
- [ ] Usar `twMerge` para mesclar classes
- [ ] Definir `displayName`
- [ ] Exportar interface e componente
- [ ] Usar cores do theme CSS (não hardcoded)
- [ ] Incluir suporte a `disabled` e `focus-visible`
- [ ] Testar todas as variantes
