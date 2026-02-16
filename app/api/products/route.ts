import { NextResponse } from 'next/server';
import { products, addProduct } from '@/lib/db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase();

    let filteredProducts = products;
    if (search) {
        filteredProducts = products.filter(p =>
            p.name.toLowerCase().includes(search) ||
            p.sku.toLowerCase().includes(search)
        );
    }

    return NextResponse.json(filteredProducts);
}

export async function POST(request: Request) {
    const body = await request.json();
    const newProduct = {
        id: Date.now().toString(),
        ...body,
        price: parseFloat(body.price),
        stock: parseInt(body.stock)
    };

    addProduct(newProduct);
    return NextResponse.json(newProduct, { status: 201 });
}
