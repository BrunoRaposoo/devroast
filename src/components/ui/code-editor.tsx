import TextareaCodeEditor from "@uiw/react-textarea-code-editor";
import hljs from "highlight.js/lib/core";
import c from "highlight.js/lib/languages/c";
import cpp from "highlight.js/lib/languages/cpp";
import csharp from "highlight.js/lib/languages/csharp";
import go from "highlight.js/lib/languages/go";
import java from "highlight.js/lib/languages/java";
import javascript from "highlight.js/lib/languages/javascript";
import kotlin from "highlight.js/lib/languages/kotlin";
import php from "highlight.js/lib/languages/php";
import python from "highlight.js/lib/languages/python";
import ruby from "highlight.js/lib/languages/ruby";
import rust from "highlight.js/lib/languages/rust";
import sql from "highlight.js/lib/languages/sql";
import swift from "highlight.js/lib/languages/swift";
import typescript from "highlight.js/lib/languages/typescript";
import { useCallback, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("python", python);
hljs.registerLanguage("go", go);
hljs.registerLanguage("rust", rust);
hljs.registerLanguage("java", java);
hljs.registerLanguage("c", c);
hljs.registerLanguage("cpp", cpp);
hljs.registerLanguage("csharp", csharp);
hljs.registerLanguage("php", php);
hljs.registerLanguage("ruby", ruby);
hljs.registerLanguage("swift", swift);
hljs.registerLanguage("kotlin", kotlin);
hljs.registerLanguage("sql", sql);

export const SUPPORTED_LANGUAGES = [
	{ value: "javascript", label: "JavaScript" },
	{ value: "typescript", label: "TypeScript" },
	{ value: "python", label: "Python" },
	{ value: "go", label: "Go" },
	{ value: "rust", label: "Rust" },
	{ value: "java", label: "Java" },
	{ value: "c", label: "C" },
	{ value: "cpp", label: "C++" },
	{ value: "csharp", label: "C#" },
	{ value: "php", label: "PHP" },
	{ value: "ruby", label: "Ruby" },
	{ value: "swift", label: "Swift" },
	{ value: "kotlin", label: "Kotlin" },
	{ value: "sql", label: "SQL" },
] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number]["value"];

const LANGUAGE_MAPPING: Record<string, Language> = {
	js: "javascript",
	ts: "typescript",
	py: "python",
	rust: "rust",
	cpp: "cpp",
	"c++": "cpp",
	cs: "csharp",
	"c#": "csharp",
	sharp: "csharp",
};

function detectLanguage(code: string): Language | null {
	if (!code || code.trim().length < 10) return null;

	try {
		const result = hljs.highlightAuto(code);
		if (result.language && result.relevance > 5) {
			const mapped = LANGUAGE_MAPPING[result.language];
			if (mapped) return mapped;
			const supported = SUPPORTED_LANGUAGES.find(
				(l) => l.value === result.language,
			);
			if (supported) return supported.value;
		}
	} catch {
		return null;
	}
	return null;
}

export interface CodeEditorProps {
	code: string;
	onChange?: (code: string) => void;
	language?: Language;
	onLanguageChange?: (language: Language) => void;
	className?: string;
	showLanguageSelector?: boolean;
	showLineNumbers?: boolean;
	showCopyButton?: boolean;
	rows?: number;
	autoDetect?: boolean;
}

