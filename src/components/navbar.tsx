import Link from "next/link";

export function Navbar() {
	return (
		<header className="flex h-14 w-full items-center justify-between border-b border-border bg-bg-page px-10">
			<Link href="/" className="flex items-center gap-2">
				<span className="font-mono text-xl font-bold text-accent-green">
					{">"}
				</span>
				<span className="font-mono text-lg font-medium text-text-primary">
					devroast
				</span>
			</Link>
			<nav className="flex items-center gap-6">
				<Link
					href="/leaderboard"
					className="font-mono text-sm text-text-secondary hover:text-text-primary transition-colors"
				>
					leaderboard
				</Link>
			</nav>
		</header>
	);
}
