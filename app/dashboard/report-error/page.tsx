"use client";

import { useState } from "react";
import { Send, AlertTriangle, Loader2, CheckCircle2 } from "lucide-react";
import api from "@/lib/axios";

export default function ReportErrorPage() {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSendReport = async () => {
        // 'message' wahi variable hona chahiye jo aapne textarea ke liye use kiya hai
        if (!message) {
            alert("Please describe the issue first!");
            return;
        }

        try {
            const response = await fetch("/api/report-error", { // Path ab folder se match kar raha hai
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: message,
                    reporterEmail: "muhammadanwarbaloch1@gmail.com",
                    reporterName: "Anwar Baloch"
                }),
            });

            const result = await response.json();

            if (response.ok) {
                alert("Success! The report has been sent to the admins.");
                // Agar aapke pas setMessage state hai toh box ko khali karne ke liye:
                // setMessage(""); 
            } else {
                alert("Error: " + result.message);
            }
        } catch (error) {
            console.error("Frontend Error:", error);
            alert("Could not connect to the server.");
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
                <form onSubmit={handleSendReport} className="space-y-4">
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
