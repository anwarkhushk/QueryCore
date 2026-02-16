import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // TODO: Validate against real database
        if (email === 'muhammadanwarbaloch1@gmail.com' && password === 'fast123@') {
            return NextResponse.json({
                token: 'mock-jwt-token-xyz-123',
                user: {
                    id: '1',
                    name: 'Admin User',
                    email: 'admin@example.com'
                }
            });
        }

        return NextResponse.json(
            { message: 'Invalid credentials' },
            { status: 401 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
