
// Client-side auth utilities
export const signOut = async () => {
    try {
        // Call the signout API endpoint which will clear the httpOnly cookie
        const response = await fetch('/api/auth/signout', {
            method: 'POST',
            credentials: 'include'
        });

        if (response.ok) {
            // Redirect to signin page
            window.location.href = '/signin';
        }
    } catch (error) {
        console.error('Sign out error:', error);
        // Fallback: force redirect even if API call fails
        window.location.href = '/signin';
    }
};

// Check if user is authenticated (client-side check)
export const isAuthenticated = async (): Promise<boolean> => {
    try {
        // Make a request to verify authentication status
        const response = await fetch('/api/auth/verify', {
            credentials: 'include'
        });
        return response.ok;
    } catch {
        return false;
    }
};