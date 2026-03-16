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

## Padrões

### UI Components
- Local: `src/components/ui/`
- Padrão: Composition pattern (sub-components)
- Estrutura: `Card > CardHeader, CardTitle, CardDescription, CardContent`
- Biblioteca: tailwind-variants + twMerge

### Variantes de Componentes
- Button: `primary`, `secondary`, `outline`, `ghost`, `destructive`
- Badge: `critical`, `warning`, `good`, `needs_serious_help`
- Card: `default`, `critical`, `warning`, `good`

### Tailwind
- Usar classes do Tailwind v4
- Preferir classes utilitárias sobre CSS customizado
- Cores via variáveis CSS (ver `globals.css`)

### Fonts
- Primary: JetBrains Mono (`--font-primary`)
- Secondary: Geist (`--font-secondary`)
