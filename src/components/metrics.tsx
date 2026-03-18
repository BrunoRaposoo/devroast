"use client";

import NumberFlow from "@number-flow/react";
import { useQuery } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { useEffect, useState } from "react";
import type { AppRouter } from "@/trpc/routers/_app";

const trpcClient = createTRPCClient<AppRouter>({
	links: [
		httpBatchLink({
			url: `/api/trpc`,
		}),
	],
});

function MetricsSkeleton() {
	return (
		<div className="flex items-center gap-6">
			<div className="flex flex-col items-center gap-1">
				<div className="h-7 w-16 animate-pulse rounded bg-border" />
				<div className="h-3 w-12 animate-pulse rounded bg-border" />
			</div>
			<span className="text-text-tertiary">·</span>
			<div className="flex flex-col items-center gap-1">
				<div className="h-7 w-12 animate-pulse rounded bg-border" />
				<div className="h-3 w-12 animate-pulse rounded bg-border" />
			</div>
		</div>
	);
}

function MetricsContent() {
	const [displayTotalRoasts, setDisplayTotalRoasts] = useState(0);
	const [displayAvgScore, setDisplayAvgScore] = useState(0);

	const { data, isLoading } = useQuery({
		queryKey: ["metrics", "getStats"],
		queryFn: () => trpcClient.metrics.getStats.query(),
	});

	useEffect(() => {
		if (data && !isLoading) {
			const duration = 1000;
			const steps = 30;
			const interval = duration / steps;

			const targetTotal = Number(data.totalRoasts);
			const targetAvg = Number(data.avgScore);

			let step = 0;
			const timer = setInterval(() => {
				step++;
				const progress = step / steps;
				const eased = 1 - (1 - progress) ** 3;

				setDisplayTotalRoasts(Math.round(targetTotal * eased));
				setDisplayAvgScore(Math.round(targetAvg * eased * 10) / 10);

				if (step >= steps) {
					clearInterval(timer);
					setDisplayTotalRoasts(targetTotal);
					setDisplayAvgScore(targetAvg);
				}
			}, interval);

			return () => clearInterval(timer);
		}
	}, [data, isLoading]);

	if (isLoading || !data) {
		return <MetricsSkeleton />;
	}

	return (
		<div className="flex items-center gap-6">
			<div className="flex flex-col items-center gap-1">
				<span className="font-mono text-lg font-bold text-text-primary">
					<NumberFlow
						value={displayTotalRoasts}
						format={{ maximumFractionDigits: 0 }}
					/>
				</span>
				<span className="font-mono text-xs text-text-tertiary">
					codes roasted
				</span>
			</div>
			<span className="text-text-tertiary">·</span>
			<div className="flex flex-col items-center gap-1">
				<span className="font-mono text-lg font-bold text-text-primary">
					<NumberFlow
						value={displayAvgScore}
						format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
					/>
					/10
				</span>
				<span className="font-mono text-xs text-text-tertiary">avg score</span>
			</div>
		</div>
	);
}

export function Metrics() {
	return <MetricsContent />;
}
