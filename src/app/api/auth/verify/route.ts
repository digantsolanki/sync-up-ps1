import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('authToken')?.value;

        if (!token) {
            return NextResponse.json({ error: 'No token provided' }, { status: 401 });
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET || '$2b$10$NJJiuOS4Vo.1iypQhmQvsOxkKm6GawLNV9ieXwh8KPE4hfydZWl3O');
        await jwtVerify(token, secret);

        return NextResponse.json({ authenticated: true });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
}