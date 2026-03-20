import { Suspense } from "react";
import { LeaderboardList } from "@/components/leaderboard-list";
import { LeaderboardSkeleton } from "@/components/leaderboard-skeleton";
import { createTRPCContext } from "@/trpc/init";
import { appRouter } from "@/trpc/routers/_app";

async function getLeaderboardData() {
	const ctx = await createTRPCContext();
	const caller = appRouter.createCaller(ctx);
	return caller.leaderboard.getLeaderboardPage({ limit: 10 });
}

export const metadata = {
	title: "Shame Leaderboard | DevRoast",
	description: "The most roasted code on the internet",
};

export default async function LeaderboardPage() {
	const initialData = await getLeaderboardData();

	return (
		<div className="flex flex-col gap-10 px-5 py-10 md:px-20 md:py-16">
			<section className="flex flex-col gap-4">
				<div className="flex items-center gap-3">
					<span className="font-mono text-3xl font-bold text-accent-green">
						{`>`}
					</span>
					<h1 className="font-mono text-3xl font-bold text-text-primary">
						shame_leaderboard
					</h1>
				</div>
				<p className="font-mono text-sm text-text-secondary">
					{`// the worst code on the internet, ranked by shame`}
				</p>
			</section>

			<section className="flex flex-col gap-5">
				<Suspense fallback={<LeaderboardSkeleton count={10} />}>
					<LeaderboardList initialData={initialData} />
				</Suspense>
			</section>
		</div>
	);
}
