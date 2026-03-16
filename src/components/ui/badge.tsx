import { forwardRef, type HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import { tv, type VariantProps } from "tailwind-variants";
import { BadgeDot } from "./badge-dot";

const badgeVariants = tv({
	base: "inline-flex items-center gap-2 font-mono",
	variants: {
		variant: {
			critical: "text-accent-red",
			warning: "text-accent-amber",
			good: "text-accent-green",
			needs_serious_help: "text-accent-red",
		},
		size: {
			default: "text-xs",
			sm: "text-2.5",
			lg: "text-sm",
		},
	},
	defaultVariants: {
		variant: "critical",
		size: "default",
	},
});

export interface BadgeProps
	extends HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof badgeVariants> {
	showDot?: boolean;
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
	({ className, variant, size, showDot = true, children, ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={twMerge(badgeVariants({ variant, size, className }))}
				{...props}
			>
				{showDot && <BadgeDot variant={variant} />}
				{children}
			</div>
		);
	},
);

Badge.displayName = "Badge";
