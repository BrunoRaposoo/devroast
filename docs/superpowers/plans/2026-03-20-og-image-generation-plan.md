# OG Image Generation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate OpenGraph images automatically when sharing roast results, using Takumi to fetch an HTML endpoint and generate the image.

**Architecture:** On-demand generation - when someone accesses `/roast/[id]`, the page includes og:image meta tag pointing to `/api/og?params`. Takumi fetches this URL and generates the image.

**Tech Stack:** Next.js App Router, Takumi API, CSS for OG design

---

## Task 1: Create OG HTML Endpoint

**Files:**
- Create: `src/app/api/og/route.ts`
- Test: Manual - visit `/api/og?score=3.5&verdict=needs_serious_help&language=javascript&title=test&quote=test+quote`

- [ ] **Step 1: Create the OG route file**

```typescript
// src/app/api/og/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const score = searchParams.get("score") || "0";
  const verdict = searchParams.get("verdict") || "acceptable";
  const language = searchParams.get("language") || "other";
  const title = searchParams.get("title") || "Roast Result";
  const quote = searchParams.get("quote") || "";

  const verdictColors: Record<string, string> = {
    needs_serious_help: "#ef4444",
    needs_work: "#f59e0b",
    acceptable: "#22c55e",
    good: "#10b981",
  };

  const verdictText: Record<string, string> = {
    needs_serious_help: "needs_serious_help",
    needs_work: "needs_work",
    acceptable: "acceptable",
    good: "good",
  };

  const color = verdictColors[verdict] || "#22c55e";
  const verdictLabel = verdictText[verdict] || "acceptable";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;900&family=Geist&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      width: 1200px;
      height: 630px;
      background: #0a0a0b;
      font-family: 'JetBrains Mono', monospace;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 64px;
    }
    
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 28px;
      height: 100%;
      justify-content: center;
    }
    
    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .logo-prompt {
      color: #22c55e;
      font-size: 24px;
      font-weight: 700;
    }
    
    .logo-text {
      color: #fafafa;
      font-size: 20px;
      font-weight: 500;
    }
    
    .score-container {
      display: flex;
      align-items: baseline;
      gap: 4px;
    }
    
    .score-number {
      color: #f59e0b;
      font-size: 160px;
      font-weight: 900;
      line-height: 1;
    }
    
    .score-denom {
      color: #71717a;
      font-size: 56px;
      font-weight: 400;
      line-height: 1;
    }
    
    .verdict {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .verdict-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: ${color};
    }
    
    .verdict-text {
      color: ${color};
      font-size: 20px;
      font-weight: 400;
    }
    
    .lang-info {
      color: #71717a;
      font-size: 16px;
    }
    
    .quote {
      color: #fafafa;
      font-size: 22px;
      text-align: center;
      line-height: 1.5;
      max-width: 100%;
      font-family: 'Geist', sans-serif;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <span class="logo-prompt">&gt;</span>
      <span class="logo-text">devroast</span>
    </div>
    <div class="score-container">
      <span class="score-number">${score}</span>
      <span class="score-denom">/10</span>
    </div>
    <div class="verdict">
      <div class="verdict-dot"></div>
      <span class="verdict-text">${verdictLabel}</span>
    </div>
    <span class="lang-info">lang: ${language}</span>
    <span class="quote">"${quote}"</span>
  </div>
</body>
</html>
  `.trim();

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
```

- [ ] **Step 2: Test the endpoint manually**

Run: `npm run dev`
Visit: `http://localhost:3000/api/og?score=3.5&verdict=needs_serious_help&language=javascript&title=test&quote=this+is+a+test`
Expected: HTML page with OG design rendered

- [ ] **Step 3: Commit**

```bash
git add src/app/api/og/route.ts
git commit -m "feat: add OG image HTML endpoint for roast results"
```

---

## Task 2: Add Takumi API Key to Environment

**Files:**
- Modify: `.env`
- Modify: `.env.example`

- [ ] **Step 1: Add TAKUMI_API_KEY to .env**

Add to `.env`:
```
TAKUMI_API_KEY=your_api_key_here
```

- [ ] **Step 2: Add to .env.example**

Add to `.env.example`:
```
TAKUMI_API_KEY=
```

- [ ] **Step 3: Commit**

```bash
git add .env .env.example
git commit -m "chore: add TAKUMI_API_KEY environment variable"
```

---

