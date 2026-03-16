import { forwardRef, type HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import { tv, type VariantProps } from "tailwind-variants";

const diffLineVariants = tv({
	base: "flex w-full gap-2 px-4 py-2 font-mono text-[13px]",
	variants: {
		type: {
			removed: "bg-[#1A0A0A] text-text-secondary",
			added: "bg-[#0A1A0F] text-foreground",
			context: "text-text-secondary",
		},
	},
	defaultVariants: {
		type: "context",
	},
});

export interface DiffLineProps
	extends HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof diffLineVariants> {
	prefix?: "+" | "-" | " ";
}

export const DiffLine = forwardRef<HTMLDivElement, DiffLineProps>(
	({ className, type, prefix = " ", children, ...props }, ref) => {
		const getPrefix = () => {
			if (type === "removed") return "-";
			if (type === "added") return "+";
			return " ";
		};

		const getPrefixColor = () => {
			if (type === "removed") return "text-accent-red";
			if (type === "added") return "text-accent-green";
			return "text-text-tertiary";
		};

		return (
			<div
				ref={ref}
				className={twMerge(diffLineVariants({ type, className }))}
				{...props}
			>
				<span className={twMerge("w-3", getPrefixColor())}>{getPrefix()}</span>
				<span className="flex-1">{children}</span>
			</div>
		);
	},
);

DiffLine.displayName = "DiffLine";
