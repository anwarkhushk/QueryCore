"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { X } from "lucide-react";
import api from "@/lib/axios";

interface ChartData {
    name: string;
    revenue: number;
}

interface MonthDetail {
    category: string;
    revenue: number;
    orders: number;
}

// Mock detail data for each month
const monthDetails: Record<string, MonthDetail[]> = {
    Jan: [
        { category: "Electronics", revenue: 1800, orders: 45 },
        { category: "Clothing", revenue: 1200, orders: 38 },
        { category: "Software", revenue: 1000, orders: 22 },
    ],
    Feb: [
        { category: "Electronics", revenue: 1200, orders: 30 },
        { category: "Clothing", revenue: 900, orders: 28 },
        { category: "Software", revenue: 900, orders: 18 },
    ],
    Mar: [
        { category: "Electronics", revenue: 800, orders: 20 },
        { category: "Clothing", revenue: 700, orders: 22 },
        { category: "Software", revenue: 500, orders: 12 },
    ],
    Apr: [
        { category: "Electronics", revenue: 1100, orders: 35 },
        { category: "Clothing", revenue: 880, orders: 30 },
        { category: "Software", revenue: 800, orders: 20 },
    ],
    May: [
        { category: "Electronics", revenue: 1400, orders: 40 },
        { category: "Clothing", revenue: 1000, orders: 32 },
        { category: "Software", revenue: 600, orders: 15 },
    ],
    Jun: [
        { category: "Electronics", revenue: 1500, orders: 42 },
        { category: "Clothing", revenue: 1100, orders: 35 },
        { category: "Software", revenue: 900, orders: 20 },
    ],
};

export function RevenueChart() {
    const [data, setData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get("/analytics/revenue-chart");
                setData(response.data);
            } catch (error) {
                console.error("Failed to fetch chart data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleChartClick = (data: any) => {
        if (data && data.activePayload && data.activePayload.length > 0) {
            const monthName = data.activePayload[0].payload.name;
            setSelectedMonth(selectedMonth === monthName ? null : monthName);
        }
    };

    if (loading) {
        return <div className="h-[350px] w-full rounded-xl bg-gray-200 animate-pulse dark:bg-gray-800" />;
    }

    const details = selectedMonth ? (monthDetails[selectedMonth] || []) : [];

    return (
        <div className="space-y-4">
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                    Revenue Overview
                    <span className="text-xs text-gray-400 dark:text-gray-500 ml-2 font-normal">Click a data point to drill down</span>
                </h3>
                <div className="h-[350px] w-full cursor-pointer">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} onClick={handleChartClick}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis
                                dataKey="name"
                                stroke="#9CA3AF"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#9CA3AF"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `$${value}`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#fff",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "8px",
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="#2563EB"
                                strokeWidth={2}
                                activeDot={{ r: 8, fill: "#2563EB", stroke: "#fff", strokeWidth: 2, cursor: "pointer" }}
                                dot={{ r: 4, fill: "#2563EB", cursor: "pointer" }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Month Drill-down Panel */}
            {selectedMonth && details.length > 0 && (
                <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-blue-50 dark:bg-blue-900/10 flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                {selectedMonth} — Revenue Breakdown by Category
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Detailed breakdown for this month</p>
                        </div>
                        <button
                            onClick={() => setSelectedMonth(null)}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                            <thead className="bg-gray-50 dark:bg-gray-800/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Revenue</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Orders</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                {details.map((row, i) => (
                                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{row.category}</td>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">${row.revenue.toLocaleString()}</td>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{row.orders}</td>
                                    </tr>
                                ))}
                                <tr className="bg-gray-50 dark:bg-gray-800/30 font-semibold">
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">Total</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        ${details.reduce((sum, r) => sum + r.revenue, 0).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        {details.reduce((sum, r) => sum + r.orders, 0)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
