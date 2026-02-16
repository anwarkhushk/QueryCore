import { NextResponse } from 'next/server';
import { customers, addCustomer } from '@/lib/db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase();

    let filteredCustomers = customers;
    if (search) {
        filteredCustomers = customers.filter(c =>
            c.name.toLowerCase().includes(search) ||
            c.email.toLowerCase().includes(search)
        );
    }

    return NextResponse.json(filteredCustomers);
}

export async function POST(request: Request) {
    const body = await request.json();
    const newCustomer = {
        id: Date.now().toString(),
        ...body,
        spend: 0,
        status: 'Active'
    };

    addCustomer(newCustomer);
    return NextResponse.json(newCustomer, { status: 201 });
}
