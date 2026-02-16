import { NextResponse } from 'next/server';
import { getBackupLog } from '@/lib/backup';

export async function GET() {
    const log = getBackupLog();
    // Sort by timestamp desc (newest first)
    const sortedLog = log.sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return NextResponse.json(sortedLog);
}
