"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Terminal, Sparkles, Loader2, Clock, Table2, Code2 } from "lucide-react";
import api from "@/lib/axios";

interface QueryResult {
    sql: string;
    columns: string[];
    results: any[];
}

const TABLE_SUGGESTIONS = [
    { label: "customers", description: "Customer data", category: "table" },
    { label: "products", description: "Product catalog", category: "table" },
    { label: "orders", description: "Order history", category: "table" },
    { label: "monthly_stats", description: "Revenue stats", category: "table" },
];

const SQL_SUGGESTIONS = [
    { label: "Show me top customers by spend", description: "Top spenders", category: "query" },
    { label: "What is the total revenue?", description: "Revenue analysis", category: "query" },
    { label: "Show me all processing orders", description: "Order status", category: "query" },
    { label: "List all active customers", description: "Customer filter", category: "query" },
    { label: "Show me the revenue trend", description: "Monthly revenue", category: "query" },
    { label: "Which products have low stock?", description: "Inventory check", category: "query" },
];

function getRecentQueries(): { label: string; description: string; category: string }[] {
    try {
        const stored = localStorage.getItem("recentQueries");
        if (!stored) return [];
        const queries = JSON.parse(stored) as string[];
        return queries.map(q => ({ label: q, description: "Recent query", category: "recent" }));
    } catch {
        return [];
    }
}

function saveRecentQuery(query: string) {
    try {
        const stored = localStorage.getItem("recentQueries");
        let queries: string[] = stored ? JSON.parse(stored) : [];
        // Remove duplicate if exists
        queries = queries.filter(q => q !== query);
        // Add to front
        queries.unshift(query);
        // Keep only last 5
        queries = queries.slice(0, 5);
        localStorage.setItem("recentQueries", JSON.stringify(queries));
    } catch {
        // ignore
    }
}

export default function AIQueryPage() {
    const [query, setQuery] = useState("");
    const [result, setResult] = useState<QueryResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    const getSuggestions = () => {
        const recent = getRecentQueries();
        const all = [...recent, ...SQL_SUGGESTIONS, ...TABLE_SUGGESTIONS];

        if (!query.trim()) {
            // Show recent queries and popular suggestions
            return [...recent, ...SQL_SUGGESTIONS.slice(0, 3)];
        }

        const lower = query.toLowerCase();
        return all.filter(s =>
            s.label.toLowerCase().includes(lower) &&
            s.label.toLowerCase() !== lower
        ).slice(0, 6);
    };

    const suggestions = getSuggestions();

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                suggestionsRef.current &&
                !suggestionsRef.current.contains(e.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(e.target as Node)
            ) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setResult(null);
        setShowSuggestions(false);
        saveRecentQuery(query.trim());

        try {
            const response = await api.post("/ai-query", { query });
            setResult(response.data);
        } catch (error) {
            console.error("Failed to execute query", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectSuggestion = (suggestion: string) => {
        setQuery(suggestion);
        setShowSuggestions(false);
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!showSuggestions || suggestions.length === 0) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSearch(e);
            }
            return;
        }

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex(prev => Math.max(prev - 1, -1));
        } else if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (selectedIndex >= 0) {
                handleSelectSuggestion(suggestions[selectedIndex].label);
            } else {
                handleSearch(e);
            }
        } else if (e.key === "Escape") {
            setShowSuggestions(false);
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "recent": return <Clock className="h-4 w-4 text-gray-400" />;
            case "table": return <Table2 className="h-4 w-4 text-blue-400" />;
            case "query": return <Code2 className="h-4 w-4 text-purple-400" />;
            default: return null;
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center">
                    <Sparkles className="mr-3 h-8 w-8 text-purple-500" />
                    AI SQL Assistant
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Ask questions about your data in plain English.
                </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                <form onSubmit={handleSearch} className="relative">
                    <textarea
                        ref={inputRef}
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setShowSuggestions(true);
                            setSelectedIndex(-1);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        placeholder="e.g., Show me the top 5 customers by spend..."
                        className="w-full h-32 p-4 pr-12 text-lg rounded-lg border border-gray-300 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        type="submit"
                        disabled={loading || !query.trim()}
                        className="absolute bottom-4 right-4 p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-purple-500/30"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    </button>

                    {/* Autocomplete Dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div
                            ref={suggestionsRef}
                            className="absolute z-10 left-0 right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden"
                        >
                            {suggestions.map((suggestion, index) => (
                                <button
                                    key={`${suggestion.category}-${suggestion.label}`}
                                    type="button"
                                    onClick={() => handleSelectSuggestion(suggestion.label)}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${index === selectedIndex
                                            ? "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
                                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                        }`}
                                >
                                    {getCategoryIcon(suggestion.category)}
                                    <span className="flex-1 truncate">{suggestion.label}</span>
                                    <span className="text-xs text-gray-400 dark:text-gray-500">{suggestion.description}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </form>
            </div>

            {result && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* SQL Block */}
                    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-900 shadow-sm">
                        <div className="flex items-center justify-between px-4 py-3 bg-gray-950 border-b border-gray-800">
                            <div className="flex items-center text-gray-400">
                                <Terminal className="mr-2 h-4 w-4" />
                                <span className="text-sm font-mono">Generated SQL</span>
                            </div>
                            <button
                                onClick={() => navigator.clipboard.writeText(result.sql)}
                                className="text-xs text-gray-500 hover:text-gray-300 uppercase tracking-wider font-semibold"
                            >
                                Copy
                            </button>
                        </div>
                        <div className="p-4 overflow-x-auto">
                            <pre className="text-sm font-mono text-green-400">
                                <code>{result.sql}</code>
                            </pre>
                        </div>
                    </div>

                    {/* Results Table */}
                    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                            <h3 className="font-semibold text-gray-900 dark:text-white">Query Results</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                                <thead className="bg-gray-50 dark:bg-gray-800/50">
                                    <tr>
                                        {result.columns.map((col) => (
                                            <th
                                                key={col}
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                                            >
                                                {col}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-800">
                                    {result.results.length === 0 ? (
                                        <tr>
                                            <td colSpan={result.columns.length} className="px-6 py-4 text-center text-sm text-gray-500">
                                                No results found
                                            </td>
                                        </tr>
                                    ) : (
                                        result.results.map((row, i) => (
                                            <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                                {result.columns.map((col) => (
                                                    <td
                                                        key={`${i}-${col}`}
                                                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200"
                                                    >
                                                        {typeof row[col] === 'number' && (col.includes('price') || col.includes('revenue') || col.includes('total') || col.includes('spend'))
                                                            ? `$${row[col].toLocaleString()}`
                                                            : row[col]}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
