import api from "@/lib/axios";

// Log a change to the backup system (always runs regardless of notification preference)
export async function logBackup(
    entityType: string,
    action: string,
    entityName: string,
    dataBefore: any | null = null,
    dataAfter: any | null = null
) {
    try {
        await api.post("/backup", {
            entityType,
            action,
            entityName,
            dataBefore,
            dataAfter,
        });
    } catch (error) {
        console.error("Failed to log backup", error);
    }
}
