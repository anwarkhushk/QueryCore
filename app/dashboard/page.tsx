import { AnalyticsCards } from "@/components/analytics-cards";
import { RevenueChart } from "@/components/revenue-chart";

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard</h1>
                <p className="text-gray-500 dark:text-gray-400">Overview of your store's performance.</p>
            </div>

            <AnalyticsCards />

            <RevenueChart />
        </div>
    );
}
