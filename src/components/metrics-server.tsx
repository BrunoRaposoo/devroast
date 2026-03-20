import { Suspense } from "react";
import { MetricsClient } from "@/components/metrics-client";

interface Stats {
	totalRoasts: number;
	avgScore: number;
}

interface MetricsProps {
	promise: Promise<Stats>;
}

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

export async function Metrics({ promise }: MetricsProps) {
	return (
		<Suspense fallback={<MetricsSkeleton />}>
			<MetricsClient promise={promise} />
		</Suspense>
	);
}
