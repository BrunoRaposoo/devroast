import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { codeSubmissions, roastResults } from "@/db/schema";
import { openai } from "@/lib/openai";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

const sarcasticSystemPrompt = `Você é um crítico de código sarcástico e implacável. Analise código e forneça feedback humorístico mas preciso. Seja cruel de forma criativa. Responda apenas em JSON.`;

const constructiveSystemPrompt = `Você é um mentor de código paciente e prestativo. Analise código e forneça feedback construtivo com sugestões práticas de melhoria. Responda apenas em JSON.`;

type RoastResponse = {
	score: number;
	title: string;
	verdict: "needs_serious_help" | "needs_work" | "acceptable" | "good";
	analysis: Array<{
		title: string;
		description: string;
		severity: "critical" | "warning";
	}>;
};

export const roastRouter = createTRPCRouter({
	create: baseProcedure
		.input(
			z.object({
				code: z.string().min(1),
				language: z.string(),
				roastMode: z.enum(["sarcastic", "constructive"]),
			}),
		)
		.mutation(async ({ input }) => {
			const systemPrompt =
				input.roastMode === "sarcastic"
					? sarcasticSystemPrompt
					: constructiveSystemPrompt;

			let parsed: RoastResponse | undefined;

			for (let attempt = 0; attempt < 2; attempt++) {
				try {
					const completion = await openai.chat.completions.create({
						model: "gpt-4o",
						messages: [
							{ role: "system", content: systemPrompt },
							{
								role: "user",
								content: `Analise este código ${input.language}:\n\n\`\`\`${input.language}\n${input.code}\n\`\`\`\n\nForneça um JSON com:\n{\n  "score": number (0-10),\n  "title": string,\n  "verdict": "needs_serious_help" | "needs_work" | "acceptable" | "good",\n  "analysis": [\n    {\n      "title": string,\n      "description": string,\n      "severity": "critical" | "warning"\n    }\n  ]\n}\n\nRetorne APENAS o JSON válido.`,
							},
						],
						response_format: { type: "json_object" },
					});

					const content = completion.choices[0].message.content;
					if (!content) throw new Error("No response from OpenAI");

					parsed = JSON.parse(content);
					break;
				} catch {
					// Retry once on JSON parse failure
				}
			}

			if (!parsed) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to generate roast. Please try again.",
				});
			}

			const [submission] = await db
				.insert(codeSubmissions)
				.values({
					code: input.code,
					language: input.language as
						| "javascript"
						| "typescript"
						| "python"
						| "rust"
						| "go"
						| "java"
						| "c"
						| "cpp"
						| "csharp"
						| "php"
						| "ruby"
						| "swift"
						| "kotlin"
						| "sql"
						| "html"
						| "css"
						| "json"
						| "yaml"
						| "markdown"
						| "bash"
						| "other",
					sessionId: crypto.randomUUID(),
				})
				.returning();

			const [roast] = await db
				.insert(roastResults)
				.values({
					submissionId: submission.id,
					score: parsed.score.toString(),
					roastMode: input.roastMode,
					title: parsed.title,
					verdict: parsed.verdict,
					analysis: parsed.analysis,
					feedback: parsed.analysis.map((a) => a.description).join("\n"),
				})
				.returning();

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
