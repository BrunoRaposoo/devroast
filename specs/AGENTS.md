# Specs

## Formato

Criar arquivo `specs/<feature-name>.md` com:

```markdown
# <Feature Name>

## Conclusão da Pesquisa
- Alternativas avaliadas
- Biblioteca/ferramenta recomendada

## Especificação
- Requisitos funcionais
- Fluxo do usuário

## To-Dos
- [ ] TODO 1
- [ ] TODO 2

## Perguntas
- ❓ Pergunta para stakeholder
```

## Processo de Desenvolvimento

1. **Criar spec** ANTES de implementar
   - Documentar alternativas e recomendação
   - Definir requisitos funcionais
   - Listar To-Dos
   - Fazer perguntas ao stakeholder

2. **Implementar** após aprovação
   - Seguir To-Dos do spec
   - Usar padrões definidos em `src/trpc/AGENTS.md` e `src/components/AGENTS.md`

3. **Revisar**
   - `npm run lint` - Verificar código
   - `npm run build` - Compilar projeto
   - Testar funcionalidades

## Quando Criar Spec

- Nova feature significativa
- Integração de biblioteca externa
- Mudança de arquitetura
- Reestruturação de páginas

## Estrutura de Specs

```
specs/
  AGENTS.md              # Este arquivo
  drizzle-postgres.md     # Spec do banco
  editor-syntax-highlight.md  # Spec do editor
  trpc-nextjs.md         # Spec do tRPC
```
