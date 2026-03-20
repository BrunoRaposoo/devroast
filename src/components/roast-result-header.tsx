import { ScoreRing } from "@/components/ui/score-ring";

interface RoastResultHeaderProps {
	score: number;
	title: string;
	verdict: string;
	roastMode: string;
	language: string;
	lines: number;
}

export function RoastResultHeader({
	score,
	title,
	verdict,
	roastMode,
	language,
	lines,
}: RoastResultHeaderProps) {
	return (
		<section className="flex items-center gap-12">
			<ScoreRing value={score} size="lg" />
			<div className="flex flex-1 flex-col gap-4">
				<div className="flex items-center gap-2">
					<span className="h-2 w-2 rounded-full bg-accent-red" />
					<span className="font-mono text-sm font-medium text-accent-red">
						verdict: {verdict}
					</span>
				</div>
				<h1 className="font-mono text-xl font-normal leading-relaxed text-text-primary">
					"{title}"
				</h1>
				<div className="flex items-center gap-4">
					<span className="font-mono text-xs text-text-tertiary">
						lang: {language}
					</span>
					<span className="text-text-tertiary">·</span>
					<span className="font-mono text-xs text-text-tertiary">
						{lines} lines
					</span>
				</div>
			</div>
		</section>
	);
}
