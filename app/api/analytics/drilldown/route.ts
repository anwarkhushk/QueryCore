import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const metric = searchParams.get('metric');

    let data: any = {};

    switch (metric) {
        case 'revenue':
            data = {
                title: 'Revenue Breakdown',
                columns: ['source', 'amount', 'percentage'],
                rows: [
                    { source: 'Premium Plans', amount: 45200, percentage: '38%' },
                    { source: 'Standard Plans', amount: 32800, percentage: '27%' },
                    { source: 'Consulting', amount: 24600, percentage: '21%' },
                    { source: 'Add-ons', amount: 16900, percentage: '14%' },
                ]
            };
            break;
        case 'customers':
            data = {
                title: 'Customer Breakdown',
                columns: ['segment', 'count', 'avgSpend'],
                rows: [
                    { segment: 'Enterprise', count: 45, avgSpend: '$2,400' },
                    { segment: 'Mid-Market', count: 120, avgSpend: '$850' },
                    { segment: 'Small Business', count: 280, avgSpend: '$320' },
                    { segment: 'Starter', count: 503, avgSpend: '$95' },
                ]
            };
            break;
        case 'orders':
            data = {
                title: 'Orders Breakdown',
                columns: ['status', 'count', 'totalValue'],
                rows: [
                    { status: 'Completed', count: 245, totalValue: '$89,400' },
                    { status: 'Processing', count: 38, totalValue: '$12,300' },
                    { status: 'Pending', count: 12, totalValue: '$4,200' },
                    { status: 'Cancelled', count: 8, totalValue: '$2,100' },
                ]
            };
            break;
        default:
            data = { title: 'No data', columns: [], rows: [] };
    }

    return NextResponse.json(data);
}
