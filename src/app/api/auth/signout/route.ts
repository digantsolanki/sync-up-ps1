import { NextResponse } from 'next/server';

export async function POST() {
    try {
        // Create response
        const response = NextResponse.json(
            { message: 'Successfully signed out' },
            { status: 200 }
        );

        // Clear the auth token cookie
        response.cookies.set('authToken', '', {
            path: '/',
            maxAge: 0,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        return response;
    } catch (error) {
        console.error('Signout error:', error);
        return NextResponse.json(
            { error: 'Failed to sign out' },
            { status: 500 }
        );
    }
}