import { forwardRef, type HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import { tv, type VariantProps } from "tailwind-variants";

const scoreRingVariants = tv({
	base: "relative inline-flex items-center justify-center",
	variants: {
		size: {
			sm: "h-24 w-24",
			default: "h-45 w-45",
			lg: "h-60 w-60",
		},
	},
	defaultVariants: {
		size: "default",
	},
});

export interface ScoreRingProps
	extends HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof scoreRingVariants> {
	value: number;
	max?: number;
}

export const ScoreRing = forwardRef<HTMLDivElement, ScoreRingProps>(
	({ className, size, value, max = 10, ...props }, ref) => {
		const percentage = (value / max) * 100;

		return (
			<div
				ref={ref}
				className={twMerge(scoreRingVariants({ size, className }))}
				{...props}
			>
				<svg
					aria-hidden="true"
					className="absolute inset-0 h-full w-full -rotate-90"
					viewBox="0 0 100 100"
				>
					<circle
						cx="50"
						cy="50"
						r="45"
						fill="none"
						stroke="currentColor"
						strokeWidth="4"
						className="text-border"
					/>
					<circle
						cx="50"
						cy="50"
						r="45"
						fill="none"
						stroke="url(#gradient)"
						strokeWidth="4"
						strokeDasharray={`${percentage * 2.827}, 282.7`}
						strokeLinecap="round"
						className="text-accent-green"
					/>
					<defs>
						<linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
							<stop offset="0%" stopColor="var(--accent-green)" />
							<stop offset="100%" stopColor="var(--accent-amber)" />
						</linearGradient>
					</defs>
				</svg>
				<div className="flex flex-col items-center justify-center">
					<span
						className="font-mono font-bold text-foreground"
						style={{
							fontSize:
								size === "sm" ? "24px" : size === "lg" ? "64px" : "48px",
							lineHeight: 1,
						}}
					>
						{value.toFixed(1)}
					</span>
					<span
						className="font-mono text-text-tertiary"
						style={{
							fontSize:
								size === "sm" ? "10px" : size === "lg" ? "20px" : "16px",
						}}
					>
						/{max}
					</span>
				</div>
			</div>
		);
	},
);

ScoreRing.displayName = "ScoreRing";
