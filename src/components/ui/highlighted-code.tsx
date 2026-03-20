"use client";

import { twMerge } from "tailwind-merge";

interface HighlightedCodeProps {
	html: string;
	lineNumbers: number[];
	language: string;
	filename?: string;
	className?: string;
}

export function HighlightedCode({
	html,
	lineNumbers,
	filename,
	className,
}: HighlightedCodeProps) {
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
				{filename && (
					<span className="font-mono text-xs text-text-tertiary">
						{filename}
					</span>
				)}
			</div>
			<div className="flex font-mono text-[13px] leading-6">
				<div className="flex w-10 flex-col items-end gap-1.5 bg-bg-surface px-2.5 py-3 text-text-tertiary">
					{lineNumbers.map((num) => (
						<span key={`ln-${num}`}>{num}</span>
					))}
				</div>
				<div
					className="flex-1 overflow-x-auto bg-bg-surface px-3 py-3"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: shiki output is trusted
					dangerouslySetInnerHTML={{ __html: html }}
				/>
			</div>
		</div>
	);
}
