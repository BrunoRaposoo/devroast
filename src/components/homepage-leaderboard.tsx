import { codeToHtml } from "shiki";
import { LeaderboardEntry } from "@/components/leaderboard-entry";

interface LeaderboardItem {
	id: string;
	code: string;
	language: string;
	score: number;
}

interface HomepageLeaderboardProps {
	promise: Promise<LeaderboardItem[]>;
}

export async function HomepageLeaderboard({
	promise,
}: HomepageLeaderboardProps) {
	const entries = await promise;

	const entriesWithHtml = await Promise.all(
		entries.map(async (entry) => {
			const lines = entry.code.split("\n");
			const highlighted = await codeToHtml(entry.code, {
				lang: entry.language,
				theme: "vesper",
			});
			const lineNumbers = lines.map((_, i) => i + 1);

			return {
				...entry,
				highlightedHtml: highlighted,
				lineNumbers,
			};
		}),
	);

	return (
		<div className="flex flex-col gap-4">
			{entriesWithHtml.map((entry, index) => (
				<LeaderboardEntry
					key={entry.id}
					id={entry.id}
					highlightedHtml={entry.highlightedHtml}
					lineNumbers={entry.lineNumbers}
					language={entry.language}
					score={entry.score}
					index={index}
				/>
			))}
		</div>
	);
}
