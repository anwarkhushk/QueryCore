// In-memory backup log — records all data modifications
// In production, this would be persisted to a database or file system

export interface BackupEntry {
    id: string;
    timestamp: string;
    entityType: 'Customer' | 'Product' | 'Order';
    action: 'Added' | 'Modified' | 'Deleted';
    entityName: string;
    dataBefore: any | null;
    dataAfter: any | null;
}

// The backup log (acts as a database table)
export let backupLog: BackupEntry[] = [];

let nextId = 1;

export function addBackupEntry(
    entityType: BackupEntry['entityType'],
    action: BackupEntry['action'],
    entityName: string,
    dataBefore: any | null = null,
    dataAfter: any | null = null
): BackupEntry {
    const entry: BackupEntry = {
        id: String(nextId++),
        timestamp: new Date().toISOString(),
        entityType,
        action,
        entityName,
        dataBefore,
        dataAfter,
    };
    backupLog.push(entry);
    console.log(`📋 BACKUP LOG: [${entry.action}] ${entry.entityType} "${entry.entityName}" at ${entry.timestamp}`);
    return entry;
}

export function getBackupLog(): BackupEntry[] {
    return [...backupLog];
}

export function clearBackupLog(): void {
    backupLog = [];
}
