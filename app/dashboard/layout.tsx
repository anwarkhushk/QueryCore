"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
        }
    }, [router]);
    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-8">
                <div className="mx-auto max-w-7xl">
                    {children}
                </div>
            </main>
        </div>
    );
}
