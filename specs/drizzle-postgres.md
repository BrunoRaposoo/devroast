# Especificação: Drizzle ORM + PostgreSQL

## 1. Visão Geral

Implementar Drizzle ORM com PostgreSQL usando Docker Compose para persistência de dados do DevRoast.

---

## 2. Tabelas

### 2.1 `code_submissions`

Armazena os códigos enviados pelos usuários para análise.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | `uuid` | PK - ID único da submissão |
| `code` | `text` | Código fonte enviado |
| `language` | `varchar(50)` | Linguagem detectada/selecionada |
| `created_at` | `timestamp` | Data de criação |

### 2.2 `roast_results`

Armazena os resultados da análise de cada submissão.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | `uuid` | PK - ID único do resultado |
| `submission_id` | `uuid` | FK para `code_submissions.id` |
| `score` | `decimal(3,2)` | Score de 0 a 10 |
| `roast_mode` | `enum` | Modo: 'sarcastic' ou 'constructive' |
| `feedback` | `text` | Feedback gerado |
| `created_at` | `timestamp` | Data de criação |

### 2.3 `leaderboard_entries`

Armazena entradas para o leaderboard (podendo ter mais dados que a simples consulta).

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | `uuid` | PK |
| `submission_id` | `uuid` | FK para `code_submissions.id` |
| `rank` | `integer` | Posição no ranking |
| `score` | `decimal(3,2)` | Score (para ordenação rápida) |
| `created_at` | `timestamp` | Data de criação |

---

## 3. Enums

### 3.1 `roast_mode`

```typescript
export const roastModeEnum = pgEnum("roast_mode", ["sarcastic", "constructive"]);
```

### 3.2 `programming_language`

Linguagens suportadas (subconjunto):

```typescript
export const languageEnum = pgEnum("programming_language", [
  "javascript",
  "typescript",
  "python",
  "rust",
  "go",
  "java",
  "c",
  "cpp",
  "csharp",
  "php",
  "ruby",
  "swift",
  "kotlin",
  "sql",
  "html",
  "css",
  "json",
  "yaml",
  "markdown",
  "bash",
  "other",
]);
```

---

## 4. Docker Compose

### 4.1 `docker-compose.yml`

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:16-alpine
    container_name: devroast-db
    environment:
      POSTGRES_USER: devroast
      POSTGRES_PASSWORD: devroast
      POSTGRES_DB: devroast
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## 5. Configuração Drizzle

### 5.1 Estrutura de Arquivos

```
src/
  db/
    index.ts        # Conexão com banco
    schema.ts       # Definição de tabelas
    migrations/     # Migrations do Drizzle
```

### 5.2 dependências

```json
{
  "drizzle-orm": "^0.39.0",
  "postgres": "^3.4.0",
  "drizzle-kit": "^0.30.0"
}
```

### 5.3 Variáveis de Ambiente

```
DATABASE_URL=postgresql://devroast:devroast@localhost:5432/devroast
```

---

## 6. To-Dos para Implementação

- [ ] **TODO 1**: Criar arquivo `docker-compose.yml` na raiz do projeto
- [ ] **TODO 2**: Instalar dependências Drizzle (drizzle-orm, postgres, drizzle-kit)
- [ ] **TODO 3**: Configurar variável de ambiente `DATABASE_URL`
- [ ] **TODO 4**: Criar schema em `src/db/schema.ts`
- [ ] **TODO 5**: Criar conexão em `src/db/index.ts`
- [ ] **TODO 6**: Configurar scripts no `package.json` (migrate, push, studio)
- [ ] **TODO 7**: Criar migration inicial
- [ ] **TODO 8**: Testar conexão com banco

---

## 7. Perguntas para Compreensão

### ❓ Pergunta 1: O projeto terá autenticação de usuários?

Se sim, precisaremos de uma tabela `users` para armazenar usuários e vincular às submissões.

### ❓ Pergunta 2: O código original precisa ser persistido?

No momento, o código é apenas processado em memória. Precisamos salvar o código original para:
- Exibir no leaderboard
- Histórico de análises
- Compartilhar resultados

### ❓ Pergunta 3: O leaderboard é global ou por sessão?

- **Global**: Todos os usuários veem o mesmo ranking
- **Por sessão**: Cada "sessão" tem seu próprio ranking
- **Por usuário**: Cada usuário tem seu próprio histórico

### ❓ Pergunta 4: Os resultados precisam ser editáveis?

Ex: Administrador pode remover entries do leaderboard? Editar feedback?

### ❓ Pergunta 5: Precisamos de paginação no leaderboard?

Quantos items预计amos exibir? ( 影响 query design)

### ❓ Pergunta 6: Haverá API externa ou tudo client-side?

Se for apenas client-side (Next.js app), podemos usar server actions diretamente.

---

## 8. Scripts Sugeridos (package.json)

```json
{
  "db:up": "docker compose up -d",
  "db:down": "docker compose down",
  "db:migrate": "drizzle-kit migrate",
  "db:push": "drizzle-kit push",
  "db:studio": "drizzle-kit studio",
  "db:generate": "drizzle-kit generate"
}
```

---

## 9. Referências

- Drizzle ORM: https://orm.drizzle.team/
- Drizzle Kit: https://kit.drizzle.team/
- Docker Compose + Postgres: https://docs.docker.com/compose/

---

## 10. Schema Detalhado (v1.0)

```typescript
// src/db/schema.ts

import { pgEnum, pgTable, uuid, text, timestamp, decimal } from 'drizzle-orm/pg-core';

// Enums
export const roastModeEnum = pgEnum('roast_mode', ['sarcastic', 'constructive']);

export const languageEnum = pgEnum('programming_language', [
  'javascript',
  'typescript', 
  'python',
  'rust',
  'go',
  'java',
  'c',
  'cpp',
  'csharp',
  'php',
  'ruby',
  'swift',
  'kotlin',
  'sql',
  'html',
  'css',
  'json',
  'yaml',
  'markdown',
  'bash',
  'other',
]);

// Tabelas
export const codeSubmissions = pgTable('code_submissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: text('code').notNull(),
  language: languageEnum('language').notNull().default('other'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const roastResults = pgTable('roast_results', {
  id: uuid('id').defaultRandom().primaryKey(),
  submissionId: uuid('submission_id').references(() => codeSubmissions.id).notNull(),
  score: decimal('score', { precision: 3, scale: 2 }).notNull(),
  roastMode: roastModeEnum('roast_mode').notNull().default('sarcastic'),
  feedback: text('feedback').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const leaderboardEntries = pgTable('leaderboard_entries', {
  id: uuid('id').defaultRandom().primaryKey(),
  submissionId: uuid('submission_id').references(() => codeSubmissions.id).notNull(),
  rank: integer('rank').notNull(),
  score: decimal('score', { precision: 3, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```
