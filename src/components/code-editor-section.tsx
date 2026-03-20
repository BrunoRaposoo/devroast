"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { Toggle } from "@/components/ui/toggle";

export function CodeEditorSection() {
	const [roastMode, setRoastMode] = useState(false);
	const [code, setCode] = useState("");

	return (
		<>
			<CodeEditor
				code={code}
				onChange={setCode}
				showLanguageSelector={true}
				showLineNumbers={true}
				showCopyButton={true}
				rows={20}
			/>

			<section className="flex w-full max-w-[780px] flex-col items-start justify-between gap-4 md:flex-row md:items-center">
				<div className="flex flex-wrap items-center gap-4 md:gap-6">
					<div className="flex items-center gap-2.5">
						<Toggle pressed={roastMode} onPressedChange={setRoastMode} />
						<span className="font-mono text-sm text-accent-green">
							roast mode
						</span>
					</div>
					<span className="font-mono text-xs text-text-tertiary">
						{"// maximum sarcasm enabled"}
					</span>
				</div>
				<Button variant="primary">$ roast_my_code</Button>
			</section>
		</>
	);
}
