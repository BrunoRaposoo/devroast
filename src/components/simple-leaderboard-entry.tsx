"use client";

import { Collapsible } from "@base-ui-components/react/collapsible";
import { SimpleCode } from "@/components/ui/simple-code";

interface SimpleLeaderboardEntryProps {
	id: string;
	code: string;
	language: string;
	score: number;
	index: number;
}

export function SimpleLeaderboardEntry({
	code,
	language,
	score,
	index,
}: SimpleLeaderboardEntryProps) {
	const lines = code.split("\n");
	const needsExpansion = lines.length > 5;

	return (
		<article className="overflow-hidden rounded border border-border">
			<Collapsible.Root defaultOpen={!needsExpansion}>
				<div className="flex h-12 items-center justify-between border-b border-border bg-bg-surface px-5">
					<div className="flex items-center gap-4">
						<span className="font-mono text-xs font-bold text-accent-red">
							#{index + 1}
						</span>
						<span className="font-mono text-xs font-bold text-accent-red">
							{score.toFixed(1)}/10
						</span>
					</div>
					<div className="flex items-center gap-4">
						<span className="font-mono text-xs text-text-secondary">
							{language}
						</span>
						{needsExpansion && (
							<Collapsible.Trigger className="flex items-center gap-1 font-mono text-xs text-text-tertiary transition-colors hover:text-text-secondary">
								<span>expand</span>
								<span className="transition-transform ui-open:rotate-180">
									▼
								</span>
							</Collapsible.Trigger>
						)}
					</div>
				</div>

				<Collapsible.Panel className="bg-bg-surface">
					<SimpleCode code={code} language={language} />
				</Collapsible.Panel>
			</Collapsible.Root>
		</article>
	);
}
