"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { LeaderboardSkeletonItem } from "@/components/leaderboard-skeleton";
import { SimpleLeaderboardEntry } from "@/components/simple-leaderboard-entry";
import type { AppRouter } from "@/trpc/routers/_app";

const trpcClient = createTRPCClient<AppRouter>({
	links: [
		httpBatchLink({
			url: `/api/trpc`,
		}),
	],
});

interface LeaderboardItem {
	id: string;
	code: string;
	language: string;
	score: number;
}

interface HighlightedEntry extends LeaderboardItem {
	highlightedHtml: string;
	lineNumbers: number[];
}

interface InitialData {
	items: LeaderboardItem[];
	nextCursor: { id: string; score: string } | null;
}

interface LeaderboardListProps {
	initialData: InitialData;
}

export function LeaderboardList({ initialData }: LeaderboardListProps) {
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useInfiniteQuery({
			queryKey: ["leaderboard", "getLeaderboardPage"],
			queryFn: async ({ pageParam }) => {
				const result = await trpcClient.leaderboard.getLeaderboardPage.query({
					cursor: pageParam ?? null,
					limit: 10,
				});
				return result;
			},
			getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
			initialPageParam: null as { id: string; score: string } | null,
			initialData: {
				pages: [initialData],
				pageParams: [null],
			},
		});

	const allEntries = data?.pages.flatMap((page) => page.items) ?? [];
	const startIndex = allEntries.length;

	const highlightedEntries: HighlightedEntry[] = allEntries.map((entry) => {
		const lines = entry.code.split("\n");
		return {
			...entry,
			highlightedHtml: "",
			lineNumbers: lines.map((_, i) => i + 1),
		};
	});

	return (
		<div className="flex flex-col gap-4">
			{highlightedEntries.map((entry, idx) => (
				<SimpleLeaderboardEntry
					key={entry.id}
					id={entry.id}
					code={entry.code}
					language={entry.language}
					score={entry.score}
					index={startIndex + idx}
				/>
			))}

			{isFetchingNextPage && (
				<div className="flex flex-col gap-4">
					<LeaderboardSkeletonItem />
					<LeaderboardSkeletonItem />
				</div>
			)}

			{hasNextPage && !isFetchingNextPage && (
				<button
					type="button"
					onClick={() => fetchNextPage()}
					className="self-center rounded border border-border px-6 py-2 font-mono text-xs text-text-secondary transition-colors hover:border-accent-green hover:text-accent-green"
				>
					load more
				</button>
			)}

			{!hasNextPage && allEntries.length > 0 && (
				<p className="self-center font-mono text-xs text-text-tertiary">
					{`// end of shame`}
				</p>
			)}
		</div>
	);
}
