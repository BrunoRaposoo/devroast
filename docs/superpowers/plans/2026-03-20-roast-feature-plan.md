# Roast Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar feature de roast que permite usuários submeter código para análise humorística/construída por IA via OpenAI.

**Architecture:** API tRPC mutation que salva código no banco, chama OpenAI, parseia resposta JSON, e salva resultado. Frontend com skeleton loading e display de resultados estruturados.

**Tech Stack:** Next.js App Router, tRPC, Drizzle ORM, PostgreSQL, OpenAI SDK, Tailwind CSS

---

## File Structure

### New Files
- `src/trpc/routers/roast.ts` - Router tRPC para criar e buscar roasts
- `src/lib/openai.ts` - Cliente OpenAI configurado
- `src/components/roast-skeleton.tsx` - Skeleton de loading
- `src/components/roast-analysis-card.tsx` - Card de análise individual
- `src/components/roast-result-header.tsx` - Header com score e título

### Modified Files
- `src/db/schema.ts` - Adicionar campos title, verdict, analysis
- `src/trpc/routers/_app.ts` - Registrar roast router
- `src/app/roast/[id]/page.tsx` - Usar dados reais do banco
- `src/components/code-editor-section.tsx` - Adicionar lógica de submit
- `.env.example` - Adicionar OPENAI_API_KEY

---

## Task 1: Setup OpenAI Client

**Files:**
- Create: `src/lib/openai.ts`
- Modify: `.env` (adicionar OPENAI_API_KEY)

- [ ] **Step 1: Install OpenAI SDK**

```bash
npm install openai
```

- [ ] **Step 2: Create OpenAI client**

```typescript
// src/lib/openai.ts
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export { openai };
```

- [ ] **Step 3: Adicionar ao .env.example**

```bash
OPENAI_API_KEY=your-api-key-here
```

---

## Task 2: Update Database Schema

**Files:**
- Modify: `src/db/schema.ts`

- [ ] **Step 1: Update roastResults table**

```typescript
// Adicionar após feedback field
title: text("title").notNull(),
verdict: text("verdict").notNull(), // needs_serious_help | needs_work | acceptable | good
analysis: jsonb("analysis").notNull().default("[]"), // array of AnalysisItem
```

- [ ] **Step 2: Adicionar interface TypeScript**

```typescript
export interface AnalysisItem {
  title: string;
  description: string;
  severity: "critical" | "warning";
}
```

- [ ] **Step 3: Push schema to database**

```bash
npm run db:push
```

---

## Task 3: Create tRPC Roast Router

**Files:**
- Create: `src/trpc/routers/roast.ts`
- Modify: `src/trpc/routers/_app.ts`

- [ ] **Step 1: Create roast router**

```typescript
// src/trpc/routers/roast.ts
import { z } from "zod";
import { db } from "@/db";
import { codeSubmissions, roastResults } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { openai } from "@/lib/openai";

const sarcasticSystemPrompt = `Você é um crítico de código sarcástico e implacável. Analise código e forneça feedback humorístico mas preciso. Seja cruel de forma criativa. Responda apenas em JSON.`;

const constructiveSystemPrompt = `Você é um mentor de código paciente e prestativo. Analise código e forneça feedback construtivo com sugestões práticas de melhoria. Responda apenas em JSON.`;

export const roastRouter = createTRPCRouter({
  create: baseProcedure
    .input(z.object({
      code: z.string().min(1),
      language: z.string(),
      roastMode: z.enum(["sarcastic", "constructive"]),
    }))
    .mutation(async ({ input }) => {
      const systemPrompt = input.roastMode === "sarcastic" 
        ? sarcasticSystemPrompt 
        : constructiveSystemPrompt;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: `Analise este código ${input.language}:\n\n\`\`\`${input.language}\n${input.code}\n\`\`\`\n\nForneça um JSON com:\n{\n  "score": number (0-10),\n  "title": string,\n  "verdict": "needs_serious_help" | "needs_work" | "acceptable" | "good",\n  "analysis": [\n    {\n      "title": string,\n      "description": string,\n      "severity": "critical" | "warning"\n    }\n  ]\n}\n\nRetorne APENAS o JSON válido.` 
          }
        ],
        response_format: { type: "json_object" },
      });

      const content = completion.choices[0].message.content;
      if (!content) throw new Error("No response from OpenAI");

      const parsed = JSON.parse(content);

      const [submission] = await db.insert(codeSubmissions).values({
        code: input.code,
        language: input.language as any,
        sessionId: crypto.randomUUID(),
      }).returning();

      const [roast] = await db.insert(roastResults).values({
        submissionId: submission.id,
        score: parsed.score.toString(),
        roastMode: input.roastMode,
        title: parsed.title,
        verdict: parsed.verdict,
        analysis: parsed.analysis,
        feedback: parsed.analysis.map((a: any) => a.description).join("\n"),
      }).returning();

      return { roastId: roast.id, submissionId: submission.id };
    }),

  getById: baseProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const [roast] = await db
        .select()
        .from(roastResults)
        .where(eq(roastResults.id, input.id));

      if (!roast) throw new TRPCError({ code: "NOT_FOUND" });

      const [submission] = await db
        .select()
        .from(codeSubmissions)
        .where(eq(codeSubmissions.id, roast.submissionId));

      return {
        ...roast,
        code: submission.code,
        language: submission.language,
        score: Number(roast.score),
      };
    }),
});
```

- [ ] **Step 2: Register router in _app.ts**

```typescript
import { roastRouter } from "./roast";

