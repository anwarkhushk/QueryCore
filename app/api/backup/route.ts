import { NextResponse } from 'next/server';
import { addBackupEntry, BackupEntry } from '@/lib/backup';

export async function POST(request: Request) {
    const body = await request.json();
    const { entityType, action, entityName, dataBefore, dataAfter } = body;

    const entry = addBackupEntry(
        entityType as BackupEntry['entityType'],
        action as BackupEntry['action'],
        entityName,
        dataBefore,
        dataAfter
    );

    return NextResponse.json({
        success: true,
        entry,
    });
}
