import Link from "next/link";
import { CodeBlock } from "@/components/ui/code-block";

const LEADERBOARD_DATA = [
	{
		rank: 1,
		score: "1.2",
		language: "javascript",
		code: `eval(prompt('enter code'))
document.write(response)
// trust the user lol`,
		roastMode: "sarcastic",
		feedback:
			"Este código é tão ruim que até o compilador está chorando. Sinceramente, você tentou escrever isso ou foi o teclado que tossiu?",
	},
	{
		rank: 2,
		score: "2.1",
		language: "python",
		code: `def hack():
  return True
// who needs types anyway`,
		roastMode: "sarcastic",
		feedback:
			"Olha, eu já vi código ruim na minha vida, mas isso aqui... isso é uma obra-prima do caos. Parabéns (não).",
	},
	{
		rank: 3,
		score: "2.8",
		language: "sql",
		code: `SELECT * FROM users
WHERE 1=1 --
// SQL injection ready!`,
		roastMode: "sarcastic",
		feedback:
			"Esse código tem mais bugs do que um filme de terror tem jump scares.",
	},
	{
		rank: 4,
		score: "3.1",
		language: "javascript",
		code: `function doEverything() {
  let data = fetch('/api/data')
  process(data)
  save(data)
  email(data)
  // one function to rule them all`,
		roastMode: "sarcastic",
		feedback:
			"Você sabe que existe algo chamado 'funções', né? Esse arquivo único de 2000 linhas está me dando ansiedade só de olhar.",
	},
	{
		rank: 5,
		score: "3.5",
		language: "java",
		code: `public class Main {
  public static void main(String[] args) {
    // TODO: implement
  }
}
// OOP? More like OOO - Object Oriented Oblivion`,
		roastMode: "sarcastic",
		feedback:
			"POO? Mais Like OOO - Orientado a Objeto Obscuro. Não sei o que isso faz, e sinceramente, não quero saber.",
	},
];

const TOTAL_SUBMISSIONS = 2847;
const AVG_SCORE = 4.2;

export const metadata = {
	title: "Shame Leaderboard | DevRoast",
	description: "The most roasted code on the internet",
};

export default function LeaderboardPage() {
	return (
		<div className="min-h-screen bg-bg-page">
			<nav className="flex h-14 items-center justify-between border-b border-border-primary px-10">
				<Link href="/" className="flex items-center gap-2">
					<span className="font-mono text-2xl font-bold text-accent-green">
						&gt;
					</span>
					<span className="font-mono text-lg font-medium text-text-primary">
						devroast
					</span>
				</Link>
				<Link href="/leaderboard">
					<span className="font-mono text-sm text-text-secondary">
						leaderboard
					</span>
				</Link>
			</nav>

			<main className="mx-auto flex max-w-4xl flex-col gap-10 px-5 py-10 md:px-20 md:py-16">
				<section className="flex flex-col gap-4">
					<div className="flex items-center gap-3">
						<span className="font-mono text-3xl font-bold text-accent-green">
							&gt;
						</span>
						<h1 className="font-mono text-3xl font-bold text-text-primary">
							shame_leaderboard
						</h1>
					</div>
					<p className="font-mono text-sm text-text-secondary">
						{/* the most roasted code on the internet */}
					</p>
					<div className="flex items-center gap-2">
						<span className="font-mono text-xs text-text-tertiary">
							{TOTAL_SUBMISSIONS.toLocaleString()} submissions
						</span>
						<span className="text-text-tertiary">·</span>
						<span className="font-mono text-xs text-text-tertiary">
							avg score: {AVG_SCORE}/10
						</span>
					</div>
				</section>

				<section className="flex flex-col gap-5">
					{LEADERBOARD_DATA.map((entry) => (
						<article
							key={entry.rank}
							className="overflow-hidden rounded border border-border-primary bg-bg-surface"
						>
							<div className="flex h-12 items-center justify-between border-b border-border-primary px-5">
								<div className="flex items-center gap-4">
									<span className="font-mono text-xs font-bold text-accent-red">
										#{entry.rank}
									</span>
									<span className="font-mono text-xs font-bold text-accent-red">
										{entry.score}/10
									</span>
								</div>
								<span className="font-mono text-xs text-text-secondary">
									{entry.language}
								</span>
							</div>
							<CodeBlock
								code={entry.code}
								language={entry.language}
								showLineNumbers={false}
							/>
						</article>
					))}
				</section>
			</main>
		</div>
	);
}