export const appRouter = createTRPCRouter({
  leaderboard: leaderboardRouter,
  metrics: metricsRouter,
  roast: roastRouter, // adicionar
});
```

---

## Task 4: Create Roast Components

**Files:**
- Create: `src/components/roast-skeleton.tsx`
- Create: `src/components/roast-analysis-card.tsx`
- Create: `src/components/roast-result-header.tsx`

- [ ] **Step 1: Create roast-skeleton.tsx**

```tsx
export function RoastSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-6">
      <div className="flex items-center gap-12">
        <div className="h-24 w-24 rounded-full bg-border" />
        <div className="flex flex-1 flex-col gap-3">
          <div className="h-6 w-48 rounded bg-border" />
          <div className="h-4 w-32 rounded bg-border" />
        </div>
      </div>
      <div className="h-px bg-border" />
      <div className="h-48 rounded bg-border" />
      <div className="h-px bg-border" />
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-40 rounded bg-border" />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create roast-analysis-card.tsx**

```tsx
interface AnalysisItem {
  title: string;
  description: string;
  severity: "critical" | "warning";
}

interface RoastAnalysisCardProps {
  item: AnalysisItem;
}

export function RoastAnalysisCard({ item }: RoastAnalysisCardProps) {
  return (
    <div className="rounded border border-border bg-bg-surface p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${
          item.severity === "critical" ? "bg-accent-red" : "bg-accent-amber"
        }`} />
        <span className={`font-mono text-xs font-medium ${
          item.severity === "critical" ? "text-accent-red" : "text-accent-amber"
        }`}>
          {item.severity}
        </span>
      </div>
      <h3 className="mb-2 font-mono text-sm font-medium text-text-primary">
        {item.title}
      </h3>
      <p className="font-mono text-xs text-text-secondary">
        {item.description}
      </p>
    </div>
  );
}
```

- [ ] **Step 3: Create roast-result-header.tsx**

```tsx
import { ScoreRing } from "@/components/ui/score-ring";

interface RoastResultHeaderProps {
  score: number;
  title: string;
  verdict: string;
  roastMode: string;
  language: string;
  lines: number;
}

