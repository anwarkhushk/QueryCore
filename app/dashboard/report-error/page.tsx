"use client";

import { useState } from "react";
import { Send, AlertTriangle, Loader2, CheckCircle2 } from "lucide-react";
import api from "@/lib/axios";

export default function ReportErrorPage() {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        setLoading(true);
        try {
            // Get current user info from token or local storage if available
            // For now, we'll mock it or assume it's the logged-in user
            // In a real app, we'd decode the JWT
            await api.post("/report-error", {
                message,
                reporterEmail: "current.user@example.com", // This would ideally come from auth context
                reporterName: "Current User" // This would ideally come from auth context
            });
            setSuccess(true);
            setMessage("");
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error("Failed to send report", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center">
                    <AlertTriangle className="mr-3 h-8 w-8 text-red-500" />
                    Report an Error
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Found a bug? Describe the issue below and we'll notify the admin team.
                </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Issue Description
                        </label>
                        <textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Please describe what happened, steps to reproduce, etc..."
                            rows={6}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                            required
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading || success}
                            className={`flex items-center justify-center w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors
                                ${success
                                    ? "bg-green-600 hover:bg-green-700"
                                    : "bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                            ) : success ? (
                                <>
                                    <CheckCircle2 className="h-5 w-5 mr-2" />
                                    Report Sent
                                </>
                            ) : (
                                <>
                                    <Send className="h-5 w-5 mr-2" />
                                    Send Report
                                </>
                            )}
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                        This report will be sent to <strong>muhammadanwarbaloch1@gmail.com</strong> and <strong>mrauf4894@gmail.com</strong>.
                    </p>
                </form>
            </div>
        </div>
    );
}
