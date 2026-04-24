"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Package,
    ShoppingCart,
    Bot,
    LogOut,
    Sun,
    Moon,
    Database,
    AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Customers", href: "/dashboard/customers", icon: Users },
    { name: "Products", href: "/dashboard/products", icon: Package },
    { name: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
    { name: "AI Query", href: "/dashboard/ai-query", icon: Bot },
    // { name: "System Backup", href: "/dashboard/backup", icon: Database },
    { name: "Report Error", href: "/dashboard/report-error", icon: AlertTriangle },
];

export function Sidebar() {
    const pathname = usePathname();
    const { theme, setTheme, resolvedTheme } = useTheme();

    const toggleTheme = () => {
        if (resolvedTheme === "dark") {
            setTheme("light");
        } else {
            setTheme("dark");
        }
    };

    return (
        <div className="flex h-screen w-64 flex-col bg-gray-900 text-white">
            <div className="flex h-16 items-center px-6">
                <Bot className="h-8 w-8 text-blue-500 mr-2" />
                <span className="text-xl font-bold">SaaS Analytics</span>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1 px-3">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                    isActive
                                        ? "bg-gray-800 text-white"
                                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                )}
                            >
                                <item.icon
                                    className={cn(
                                        "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                                        isActive ? "text-blue-500" : "text-gray-400 group-hover:text-white"
                                    )}
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="border-t border-gray-800 p-4 space-y-3">
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="flex w-full items-center px-3 py-2 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white rounded-md transition-colors"
                >
                    {resolvedTheme === "dark" ? (
                        <>
                            <Sun className="mr-3 h-5 w-5 text-yellow-400" />
                            Light Mode
                        </>
                    ) : (
                        <>
                            <Moon className="mr-3 h-5 w-5 text-blue-400" />
                            Dark Mode
                        </>
                    )}
                </button>

                <div className="flex items-center">
                    <div className="ml-3">
                        <p className="text-sm font-medium text-white">Admin User</p>
                        <p className="text-xs text-gray-400">admin@example.com</p>
                    </div>
                </div>
                <button
                    onClick={() => {
                        localStorage.removeItem("token");
                        window.location.href = "/login";
                    }}
                    className="flex w-full items-center px-3 py-2 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white rounded-md transition-colors"
                >
                    <LogOut className="mr-3 h-5 w-5 text-gray-400" />
                    Sign out
                </button>
            </div>
        </div>
    );
}
