"use client";

import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { Toggle } from "@/components/ui/toggle";
import type { AppRouter } from "@/trpc/routers/_app";

const trpcClient = createTRPCClient<AppRouter>({
	links: [httpBatchLink({ url: "/api/trpc" })],
});

export function CodeEditorSection() {
	const router = useRouter();
	const [roastMode, setRoastMode] = useState(false);
	const [code, setCode] = useState("");
	const [language, setLanguage] = useState("javascript");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async () => {
		if (!code.trim() || isSubmitting) return;

		setIsSubmitting(true);
		try {
			const result = await trpcClient.roast.create.mutate({
				code,
				language,
				roastMode: roastMode ? "sarcastic" : "constructive",
			});
			router.push(`/roast/${result.roastId}`);
		} catch (error) {
			console.error("Failed to create roast:", error);
			setIsSubmitting(false);
		}
	};

	return (
		<>
			<CodeEditor
				code={code}
				onChange={setCode}
				onLanguageChange={setLanguage}
				showLanguageSelector={true}
				showLineNumbers={true}
				showCopyButton={true}
				rows={20}
			/>
			<section className="flex w-full max-w-[780px] items-start justify-between gap-4 md:flex-row md:items-center">
				<div className="flex flex-wrap items-center gap-4 md:gap-6">
					<div className="flex items-center gap-2.5">
						<Toggle pressed={roastMode} onPressedChange={setRoastMode} />
						<span className="font-mono text-sm text-accent-green">
							roast mode
						</span>
					</div>
					<span className="font-mono text-xs text-text-tertiary">
						{roastMode
							? "// maximum sarcasm enabled"
							: "// constructive feedback"}
					</span>
				</div>
				<Button
					variant="primary"
					onClick={handleSubmit}
					disabled={!code.trim() || isSubmitting}
				>
					{isSubmitting ? "roasting..." : "$ roast_my_code"}
				</Button>
			</section>
		</>
	);
}
