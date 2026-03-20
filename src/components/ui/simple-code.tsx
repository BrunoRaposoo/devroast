"use client";

import { twMerge } from "tailwind-merge";

interface SimpleCodeProps {
	code: string;
	language: string;
	className?: string;
}

export function SimpleCode({ code, language, className }: SimpleCodeProps) {
	const lines = code.split("\n");

	return (
		<div
			className={twMerge(
				"w-full max-w-140 overflow-hidden rounded-md border border-border bg-input",
				className,
			)}
		>
			<div className="flex h-10 items-center gap-3 border-b border-border px-4">
				<span className="h-2.5 w-2.5 rounded-full bg-[#EF4444]" />
				<span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />
				<span className="h-2.5 w-2.5 rounded-full bg-[#10B981]" />
				<span className="flex-1" />
				<span className="font-mono text-xs text-text-tertiary">{language}</span>
			</div>
			<div className="flex font-mono text-[13px] leading-6">
				<div className="flex w-10 flex-col items-end gap-1.5 bg-bg-surface px-2.5 py-3 text-text-tertiary">
					{lines.map((_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: line numbers are stable
						<span key={`ln-${i}`}>{i + 1}</span>
					))}
				</div>
				<pre className="flex-1 overflow-x-auto bg-bg-surface px-3 py-3 text-text-secondary">
					<code>{code}</code>
				</pre>
			</div>
		</div>
	);
}
