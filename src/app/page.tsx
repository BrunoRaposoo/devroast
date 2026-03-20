import Link from "next/link";
import { Suspense } from "react";
import { CodeEditorSection } from "@/components/code-editor-section";
import { HomepageLeaderboard } from "@/components/homepage-leaderboard";
import { Metrics } from "@/components/metrics-server";
import { createTRPCContext } from "@/trpc/init";
import { appRouter } from "@/trpc/routers/_app";

export const revalidate = 3600;

async function getLeaderboardData() {
	const ctx = await createTRPCContext();
	const caller = appRouter.createCaller(ctx);
	return caller.leaderboard.getTopWorst();
}

async function getMetricsData() {
	const ctx = await createTRPCContext();
	const caller = appRouter.createCaller(ctx);
	return caller.metrics.getStats();
}

function LeaderboardSkeleton() {
	return (
		<div className="flex flex-col gap-4">
			{[1, 2, 3].map((i) => (
				<div key={i} className="overflow-hidden rounded border border-border">
					<div className="flex h-12 items-center justify-between border-b border-border bg-bg-surface px-5">
						<div className="flex items-center gap-4">
							<div className="h-4 w-6 animate-pulse rounded bg-border" />
							<div className="h-4 w-8 animate-pulse rounded bg-border" />
						</div>
						<div className="h-4 w-12 animate-pulse rounded bg-border" />
					</div>
					<div className="h-32 animate-pulse bg-bg-surface" />
				</div>
			))}
		</div>
	);
}

export default function Home() {
	const leaderboardPromise = getLeaderboardData();
	const metricsPromise = getMetricsData();

	return (
		<div className="flex flex-col items-center gap-8 px-4 py-12 md:px-10 md:py-20">
			<section className="flex flex-col items-center gap-3 text-center">
				<h1 className="flex flex-col items-center gap-2 font-mono text-2xl font-bold text-text-primary md:flex-row md:text-4xl">
					<span className="text-accent-green">$</span>
					<span>paste your code. get roasted.</span>
				</h1>
				<p className="font-mono text-xs text-text-secondary md:text-sm">
					{
						"// drop your code below and we'll rate it — brutally honest or full roast mode"
					}
				</p>
			</section>

			<CodeEditorSection />

			<section className="flex items-center gap-4 font-mono text-xs text-text-tertiary md:gap-6">
				<Metrics promise={metricsPromise} />
			</section>

			<section className="mt-4 flex w-full max-w-[960px] flex-col gap-4 md:mt-8 md:gap-6">
				<div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
					<div className="flex items-center gap-2">
						<span className="font-mono text-sm font-bold text-accent-green">
							{"//"}
						</span>
						<span className="font-mono text-sm font-bold text-text-primary">
							shame_leaderboard
						</span>
					</div>
					<Link
						href="/leaderboard"
						className="rounded border border-border px-3 py-1.5"
					>
						<span className="font-mono text-xs text-text-secondary">
							$ view_all &gt;&gt;
						</span>
					</Link>
				</div>
				<p className="font-mono text-xs text-text-tertiary md:text-sm">
					{"// the worst code on the internet, ranked by shame"}
				</p>

				<Suspense fallback={<LeaderboardSkeleton />}>
					<HomepageLeaderboard promise={leaderboardPromise} />
				</Suspense>
			</section>

			<div className="h-8 md:h-16" />
		</div>
	);
}
