import { type ButtonHTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { tv, type VariantProps } from "tailwind-variants";

const buttonVariants = tv({
	base: "inline-flex items-center justify-center gap-2 rounded-md font-mono text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
	variants: {
		variant: {
			primary:
				"bg-[#22c55e] text-[#0A0A0A] hover:bg-[#16a34a] focus-visible:ring-[#22c55e]",
			secondary:
				"bg-zinc-800 text-zinc-100 hover:bg-zinc-700 focus-visible:ring-zinc-800",
			outline:
				"border border-zinc-600 bg-transparent hover:bg-zinc-800 hover:text-zinc-100 focus-visible:ring-zinc-600",
			ghost: "hover:bg-zinc-800 hover:text-zinc-100",
			destructive:
				"bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600",
		},
		size: {
			default: "h-10 px-6 py-2",
			sm: "h-8 px-3 text-xs",
			lg: "h-12 px-8 text-base",
			icon: "h-10 w-10",
		},
	},
	defaultVariants: {
		variant: "primary",
		size: "default",
	},
});

export interface ButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		return (
			<button
				className={twMerge(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	},
);

Button.displayName = "Button";
