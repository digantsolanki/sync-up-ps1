
import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import bcrypt from 'bcrypt'; // npm install bcrypt @types/bcrypt

// Store credentials securely (preferably in environment variables or database)
const ADMIN_CREDENTIALS = {
    email: process.env.ADMIN_EMAIL || "admin@admin.com",
    // Store hashed password, not plain text
    passwordHash: process.env.ADMIN_PASSWORD_HASH || "$2b$10$NJJiuOS4Vo.1iypQhmQvsOxkKm6GawLNV9ieXwh8KPE4hfydZWl3O" // bcrypt hash of "admin123"
};

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        // Verify credentials
        if (email !== ADMIN_CREDENTIALS.email) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Verify password against hash
        const isPasswordValid = await bcrypt.compare(password, ADMIN_CREDENTIALS.passwordHash);
        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Generate JWT token
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
        const token = await new SignJWT({
            email: email,
            role: 'admin',
            exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('24h')
            .sign(secret);

        // Set secure HTTP-only cookie
        const response = NextResponse.json({ success: true });
        response.cookies.set('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 24 hours
            path: '/'
        });

        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}