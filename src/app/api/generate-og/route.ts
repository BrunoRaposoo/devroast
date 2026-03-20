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
				{ status: 500 },
			);
		}

		const takumiResponse = await fetch("https://api.takumi.ink/v1/generation", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${takumiApiKey}`,
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
				{ status: takumiResponse.status },
			);
		}

		const result = await takumiResponse.json();
		return NextResponse.json({ imageUrl: result.image_url });
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal error", details: String(error) },
			{ status: 500 },
		);
	}
}
