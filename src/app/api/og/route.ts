import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const score = searchParams.get("score") || "0";
	const verdict = searchParams.get("verdict") || "acceptable";
	const language = searchParams.get("language") || "other";
	const _title = searchParams.get("title") || "Roast Result";
	const quote = searchParams.get("quote") || "";
	const lines = searchParams.get("lines");

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
    <span class="lang-info">lang: ${language}${lines ? ` · ${lines} lines` : ''}</span>
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
