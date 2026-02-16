"use client";

import { useEffect, useState } from "react";
import { DollarSign, Users, ShoppingCart, ArrowUpRight, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import api from "@/lib/axios";

interface AnalyticsData {
    totalRevenue: number;
    totalCustomers: number;
    ordersThisMonth: number;
    growth: {
        revenue: number;
        customers: number;
        orders: number;
    };
}

interface DrilldownData {
    title: string;
    columns: string[];
    rows: any[];
}

export function AnalyticsCards() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [expandedCard, setExpandedCard] = useState<string | null>(null);
    const [drilldownData, setDrilldownData] = useState<DrilldownData | null>(null);
    const [drilldownLoading, setDrilldownLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get("/analytics/summary");
                setData(response.data);
            } catch (error) {
                console.error("Failed to fetch analytics data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleCardClick = async (metric: string) => {
        if (expandedCard === metric) {
            setExpandedCard(null);
            setDrilldownData(null);
            return;
        }

        setExpandedCard(metric);
        setDrilldownLoading(true);
        try {
            const response = await api.get(`/analytics/drilldown?metric=${metric}`);
            setDrilldownData(response.data);
        } catch (error) {
            console.error("Failed to fetch drilldown data", error);
        } finally {
            setDrilldownLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 rounded-xl bg-gray-200 animate-pulse dark:bg-gray-800" />
                ))}
            </div>
        );
    }

    if (!data) return null;

    const cards = [
        {
            title: "Total Revenue",
            metric: "revenue",
            value: `$${data.totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            trend: `+${data.growth.revenue}% from last month`,
            color: "text-green-500",
        },
        {
            title: "Total Customers",
            metric: "customers",
            value: data.totalCustomers.toLocaleString(),
            icon: Users,
            trend: `+${data.growth.customers}% from last month`,
            color: "text-blue-500",
        },
        {
            title: "Orders This Month",
            metric: "orders",
            value: data.ordersThisMonth.toLocaleString(),
            icon: ShoppingCart,
            trend: `+${data.growth.orders}% from last month`,
            color: "text-purple-500",
        },
    ];

    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {cards.map((card) => (
                    <button
                        key={card.title}
                        onClick={() => handleCardClick(card.metric)}
                        className={`rounded-xl border p-6 shadow-sm text-left transition-all cursor-pointer hover:shadow-md ${expandedCard === card.metric
                                ? "border-blue-500 ring-1 ring-blue-500 bg-white dark:bg-gray-900"
                                : "border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700"
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                {card.title}
                            </h3>
                            <div className="flex items-center gap-1">
                                <card.icon className={`h-4 w-4 ${card.color}`} />
                                {expandedCard === card.metric ? (
                                    <ChevronUp className="h-3 w-3 text-gray-400" />
                                ) : (
                                    <ChevronDown className="h-3 w-3 text-gray-400" />
                                )}
                            </div>
                        </div>
                        <div className="mt-2 flex items-baseline">
                            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                {card.value}
                            </p>
                        </div>
                        <div className="mt-1 flex items-center text-sm">
                            <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                            <span className="text-green-500 font-medium">{card.trend}</span>
                        </div>
                    </button>
                ))}
            </div>

            {/* Drill-down Panel */}
            {expandedCard && (
                <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                    {drilldownLoading ? (
                        <div className="flex items-center justify-center p-8">
                            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                            <span className="ml-2 text-sm text-gray-500">Loading breakdown...</span>
                        </div>
                    ) : drilldownData ? (
                        <>
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-blue-50 dark:bg-blue-900/10">
                                <h3 className="font-semibold text-gray-900 dark:text-white">{drilldownData.title}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Click the card again to collapse</p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                                    <thead className="bg-gray-50 dark:bg-gray-800/50">
                                        <tr>
                                            {drilldownData.columns.map((col) => (
                                                <th key={col} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                                    {col}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                        {drilldownData.rows.map((row, i) => (
                                            <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                                {drilldownData.columns.map((col) => (
                                                    <td key={`${i}-${col}`} className="px-6 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                                        {typeof row[col] === 'number' && col === 'amount'
                                                            ? `$${row[col].toLocaleString()}`
                                                            : row[col]}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : null}
                </div>
            )}
        </div>
    );
}
