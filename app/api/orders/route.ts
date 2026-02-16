import { NextResponse } from 'next/server';
import { orders, addOrder } from '@/lib/db';

export async function GET() {
    return NextResponse.json(orders);
}

export async function POST(request: Request) {
    const body = await request.json();
    const newOrder = {
        id: Date.now().toString(),
        ...body,
        date: new Date().toISOString().split('T')[0],
        status: 'Processing'
    };

    addOrder(newOrder);
    return NextResponse.json(newOrder, { status: 201 });
}