export function CodeEditor({
	code,
	onChange,
	language: controlledLanguage,
	onLanguageChange,
	className,
	showLanguageSelector = true,
	showLineNumbers = true,
	showCopyButton = true,
	rows = 20,
	autoDetect = true,
}: CodeEditorProps) {
	const [internalLanguage, setInternalLanguage] =
		useState<Language>("javascript");
	const [autoDetected, setAutoDetected] = useState(false);
	const [copied, setCopied] = useState(false);
	const lineNumbersRef = useRef<HTMLDivElement>(null);
	const editorRef = useRef<HTMLDivElement>(null);

	const language = controlledLanguage ?? internalLanguage;
	const codeLines = code.split("\n").length;
	const totalLines = Math.max(rows, codeLines);

	useEffect(() => {
		if (
			autoDetect &&
			!controlledLanguage &&
			!autoDetected &&
			code.length > 20
		) {
			const detected = detectLanguage(code);
			if (detected) {
				setInternalLanguage(detected);
				setAutoDetected(true);
				onLanguageChange?.(detected);
			}
		}
	}, [code, autoDetect, controlledLanguage, autoDetected, onLanguageChange]);

	const handleLanguageChange = useCallback(
		(newLanguage: Language) => {
			setAutoDetected(false);
			if (onLanguageChange) {
				onLanguageChange(newLanguage);
			} else {
				setInternalLanguage(newLanguage);
			}
		},
		[onLanguageChange],
	);

	const handleCopy = useCallback(async () => {
		await navigator.clipboard.writeText(code);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}, [code]);

	const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
		if (lineNumbersRef.current) {
			lineNumbersRef.current.scrollTop = e.currentTarget.scrollTop;
		}
	}, []);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
			if (e.key === "Tab") {
				e.preventDefault();
				const target = e.target as HTMLTextAreaElement;
				const start = target.selectionStart;
				const end = target.selectionEnd;
				const newCode = `${code.substring(0, start)}  ${code.substring(end)}`;
				onChange?.(newCode);
				requestAnimationFrame(() => {
					target.selectionStart = target.selectionEnd = start + 2;
				});
				return false;
			}
		},
		[code, onChange],
	);

	return (
		<div
			className={twMerge(
				"w-full max-w-[780px] overflow-hidden rounded-md border border-border bg-bg-surface",
				className,
			)}
		>
			<div className="flex h-10 items-center gap-3 border-b border-border px-4">
				<span className="h-2.5 w-2.5 rounded-full bg-[#EF4444]" />
				<span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />
				<span className="h-2.5 w-2.5 rounded-full bg-[#10B981]" />
				<span className="flex-1" />
				{showLanguageSelector && (
					<select
						value={language}
						onChange={(e) => handleLanguageChange(e.target.value as Language)}
						className="rounded border border-border bg-bg-surface px-2 py-1 font-mono text-xs text-text-secondary focus:outline-none focus:ring-1 focus:ring-accent-green"
					>
						{SUPPORTED_LANGUAGES.map((lang) => (
							<option key={lang.value} value={lang.value}>
								{lang.label}
							</option>
						))}
					</select>
				)}
				{showCopyButton && (
					<button
						type="button"
						onClick={handleCopy}
						className="rounded px-2 py-1 font-mono text-xs text-text-tertiary transition-colors hover:bg-border hover:text-text-secondary"
					>
						{copied ? "copied!" : "copy"}
					</button>
				)}
			</div>
			<div className="flex">
				{showLineNumbers && (
					<div
						ref={lineNumbersRef}
						className="flex w-12 flex-col items-end bg-bg-surface px-3 py-4 font-mono text-xs leading-6 text-text-tertiary"
					>
						{Array.from({ length: totalLines }, (_, lineNum) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: keys are stable for line numbers
							<span key={lineNum}>{lineNum + 1}</span>
						))}
					</div>
				)}
				<div ref={editorRef} onScroll={handleScroll} className="flex-1">
					<TextareaCodeEditor
						value={code}
						onChange={(e) => onChange?.(e.target.value)}
						language={language}
						onKeyDown={handleKeyDown}
						rows={totalLines}
						style={{
							fontFamily:
								'"JetBrains Mono", ui-monospace, SFMono-Regular, SF Mono, Consolas, Liberation Mono, Menlo, monospace',
							fontSize: "14px",
							lineHeight: "24px",
							backgroundColor: "transparent",
						}}
						className="!bg-transparent !p-4 !font-mono !text-sm !text-text-primary leading-6 placeholder:!text-text-tertiary focus:!outline-none"
					/>
				</div>
			</div>
		</div>
	);
}