export function RoastResultHeader({
  score,
  title,
  verdict,
  roastMode,
  language,
  lines,
}: RoastResultHeaderProps) {
  return (
    <section className="flex items-center gap-12">
      <ScoreRing value={score} size="lg" />
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-accent-red" />
          <span className="font-mono text-sm font-medium text-accent-red">
            verdict: {verdict}
          </span>
        </div>
        <h1 className="font-mono text-xl font-normal leading-relaxed text-text-primary">
          "{title}"
        </h1>
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-text-tertiary">
            lang: {language}
          </span>
          <span className="text-text-tertiary">·</span>
          <span className="font-mono text-xs text-text-tertiary">
            {lines} lines
          </span>
        </div>
      </div>
    </section>
  );
}
```

---

## Task 5: Update CodeEditorSection with Submit Logic

**Files:**
- Modify: `src/components/code-editor-section.tsx`

- [ ] **Step 1: Add tRPC mutation and submit handler**

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { Toggle } from "@/components/ui/toggle";
import type { AppRouter } from "@/trpc/routers/_app";
import type { ProgrammingLanguage } from "@/db/schema";

const trpcClient = createTRPCClient<AppRouter>({
  links: [httpBatchLink({ url: "/api/trpc" })],
});

export function CodeEditorSection() {
  const router = useRouter();
  const [roastMode, setRoastMode] = useState(false);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState<ProgrammingLanguage>("javascript");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!code.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const result = await trpcClient.roast.create.mutate({
        code,
        language,
        roastMode: roastMode ? "sarcastic" : "constructive",
      });
      router.push(`/roast/${result.roastId}`);
    } catch (error) {
      console.error("Failed to create roast:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <CodeEditor
        code={code}
        onChange={setCode}
        onLanguageChange={setLanguage}
        showLanguageSelector={true}
        showLineNumbers={true}
        showCopyButton={true}
        rows={20}
      />
      <section className="flex w-full max-w-[780px] items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex flex-wrap items-center gap-4 md:gap-6">
          <div className="flex items-center gap-2.5">
            <Toggle 
              pressed={roastMode} 
              onPressedChange={setRoastMode}
            />
            <span className="font-mono text-sm text-accent-green">
              roast mode
            </span>
          </div>
          <span className="font-mono text-xs text-text-tertiary">
            {roastMode ? "// maximum sarcasm enabled" : "// constructive feedback"}
          </span>
        </div>
        <Button 
          variant="primary" 
          onClick={handleSubmit}
          disabled={!code.trim() || isSubmitting}
        >
          {isSubmitting ? "roasting..." : "$ roast_my_code"}
        </Button>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Update CodeEditor to expose onLanguageChange**

```tsx
// Em src/components/ui/code-editor.tsx
// Adicionar prop onLanguageChange: (lang: ProgrammingLanguage) => void
```

---

## Task 6: Update Roast Result Page

**Files:**
- Modify: `src/app/roast/[id]/page.tsx`

- [ ] **Step 1: Fetch data server-side and render**

```tsx
import { notFound } from "next/navigation";
import { createTRPCContext } from "@/trpc/init";
import { appRouter } from "@/trpc/routers/_app";
import { CodeBlock } from "@/components/ui/code-block";
import { RoastResultHeader } from "@/components/roast-result-header";
import { RoastAnalysisCard } from "@/components/roast-analysis-card";
import { RoastSkeleton } from "@/components/roast-skeleton";
import { Suspense } from "react";

interface RoastResultPageProps {
  params: Promise<{ id: string }>;
}

async function getRoastData(id: string) {
  const ctx = await createTRPCContext();
  const caller = appRouter.createCaller(ctx);
  return caller.roast.getById({ id });
}

export async function generateMetadata({ params }: RoastResultPageProps) {
  const { id } = await params;
  try {
    const data = await getRoastData(id);
    return {
      title: `Roast Result: ${data.score}/10 | DevRoast`,
      description: data.title,
    };
  } catch {
    return { title: "Roast Result | DevRoast" };
  }
}

export default async function RoastResultPage({ params }: RoastResultPageProps) {
  const { id } = await params;

  let data;
  try {
    data = await getRoastData(id);
  } catch {
    notFound();
  }

  const lines = data.code.split("\n").length;

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-10 px-5 py-10 md:px-20 md:py-16">
      <RoastResultHeader
        score={data.score}
        title={data.title}
        verdict={data.verdict}
        roastMode={data.roastMode}
        language={data.language}
        lines={lines}
      />

      <div className="h-px w-full bg-border" />

      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold text-accent-green">
            {"//"}
          </span>
          <span className="font-mono text-sm font-bold text-text-primary">
            your_submission
          </span>
        </div>
        <div className="overflow-hidden rounded border border-border bg-bg-input">
          <CodeBlock code={data.code} language={data.language} />
        </div>
      </section>

      <div className="h-px w-full bg-border" />

      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold text-accent-green">
            {"//"}
          </span>
          <span className="font-mono text-sm font-bold text-text-primary">
            detailed_analysis
          </span>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {data.analysis.map((item, idx) => (
            <RoastAnalysisCard key={idx} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
```

---

## Task 7: Add .env to .gitignore

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Ensure OPENAI_API_KEY is not committed**

```bash
# Adicionar ao .gitignore se não existir
echo "OPENAI_API_KEY" >> .gitignore
```

---

## Task 8: Test the Feature

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Test roast submission**

1. Abrir http://localhost:3000
2. Digitar código no editor
3. Selecionar linguagem
4. Toggle roast mode (on/off)
5. Clicar em "$ roast_my_code"
6. Verificar redirect para página de resultado
7. Verificar score ring, título, análise

- [ ] **Step 3: Test error handling**

1. Submit com código vazio (botão deve estar desabilitado)
2. Verificar toast de erro se API falhar

---

## Verification

- [ ] **Run lint:** `npm run lint`
- [ ] **Run build:** `npm run build`
- [ ] **Manual test:** Submit código e verificar resultado
