
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Get the current path
    const path = request.nextUrl.pathname;

    // Check if it's an admin path
    const isAdminPath = path === '/' || path.startsWith('/(admin)');

    // Get the admin authentication status from cookies
    const isAuthenticated = request.cookies.get('isAdminAuthenticated')?.value === 'true';

    // If trying to access admin routes without authentication
    if (isAdminPath && !isAuthenticated) {
        // Redirect to login page
        return NextResponse.redirect(new URL('/signin', request.url));
    }

    // If trying to access login page while already authenticated
    if (path === '/signin' && isAuthenticated) {
        // Redirect to admin dashboard
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

// Configure the middleware to run on specific paths
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
