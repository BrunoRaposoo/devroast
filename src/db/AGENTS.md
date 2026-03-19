# Padrões Drizzle ORM

## Estrutura

```
src/db/
  index.ts        # Conexão com banco
  schema.ts       # Definição de tabelas
  seed.ts         # Seed do banco
  migrations/     # Migrations Drizzle
```

## Schema

```typescript
// src/db/schema.ts
import {
  decimal,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const roastModeEnum = pgEnum("roast_mode", [
  "sarcastic",
  "constructive",
]);

export const languageEnum = pgEnum("programming_language", [
  "javascript",
  "typescript",
  "python",
  // ...
]);

export const codeSubmissions = pgTable("code_submissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: text("session_id").notNull(),
  code: text("code").notNull(),
  language: languageEnum("language").notNull().default("other"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type CodeSubmission = typeof codeSubmissions.$inferSelect;
export type NewCodeSubmission = typeof codeSubmissions.$inferInsert;
```

## Conexão

```typescript
// src/db/index.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const client = postgres(connectionString);
export const db = drizzle(client, { schema });
```

## Queries (sem relations)

```typescript
import { db } from "@/db";
import { codeSubmissions, roastResults } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

// Select simples
const results = await db.select().from(codeSubmissions);

// Select com where
const result = await db
  .select()
  .from(roastResults)
  .where(eq(roastResults.score, "3.5"));

// Insert
const [newSubmission] = await db
  .insert(codeSubmissions)
  .values({
    sessionId: "abc123",
    code: "const x = 1;",
    language: "javascript",
  })
  .returning({ id: codeSubmissions.id });

// Aggregation
const [stats] = await db
  .select({ count: sql<number>`count(*)` })
  .from(codeSubmissions);
```

## Regras

1. **Sem relations nativas** - Usar joins manuais quando necessário
2. **Casing** - Campos em snake_case no DB (session_id, created_at)
3. **Types** - Exportar tipos InferSelect e InferInsert
4. **Enums** - Usar pgEnum para valores fixos
5. **UUID** - Usar `uuid().defaultRandom().primaryKey()`

## Scripts

```bash
npm run db:up        # Iniciar PostgreSQL
npm run db:down      # Parar PostgreSQL
npm run db:generate   # Gerar migrations
npm run db:migrate    # Aplicar migrations
npm run db:push      # Push schema (desenvolvimento)
npm run db:studio     # Abrir Drizzle Studio
npm run db:seed       # Popular banco
```
