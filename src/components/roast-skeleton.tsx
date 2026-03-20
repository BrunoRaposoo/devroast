export function RoastSkeleton() {
	return (
		<div className="flex animate-pulse flex-col gap-6">
			<div className="flex items-center gap-12">
				<div className="h-24 w-24 rounded-full bg-border" />
				<div className="flex flex-1 flex-col gap-3">
					<div className="h-6 w-48 rounded bg-border" />
					<div className="h-4 w-32 rounded bg-border" />
				</div>
			</div>
			<div className="h-px bg-border" />
			<div className="h-48 rounded bg-border" />
			<div className="h-px bg-border" />
			<div className="grid grid-cols-2 gap-4">
				{[1, 2, 3, 4].map((i) => (
					<div key={i} className="h-40 rounded bg-border" />
				))}
			</div>
		</div>
	);
}
