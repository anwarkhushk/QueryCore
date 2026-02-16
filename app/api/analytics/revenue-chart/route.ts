import { NextResponse } from 'next/server';

export async function GET() {
    // Mock data for line chart
    const data = [
        { name: 'Jan', revenue: 4000 },
        { name: 'Feb', revenue: 3000 },
        { name: 'Mar', revenue: 2000 },
        { name: 'Apr', revenue: 2780 },
        { name: 'May', revenue: 1890 },
        { name: 'Jun', revenue: 2390 },
        { name: 'Jul', revenue: 3490 },
        { name: 'Aug', revenue: 4200 },
        { name: 'Sep', revenue: 5100 },
        { name: 'Oct', revenue: 4800 },
        { name: 'Nov', revenue: 6000 },
        { name: 'Dec', revenue: 7200 },
    ];
    return NextResponse.json(data);
}
