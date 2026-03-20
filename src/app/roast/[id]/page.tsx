import { CodeBlock } from "@/components/ui/code-block";
import { ScoreRing } from "@/components/ui/score-ring";

const STATIC_ROAST_DATA = {
	id: "123e4567-e89b-12d3-a456-426614174000",
	score: 3.5,
	language: "javascript",
	lines: 7,
	roastMode: "sarcastic",
	verdict: "needs_serious_help",
	title:
		"this code looks like it was written during a power outage... in 2005.",
	code: `function calculate() {
  let x = 10;
  let result = x * 2;
  return result;
}`,
	analysis: [
		{
			severity: "critical",
			title: "Naming catastrophe",
			description:
				"Variables named 'x' and 'result' tell us absolutely nothing about what they represent. Future you will not remember what this does.",
		},
		{
			severity: "critical",
			title: "Magic numbers everywhere",
			description:
				"The number 10 appears out of nowhere. What does it mean? Why 10? The answer lies in a comment that doesn't exist.",
		},
		{
			severity: "warning",
			title: "No type safety",
			description:
				"This is JavaScript, but we're in 2024. TypeScript exists. Embrace it or be doomed to runtime errors.",
		},
		{
			severity: "warning",
			title: "Single responsibility? Never heard of it",
			description:
				"This function calculates AND returns. Consider separating concerns for better testability.",
		},
	],
	suggestedFix: {
		before: `function calculate() {
  let x = 10;
  let result = x * 2;
  return result;
}`,
		after: `function calculateTax(subtotal: number, taxRate: number = 0.1): number {
  if (subtotal <= 0) {
    throw new Error("Subtotal must be positive");
  }
  
  const tax = subtotal * taxRate;
  return subtotal + tax;
}`,
	},
};

export async function generateStaticParams() {
	return [{ id: STATIC_ROAST_DATA.id }];
}

export async function generateMetadata() {
	return {
		title: `Roast Result: ${STATIC_ROAST_DATA.score}/10 | DevRoast`,
		description: STATIC_ROAST_DATA.title,
	};
}

export default function RoastResultPage() {
	const data = STATIC_ROAST_DATA;

	return (
		<div className="mx-auto flex max-w-4xl flex-col gap-10 px-5 py-10 md:px-20 md:py-16">
			<section className="flex items-center gap-12">
				<ScoreRing value={data.score} size="lg" />

				<div className="flex flex-1 flex-col gap-4">
					<div className="flex items-center gap-2">
						<span className="h-2 w-2 rounded-full bg-accent-red" />
						<span className="font-mono text-sm font-medium text-accent-red">
							verdict: {data.verdict}
						</span>
					</div>

					<h1 className="font-mono text-xl font-normal leading-relaxed text-text-primary">
						"{data.title}"
					</h1>

					<div className="flex items-center gap-4">
						<span className="font-mono text-xs text-text-tertiary">
							lang: {data.language}
						</span>
						<span className="text-text-tertiary">·</span>
						<span className="font-mono text-xs text-text-tertiary">
							{data.lines} lines
						</span>
					</div>

					<div className="flex gap-3">
						<button
							type="button"
							className="rounded border border-border px-4 py-2 font-mono text-xs text-text-secondary transition-colors hover:bg-border"
						>
							share
						</button>
					</div>
				</div>
			</section>

			<div className="h-px w-full bg-border" />

			<section className="flex flex-col gap-4">
				<div className="flex items-center gap-2">
					<span className="font-mono text-sm font-bold text-accent-green">
						{"//"}
					</span>
					<span className="font-mono text-sm font-bold text-text-primary">
						your_submission
					</span>
				</div>

				<div className="overflow-hidden rounded border border-border bg-bg-input">
					<CodeBlock code={data.code} language={data.language} />
				</div>
			</section>

			<div className="h-px w-full bg-border" />

			<section className="flex flex-col gap-6">
				<div className="flex items-center gap-2">
					<span className="font-mono text-sm font-bold text-accent-green">
						{"//"}
					</span>
					<span className="font-mono text-sm font-bold text-text-primary">
						detailed_analysis
					</span>
				</div>

				<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
					{data.analysis.map((issue) => (
						<div
							key={issue.title}
							className="rounded border border-border bg-bg-surface p-5"
						>
							<div className="mb-3 flex items-center gap-2">
								<span
									className={`h-2 w-2 rounded-full ${
										issue.severity === "critical"
											? "bg-accent-red"
											: "bg-accent-amber"
									}`}
								/>
								<span
									className={`font-mono text-xs font-medium ${
										issue.severity === "critical"
											? "text-accent-red"
											: "text-accent-amber"
									}`}
								>
									{issue.severity}
								</span>
							</div>
							<h3 className="mb-2 font-mono text-sm font-medium text-text-primary">
								{issue.title}
							</h3>
							<p className="font-mono text-xs text-text-secondary">
								{issue.description}
							</p>
						</div>
					))}
				</div>
			</section>

			<div className="h-px w-full bg-border" />

			<section className="flex flex-col gap-6">
				<div className="flex items-center gap-2">
					<span className="font-mono text-sm font-bold text-accent-green">
						{"//"}
					</span>
					<span className="font-mono text-sm font-bold text-text-primary">
						suggested_fix
					</span>
				</div>

				<div className="overflow-hidden rounded border border-border bg-bg-input">
					<div className="flex h-10 items-center border-b border-border px-4">
						<span className="font-mono text-xs font-medium text-text-secondary">
							your_code.ts → improved_code.ts
						</span>
					</div>
					<CodeBlock code={data.suggestedFix.after} language="typescript" />
				</div>
			</section>
		</div>
	);
}
