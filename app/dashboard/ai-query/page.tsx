"use client";

import { useState } from "react";
import {
    Sparkles,
    Loader2,
    Terminal,
    ShieldCheck,
    Send,
    Copy,
    Check,
    AlertCircle,
    Database,
    Zap,
} from "lucide-react";

/* ── Types ─────────────────────────────────────────────────────────── */
interface ApiResponse {
    status: string;
    original_question: string;
    raw_llm_sql: string;
    secure_sql_to_execute: string;
}

/* ── Example prompts for the suggestion chips ──────────────────────── */
const EXAMPLES = [
    "Show me all users in the system",
    "Get the latest 10 analytics reports",
    "Count query executions by tenant",
    "Find users with gmail emails",
];

/* ── Clipboard copy helper ─────────────────────────────────────────── */
function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider
                 text-gray-400 hover:text-white transition-colors"
        >
            {copied ? (
                <>
                    <Check className="h-3.5 w-3.5 text-green-400" /> Copied
                </>
            ) : (
                <>
                    <Copy className="h-3.5 w-3.5" /> Copy
                </>
            )}
        </button>
    );
}

/* ── Page ───────────────────────────────────────────────────────────── */
export default function AIQueryPage() {
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ApiResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    /* ── API call ──────────────────────────────────────────────────── */
    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        const trimmed = question.trim();
        if (!trimmed) return;

        setLoading(true);
        setResult(null);
        setError(null);

        try {
            const res = await fetch("http://127.0.0.1:8000/api/ask-ai", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "tenant-id": "demo-tenant-123",
                },
                body: JSON.stringify({ question: trimmed }),
            });

            if (!res.ok) {
                throw new Error(`Backend responded with status ${res.status}`);
            }

            const data: ApiResponse = await res.json();

            if (data.status !== "success") {
                throw new Error((data as any).error ?? "Unknown backend error");
            }

            setResult(data);
        } catch (err: any) {
            setError(
                err.message?.includes("Failed to fetch") || err.message?.includes("NetworkError")
                    ? "Could not reach the backend. Please make sure the Python server is running on port 8000."
                    : err.message ?? "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChipClick = (text: string) => {
        setQuestion(text);
    };

    /* ── Render ────────────────────────────────────────────────────── */
    return (
        <div className="space-y-8">
            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className="relative overflow-hidden rounded-2xl
                      bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700
                      p-8 shadow-xl">
                {/* decorative blurred circles */}
                <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full
                        bg-white/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full
                        bg-purple-400/20 blur-3xl" />

                <div className="relative z-10 flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl
                          bg-white/15 backdrop-blur-sm ring-1 ring-white/20">
                        <Sparkles className="h-7 w-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                            QueryCore AI
                            <span className="ml-2 text-base font-normal text-purple-200">
                                — Multi-Tenant SQL Generator
                            </span>
                        </h1>
                        <p className="mt-1.5 max-w-xl text-sm text-purple-100/80">
                            Type a question in plain English and let AI generate a safe, tenant-scoped
                            PostgreSQL query for you.
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Input area ─────────────────────────────────────────────── */}
            <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-gray-200 bg-white p-6
                   shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
                <label className="mb-2 block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Ask a question about your data
                </label>

                <div className="relative">
                    <textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit();
                            }
                        }}
                        disabled={loading}
                        placeholder="e.g., Show me all users who signed up this week..."
                        rows={3}
                        className="w-full resize-none rounded-xl border border-gray-200
                       bg-gray-50 p-4 pr-14 text-base text-gray-900
                       placeholder:text-gray-400 focus:border-purple-500
                       focus:outline-none focus:ring-2 focus:ring-purple-500/20
                       disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800
                       dark:text-white dark:placeholder:text-gray-500
                       dark:focus:border-purple-400"
                    />

                    <button
                        type="submit"
                        disabled={loading || !question.trim()}
                        className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center
                       rounded-xl bg-purple-600 text-white shadow-lg shadow-purple-500/30
                       transition-all hover:bg-purple-700 hover:shadow-purple-500/40
                       disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                    >
                        {loading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <Send className="h-5 w-5" />
                        )}
                    </button>
                </div>

                {/* ── Suggestion chips ────────────────────────────────────── */}
                <div className="mt-4 flex flex-wrap gap-2">
                    {EXAMPLES.map((ex) => (
                        <button
                            key={ex}
                            type="button"
                            onClick={() => handleChipClick(ex)}
                            className="rounded-full border border-gray-200 bg-gray-50 px-3.5 py-1.5
                         text-xs font-medium text-gray-600 transition-all
                         hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700
                         dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300
                         dark:hover:border-purple-500 dark:hover:bg-purple-900/30
                         dark:hover:text-purple-300"
                        >
                            <Zap className="mr-1 inline h-3 w-3" />
                            {ex}
                        </button>
                    ))}
                </div>
            </form>

            {/* ── Loading skeleton ───────────────────────────────────────── */}
            {loading && (
                <div className="space-y-4 animate-pulse">
                    <div className="h-44 rounded-2xl bg-gray-200 dark:bg-gray-800" />
                    <div className="h-52 rounded-2xl bg-gray-200 dark:bg-gray-800" />
                </div>
            )}

            {/* ── Error toast ────────────────────────────────────────────── */}
            {error && (
                <div className="flex items-start gap-3 rounded-2xl border border-red-200
                        bg-red-50 p-5 text-sm text-red-800
                        dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-300">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                    <div>
                        <p className="font-semibold">Request Failed</p>
                        <p className="mt-1">{error}</p>
                    </div>
                </div>
            )}

            {/* ── Results ────────────────────────────────────────────────── */}
            {result && (
                <div className="space-y-5">
                    {/* Question echo */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Database className="h-4 w-4" />
                        <span>
                            Showing results for:{" "}
                            <span className="font-medium text-gray-900 dark:text-white">
                                &ldquo;{result.original_question}&rdquo;
                            </span>
                        </span>
                    </div>

                    {/* ── Card 1: Raw AI SQL ──────────────────────────────────── */}
                    <div className="overflow-hidden rounded-2xl border border-gray-800
                          bg-gray-950 shadow-lg">
                        <div className="flex items-center justify-between border-b border-gray-800
                            bg-gray-900/80 px-5 py-3">
                            <div className="flex items-center gap-2 text-gray-300">
                                <Terminal className="h-4 w-4 text-purple-400" />
                                <span className="text-sm font-semibold tracking-wide">
                                    Raw AI Output
                                </span>
                            </div>
                            <CopyButton text={result.raw_llm_sql} />
                        </div>
                        <div className="overflow-x-auto p-5">
                            <pre className="text-sm leading-relaxed text-emerald-400 font-mono whitespace-pre-wrap">
                                <code>{result.raw_llm_sql}</code>
                            </pre>
                        </div>
                    </div>

                    {/* ── Card 2: Secure tenant-scoped SQL ────────────────────── */}
                    <div className="overflow-hidden rounded-2xl border border-emerald-700/40
                          bg-gray-950 shadow-lg ring-1 ring-emerald-500/10">
                        <div className="flex items-center justify-between border-b border-emerald-800/40
                            bg-emerald-950/60 px-5 py-3">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                                <span className="text-sm font-semibold tracking-wide text-emerald-200">
                                    Secure Multi-Tenant Query
                                </span>
                                <span className="ml-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px]
                                 font-bold uppercase tracking-widest text-emerald-400
                                 ring-1 ring-emerald-500/30">
                                    Tenant-Scoped
                                </span>
                            </div>
                            <CopyButton text={result.secure_sql_to_execute} />
                        </div>
                        <div className="overflow-x-auto p-5">
                            <pre className="text-sm leading-relaxed text-sky-300 font-mono whitespace-pre-wrap">
                                <code>{result.secure_sql_to_execute}</code>
                            </pre>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
