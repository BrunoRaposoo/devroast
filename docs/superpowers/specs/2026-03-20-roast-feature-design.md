# Roast Feature Design

**Date:** 2026-03-20  
**Feature:** Code Roast Submission and Analysis

## Overview

Permitir que usuários submetam trechos de código para análise humorística/construída por IA. O sistema usa OpenAI (GPT-4o) para gerar feedback sarcástico ou construtivo com score de 0-10 e análise pontual de problemas.

---

## 1. User Flow

```
1. Usuário acessa página inicial (/)
2. Insere código no editor
3. Seleciona linguagem de programação
4. Toggle: escolhe modo sarcástico ou construtivo
5. Clica em "$ roast_my_code"
6. Sistema mostra loading skeleton
7. OpenAI analisa código e retorna:
   - Score (0-10)
   - Título
   - Lista de problemas (3-5 items)
8. Usuário vê página de resultado (/roast/[id])
9. Opcional: ver código na leaderboard
```

---

## 2. Roast Modes

| Modo | Comportamento |
|------|---------------|
| `sarcastic` | Humor ácido, piadas, crítica destrutiva |
| `constructive` | Feedback prático, sugestões de melhoria |

---

## 3. API OpenAI

### Prompt Structure

**System Prompt (Sarcastic):**
```
Você é um crítico de código sarcástico e implacável. Analise código e forneça feedback humorístico mas preciso. Seja cruel de forma criativa.
```

**System Prompt (Constructive):**
```
Você é um mentor de código paciente e prestativo. Analise código e forneça feedback construtivo com sugestões práticas de melhoria.
```

**User Prompt:**
```
Analise este código {language}:

```{language}
{codigo}
```

Forneça um JSON com:
{
  "score": number (0-10),
  "title": string (título impactante),
  "verdict": "needs_serious_help" | "needs_work" | "acceptable" | "good",
  "analysis": [
    {
      "title": string,
      "description": string,
      "severity": "critical" | "warning"
    }
  ]
}

Retorne APENAS o JSON, sem markdown ou explicações.
```

---

## 4. Database Schema

### New Fields in `roastResults`

```typescript
export const roastResults = pgTable("roast_results", {
  id: uuid("id").defaultRandom().primaryKey(),
  submissionId: uuid("submission_id").notNull(),
  score: decimal("score", { precision: 3, scale: 2 }).notNull(),
  roastMode: roastModeEnum("roast_mode").notNull().default("sarcastic"),
  title: text("title").notNull(),
  verdict: text("verdict").notNull(),
  analysis: jsonb("analysis").notNull(), // array of analysis items
  feedback: text("feedback").notNull(), // kept for backwards compatibility
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

### Analysis Item Type

```typescript
interface AnalysisItem {
  title: string;
  description: string;
  severity: "critical" | "warning";
}
```

---

## 5. tRPC Router

### `roast.create` Mutation

```typescript
input: {
  code: string;
  language: ProgrammingLanguage;
  roastMode: "sarcastic" | "constructive";
}

output: {
  roastId: string;
  submissionId: string;
}
```

**Steps:**
1. Generate sessionId (from cookies or generate new)
2. Insert codeSubmission
3. Call OpenAI API
4. Parse JSON response
5. Insert roastResult
6. Return IDs

### `roast.getById` Query

```typescript
input: {
  id: string;
}

output: {
  id: string;
  code: string;
  language: string;
  score: number;
  roastMode: string;
  title: string;
  verdict: string;
  analysis: AnalysisItem[];
  createdAt: Date;
}
```

---

## 6. Frontend Components

### Modified

| Component | Changes |
|-----------|---------|
| `code-editor-section.tsx` | Add submit handler, call tRPC mutation, redirect to result |
| `roast/[id]/page.tsx` | Fetch data from tRPC, display real content |

### New

| Component | Purpose |
|-----------|---------|
| `roast-skeleton.tsx` | Loading skeleton for roast result |
| `roast-analysis-card.tsx` | Display single analysis item |
| `roast-result-header.tsx` | Score ring + title + verdict |

---

## 7. Error Handling

| Scenario | Handling |
|----------|----------|
| Empty code | Disable submit button, show validation |
| OpenAI API error | Show error toast, allow retry |
| Invalid JSON from AI | Retry once, fallback to error message |
| Database error | Show error toast |
| Network error | Show error message |

---

## 8. Out of Scope (v1)

- Share roast functionality
- User accounts / authentication
- Code execution / testing
- Multiple roast comparison
- Export/share results

---

## 9. File Changes

### New Files
- `src/trpc/routers/roast.ts`
- `src/components/roast-skeleton.tsx`
- `src/components/roast-analysis-card.tsx`
- `src/components/roast-result-header.tsx`

### Modified Files
- `src/db/schema.ts` (add fields)
- `src/trpc/routers/_app.ts` (add roast router)
- `src/app/roast/[id]/page.tsx` (use real data)
- `src/components/code-editor-section.tsx` (add submission logic)

### Environment Variables
- `OPENAI_API_KEY` - API key for OpenAI

---

## 10. Dependencies

```bash
npm install openai
```
