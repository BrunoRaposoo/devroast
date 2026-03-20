import { notFound } from "next/navigation";
import { RoastAnalysisCard } from "@/components/roast-analysis-card";
import { RoastResultHeader } from "@/components/roast-result-header";
import { CodeBlock } from "@/components/ui/code-block";
import { createTRPCContext } from "@/trpc/init";
import { appRouter } from "@/trpc/routers/_app";

interface AnalysisItem {
	title: string;
	description: string;
	severity: "critical" | "warning";
}

interface RoastData {
	id: string;
	score: number;
	title: string;
	verdict: "needs_serious_help" | "needs_work" | "acceptable" | "good";
	roastMode: "sarcastic" | "constructive";
	language: string;
	code: string;
	analysis: AnalysisItem[];
}

interface RoastResultPageProps {
	params: Promise<{ id: string }>;
}

async function getRoastData(id: string): Promise<RoastData> {
	const ctx = await createTRPCContext();
	const caller = appRouter.createCaller(ctx);
	return caller.roast.getById({ id }) as Promise<RoastData>;
}

export async function generateMetadata({ params }: RoastResultPageProps) {
	const { id } = await params;
	try {
		const data = await getRoastData(id);
		return {
			title: `Roast Result: ${data.score}/10 | DevRoast`,
			description: data.title,
		};
	} catch {
		return { title: "Roast Result | DevRoast" };
	}
}

export default async function RoastResultPage({
	params,
}: RoastResultPageProps) {
	const { id } = await params;

	let data: RoastData;
	try {
		data = await getRoastData(id);
	} catch {
		notFound();
	}

	const lines = data.code.split("\n").length;

	return (
		<div className="mx-auto flex max-w-4xl flex-col gap-10 px-5 py-10 md:px-20 md:py-16">
			<RoastResultHeader
				score={data.score}
				title={data.title}
				verdict={data.verdict}
				language={data.language}
				lines={lines}
			/>

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
					{data.analysis.map((item) => (
						<RoastAnalysisCard key={item.title} item={item} />
					))}
				</div>
			</section>
		</div>
	);
}
