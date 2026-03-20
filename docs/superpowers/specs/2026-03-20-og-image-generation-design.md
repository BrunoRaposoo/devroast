# OG Image Generation for Roast Results

**Date**: 2026-03-20  
**Status**: Draft  
**Feature**: Generate OpenGraph images for shared roast results

## Overview

When a user shares a roast result link, the system should automatically generate an OpenGraph image with the roast details (score, verdict, language, title, feedback quote). The image will be generated on-demand when someone accesses the sharing page, using Takumi to fetch an HTML endpoint and generate the image.

## Architecture

```
[User] → GET /roast/[id]
           → Page renders with meta tags
           → og:image points to /api/og?params
           → Takumi fetches /api/og and generates image
```

## Data Flow

1. User visits `/roast/[id]` page
2. Page fetches roast data via tRPC
3. GenerateMetadata creates og:image URL with query params
4. Meta tags include `og:image` pointing to internal API
5. When shared on social media, Takumi fetches the URL and generates image

## Components

### 1. OG HTML Endpoint (`/api/og`)

**File**: `src/app/api/og/route.ts`

- **Input**: Query parameters
  - `score` (string, e.g., "3.5")
  - `verdict` (enum: needs_serious_help, needs_work, acceptable, good)
  - `language` (string)
  - `title` (string)
  - `quote` (string, truncated feedback)

- **Output**: HTML with design matching Screen 4 - OG Image (1200x630)
- **Design Elements**:
  - Logo: "> devroast" with accent-green
  - Score: large number (e.g., "3.5") in accent-amber, "/10" in tertiary
  - Verdict: colored dot + text (red for needs_serious_help)
  - Language info: "lang: javascript · 7 lines"
  - Quote: truncated feedback in quotes

- **Headers**: Cache-Control for performance

### 2. Takumi Integration (`/api/generate-og`)

**File**: `src/app/api/generate-og/route.ts`

- **Input**: POST body with roast data
- **Action**: Calls Takumi API with the OG endpoint URL
- **Output**: Returns URL of generated image
- **Environment**: `TAKUMI_API_KEY` in .env

### 3. Metadata Update (`/roast/[id]/page.tsx`)

- Update `generateMetadata` to include `openGraph.images`
- Build og:image URL with query params from roast data

## Implementation Notes

1. **Local Development**: Since Takumi needs to fetch the URL, for local development use `ngrok` or similar to expose localhost, or run Takumi on same machine/network
2. **Quote Truncation**: Limit feedback to ~100 chars for OG image layout
3. **Cache Strategy**: Add appropriate cache headers to OG endpoint

## Dependencies

- Takumi API (https://takumi.kane.tw)
- Environment variable: `TAKUMI_API_KEY`

## File Changes

1. Create: `src/app/api/og/route.ts`
2. Create: `src/app/api/generate-og/route.ts`
3. Update: `src/app/roast/[id]/page.tsx` - add generateMetadata