"use client";

import NumberFlow from "@number-flow/react";
import { useEffect, useState } from "react";

interface Stats {
	totalRoasts: number;
	avgScore: number;
}

interface MetricsClientProps {
	promise: Promise<Stats>;
}

export function MetricsClient({ promise }: MetricsClientProps) {
	const [data, setData] = useState<Stats | null>(null);

	const [displayTotalRoasts, setDisplayTotalRoasts] = useState(0);
	const [displayAvgScore, setDisplayAvgScore] = useState(0);

	useEffect(() => {
		promise.then((stats) => {
			setData(stats);

			const duration = 1000;
			const steps = 30;
			const interval = duration / steps;

			const targetTotal = stats.totalRoasts;
			const targetAvg = stats.avgScore;

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
		});
	}, [promise]);

	if (!data) {
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
