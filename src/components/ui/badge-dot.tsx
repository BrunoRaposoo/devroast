import { forwardRef, type HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import { tv, type VariantProps } from "tailwind-variants";

const badgeDotVariants = tv({
	base: "h-2 w-2 rounded-full",
	variants: {
		variant: {
			critical: "bg-accent-red",
			warning: "bg-accent-amber",
			good: "bg-accent-green",
			needs_serious_help: "bg-accent-red",
		},
	},
	defaultVariants: {
		variant: "critical",
	},
});

export interface BadgeDotProps
	extends HTMLAttributes<HTMLSpanElement>,
		VariantProps<typeof badgeDotVariants> {}

export const BadgeDot = forwardRef<HTMLSpanElement, BadgeDotProps>(
	({ className, variant, ...props }, ref) => {
		return (
			<span
				ref={ref}
				className={twMerge(badgeDotVariants({ variant, className }))}
				{...props}
			/>
		);
	},
);

BadgeDot.displayName = "BadgeDot";
