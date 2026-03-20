interface AnalysisItem {
	title: string;
	description: string;
	severity: "critical" | "warning";
}

interface RoastAnalysisCardProps {
	item: AnalysisItem;
}

export function RoastAnalysisCard({ item }: RoastAnalysisCardProps) {
	return (
		<div className="rounded border border-border bg-bg-surface p-5">
			<div className="mb-3 flex items-center gap-2">
				<span
					className={`h-2 w-2 rounded-full ${
						item.severity === "critical" ? "bg-accent-red" : "bg-accent-amber"
					}`}
				/>
				<span
					className={`font-mono text-xs font-medium ${
						item.severity === "critical"
							? "text-accent-red"
							: "text-accent-amber"
					}`}
				>
					{item.severity}
				</span>
			</div>
			<h3 className="mb-2 font-mono text-sm font-medium text-text-primary">
				{item.title}
			</h3>
			<p className="font-mono text-xs text-text-secondary">
				{item.description}
			</p>
		</div>
	);
}
