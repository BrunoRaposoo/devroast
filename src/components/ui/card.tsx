import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { tv, type VariantProps } from "tailwind-variants";

const cardVariants = tv({
	base: "rounded-md border border-border bg-card p-5",
	variants: {
		variant: {
			default: "border-border",
			critical: "border-accent-red/30",
			warning: "border-accent-amber/30",
			good: "border-accent-green/30",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

export interface CardProps
	extends HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof cardVariants> {
	children: ReactNode;
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
	children: ReactNode;
}

export interface CardDescriptionProps
	extends HTMLAttributes<HTMLParagraphElement> {
	children: ReactNode;
}

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
	({ className, variant, children, ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={twMerge(cardVariants({ variant, className }))}
				{...props}
			>
				{children}
			</div>
		);
	},
);

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
	({ className, children, ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={twMerge("flex items-center gap-2 mb-3", className)}
				{...props}
			>
				{children}
			</div>
		);
	},
);

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
	({ className, children, ...props }, ref) => {
		return (
			<h3
				ref={ref}
				className={twMerge("font-mono text-sm text-foreground", className)}
				{...props}
			>
				{children}
			</h3>
		);
	},
);

export const CardDescription = forwardRef<
	HTMLParagraphElement,
	CardDescriptionProps
>(({ className, children, ...props }, ref) => {
	return (
		<p
			ref={ref}
			className={twMerge(
				"font-mono text-xs text-text-secondary leading-relaxed",
				className,
			)}
			{...props}
		>
			{children}
		</p>
	);
});

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
	({ className, children, ...props }, ref) => {
		return (
			<div ref={ref} className={twMerge(className)} {...props}>
				{children}
			</div>
		);
	},
);

Card.displayName = "Card";
CardHeader.displayName = "CardHeader";
CardTitle.displayName = "CardTitle";
CardDescription.displayName = "CardDescription";
CardContent.displayName = "CardContent";

export interface AnalysisCardProps extends HTMLAttributes<HTMLDivElement> {
	variant?: "critical" | "warning" | "good";
}

export const AnalysisCard = forwardRef<HTMLDivElement, AnalysisCardProps>(
	({ className, variant = "critical", children, ...props }, ref) => {
		return (
			<Card
				ref={ref}
				variant={variant}
				className={twMerge("w-120", className)}
				{...props}
			>
				{children}
			</Card>
		);
	},
);

AnalysisCard.displayName = "AnalysisCard";
