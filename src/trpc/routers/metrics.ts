import { sql } from "drizzle-orm";
import { db } from "@/db";
import { codeSubmissions, roastResults } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const metricsRouter = createTRPCRouter({
	getStats: baseProcedure.query(async () => {
		const [totalSubmissions] = await db
			.select({ count: sql<number>`count(*)` })
			.from(codeSubmissions);

		const [avgResult] = await db
			.select({ avg: sql<number>`avg(${roastResults.score})` })
			.from(roastResults);

		const totalRoasts = totalSubmissions?.count ?? 0;
		const avgScore = avgResult?.avg ? Number(avgResult.avg) : 0;

		return {
			totalRoasts,
			avgScore: Math.round(avgScore * 10) / 10,
		};
	}),
});
