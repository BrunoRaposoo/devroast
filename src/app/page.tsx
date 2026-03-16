"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";

const LINE_NUMBERS = Array.from({ length: 20 }, (_, i) => i + 1);

export default function Home() {
	const [roastMode, setRoastMode] = useState(false);
	const [code, setCode] = useState("");

	return (
		<div className="flex flex-col items-center gap-8 px-4 py-12 md:px-10 md:py-20">
			<section className="flex flex-col items-center gap-3 text-center">
				<h1 className="flex flex-col items-center gap-2 font-mono text-2xl font-bold text-text-primary md:flex-row md:text-4xl">
					<span className="text-accent-green">$</span>
					<span>paste your code. get roasted.</span>
				</h1>
				<p className="font-mono text-xs text-text-secondary md:text-sm">
					{
						"// drop your code below and we'll rate it — brutally honest or full roast mode"
					}
				</p>
			</section>

			<section className="w-full max-w-[780px] overflow-hidden rounded-md border border-border bg-bg-surface">
				<div className="flex h-10 items-center gap-3 border-b border-border px-4">
					<span className="h-2.5 w-2.5 rounded-full bg-[#EF4444]" />
					<span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />
					<span className="h-2.5 w-2.5 rounded-full bg-[#10B981]" />
				</div>
				<div className="flex">
					<div className="hidden w-12 flex-col items-end gap-2 bg-bg-surface px-3 py-4 pt-4 text-right font-mono text-xs text-text-tertiary md:flex">
						{LINE_NUMBERS.map((num) => (
							<span key={`ln-${num}`}>{num}</span>
						))}
					</div>
					<textarea
						value={code}
						onChange={(e) => setCode(e.target.value)}
						placeholder={"// paste your code here..."}
						className="h-80 w-full resize-none bg-bg-surface p-4 font-mono text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none"
					/>
				</div>
			</section>

			<section className="flex w-full max-w-[780px] flex-col items-start justify-between gap-4 md:flex-row md:items-center">
				<div className="flex flex-wrap items-center gap-4 md:gap-6">
					<div className="flex items-center gap-2.5">
						<Toggle pressed={roastMode} onPressedChange={setRoastMode} />
						<span className="font-mono text-sm text-accent-green">
							roast mode
						</span>
					</div>
					<span className="font-mono text-xs text-text-tertiary">
						{"// maximum sarcasm enabled"}
					</span>
				</div>
				<Button variant="primary">$ roast_my_code</Button>
			</section>

			<section className="flex items-center gap-4 font-mono text-xs text-text-tertiary md:gap-6">
				<span>2,847 codes roasted</span>
				<span>·</span>
				<span>avg score: 4.2/10</span>
			</section>

			<section className="mt-4 flex w-full max-w-[960px] flex-col gap-4 md:mt-8 md:gap-6">
				<div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
					<div className="flex items-center gap-2">
						<span className="font-mono text-sm font-bold text-accent-green">
							{"//"}
						</span>
						<span className="font-mono text-sm font-bold text-text-primary">
							shame_leaderboard
						</span>
					</div>
					<div className="rounded border border-border px-3 py-1.5">
						<span className="font-mono text-xs text-text-secondary">
							$ view_all &gt;&gt;
						</span>
					</div>
				</div>
				<p className="font-mono text-xs text-text-tertiary md:text-sm">
					{"// the worst code on the internet, ranked by shame"}
				</p>

				<div className="w-full overflow-hidden rounded border border-border">
					<div className="flex h-10 items-center bg-bg-surface px-3 text-text-tertiary md:px-5">
						<span className="w-8 font-mono text-xs font-medium md:w-12">#</span>
						<span className="w-12 font-mono text-xs font-medium md:w-16">
							score
						</span>
						<span className="flex-1 font-mono text-xs font-medium">code</span>
						<span className="w-20 font-mono text-xs font-medium md:w-24">
							lang
						</span>
					</div>

					{[
						{
							rank: 1,
							score: "1.2",
							code: [
								"eval(prompt('enter code'))",
								"document.write(response)",
								"// trust the user lol",
							],
							lang: "javascript",
						},
						{
							rank: 2,
							score: "2.1",
							code: ["function hack() {", "  return true;", "}"],
							lang: "python",
						},
						{
							rank: 3,
							score: "2.8",
							code: ["SELECT * FROM users", "WHERE 1=1 --"],
							lang: "sql",
						},
					].map((item) => (
						<div
							key={item.rank}
							className="flex border-b border-border px-3 py-3 md:px-5 md:py-4"
						>
							<span className="w-8 font-mono text-xs text-text-secondary md:w-12">
								{item.rank}
							</span>
							<span className="w-12 font-mono text-xs font-bold text-accent-red md:w-16">
								{item.score}
							</span>
							<div className="flex-1 space-y-0.5 overflow-hidden">
								{item.code.map((line) => (
									<p
										key={line}
										className="truncate font-mono text-xs text-text-primary md:overflow-visible"
									>
										{line}
									</p>
								))}
							</div>
							<span className="w-20 overflow-hidden text-ellipsis font-mono text-xs text-text-secondary md:w-24 md:overflow-visible">
								{item.lang}
							</span>
						</div>
					))}
				</div>
			</section>

			<div className="h-8 md:h-16" />
		</div>
	);
}
