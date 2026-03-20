import { asc, gt, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { codeSubmissions, roastResults } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

const cursorSchema = z.object({
	id: z.string(),
	score: z.string(),
});

export const leaderboardRouter = createTRPCRouter({
	getTopWorst: baseProcedure.query(async () => {
		const results = await db
			.select({
				id: codeSubmissions.id,
				code: codeSubmissions.code,
				language: codeSubmissions.language,
				score: roastResults.score,
			})
			.from(roastResults)
			.innerJoin(
				codeSubmissions,
				sql`${roastResults.submissionId} = ${codeSubmissions.id}`,
			)
			.orderBy(asc(roastResults.score))
			.limit(3);

		return results.map((r) => ({
			id: r.id,
			code: r.code,
			language: r.language,
			score: Number(r.score),
		}));
	}),

	getLeaderboardPage: baseProcedure
		.input(
			z.object({
				cursor: cursorSchema.nullish(),
				limit: z.number().min(1).max(20).default(10),
			}),
		)
		.query(async ({ input }) => {
			const { cursor, limit } = input;

			const results = cursor
				? await db
						.select({
							id: codeSubmissions.id,
							code: codeSubmissions.code,
							language: codeSubmissions.language,
							score: roastResults.score,
						})
						.from(roastResults)
						.innerJoin(
							codeSubmissions,
							sql`${roastResults.submissionId} = ${codeSubmissions.id}`,
						)
						.where(gt(roastResults.score, cursor.score))
						.orderBy(asc(roastResults.score), sql`${codeSubmissions.id} DESC`)
						.limit(limit + 1)
				: await db
						.select({
							id: codeSubmissions.id,
							code: codeSubmissions.code,
							language: codeSubmissions.language,
							score: roastResults.score,
						})
						.from(roastResults)
						.innerJoin(
							codeSubmissions,
							sql`${roastResults.submissionId} = ${codeSubmissions.id}`,
						)
						.orderBy(asc(roastResults.score), sql`${codeSubmissions.id} DESC`)
						.limit(limit + 1);

			const hasMore = results.length > limit;
			const items = hasMore ? results.slice(0, -1) : results;
			const nextCursor = hasMore
				? {
						id: items[items.length - 1].id,
						score: items[items.length - 1].score,
					}
				: null;

			return {
				items: items.map((r) => ({
					id: r.id,
					code: r.code,
					language: r.language,
					score: Number(r.score),
				})),
				nextCursor,
			};
		}),
});
