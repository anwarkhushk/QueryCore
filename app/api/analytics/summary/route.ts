import { NextResponse } from 'next/server';

export async function GET() {
    // Mock data
    return NextResponse.json({
        totalRevenue: 54230,
        totalCustomers: 1240,
        ordersThisMonth: 345,
        growth: {
            revenue: 12,
            customers: 8,
            orders: 24
        }
    });
}
