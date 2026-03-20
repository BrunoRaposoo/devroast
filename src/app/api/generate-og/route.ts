import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

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

		if (!score || !verdict || !language || !title || !quote) {
			return NextResponse.json(
				{
					error:
						"Missing required fields: score, verdict, language, title, quote",
				},
				{ status: 400 },
			);
		}

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
				{ error: "Server configuration error" },
				{ status: 500 },
			);
		}

		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 30000);

		const takumiResponse = await fetch("https://api.takumi.ink/v1/generation", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${takumiApiKey}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				image_url: ogUrl.toString(),
			}),
			signal: controller.signal,
		});

		clearTimeout(timeoutId);

		if (!takumiResponse.ok) {
			return NextResponse.json(
				{ error: "Failed to generate image" },
				{ status: takumiResponse.status },
			);
		}

		const result = await takumiResponse.json();
		return NextResponse.json({ imageUrl: result.image_url });
	} catch (error) {
		if (error instanceof Error && error.name === "AbortError") {
			return NextResponse.json({ error: "Request timed out" }, { status: 504 });
		}
		return NextResponse.json(
			{ error: "Failed to generate image" },
			{ status: 500 },
		);
	}
}
