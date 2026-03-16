"use client";

import { Toggle as BaseToggle } from "@base-ui-components/react/toggle";
import { forwardRef, useState } from "react";
import { twMerge } from "tailwind-merge";

export interface ToggleProps {
	pressed?: boolean;
	defaultPressed?: boolean;
	onPressedChange?: (pressed: boolean) => void;
	disabled?: boolean;
	className?: string;
}

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
	(
		{
			className,
			pressed: controlledPressed,
			defaultPressed = false,
			onPressedChange,
			disabled,
		},
		ref,
	) => {
		const [internalPressed, setInternalPressed] = useState(defaultPressed);
		const isControlled = controlledPressed !== undefined;
		const isPressed = isControlled ? controlledPressed : internalPressed;

		const handlePressedChange = (newPressed: boolean) => {
			if (!isControlled) {
				setInternalPressed(newPressed);
			}
			onPressedChange?.(newPressed);
		};

		return (
			<BaseToggle
				ref={ref}
				pressed={isPressed}
				onPressedChange={handlePressedChange}
				disabled={disabled}
				className={twMerge(
					"relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
					isPressed ? "bg-accent-green" : "bg-border",
					className,
				)}
			>
				<span
					className={twMerge(
						"pointer-events-none block h-4 w-4 rounded-full shadow-lg ring-0 transition-transform duration-150 ease-[cubic-bezier(0.26,0.75,0.38,0.45)]",
						isPressed
							? "translate-x-4.5 bg-[#0A0A0A]"
							: "translate-x-0 bg-[#6B7280]",
					)}
				/>
			</BaseToggle>
		);
	},
);

Toggle.displayName = "Toggle";
