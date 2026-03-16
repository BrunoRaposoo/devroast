import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	AnalysisCard,
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { DiffLine } from "@/components/ui/diff-line";
import { ScoreRing } from "@/components/ui/score-ring";
import { Toggle } from "@/components/ui/toggle";

export default function ComponentsPage() {
	const buttonVariants = [
		"primary",
		"secondary",
		"outline",
		"ghost",
		"destructive",
	] as const;
	const buttonSizes = ["sm", "default", "lg", "icon"] as const;
	const badgeVariants = [
		"critical",
		"warning",
		"good",
		"needs_serious_help",
	] as const;

	const sampleCode = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}`;

	return (
		<div className="min-h-screen bg-background p-8">
			<h1 className="font-mono text-4xl font-bold mb-8">UI Components</h1>

			<section className="mb-12">
				<h2 className="font-mono text-2xl font-semibold mb-4">Button</h2>

				<div className="space-y-8">
					<div>
						<h3 className="font-mono text-lg text-muted-foreground mb-4">
							Variants
						</h3>
						<div className="flex flex-wrap gap-4">
							{buttonVariants.map((variant) => (
								<Button key={variant} variant={variant}>
									{variant}
								</Button>
							))}
						</div>
					</div>

					<div>
						<h3 className="font-mono text-lg text-muted-foreground mb-4">
							Sizes
						</h3>
						<div className="flex flex-wrap items-center gap-4">
							{buttonSizes.map((size) => (
								<Button key={size} size={size}>
									{size}
								</Button>
							))}
						</div>
					</div>

					<div>
						<h3 className="font-mono text-lg text-muted-foreground mb-4">
							States
						</h3>
						<div className="flex flex-wrap gap-4">
							<Button>Default</Button>
							<Button disabled>Disabled</Button>
						</div>
					</div>

					<div>
						<h3 className="font-mono text-lg text-muted-foreground mb-4">
							With Icon
						</h3>
						<div className="flex flex-wrap gap-4">
							<Button>
								<svg
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M12 20h9" />
									<path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
								</svg>
								Edit
							</Button>
							<Button variant="secondary">
								<svg
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
									<polyline points="7 10 12 15 17 10" />
									<line x1="12" x2="12" y1="15" y2="3" />
								</svg>
								Download
							</Button>
							<Button variant="outline">
								<svg
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<circle cx="12" cy="12" r="10" />
									<path d="M12 8v4" />
									<path d="M12 16h.01" />
								</svg>
								Info
							</Button>
						</div>
					</div>
				</div>
			</section>

			<section className="mb-12">
				<h2 className="font-mono text-2xl font-semibold mb-4">Toggle</h2>

				<div className="space-y-8">
					<div>
						<h3 className="font-mono text-lg text-muted-foreground mb-4">
							States
						</h3>
						<div className="flex flex-wrap items-center gap-8">
							<div className="flex items-center gap-3">
								<Toggle defaultPressed />
								<span className="font-mono text-sm text-accent-green">
									roast mode
								</span>
							</div>
							<div className="flex items-center gap-3">
								<Toggle />
								<span className="font-mono text-sm text-text-secondary">
									roast mode
								</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="mb-12">
				<h2 className="font-mono text-2xl font-semibold mb-4">Badge</h2>

				<div className="space-y-8">
					<div>
						<h3 className="font-mono text-lg text-muted-foreground mb-4">
							Variants
						</h3>
						<div className="flex flex-wrap items-center gap-6">
							{badgeVariants.map((variant) => (
								<Badge key={variant} variant={variant}>
									{variant}
								</Badge>
							))}
						</div>
					</div>

					<div>
						<h3 className="font-mono text-lg text-muted-foreground mb-4">
							Sizes
						</h3>
						<div className="flex flex-wrap items-center gap-6">
							<Badge size="sm">small</Badge>
							<Badge size="default">default</Badge>
							<Badge size="lg">large</Badge>
						</div>
					</div>

					<div>
						<h3 className="font-mono text-lg text-muted-foreground mb-4">
							Without Dot
						</h3>
						<div className="flex flex-wrap items-center gap-6">
							<Badge showDot={false}>no dot</Badge>
						</div>
					</div>
				</div>
			</section>

			<section className="mb-12">
				<h2 className="font-mono text-2xl font-semibold mb-4">DiffLine</h2>

				<div className="space-y-8">
					<div>
						<h3 className="font-mono text-lg text-muted-foreground mb-4">
							Types
						</h3>
						<div className="flex flex-col border border-border rounded-md overflow-hidden max-w-lg">
							<DiffLine type="removed">var total = 0;</DiffLine>
							<DiffLine type="added">const total = 0;</DiffLine>
							<DiffLine type="context">
								for (let i = 0; i &lt; items.length; i++) {"{"}
							</DiffLine>
						</div>
					</div>
				</div>
			</section>

			<section className="mb-12">
				<h2 className="font-mono text-2xl font-semibold mb-4">CodeBlock</h2>

				<div className="space-y-8">
					<div>
						<h3 className="font-mono text-lg text-muted-foreground mb-4">
							Default
						</h3>
						<CodeBlock code={sampleCode} filename="calculate.js" />
					</div>

					<div>
						<h3 className="font-mono text-lg text-muted-foreground mb-4">
							Without Line Numbers
						</h3>
						<CodeBlock code={sampleCode} showLineNumbers={false} />
					</div>
				</div>
			</section>

			<section className="mb-12">
				<h2 className="font-mono text-2xl font-semibold mb-4">ScoreRing</h2>

				<div className="space-y-8">
					<div>
						<h3 className="font-mono text-lg text-muted-foreground mb-4">
							Sizes
						</h3>
						<div className="flex flex-wrap items-end gap-8">
							<ScoreRing value={3.5} size="sm" />
							<ScoreRing value={7.2} size="default" />
							<ScoreRing value={2.1} size="lg" />
						</div>
					</div>

					<div>
						<h3 className="font-mono text-lg text-muted-foreground mb-4">
							Values
						</h3>
						<div className="flex flex-wrap items-end gap-8">
							<ScoreRing value={1.2} />
							<ScoreRing value={5.5} />
							<ScoreRing value={9.8} />
						</div>
					</div>
				</div>
			</section>

			<section className="mb-12">
				<h2 className="font-mono text-2xl font-semibold mb-4">Card</h2>

				<div className="space-y-8">
					<div>
						<h3 className="font-mono text-lg text-muted-foreground mb-4">
							Analysis Cards
						</h3>
						<div className="flex flex-col gap-4">
							<AnalysisCard variant="critical">
								<CardHeader>
									<Badge variant="critical">critical</Badge>
								</CardHeader>
								<CardTitle>using var instead of const/let</CardTitle>
								<CardDescription>
									the var keyword is function-scoped rather than block-scoped,
									which can lead to unexpected behavior and bugs. modern
									javascript uses const for immutable bindings and let for
									mutable ones.
								</CardDescription>
							</AnalysisCard>
							<AnalysisCard variant="warning">
								<CardHeader>
									<Badge variant="warning">warning</Badge>
								</CardHeader>
								<CardTitle>missing error handling</CardTitle>
								<CardDescription>
									consider adding try-catch blocks around async operations to
									handle potential errors gracefully.
								</CardDescription>
							</AnalysisCard>
							<AnalysisCard variant="good">
								<CardHeader>
									<Badge variant="good">good</Badge>
								</CardHeader>
								<CardTitle>good variable naming</CardTitle>
								<CardDescription>
									clear and descriptive variable names make the code more
									readable and maintainable.
								</CardDescription>
							</AnalysisCard>
						</div>
					</div>

					<div>
						<h3 className="font-mono text-lg text-muted-foreground mb-4">
							Base Card
						</h3>
						<Card>
							<CardHeader>
								<Badge variant="critical">custom</Badge>
							</CardHeader>
							<CardTitle>Card Title</CardTitle>
							<CardDescription>
								This is a description text that provides more context about the
								card content.
							</CardDescription>
						</Card>
					</div>
				</div>
			</section>
		</div>
	);
}
