
export const setAuthToken = (token: string) => {
    // Store JWT token securely with httpOnly flag (this would be set by server)
    document.cookie = `authToken=${token}; path=/; max-age=${60 * 60 * 24}; Secure; SameSite=Strict; HttpOnly`;
};

export const clearAuthToken = () => {
    document.cookie = 'authToken=; path=/; max-age=0; HttpOnly';
};
