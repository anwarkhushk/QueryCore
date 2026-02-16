import { NextResponse } from 'next/server';
import { updateCustomer, deleteCustomer } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const body = await request.json();

    const updated = updateCustomer(id, body);

    if (!updated) {
        return NextResponse.json({ message: 'Customer not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    deleteCustomer(id);
    return NextResponse.json({ message: 'Deleted successfully' });
}
