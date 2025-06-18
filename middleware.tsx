import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const protectedRoutes = ['/dashboard', '/(admin)']
const publicRoutes = ['/signin', '/reset-password']

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    // Check if the current path is a protected route
    const isProtectedRoute = protectedRoutes.some(route => {
        if (route === '/dashboard') {
            return path === '/dashboard' || path.startsWith('/dashboard/')
        }
        if (route === '/(admin)') {
            return path.startsWith('/dashboard') || path.includes('/(admin)')
        }
        return path === route || path.startsWith(route + '/')
    })

    const isPublicRoute = publicRoutes.includes(path)

    // Get the JWT token from cookies
    const token = request.cookies.get('authToken')?.value;

    // Verify the token server-side
    let isAuthenticated = false;
    if (token) {
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET || '$2b$10$NJJiuOS4Vo.1iypQhmQvsOxkKm6GawLNV9ieXwh8KPE4hfydZWl3O');
            const payload = await jwtVerify(token, secret);

            // Additional validation: check token expiration
            const currentTime = Math.floor(Date.now() / 1000);
            if (payload.payload.exp && payload.payload.exp < currentTime) {
                console.log('Token expired');
                isAuthenticated = false;
            } else {
                isAuthenticated = true;
            }
        } catch (error) {
            console.log('Token verification failed:', error);
            isAuthenticated = false;
        }
    }

    // Redirect to signin if trying to access protected route without authentication
    if (isProtectedRoute && !isAuthenticated) {
        console.log(`Redirecting unauthenticated user from ${path} to /signin`);
        // Clear invalid token if it exists
        const response = NextResponse.redirect(new URL('/signin', request.nextUrl));
        if (token) {
            response.cookies.set('authToken', '', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 0,
                path: '/'
            });
        }
        return response;
    }

    // Redirect root to signin
    if (path === '/'){
        return NextResponse.redirect(new URL('/signin', request.nextUrl))
    }

    // Redirect authenticated users from public routes to dashboard
    if (isPublicRoute && isAuthenticated) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};