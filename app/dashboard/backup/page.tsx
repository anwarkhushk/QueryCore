"use client";

import { useEffect, useState } from "react";
import { Copy, History, RefreshCw, FileText, ArrowRight } from "lucide-react";
import api from "@/lib/axios";

interface BackupEntry {
    id: string;
    timestamp: string;
    entityType: 'Customer' | 'Product' | 'Order';
    action: 'Added' | 'Modified' | 'Deleted';
    entityName: string;
    dataBefore: any | null;
    dataAfter: any | null;
}

export default function BackupPage() {
    const [logs, setLogs] = useState<BackupEntry[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const response = await api.get("/backup/log");
            setLogs(response.data);
        } catch (error) {
            console.error("Failed to fetch backup logs", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const getActionColor = (action: string) => {
        switch (action) {
            case 'Added': return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400';
            case 'Modified': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400';
            case 'Deleted': return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center">
                        <History className="mr-3 h-8 w-8 text-indigo-500" />
                        System Backup Log
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        Audit trail of all data modifications.
                    </p>
                </div>
                <button
                    onClick={fetchLogs}
                    className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                        <thead className="bg-gray-50 dark:bg-gray-800/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Timestamp</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Entity</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Action</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            {logs.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        <div className="flex flex-col items-center">
                                            <FileText className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                                            <p>No backup entries found yet.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                logs.map((entry) => (
                                    <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(entry.timestamp).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                            {entry.entityType}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getActionColor(entry.action)}`}>
                                                {entry.action}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                            <div className="flex flex-col">
                                                <span className="font-medium">{entry.entityName}</span>
                                                {entry.dataBefore && (
                                                    <details className="mt-1 cursor-pointer">
                                                        <summary className="text-xs text-indigo-500 hover:text-indigo-600">View Data Snapshot</summary>
                                                        <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-x-auto max-w-md">
                                                            {JSON.stringify(entry.action === 'Modified' ? { from: entry.dataBefore, to: entry.dataAfter } : (entry.dataAfter || entry.dataBefore), null, 2)}
                                                        </pre>
                                                    </details>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
