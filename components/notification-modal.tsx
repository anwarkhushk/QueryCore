"use client";

import { Bell, BellOff, X } from "lucide-react";

interface NotificationModalProps {
    isOpen: boolean;
    onAccept: () => void;
    onDecline: () => void;
}

export function NotificationModal({ isOpen, onAccept, onDecline }: NotificationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                <div className="p-6 text-center space-y-4">
                    <div className="mx-auto w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Bell className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Enable Email Notifications?
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Get notified whenever a product, customer, or order is added or modified. You can change this later in settings.
                    </p>
                </div>

                <div className="flex border-t border-gray-200 dark:border-gray-800">
                    <button
                        onClick={onDecline}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-r border-gray-200 dark:border-gray-800"
                    >
                        <BellOff className="h-4 w-4" />
                        No Thanks
                    </button>
                    <button
                        onClick={onAccept}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    >
                        <Bell className="h-4 w-4" />
                        Enable
                    </button>
                </div>
            </div>
        </div>
    );
}
