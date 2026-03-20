export function LeaderboardSkeleton({ count = 5 }: { count?: number }) {
	return (
		<div className="flex flex-col gap-4">
			{Array.from({ length: count }).map((_, idx) => (
				<div
					// biome-ignore lint/suspicious/noArrayIndexKey: skeleton items have no stable identity
					key={`skeleton-${idx}`}
					className="overflow-hidden rounded border border-border"
				>
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

export function LeaderboardSkeletonItem() {
	return (
		<div className="overflow-hidden rounded border border-border">
			<div className="flex h-12 items-center justify-between border-b border-border bg-bg-surface px-5">
				<div className="flex items-center gap-4">
					<div className="h-4 w-6 animate-pulse rounded bg-border" />
					<div className="h-4 w-8 animate-pulse rounded bg-border" />
				</div>
				<div className="h-4 w-12 animate-pulse rounded bg-border" />
			</div>
			<div className="h-32 animate-pulse bg-bg-surface" />
		</div>
	);
}
