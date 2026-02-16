import { NextResponse } from 'next/server';
import { updateProduct, deleteProduct } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const body = await request.json();

    const updated = updateProduct(id, {
        ...body,
        price: parseFloat(body.price),
        stock: parseInt(body.stock)
    });

    if (!updated) {
        return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    deleteProduct(id);
    return NextResponse.json({ message: 'Deleted successfully' });
}