## Task 3: Create Takumi Generation Endpoint (Optional - for programmatic use)

**Files:**
- Create: `src/app/api/generate-og/route.ts`
- Test: Manual - send POST request with roast data

Note: This endpoint is optional if you're just using the og:image meta tag directly. The Takumi would need to fetch the URL externally. This endpoint can be used if you want to programmatically generate images.

- [ ] **Step 1: Create the generate-og route file**

```typescript
// src/app/api/generate-og/route.ts
import { NextRequest, NextResponse } from "next/server";

interface GenerateOGRequest {
  score: string;
  verdict: string;
  language: string;
  title: string;
  quote: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateOGRequest = await request.json();
    const { score, verdict, language, title, quote } = body;

    const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
    const ogUrl = new URL(`${baseUrl}/api/og`);
    ogUrl.searchParams.set("score", score);
    ogUrl.searchParams.set("verdict", verdict);
    ogUrl.searchParams.set("language", language);
    ogUrl.searchParams.set("title", title);
    ogUrl.searchParams.set("quote", quote.slice(0, 100));

    const takumiApiKey = process.env.TAKUMI_API_KEY;

    if (!takumiApiKey) {
      return NextResponse.json(
        { error: "TAKUMI_API_KEY not configured" },
        { status: 500 }
      );
    }

    const takumiResponse = await fetch("https://api.takumi.ink/v1/generation", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${takumiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_url: ogUrl.toString(),
      }),
    });

    if (!takumiResponse.ok) {
      const error = await takumiResponse.text();
      return NextResponse.json(
        { error: "Failed to generate image", details: error },
        { status: takumiResponse.status }
      );
    }

    const result = await takumiResponse.json();
    return NextResponse.json({ imageUrl: result.image_url });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal error", details: String(error) },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/generate-og/route.ts
git commit -m "feat: add Takumi generation endpoint for OG images"
```

---

## Task 4: Update Roast Page Metadata

**Files:**
- Modify: `src/app/roast/[id]/page.tsx`

- [ ] **Step 1: Update generateMetadata to include og:image**

Replace the existing `generateMetadata` function with:

```typescript
export async function generateMetadata({ params }: RoastResultPageProps) {
  const { id } = await params;
  try {
    const data = await getRoastData(id);
    const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
    const truncatedQuote = data.title.slice(0, 100);
    
    const ogUrl = new URL(`${baseUrl}/api/og`);
    ogUrl.searchParams.set("score", String(data.score));
    ogUrl.searchParams.set("verdict", data.verdict);
    ogUrl.searchParams.set("language", data.language);
    ogUrl.searchParams.set("title", data.title);
    ogUrl.searchParams.set("quote", truncatedQuote);

    return {
      title: `Roast Result: ${data.score}/10 | DevRoast`,
      description: data.title,
      openGraph: {
        images: [ogUrl.toString()],
      },
    };
  } catch {
    return { title: "Roast Result | DevRoast" };
  }
}
```

- [ ] **Step 2: Test the metadata**

Run: `npm run dev`
Visit: `http://localhost:3000/roast/some-valid-id`
Inspect: View page source or use Facebook Debugger to see og:image meta tag

- [ ] **Step 3: Commit**

```bash
git add src/app/roast/[id]/page.tsx
git commit -m "feat: add OpenGraph image to roast result page"
```

---

## Task 5: Add NEXT_PUBLIC_URL to Environment

**Files:**
- Modify: `.env`
- Modify: `.env.example`

- [ ] **Step 1: Add NEXT_PUBLIC_URL to .env**

Add to `.env`:
```
NEXT_PUBLIC_URL=http://localhost:3000
```

- [ ] **Step 2: Add to .env.example**

Add to `.env.example`:
```
NEXT_PUBLIC_URL=http://localhost:3000
```

- [ ] **Step 3: Commit**

```bash
git add .env .env.example
git commit -m "chore: add NEXT_PUBLIC_URL environment variable"
```

---

## Summary

After completing these tasks:
1. `/api/og?score=3.5&verdict=...` returns HTML with OG design
2. Roast pages have `og:image` meta tag pointing to the OG endpoint
3. When shared on social media, the image will be fetched and displayed

**Note:** For the image to be generated by Takumi, you need to expose the `/api/og` endpoint publicly (using ngrok, tunnel, or production deploy). The og:image meta tag works with any image URL - Takumi is used to generate it from the HTML endpoint.